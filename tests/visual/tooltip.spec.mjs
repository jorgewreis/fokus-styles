import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const url = `file://${path.join(root, "mockup", "examples", "tooltip.html")}`;

test.describe("Tooltip laboratory", () => {
  test("opens by hover, focus and Escape", async ({ page }) => {
    await page.goto(url);
    const trigger = page.locator('[data-fs="tooltip"]').first();
    await trigger.hover();
    await expect(page.locator(".fs-tooltip.is-open")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".fs-tooltip.is-open")).toHaveCount(0);
    await trigger.focus();
    await expect(page.locator(".fs-tooltip.is-open")).toBeVisible();
  });

  test("supports RTL and does not overflow on narrow screens", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(url);
    await page.locator("#toggle-direction").click();
    await expect(page.locator(".demo-page")).toHaveAttribute("dir", "rtl");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });

  test("exibe os novos alinhamentos e offset", async ({ page }) => {
    await page.goto(url);
    await expect(page.getByRole("heading", { name: "Alinhamento e offset" })).toBeVisible();
    await page.locator('[data-placement="top-start"]').last().hover();
    await expect(page.locator(".fs-tooltip.is-open")).toHaveAttribute("data-align", "start");
    await page.mouse.move(5, 5);
    await page.locator('[data-offset="16"]').hover();
    await expect(page.locator(".fs-tooltip.is-open")).toBeVisible();
  });
});
