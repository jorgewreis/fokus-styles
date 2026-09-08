import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const exampleUrl = `file://${path.join(rootDir, "mockup", "examples", "alerts.html")}`;

for (const theme of ["light", "dark"]) {
  test(`alertas demonstram variantes, slots e responsividade (${theme})`, async ({ page }) => {
    await page.goto(`${exampleUrl}?theme=${theme}`);
    await expect(page.locator(".fs-alert")).toHaveCount(13);
    await expect(page.locator(".fs-alert-icon").first()).toBeVisible();
    await expect(page.locator(".fs-alert-heading").first()).toBeVisible();
    await expect(page.locator(".fs-alert-actions").first()).toBeVisible();
    await expect(page.locator(".fs-alert-close").first()).toHaveAttribute("aria-label");
    await expect(page.locator(".fs-alert-danger").first()).toHaveCSS("border-radius", "6px");
    await expect(page.locator(".fs-alert-success").first()).toHaveCSS("border-inline-start-width", "4px");
    await expect(page.locator(".fs-alert-group")).toBeVisible();
    await expect(page.locator(".fs-alert-inline")).toBeVisible();
    await expect(page.locator('.fs-alert[aria-busy="true"]')).toBeVisible();
    expect(await page.locator("body").evaluate((body) => body.scrollWidth > body.clientWidth)).toBe(false);
    await page.setViewportSize({ width: 320, height: 800 });
    expect(await page.locator("body").evaluate((body) => body.scrollWidth > body.clientWidth)).toBe(false);
    await page.emulateMedia({ forcedColors: "active" });
    await expect(page.locator(".fs-alert").first()).toBeVisible();
  });
}
