import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));

const cases = [
  { side: "start", placement: "right", scroll: "end", axis: "x", edge: "end", after: true },
  { side: "end", placement: "left", scroll: "end", axis: "x", edge: "start", after: true },
  { side: "top", placement: "bottom", scroll: "end", axis: "y", edge: "end", after: false },
  { side: "bottom", placement: "top", scroll: "start", axis: "y", edge: "start", after: true },
];

for (const scenario of cases) {
  test(`portaled Popover remains visible and clickable at the ${scenario.side} Offcanvas body edge`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.setContent(`<!doctype html><html lang="en"><head><title>Offcanvas portal clipping</title></head><body>
      <main><button id="open" data-fs-target="#canvas">Open panel</button></main>
      <section id="canvas" class="fs-offcanvas fs-offcanvas-${scenario.side}">
        <header class="fs-offcanvas-header"><h2 class="fs-offcanvas-title">Panel</h2></header>
        <div class="fs-offcanvas-body" id="scroll-body">
          ${scenario.scroll === "end" ? '<div aria-hidden="true" style="height:420px"></div>' : ""}
          <button id="trigger" data-fs-target="#popup" data-placement="${scenario.placement}" style="width:260px;height:40px">Open popup</button>
          ${scenario.after ? '<div aria-hidden="true" style="height:420px"></div>' : ""}
        </div>
      </section>
      <div id="popup" class="fs-popover"><button id="popup-action" data-fs-dismiss="popover">Activate popup</button></div>
    </body></html>`);
    await page.addStyleTag({ path: path.join(root, "dist/css/fokus.css") });
    await page.addScriptTag({ path: path.join(root, "dist/js/fokus.js") });
    await page.evaluate(() => {
      window.actionCount = 0;
      window.popoverInstance = null;
      document.querySelector("#popup-action").addEventListener("click", () => window.actionCount++);
      const trigger = document.querySelector("#trigger");
      window.offcanvasInstance = new window.FokusStyles.Offcanvas(document.querySelector("#open"));
      window.popoverInstance = new window.FokusStyles.Popover(trigger);
    });

    await page.locator("#open").click();
    await page.evaluate(async () => {
      await Promise.all(document.getAnimations().filter(animation => animation instanceof CSSTransition).map(animation => animation.finished.catch(() => {})));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    await page.evaluate((scroll) => {
      const body = document.querySelector("#scroll-body");
      body.scrollTop = scroll === "start" ? 0 : body.scrollHeight;
    }, scenario.scroll);
    await page.locator("#trigger").focus();
    await page.evaluate(() => window.popoverInstance.show());

    const state = await page.evaluate(({ axis, edge }) => {
      const body = document.querySelector("#scroll-body");
      const panel = document.querySelector("#canvas");
      const popup = document.querySelector("#popup");
      const bodyRect = body.getBoundingClientRect();
      const popupRect = popup.getBoundingClientRect();
      const outsideBody = axis === "x"
        ? (edge === "end" ? popupRect.right > bodyRect.right + 1 : popupRect.left < bodyRect.left - 1)
        : (edge === "end" ? popupRect.bottom > bodyRect.bottom + 1 : popupRect.top < bodyRect.top - 1);
      return {
        parentIsPanel: popup.parentElement === panel,
        bodyScrolls: body.scrollHeight > body.clientHeight && getComputedStyle(body).overflowY === "auto",
        outsideBody,
        popupRect: { x: popupRect.x, y: popupRect.y, width: popupRect.width, height: popupRect.height },
        bodyRect: { x: bodyRect.x, y: bodyRect.y, width: bodyRect.width, height: bodyRect.height },
      };
    }, scenario);

    expect(state.parentIsPanel).toBe(true);
    expect(state.bodyScrolls).toBe(true);
    expect(state.outsideBody).toBe(true);
    await expect(page.locator("#popup")).toBeVisible();
    const action = page.locator("#popup-action");
    await action.focus();
    await expect(action).toBeFocused();
    const box = await action.boundingBox();
    const hitTarget = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.id, {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    });
    expect(hitTarget).toBe("popup-action");
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    expect(await page.evaluate(() => window.actionCount)).toBe(1);
    await expect(page.locator("#popup")).not.toHaveClass(/is-open/);
    await expect(page.locator("#trigger")).toBeFocused();
  });
}
