import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));
async function mount(page, html) {
  await page.setContent('<!doctype html><html lang="en"><title>Component state</title><body>'+html+"</body></html>");
  await page.addStyleTag({ path: path.join(root, "dist/css/fokus.css") });
  await page.addScriptTag({ path: path.join(root, "dist/js/fokus.js") });
}
test("rapid animated collapse and accordion keep their final visible state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await mount(page, '<button id="toggle" data-fs-target="#panel">Toggle</button><div id="panel">Content</div><div id="a"><div class="fs-accordion-item"><button class="fs-accordion-button">Section</button><div class="fs-accordion-collapse">Details</div></div></div>');
  await page.evaluate(() => {
    window.c = new FokusStyles.Collapse(document.querySelector("#toggle"));
    window.a = new FokusStyles.Accordion(document.querySelector("#a"));
    window.settled = false;
    document.querySelector("#toggle").addEventListener("fs:collapse:shown", () => { window.settled = true; });
    c.show(); c.hide(); c.show();
    const button = document.querySelector(".fs-accordion-button");
    button.click(); button.click(); button.click();
  });
  await expect.poll(() => page.evaluate(() => window.settled)).toBe(true);
  await expect(page.locator("#panel")).toBeVisible();
  await expect(page.locator(".fs-accordion-collapse")).toBeVisible();
  await expect(page.locator(".fs-accordion-button")).toHaveAttribute("aria-expanded", "true");
  await page.evaluate(() => c.hide());
  await expect(page.locator("#panel")).toBeHidden();
});
test("native reset synchronizes custom select and date deletion clears model", async ({ page }) => {
  await mount(page, '<form><select id="select"><option>A</option><option>B</option></select><button type="reset" id="reset">Reset</button></form><input id="date" value="30/10/2026" data-fs-target="#dp"><div id="dp"></div>');
  await page.evaluate(() => {
    window.s = new FokusStyles.Select(document.querySelector("#select"));
    window.d = new FokusStyles.Datepicker(document.querySelector("#date"));
  });
  await page.locator(".fs-form-select").click();
  await page.locator(".fs-dropdown-item").nth(1).click();
  await page.locator("#reset").click();
  await expect(page.locator(".fs-form-select")).toHaveText("A");
  await page.locator("#date").fill("");
  await page.locator("#date").dispatchEvent("change");
  expect(await page.evaluate(() => d.value)).toBeNull();
});
test("decimal table sort survives dispose and reinit", async ({ page }) => {
  await mount(page, '<div id="dt"><table class="fs-table"><thead><tr><th data-fs-sort="n" data-fs-sort-type="number">Number</th></tr></thead><tbody><tr><td>2</td></tr><tr><td>1.5</td></tr></tbody></table></div>');
  await page.evaluate(() => {
    window.table = new FokusStyles.DataTable(document.querySelector("#dt"));
    table.dispose();
    window.table = new FokusStyles.DataTable(document.querySelector("#dt"));
  });
  await expect(page.locator("th button")).toHaveCount(1);
  await page.locator("th button").click();
  await expect(page.locator("tbody tr").first()).toHaveText("1.5");
});
