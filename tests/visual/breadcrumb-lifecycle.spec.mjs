import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const script = buildSync({
  stdin: {
    contents: 'import { Breadcrumb } from "./packages/fokus-js/js/breadcrumb.js"; import { Tooltip } from "./packages/fokus-js/js/tooltip.js"; window.Breadcrumb = Breadcrumb; window.Tooltip = Tooltip;',
    resolveDir: root,
  },
  bundle: true,
  write: false,
  format: "iife",
}).outputFiles[0].text;

async function mount(page, { collapse = false } = {}) {
  const items = Array.from({ length: collapse ? 5 : 1 }, (_, index) =>
    `<li class="fs-breadcrumb-item"><a href="#detail-${index}" style="display:inline-block;max-width:72px;white-space:nowrap;overflow:hidden">Nome muito longo para truncar ${index}</a></li>`,
  ).join("");
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Breadcrumb lifecycle</title><body><main>
    <nav aria-label="Trilha"><ol class="fs-breadcrumb" ${collapse ? 'data-max-items="3"' : ""}>${items}</ol></nav>
    <h1 id="detail-0">Detalhes</h1></main></body></html>`);
  await page.addStyleTag({ path: `${root}dist/css/fokus.css` });
  await page.addScriptTag({ content: script });
}

test("Breadcrumb disposal cancels deferred fonts and owns its generated Tooltip", async ({ page }) => {
  await mount(page);
  await page.evaluate(async () => {
    let resolveFonts;
    Object.defineProperty(document, "fonts", { configurable: true, value: { ready: new Promise((resolve) => { resolveFonts = resolve; }) } });
    const list = document.querySelector("ol");
    const target = list.querySelector("a");
    Object.defineProperties(target, { scrollWidth: { configurable: true, value: 200 }, clientWidth: { configurable: true, value: 20 } });
    window.instance = new window.Breadcrumb(list);
    window.instance.dispose();
    resolveFonts();
    await Promise.resolve();
  });
  await expect(page.locator(".fs-tooltip")).toHaveCount(0);

  await page.evaluate(async () => {
    delete document.fonts;
    window.instance = new window.Breadcrumb(document.querySelector("ol"));
    await document.fonts?.ready;
  });
  const link = page.locator(".fs-breadcrumb a");
  await expect(page.locator(".fs-tooltip")).toHaveCount(1);
  await link.focus();
  await expect(page.getByRole("tooltip")).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.evaluate(() => window.instance.dispose());
  await expect(page.locator(".fs-tooltip")).toHaveCount(0);
  await expect(link).not.toHaveAttribute("aria-describedby", /fokus-tooltip/);
});

test("collapsed Breadcrumb Dropdown opens and disposes through shared overlay lifecycle", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await mount(page, { collapse: true });
  await page.evaluate(() => { window.instance = new window.Breadcrumb(document.querySelector("ol")); });
  const trigger = page.locator(".fs-breadcrumb-more");
  await expect(trigger).toBeVisible();
  await trigger.click();
  const menu = page.locator(".fs-dropdown-menu");
  await expect(menu).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.evaluate(() => window.instance.dispose());
  await expect(page.locator(".fs-breadcrumb-more")).toHaveCount(0);
  await expect(menu).toHaveCount(0);
  await expect(page.locator(".fs-breadcrumb-item")).toHaveCount(5);
});
