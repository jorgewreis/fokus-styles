import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";
const root = fileURLToPath(new URL("../../", import.meta.url));
const ids = ["offcanvas", "popover", "tooltip", "toast", "navbar", "nested-menu"];
const scripts = Object.fromEntries(ids.map(id => [id, buildSync({ entryPoints: [`${root}docs/catalog/fixtures/${id}/basic.js`], bundle: true, write: false, format: "iife" }).outputFiles[0].text]));
async function mount(page, id) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Exemplo ${id}</title><body><main>${readFileSync(`${root}docs/catalog/fixtures/${id}/basic.html`, "utf8")}</main></body></html>`);
  await page.addStyleTag({ path: `${root}dist/css/fokus.css` });
  await page.addScriptTag({ content: scripts[id] });
}
async function dispose(page) { await page.evaluate(() => window.dispatchEvent(new Event("pagehide"))); }
for (const id of ids) {
  test(`${id}: fixture script loads, disposes and reinitializes without errors`, async ({ page }) => {
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    await mount(page, id); await dispose(page); await page.addScriptTag({ content: scripts[id] }); await dispose(page);
    expect(errors).toEqual([]);
  });
}

test("offcanvas repeated Escape/focus, dismiss and interrupted teardown", async ({ page }) => {
  await mount(page, "offcanvas"); const trigger = page.getByRole("button", { name: "Abrir menu" });
  for (let n = 0; n < 2; n++) {
    await trigger.click(); await expect(page.getByRole("dialog", { name: "Menu", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Fechar", exact: true })).toBeFocused();
    await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
  }
  await trigger.click(); await page.getByRole("button", { name: "Fechar", exact: true }).click();
  await trigger.click(); await dispose(page); await expect(page.locator("#meuPainel")).toBeHidden();
  await trigger.click(); await expect(page.locator("#meuPainel")).toBeHidden();
});

test("popover close/Escape and tooltip text survive repeated mount lifecycle", async ({ page }) => {
  await mount(page, "popover"); const trigger = page.getByRole("button", { name: "Mais informações" });
  for (let n = 0; n < 2; n++) {
    await trigger.click(); await expect(page.getByRole("dialog", { name: "Título" })).toBeVisible();
    await page.getByRole("button", { name: "Fechar informações" }).click(); await expect(trigger).toBeFocused();
    await trigger.click(); await page.keyboard.press("Escape"); await expect(trigger).toHaveAttribute("aria-expanded", "false");
  }
  await mount(page, "tooltip");
  for (let n = 0; n < 2; n++) {
    await page.getByRole("button", { name: "Copiar", exact: true }).focus();
    await expect(page.getByRole("tooltip")).toHaveText("Copiar para a área de transferência");
    await page.keyboard.press("Escape"); await expect(page.getByRole("tooltip")).toBeHidden();
    await dispose(page); await page.addScriptTag({ content: scripts.tooltip });
    await page.getByRole("button", { name: "Copiar", exact: true }).blur();
  }
});

test("toast trigger, focus pause, close and handler teardown", async ({ page }) => {
  await mount(page, "toast"); const trigger = page.getByRole("button", { name: "Mostrar notificação de exemplo" });
  const toast = page.locator('[data-fs="toast"]');
  await trigger.click(); await expect(toast).toBeVisible();
  await page.getByRole("button", { name: "Fechar", exact: true }).focus(); await expect(toast).toHaveClass(/is-paused/);
  await page.getByRole("button", { name: "Fechar", exact: true }).click(); await expect(toast).toBeHidden();
  await dispose(page); await trigger.click(); await expect(toast).toBeHidden();
  await page.addScriptTag({ content: scripts.toast }); await trigger.click(); await expect(toast).toBeVisible();
});

test("navbar mobile keyboard and desktop breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await mount(page, "navbar");
  const trigger = page.getByRole("button", { name: "Menu", exact: true }); const panel = page.locator("#menuPrincipal");
  for (let n = 0; n < 2; n++) {
    await trigger.click(); await expect(panel).toBeVisible(); await panel.getByRole("link", { name: "Produtos" }).focus();
    await page.keyboard.press("Escape"); await expect(panel).toBeHidden(); await expect(trigger).toBeFocused();
  }
  await page.setViewportSize({ width: 1024, height: 768 }); await expect(panel).toBeVisible(); await expect(trigger).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 }); await expect(panel).toBeHidden();
  await dispose(page); await trigger.click(); await expect(panel).toBeHidden();
});

test("nested-menu keyboard levels and Escape restore focus", async ({ page }) => {
  await mount(page, "nested-menu"); const trigger = page.getByRole("button", { name: "Arquivo", exact: true });
  for (let n = 0; n < 2; n++) {
    await trigger.click(); await page.getByRole("menuitem", { name: "Exportar", exact: true }).focus();
    await page.keyboard.press("ArrowRight"); await expect(page.getByRole("menuitem", { name: "PDF", exact: true })).toBeFocused();
    await page.keyboard.press("ArrowLeft"); await expect(page.getByRole("menuitem", { name: "Exportar", exact: true })).toBeFocused();
    await page.keyboard.press("Escape"); await expect(trigger).toBeFocused(); await expect(trigger).toHaveAttribute("aria-expanded", "false");
  }
  await trigger.click(); await dispose(page); await trigger.click(); await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

for (const id of ids) {
  test(`${id}: automated accessibility check of the selected open state`, async ({ page }) => {
    await mount(page, id);
    if (id === "offcanvas") await page.getByRole("button", { name: "Abrir menu" }).click();
    if (id === "popover") await page.getByRole("button", { name: "Mais informações" }).click();
    if (id === "tooltip") await page.getByRole("button", { name: "Copiar", exact: true }).focus();
    if (id === "toast") await page.getByRole("button", { name: "Mostrar notificação de exemplo" }).click();
    if (id === "nested-menu") await page.getByRole("button", { name: "Arquivo", exact: true }).click();
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(result.violations).toEqual([]);
  });
}
