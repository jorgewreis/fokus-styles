import { test, expect } from "@playwright/test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const script = buildSync({
  stdin: {
    contents: 'import { DataTable } from "./packages/fokus-js/js/datatable.js"; window.table = new DataTable(document.getElementById("table"));',
    resolveDir: root,
  },
  bundle: true,
  write: false,
  format: "iife",
}).outputFiles[0].text;

test("subunit page size preserves visible rows and finite pagination", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Table boundary</title><body><main>
    <div id="table" data-fs-page-size="0.5"><table class="fs-table"><caption>Itens</caption>
      <thead><tr><th>Nome</th></tr></thead><tbody><tr><td>A</td></tr><tr><td>B</td></tr></tbody>
    </table></div></main></body></html>`);
  await page.addStyleTag({ path: `${root}dist/css/fokus.css` });
  await page.addScriptTag({ content: script });

  await expect(page.locator("tbody tr:not([hidden])")).toHaveCount(2);
  expect(await page.evaluate(() => [window.table.pageSize, window.table.pageCount])).toEqual([10, 1]);
  await page.evaluate(() => window.table.goToPage(100));
  await expect(page.locator("tbody td").first()).toBeVisible();
  expect(await page.evaluate(() => window.table.currentPage)).toBe(1);
});
