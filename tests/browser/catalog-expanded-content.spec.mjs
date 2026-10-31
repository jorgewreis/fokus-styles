import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));
async function mount(page, id) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setContent(`<!doctype html><html lang="pt-BR"><head><title>Catálogo ${id}</title></head><body><main><h1>Exemplo ${id}</h1>${readFileSync(`${root}docs/catalog/fixtures/${id}/basic.html`, "utf8")}</main></body></html>`);
  await page.addStyleTag({ path: `${root}dist/css/fokus.css` });
}
for (const id of ["avatar", "icon-link", "menu", "pagination", "progress", "rating", "ratio", "input-group"]) {
  test(`${id}: adapted content has no automated axe violations`, async ({ page }) => {
    await mount(page, id);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations).toEqual([]);
  });
}
test("rating native labels and keyboard update exactly one value", async ({ page }) => {
  await mount(page, "rating");
  await page.locator('label[for="nota-3"]').click();
  await expect(page.getByRole("radio", { name: "3 estrelas", exact: true })).toBeChecked();
  await page.getByRole("radio", { name: "3 estrelas", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('input:checked')).toHaveCount(1);
  await expect(page.locator('input:checked')).not.toHaveValue("3");
});
test("ratio remains four by three at two viewport sizes", async ({ page }) => {
  await mount(page, "ratio");
  for (const width of [400, 1000]) {
    await page.setViewportSize({ width, height: 900 });
    const box = await page.locator(".fs-ratio").boundingBox();
    expect(box.height / box.width).toBeCloseTo(0.75, 2);
  }
});
test("content navigation has real local targets and no disabled anchor", async ({ page }) => {
  for (const id of ["icon-link", "menu", "pagination"]) {
    await mount(page, id);
    for (const link of await page.locator("a").all()) {
      const target = await link.getAttribute("href");
      await link.click();
      expect(await page.evaluate(() => location.hash)).toBe(target);
    }
    await expect(page.locator('[aria-disabled="true"][href]')).toHaveCount(0);
  }
});
