import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const utilityLab = `file://${path.join(rootDir, "mockup", "examples", "utilities.html")}`;

test.describe("Utility laboratory", () => {
  test("aplica Grid e overflow na viewport compacta", async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto(utilityLab);

    const result = await page.locator(".utility-grid").evaluate((el) => {
      const style = getComputedStyle(el);
      const overflow = getComputedStyle(document.querySelector(".utility-overflow"));
      return {
        columns: style.gridTemplateColumns.split(" ").length,
        overflowY: overflow.overflowY,
      };
    });

    expect(result.columns).toBe(2);
    expect(result.overflowY).toBe("auto");
  });

  test("ativa Grid responsivo em viewport ampla e reduz movimento", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(utilityLab);

    const result = await page.locator(".utility-grid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
    expect(result).toBe(3);

    await page.emulateMedia({ reducedMotion: "reduce" });
    const motion = await page.locator(".utility-motion").evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(motion).toMatch(/0|0\.01/);
  });

  test("renderiza tokens semânticos, formulário e composição de transforms", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto(utilityLab);

    await expect(page.locator(".fs-u-bg-primary-subtle").first()).toBeVisible();
    await expect(page.locator("#utility-email")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator('[data-theme="dark"][dir="rtl"]')).toHaveAttribute("dir", "rtl");

    const transform = await page.locator('[data-theme="dark"][dir="rtl"] .fs-u-rotate-90').evaluate((el) => getComputedStyle(el).transform);
    expect(transform).not.toBe("none");
  });

  test("mantém o foco visível e reduz animações em forced colors", async ({ page }) => {
    await page.goto(utilityLab);
    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    const button = page.locator(".utility-form button");
    await button.focus();

    await expect(button).toBeFocused();
    const transition = await page.locator(".utility-motion").evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(transition).toMatch(/0|0\.01/);
  });
});
