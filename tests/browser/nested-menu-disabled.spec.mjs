import { test, expect } from "@playwright/test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const script = buildSync({
  stdin: { contents: 'import { NestedMenu } from "./packages/fokus-js/js/nested-menu.js"; window.NestedMenu = NestedMenu;', resolveDir: root },
  bundle: true, write: false, format: "iife",
}).outputFiles[0].text;

test("NestedMenu skips unavailable controls and blocks real link keyboard activation", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Menu</title><body><main>
    <button id="toggle">Ações</button><div class="fs-dropdown-menu">
      <button class="fs-dropdown-item" id="first">Primeiro</button>
      <button class="fs-dropdown-item" disabled>Indisponível nativo</button>
      <a class="fs-dropdown-item" id="blocked" aria-disabled="true" href="#blocked">Indisponível ARIA</a>
      <a class="fs-dropdown-item is-disabled" href="#class">Indisponível classe</a>
      <a class="fs-dropdown-item" id="last" href="#allowed">Último</a>
    </div></main></body></html>`);
  await page.addStyleTag({ path: root + "dist/css/fokus.css" });
  await page.addScriptTag({ content: script });
  await page.evaluate(() => {
    window.instance = new window.NestedMenu(document.querySelector("#toggle"));
    window.activations = 0;
    document.querySelector("#blocked").addEventListener("click", () => window.activations++);
  });
  await page.locator("#toggle").click();
  await expect(page.locator("#first")).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#last")).toBeFocused();
  await page.locator("#blocked").focus();
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => ({ count: window.activations, hash: location.hash, open: window.instance.isOpen }))).toEqual({ count: 0, hash: "", open: true });
  await page.locator("#last").focus();
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => location.hash)).toBe("#allowed");
  await expect(page.locator("#toggle")).toBeFocused();
});

test("hover cannot open disabled branches but enabled siblings still open", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Submenus</title><body><main>
    <button id="toggle">Menu</button><div class="fs-dropdown-menu">
      ${['disabled', 'aria-disabled="true"', 'class-disabled', 'enabled'].map((attr, i) =>
        `<div class="fs-dropdown-submenu" id="wrapper${i}"><button class="fs-dropdown-item fs-dropdown-item-submenu ${attr === 'class-disabled' ? 'is-disabled' : ''}" ${attr === 'disabled' || attr.startsWith('aria-') ? attr : ''}>Ramo ${i}</button><div class="fs-dropdown-menu" id="submenu${i}"><button class="fs-dropdown-item">Filho</button></div></div>`
      ).join('')}
    </div></main></body></html>`);
  await page.addStyleTag({ path: root + "dist/css/fokus.css" });
  await page.addScriptTag({ content: script });
  await page.evaluate(() => new window.NestedMenu(document.querySelector("#toggle")).show());
  for (const i of [0, 1, 2]) {
    await page.locator(`#wrapper${i}`).hover();
    await expect(page.locator(`#submenu${i}`)).toBeHidden();
  }
  await page.locator("#wrapper3").hover();
  await expect(page.locator("#submenu3")).toBeVisible();
});

test("Escape can leave a submenu whose native parent became disabled", async ({ page }) => {
  await page.setContent('<!doctype html><html lang="pt-BR"><title>Menu escape</title><body><main><button id="toggle">Menu</button><div class="fs-dropdown-menu"><div class="fs-dropdown-submenu"><button id="parent" class="fs-dropdown-item fs-dropdown-item-submenu">Pai</button><div class="fs-dropdown-menu"><button id="child" class="fs-dropdown-item">Filho</button></div></div></div></main></body></html>');
  await page.addStyleTag({ path: root + "dist/css/fokus.css" });
  await page.addScriptTag({ content: script });
  await page.evaluate(() => { window.instance = new window.NestedMenu(document.getElementById('toggle')); window.instance.show(); });
  await page.locator('#parent').press('ArrowRight');
  await expect(page.locator('#child')).toBeFocused();
  await page.evaluate(() => document.getElementById('parent').disabled = true);
  await page.locator('#child').press('Escape');
  await expect(page.locator('#toggle')).toBeFocused();
  expect(await page.evaluate(() => window.instance.isOpen)).toBe(false);
});
