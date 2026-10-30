import { test, expect } from "@playwright/test";
import { fileURLToPath } from "node:url";
const css = fileURLToPath(new URL("../../dist/css/fokus.css", import.meta.url));

for (const [ancestor, local, direction] of [
  ["ltr", "", 1], ["rtl", "", -1], ["rtl", "ltr", 1], ["ltr", "rtl", -1],
]) {
  test(`icon-link motion: ancestor ${ancestor}, local ${local || "inherited"}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setContent(`<!doctype html><html dir="${ancestor}"><body>
      <a class="fs-icon-link" ${local ? `dir="${local}"` : ""} href="#target">Documentation
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
      </a></body></html>`);
    await page.addStyleTag({ path: css });
    const link = page.locator(".fs-icon-link");
    const icon = link.locator("svg");
    const offset = () => icon.evaluate(el => {
      const transform = getComputedStyle(el).transform;
      return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41;
    });
    await expect(icon).toHaveCSS("transform", "none");
    await link.hover();
    const fontSize = await icon.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    expect(await offset()).toBeCloseTo(direction * fontSize * .15, 3);
    // Toggle while hovered: reduced motion must remove displacement, not just animation.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(icon).toHaveCSS("transform", "none");
    // Global reduced-motion reset intentionally retains a tiny duration
    // for transitionend consumers; no transition property means no icon motion.
    await expect(icon).toHaveCSS("transition-property", "none");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect.poll(offset).toBeCloseTo(direction * fontSize * .15, 3);
    // Reset removes body margins: (0,0) can still be inside the link.
    await page.mouse.move(0, page.viewportSize().height - 1);
    await expect(icon).toHaveCSS("transform", "none");
  });
}
