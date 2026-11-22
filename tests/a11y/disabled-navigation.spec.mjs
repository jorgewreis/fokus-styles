import { test, expect } from "@playwright/test";
import { buildSync } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const bundle = (source) => buildSync({
  stdin: { contents: source, resolveDir: rootDir },
  bundle: true,
  write: false,
  format: "iife",
}).outputFiles[0].text;
const tabsScript = bundle('import { Tabs } from "./packages/fokus-js/js/tabs.js"; window.tabs = new Tabs(document.querySelector("#tabs"));');
const treeScript = bundle('import { TreeView } from "./packages/fokus-js/js/tree-view.js"; window.tree = new TreeView(document.querySelector("#tree"));');
const menuScript = bundle('import { NestedMenu } from "./packages/fokus-js/js/nested-menu.js"; window.menu = new NestedMenu(document.querySelector("#toggle"));');

async function loadStyles(page) {
  await page.addStyleTag({ path: path.join(rootDir, "dist/css/fokus.css") });
}

test("Tabs bloqueia ativação desabilitada e preserva navegação habilitada", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Tabs disabled</title><body><main>
    <div id="tabs"><button class="fs-nav-link is-active" data-fs-target="#one">Um</button>
      <a href="#blocked" aria-disabled="true" class="fs-nav-link" data-fs-target="#two">Indisponível</a>
      <a href="#allowed" class="fs-nav-link" data-fs-target="#three">Permitido</a></div>
    <section id="one">Um</section><section id="two">Dois</section><section id="three">Três</section><div id="allowed">Destino</div>
  </main></body></html>`);
  await loadStyles(page);
  await page.addScriptTag({ content: tabsScript });
  await page.getByRole("tab", { name: "Indisponível" }).focus();
  await page.getByRole("tab", { name: "Indisponível" }).press("Enter");
  expect(await page.evaluate(() => location.hash)).toBe("");
  await expect(page.getByRole("tab", { name: "Um" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Um" }).focus();
  await page.getByRole("tab", { name: "Um" }).press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Permitido" })).toBeFocused();
  await page.getByRole("tab", { name: "Permitido" }).press("Enter");
  expect(await page.evaluate(() => location.hash)).toBe("#allowed");
});

test("TreeView mantém nós desabilitados descobríveis sem permitir ativação", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Tree disabled</title><body><main>
    <ul id="tree" class="fs-tree" aria-label="Arquivos">
      <li id="closed" aria-disabled="true"><a class="fs-tree-label" href="#blocked">Fechado</a><ul><li><span class="fs-tree-label">Oculto</span></li></ul></li>
      <li id="open" class="is-disabled" aria-expanded="true"><span class="fs-tree-label">Aberto</span><ul><li id="child"><span class="fs-tree-label">Filho habilitado</span></li></ul></li>
      <li id="after"><span class="fs-tree-label">Depois</span></li>
    </ul></main></body></html>`);
  await loadStyles(page);
  await page.addScriptTag({ content: treeScript });
  await page.locator("#closed").focus();
  await page.locator("#closed").press("ArrowRight");
  await expect(page.locator("#closed")).toHaveAttribute("aria-expanded", "false");
  await page.locator("#closed a").focus();
  await page.locator("#closed a").press("Enter");
  expect(await page.evaluate(() => location.hash)).toBe("");
  await page.locator("#closed").focus();
  await page.locator("#closed").press("ArrowDown");
  await expect(page.locator("#open")).toBeFocused();
  await page.locator("#open").press("ArrowRight");
  await expect(page.locator("#child")).toBeFocused();
  await page.locator("#child").press("Enter");
  await expect(page.locator("#child")).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#open")).toHaveAttribute("aria-expanded", "true");
});

test("NestedMenu não abre por hover o submenu de um item aria-disabled", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Nested menu hover</title><body><main>
    <button id="toggle">Menu</button><div class="fs-dropdown-menu">
      <div class="fs-dropdown-submenu" id="disabled-wrap"><button class="fs-dropdown-item fs-dropdown-item-submenu" aria-disabled="true">Indisponível</button><div class="fs-dropdown-menu" id="blocked-submenu"><button class="fs-dropdown-item">Filho</button></div></div>
      <div class="fs-dropdown-submenu" id="enabled-wrap"><button class="fs-dropdown-item fs-dropdown-item-submenu">Disponível</button><div class="fs-dropdown-menu" id="enabled-submenu"><button class="fs-dropdown-item">Filho</button></div></div>
    </div></main></body></html>`);
  await loadStyles(page);
  await page.addScriptTag({ content: menuScript });
  await page.evaluate(() => window.menu.show());
  await page.locator("#disabled-wrap").hover();
  await expect(page.locator("#blocked-submenu")).toBeHidden();
  await page.locator("#enabled-wrap").hover();
  await expect(page.locator("#enabled-submenu")).toBeVisible();
});

test("NestedMenu devolve foco ao gatilho se o pai ficar desabilitado no submenu", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Nested menu disabled</title><body><main>
    <button id="toggle">Menu</button><div class="fs-dropdown-menu">
      <div class="fs-dropdown-submenu"><button id="parent" class="fs-dropdown-item fs-dropdown-item-submenu">Pai</button><div class="fs-dropdown-menu"><button id="child" class="fs-dropdown-item">Filho</button></div></div>
    </div></main></body></html>`);
  await loadStyles(page);
  await page.addScriptTag({ content: menuScript });
  await page.evaluate(() => window.menu.show());
  await page.locator("#parent").focus();
  await expect(page.locator("#parent")).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#parent")).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#child")).toBeFocused();
  await page.evaluate(() => { document.querySelector("#parent").disabled = true; });
  await page.locator("#child").press("Escape");
  await expect(page.locator("#toggle")).toBeFocused();
  expect(await page.evaluate(() => window.menu.isOpen)).toBe(false);
});
