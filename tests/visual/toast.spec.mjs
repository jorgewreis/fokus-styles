import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const exampleUrl = `file://${path.join(rootDir, "mockup", "examples", "toast.html")}`;

for (const theme of ["light", "dark"]) {
  test(`toasts demonstram composição, pausa e responsividade (${theme})`, async ({ page }) => {
    await page.goto(`${exampleUrl}?theme=${theme}`);
    await expect(page.locator(".demo-page")).toBeVisible();
    await page.click('[data-show-toast="progress"]');
    await expect(page.locator("#toast-progress")).toBeVisible();
    await expect(page.locator("#toast-progress .fs-toast-progress")).toBeVisible();
    await expect(page.locator("#toast-progress .fs-toast-progress")).toHaveCSS("opacity", "0.5");
    const initialProgress = await page.locator("#toast-progress .fs-toast-progress").evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, right: rect.right };
    });
    await expect(page.locator("#toast-progress .fs-toast-meta")).toHaveText("6 segundos");
    await page.waitForTimeout(1100);
    const reducedProgress = await page.locator("#toast-progress .fs-toast-progress").evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, right: rect.right };
    });
    expect(reducedProgress.width).toBeLessThan(initialProgress.width);
    expect(Math.abs(reducedProgress.right - initialProgress.right)).toBeLessThanOrEqual(1);
    await expect(page.locator("#toast-progress .fs-toast-meta")).toHaveText("5 segundos");
    await page.locator("#toast-progress").hover();
    await expect(page.locator("#toast-progress")).toHaveClass(/is-paused/);
    await expect(page.locator(".fs-toast-container")).toBeVisible();
    await page.click("#toggle-direction");
    await expect(page.locator(".demo-page")).toHaveAttribute("dir", "rtl");
    await page.setViewportSize({ width: 320, height: 800 });
    expect(await page.locator("body").evaluate((body) => body.scrollWidth > body.clientWidth)).toBe(false);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("#toast-progress")).toBeVisible();
  });
}
