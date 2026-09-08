import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const exampleUrl = `file://${path.join(rootDir, "mockup", "examples", "badges-alerts.html")}`;

for (const theme of ["light", "dark"]) {
  test(`badges preservam densidade, raio e variantes (${theme})`, async ({ page }) => {
    await page.goto(`${exampleUrl}?theme=${theme}`);

    const badge = page.locator(".fs-badge").first();
    const small = page.locator(".fs-badge:not(.fs-badge-split).fs-badge-sm").first();
    const circle = page.locator(".fs-badge-count-circle").first();
    const split = page.locator(".fs-badge-split").first();

    await expect(badge).toHaveCSS("border-radius", "4px");
    await expect(small).toHaveCSS("padding-left", "6px");
    await expect(small).toHaveCSS("padding-right", "6px");
    await expect(circle).toHaveCSS("border-radius", "50%");
    await expect(circle).toHaveCSS("aspect-ratio", "1 / 1");
    await expect(split).toHaveCSS("border-radius", "4px");
  });
}
