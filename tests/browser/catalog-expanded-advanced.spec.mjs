import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../../", import.meta.url));
const ids = ["combobox", "command-palette", "datatable", "datepicker", "select", "tree-view"];
const scripts = Object.fromEntries(ids.map(id => [id, buildSync({ entryPoints: [path.join(root, `docs/catalog/fixtures/${id}/basic.js`)], bundle: true, write: false, format: "iife" }).outputFiles[0].text]));
async function mount(page, id) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>${id}</title><body><main>${readFileSync(path.join(root, `docs/catalog/fixtures/${id}/basic.html`), "utf8")}</main></body></html>`);
  await page.addStyleTag({ path: path.join(root, "dist/css/fokus.css") });
  await page.addScriptTag({ content: scripts[id] });
}
async function dispose(page) { await page.evaluate(() => window.dispatchEvent(new Event("pagehide"))); }

test("advanced Combobox named input filters/selects with keyboard then reinitializes", async ({ page }) => {
  await mount(page, "combobox");
  const input = page.getByRole("combobox", { name: "Framework" });
  await input.fill("tail"); await input.press("Home"); await input.press("Enter");
  await expect(input).toHaveValue("Tailwind CSS"); await expect(input).toHaveAttribute("aria-expanded", "false");
  await input.press("ArrowDown"); await input.press("Escape"); await expect(input).toBeFocused();
  await dispose(page); await input.press("ArrowDown"); await expect(input).toHaveAttribute("aria-expanded", "false");
  await page.addScriptTag({ content: scripts.combobox }); await input.press("ArrowDown"); await expect(input).toHaveAttribute("aria-expanded", "true");
});

test("advanced CommandPalette named dialog supports filtering, Escape and teardown", async ({ page }) => {
  await mount(page, "command-palette");
  const trigger = page.getByRole("button", { name: /Comandos/ });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Comandos disponíveis" })).toBeVisible();
  const input = page.getByRole("combobox", { name: "Buscar comando" });
  await input.fill("Novo"); await input.press("Home"); await input.press("Enter");
  await expect(trigger).toBeFocused();
  for (let i = 0; i < 2; i++) { await trigger.click(); await input.press("Escape"); await expect(trigger).toBeFocused(); }
  await dispose(page); await trigger.click(); await expect(page.locator("#paleta")).toBeHidden();
  await page.addScriptTag({ content: scripts["command-palette"] }); await trigger.click(); await expect(input).toBeFocused();
});

test("advanced DataTable named filter sorts and clears empty state after teardown", async ({ page }) => {
  await mount(page, "datatable");
  await page.getByRole("button", { name: "Idade", exact: true }).click();
  await expect(page.locator("tbody tr").first()).toContainText("Bruno");
  await page.getByRole("searchbox", { name: "Filtrar pessoas" }).fill("zzzz");
  await expect(page.locator("[data-fs-datatable-empty]")).toBeVisible();
  await page.getByRole("searchbox", { name: "Filtrar pessoas" }).fill("Ana");
  await expect(page.locator("tbody tr:visible")).toHaveCount(1);
  await dispose(page); await expect(page.locator("tbody tr:visible")).toHaveCount(2);
  await page.addScriptTag({ content: scripts.datatable });
  await expect(page.locator("th button")).toHaveCount(2);
});

test("advanced Datepicker keyboard date selection, repeated Escape and teardown", async ({ page }) => {
  await mount(page, "datepicker");
  const input = page.getByRole("combobox", { name: "Data de entrega" });
  await input.focus(); await input.press("ArrowDown"); await page.keyboard.press("ArrowRight"); await page.keyboard.press("Enter");
  await expect(input).toHaveValue("21/07/2026"); await expect(input).toHaveAttribute("aria-expanded", "false");
  for (let i = 0; i < 2; i++) { await input.press("ArrowDown"); await page.keyboard.press("Escape"); await expect(input).toBeFocused(); await expect(input).toHaveAttribute("aria-expanded", "false"); }
  await dispose(page); await input.press("ArrowDown"); await expect(input).toHaveAttribute("aria-expanded", "false");
  await page.addScriptTag({ content: scripts.datepicker }); await input.press("ArrowDown"); await expect(page.getByRole("grid", { name: "Data de entrega" })).toBeVisible();
});

test("advanced Select generated button keeps field name and selected country", async ({ page }) => {
  await mount(page, "select");
  const toggle = page.getByRole("button", { name: "País Brasil", exact: true });
  await toggle.click(); await page.getByRole("option", { name: "Portugal", exact: true }).click();
  await expect(page.getByRole("button", { name: "País Portugal", exact: true })).toBeVisible();
  await expect(page.locator("#pais")).toHaveValue("pt");
  await dispose(page); await expect(page.getByRole("combobox", { name: "País", exact: true })).toBeVisible();
  await page.addScriptTag({ content: scripts.select }); await expect(page.getByRole("button", { name: "País Portugal", exact: true })).toBeVisible();
});

test("advanced TreeView named tree keyboard navigation and reinitialization", async ({ page }) => {
  await mount(page, "tree-view");
  const tree = page.getByRole("tree", { name: "Arquivos de exemplo" });
  const parent = tree.locator(':scope > li').first();
  await parent.focus(); await page.keyboard.press("ArrowRight"); await expect(parent).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("ArrowRight"); await page.keyboard.press("Enter");
  await expect(tree.getByRole("treeitem", { name: "index.js", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowLeft"); await page.keyboard.press("ArrowLeft"); await expect(parent).toHaveAttribute("aria-expanded", "false");
  await dispose(page); await parent.press("ArrowRight"); await expect(parent).toHaveAttribute("aria-expanded", "false");
  await page.addScriptTag({ content: scripts["tree-view"] }); await parent.press("ArrowRight"); await expect(parent).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".fs-tree-toggle")).toHaveCount(2);
});

for (const id of ids) {
  test(`${id}: targeted fixture axe check (not a manual accessibility certification)`, async ({ page }) => {
    await mount(page, id);
    if (id === "command-palette") await page.locator('[data-fs="command-palette"]').click();
    if (id === "combobox" || id === "datepicker") await page.locator(`[data-fs="${id}"]`).press("ArrowDown");
    if (id === "select") await page.locator(".fs-form-select-dropdown > button").click();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
  });
}
