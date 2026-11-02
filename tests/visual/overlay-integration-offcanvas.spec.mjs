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
    document.addEventListener("click", (event) => {
      window.lastClickTarget = event.target.className;
    }, true);
    const open = document.querySelector("#open");
    window.canvas = new window.FokusStyles.Offcanvas(open);
    if (nested) {
      window.child = new window.FokusStyles.Modal(document.querySelector("#child-open"));
      open.addEventListener("fs:shown", () => window.child.show());
    }
  }, { nested });
}

test("real backdrop hit target dismisses Offcanvas while background stays inert", async ({ page }) => {
  await mount(page);
  await page.locator("#open").click();
  await expect(page.locator("#canvas")).toHaveClass(/is-open/);
  await expect(page.locator("#background")).toHaveAttribute("inert", "");
  const height = await page.evaluate(() => window.innerHeight);
  await page.mouse.click(24, height / 2);
  await expect(page.locator("#canvas")).not.toHaveClass(/is-open/);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  expect(await page.evaluate(() => window.lastClickTarget)).toMatch(/fs-offcanvas-backdrop/);
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
