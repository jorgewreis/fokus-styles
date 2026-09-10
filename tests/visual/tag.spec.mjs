import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const exampleUrl = `file://${path.join(rootDir, "mockup", "examples", "tag.html")}`;

for (const theme of ["light", "dark"]) {
  test(`tags demonstram ícones, estados e foco (${theme})`, async ({ page }) => {
    await page.goto(`${exampleUrl}?theme=${theme}`);

    await expect(page.locator(".fs-tag-icon").first()).toBeVisible();
    await expect(page.locator(".fs-tag-icon-end").first()).toBeVisible();
    await expect(page.locator(".fs-tag.is-loading")).toHaveAttribute("aria-busy", "true");
    await expect(page.locator(".fs-tag-overflow")).toHaveAttribute("aria-label", "Mostrar mais 3 tags");
    await expect(page.locator(".fs-tag-protected .fs-btn-close")).toHaveCount(0);
    await expect(page.locator(".fs-tag .fs-btn-close").first()).toHaveCSS("border-radius", "4px");
    await expect(page.locator(".fs-tag-icon").first()).toHaveCSS("width", "20px");
    await expect(page.locator(".fs-tag-icon").first()).toHaveCSS("height", "20px");
    await expect(page.locator(".fs-tag-icon .fs-icon").first()).toBeVisible();
    await expect(page.locator('.fs-tag:has(> .fs-tag-icon:not(.fs-tag-icon-end))').first()).toHaveCSS("padding-left", "2px");
    await expect(page.locator(".fs-tag").first()).toHaveCSS("padding-right", "2px");
    await expect(page.locator(".fs-tag-addons > .fs-tag").first()).toHaveCSS("padding-left", "8px");
    await expect(page.locator(".fs-tag-addons > .fs-tag").last()).toHaveCSS("padding-right", "8px");
    await expect(page.locator(".fs-tag-rounded").first()).toHaveCSS("padding-left", "8px");
    await expect(page.locator(".fs-tag-rounded").first()).toHaveCSS("padding-right", "8px");

    const aligned = await page.locator('.fs-tag:has(> .fs-tag-icon:not(.fs-tag-icon-end))').first().evaluate((tag) => {
      const nodes = [tag.querySelector(".fs-tag-icon"), tag.querySelector(".fs-tag-label"), tag.querySelector(".fs-btn-close")];
      const centers = nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });
      return Math.max(...centers) - Math.min(...centers);
    });
    expect(aligned).toBeLessThanOrEqual(1);

    const groupButtons = page.locator('.fs-tag-group [data-fs-dismiss="tag"]');
    await groupButtons.first().focus();
    await page.keyboard.press("Enter");
    await expect(groupButtons.first()).toBeFocused();
  });
}
