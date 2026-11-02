import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));

async function mount(page, nested = false) {
  await page.setContent(`<!doctype html><html lang="en"><head><title>Offcanvas overlay regression</title></head><body>
    <main id="background"><button id="open" data-fs-target="#canvas">Open panel</button><a href="#background">Background</a></main>
    <section id="canvas" class="fs-offcanvas fs-offcanvas-end">
      <h2 class="fs-offcanvas-title">Panel</h2>
      <button id="child-open" data-fs-target="#child">Open child</button>
      <button id="canvas-close" data-fs-dismiss="offcanvas">Close panel</button>
    </section>
    <section id="child" class="fs-modal"><div class="fs-modal-dialog"><div class="fs-modal-content">
      <h2>Child modal</h2><button id="child-close" data-fs-dismiss="modal">Close child</button>
    </div></div></section>
  </body></html>`);
  await page.addStyleTag({ path: path.join(root, "dist/css/fokus.css") });
  await page.addScriptTag({ path: path.join(root, "dist/js/fokus.js") });
  await page.evaluate(({ nested }) => {
    window.pointerEventTargets = [];
    for (const type of ["pointerdown", "mousedown", "mouseup", "click"]) {
      document.addEventListener(type, (event) => {
        const target = event.target;
        window.pointerEventTargets.push({
          type,
          tagName: target?.tagName ?? "",
          className: typeof target?.className === "string" ? target.className : "",
          isBackdrop: target?.classList?.contains("fs-offcanvas-backdrop") ?? false,
          pathHasBackdrop: event.composedPath().some((node) => node?.classList?.contains?.("fs-offcanvas-backdrop")),
        });
      }, true);
    }
    const open = document.querySelector("#open");
    window.canvas = new window.FokusStyles.Offcanvas(open);
    if (nested) {
      window.child = new window.FokusStyles.Modal(document.querySelector("#child-open"));
      open.addEventListener("fs:shown", () => window.child.show());
    }
  }, { nested });
}

async function backdropHitTarget(page, x, y) {
  return page.evaluate(({ x, y }) => {
    const hit = document.elementFromPoint(x, y);
    const backdrop = document.querySelector(".fs-offcanvas-backdrop");
    const style = backdrop && getComputedStyle(backdrop);
    return {
      isBackdropHit: hit === backdrop,
      hitTagName: hit?.tagName ?? "",
      hitClassName: typeof hit?.className === "string" ? hit.className : "",
      backdropInert: backdrop?.inert ?? null,
      backgroundInert: document.querySelector("#background")?.inert ?? null,
      visibility: style?.visibility ?? "missing",
      opacity: style?.opacity ?? "missing",
      pointerEvents: style?.pointerEvents ?? "missing",
      zIndex: style?.zIndex ?? "missing",
    };
  }, { x, y });
}

test("real backdrop hit target dismisses Offcanvas while background stays inert", async ({ page }) => {
  await mount(page);
  await page.locator("#open").click();
  await expect(page.locator("#canvas")).toHaveClass(/is-open/);
  await expect(page.locator("#background")).toHaveAttribute("inert", "");
  const height = await page.evaluate(() => window.innerHeight);
  const point = { x: 24, y: height / 2 };
  await expect.poll(async () => (await backdropHitTarget(page, point.x, point.y)).isBackdropHit).toBe(true);
  const beforeClick = await backdropHitTarget(page, point.x, point.y);
  console.log("Offcanvas backdrop hit target before dismissal:", beforeClick);
  expect(beforeClick).toMatchObject({
    isBackdropHit: true,
    backdropInert: false,
    backgroundInert: true,
    visibility: "visible",
    pointerEvents: "auto",
  });

  await page.mouse.click(point.x, point.y);
  const click = await page.evaluate(() => window.pointerEventTargets.findLast((event) => event.type === "click"));
  console.log("Captured click target before dismissal:", click);
  expect(click).toMatchObject({ isBackdrop: true, pathHasBackdrop: true });
  expect(click.className).toContain("fs-offcanvas-backdrop");
  await expect(page.locator("#canvas")).not.toHaveClass(/is-open/);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.locator("#background")).not.toHaveAttribute("inert", "");
  await expect(page.locator("#open")).toBeFocused();
});

test("hit-target regression detects an Offcanvas backdrop made inert", async ({ page }) => {
  await mount(page);
  await page.locator("#open").click();
  await expect(page.locator("#background")).toHaveAttribute("inert", "");
  const height = await page.evaluate(() => window.innerHeight);
  const point = { x: 24, y: height / 2 };
  await expect.poll(async () => (await backdropHitTarget(page, point.x, point.y)).isBackdropHit).toBe(true);

  await page.locator(".fs-offcanvas-backdrop").evaluate((backdrop) => { backdrop.inert = true; });
  await expect.poll(async () => (await backdropHitTarget(page, point.x, point.y)).isBackdropHit).toBe(false);
  const negativeControl = await backdropHitTarget(page, point.x, point.y);
  console.log("Negative control with inert backdrop:", negativeControl);
  expect(negativeControl.backdropInert).toBe(true);
  expect(negativeControl.isBackdropHit).toBe(false);
  await expect(page.locator("#canvas")).toHaveClass(/is-open/);
  await expect(page.locator("#background")).toHaveAttribute("inert", "");
});

test("Offcanvas fs:shown child remains the top focus trap through dismissal and repeat", async ({ page }) => {
  await mount(page, true);
  await page.locator("#open").click();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(page.locator("#canvas")).toHaveClass(/is-open/);
  await expect(page.locator("#child")).toHaveClass(/is-open/);
  expect(await page.locator("#child").evaluate(el => !!el.closest("[inert], [aria-hidden='true']"))).toBe(false);
  await expect(page.locator("#child-close")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#child")).not.toHaveClass(/is-open/);
  await expect(page.locator("#canvas")).toHaveClass(/is-open/);
  await expect(page.locator("#child-open")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#canvas")).not.toHaveClass(/is-open/);
  await page.locator("#open").click();
  await expect(page.locator("#canvas")).toHaveClass(/is-open/);
  await expect(page.locator("#child")).toHaveClass(/is-open/);
  await page.keyboard.press("Escape");
  await expect(page.locator("#child")).not.toHaveClass(/is-open/);
  await expect(page.locator("#canvas")).toHaveClass(/is-open/);
  await page.keyboard.press("Escape");
  await expect(page.locator("#canvas")).not.toHaveClass(/is-open/);
});
