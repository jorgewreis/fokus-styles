import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
for (const file of ["examples/rating.html", "kitchen-sink.html"]) {
  test(`${file}: rating names belong to native radios and labels remain clickable`, async ({ page }) => {
    await page.goto(`file://${path.join(root, "mockup", file)}`);
    const labels = page.locator("label.fs-rating-star");
    expect(await labels.count()).toBeGreaterThan(0);
    for (const label of await labels.all()) {
      await expect(label).not.toHaveAttribute("aria-label");
      const id = await label.getAttribute("for");
      const input = page.locator(`[id="${id}"]`);
      const value = await input.getAttribute("value");
      await expect(input).toHaveAccessibleName(`${value} ${value === "1" ? "estrela" : "estrelas"}`);
      if (await input.isEnabled()) {
        await label.click();
        await expect(input).toBeChecked();
      }
    }
  });
}
