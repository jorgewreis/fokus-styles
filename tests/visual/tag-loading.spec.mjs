import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const script = buildSync({
  stdin: {
    contents: 'import { Tag } from "./packages/fokus-js/js/tag.js"; window.Tag = Tag;',
    resolveDir: root,
  },
  bundle: true,
  write: false,
  format: "iife",
}).outputFiles[0].text;

test("Tag preserves consumer-disabled control through initial and subsequent loading", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Tag loading</title><body><main>
    <h1>Filtros</h1><span id="tag" class="fs-badge fs-tag is-loading" data-fs="tag" aria-busy="true">
      <span class="fs-tag-label">Frontend</span><button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover filtro" disabled></button>
    </span></main></body></html>`);
  await page.addStyleTag({ path: `${root}dist/css/fokus.css` });
  await page.addScriptTag({ content: script });

  const button = page.locator("[data-fs-dismiss='tag']");
  await expect(button).toBeDisabled();
  await page.evaluate(() => window.Tag.getInstance(document.querySelector("#tag")).setLoading(false).setLoading(true).setLoading(false));
  await expect(button).toBeDisabled();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()).violations).toEqual([]);

  await button.evaluate((el) => { el.disabled = false; });
  await button.click();
  await expect(page.locator("#tag")).toHaveCount(0);
});
