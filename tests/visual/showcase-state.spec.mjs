import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));

test.describe("Showcase state laboratory", () => {
  test("applies RTL, reduced motion and forced-colors to all previews", async ({ page }) => {
    await page.goto(`file://${path.join(rootDir, "mockup", "forms.html")}?theme=dark`);
    await expect(page.locator("iframe.showcase-preview").first()).toBeVisible();
    const frame = page.locator("iframe.showcase-preview").first().contentFrame();
    await expect(frame.locator("body")).toBeVisible();

    const rtl = page.getByRole("button", { name: "Testar RTL" });
    const motion = page.getByRole("button", { name: "Reduzir movimento" });
    const forced = page.getByRole("button", { name: "Simular alto contraste" });

    await rtl.click();
    await motion.click();
    await forced.click();

    expect(await rtl.getAttribute("aria-pressed")).toBe("true");
    expect(await motion.getAttribute("aria-pressed")).toBe("true");
    expect(await forced.getAttribute("aria-pressed")).toBe("true");

    await expect(frame.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(frame.locator("html")).toHaveAttribute("data-showcase-forced-colors");
    await expect.poll(() => frame.locator("#showcase-preview-state-style").evaluate((element) => element.textContent)).toContain("transition-duration");
  });
});
