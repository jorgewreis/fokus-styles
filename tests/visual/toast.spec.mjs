import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const exampleUrl = `file://${path.join(rootDir, "mockup", "examples", "toast.html")}`;

for (const theme of ["light", "dark"]) {
  test(`toasts demonstram composição, pausa e responsividade (${theme})`, async ({ page }) => {
    await page.clock.install();
    await page.goto(`${exampleUrl}?theme=${theme}`);
    await expect(page.locator(".demo-page")).toBeVisible();
    const toastShown = page.evaluate(() => new Promise((resolve) => {
      document.querySelector("#toast-progress").addEventListener("fs:toast:shown", resolve, { once: true });
    }));
    await page.click('[data-show-toast="progress"]');
    await toastShown;
    const currentTime = await page.evaluate(() => Date.now());
    await page.clock.pauseAt(currentTime + 1000);
    await expect(page.locator("#toast-progress")).toBeVisible();
    await expect(page.locator("#toast-progress .fs-toast-progress")).toBeVisible();
    await expect(page.locator("#toast-progress .fs-toast-progress")).toHaveCSS("opacity", "0.5");
    const initialProgress = await page.locator("#toast-progress .fs-toast-progress").evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, right: rect.right };
    });
    const initialCountdown = await page.locator("#toast-progress .fs-toast-meta").textContent();
    const initialSeconds = Number(initialCountdown.match(/\d+/)?.[0]);
    expect(initialSeconds).toBeGreaterThan(0);
    await page.clock.runFor(1100);
    // The JS clock drives the countdown, but CSS inline-size transitions use
    // the rendering timeline. Wait for the visible effect, not an immediate
    // layout read in the same task as the virtual-clock advance.
    await expect.poll(() => page.locator("#toast-progress .fs-toast-progress")
      .evaluate((element) => element.getBoundingClientRect().width))
      .toBeLessThan(initialProgress.width);
    const reducedProgress = await page.locator("#toast-progress .fs-toast-progress").evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, right: rect.right };
    });
    expect(reducedProgress.width).toBeLessThan(initialProgress.width);
    expect(Math.abs(reducedProgress.right - initialProgress.right)).toBeLessThanOrEqual(1);
    const reducedCountdown = await page.locator("#toast-progress .fs-toast-meta").textContent();
    const reducedSeconds = Number(reducedCountdown.match(/\d+/)?.[0]);
    expect(reducedSeconds).toBe(initialSeconds - 1);
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
