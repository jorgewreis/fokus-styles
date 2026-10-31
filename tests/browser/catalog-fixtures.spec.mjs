import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";
const root = fileURLToPath(new URL("../../", import.meta.url));
const examples = JSON.parse(readFileSync(path.join(root, "docs/catalog/examples.json"), "utf8"));
const scripts = Object.fromEntries(Object.entries(examples).filter(([, [e]]) => e.js).map(([id, [e]]) => [id,
  buildSync({ entryPoints: [path.join(root, e.js)], bundle: true, write: false, format: "iife" }).outputFiles[0].text,
]));
async function mount(page, id) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Exemplo ${id}</title><body>${readFileSync(path.join(root, examples[id][0].html), "utf8")}</body></html>`);
  await page.addStyleTag({ path: path.join(root, "dist/css/fokus.css") });
  if (scripts[id]) await page.addScriptTag({ content: scripts[id] });
}
async function dispose(page) {
  await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
}
for (const id of Object.keys(examples)) {
  test(`${id}: selected fixture loads without browser errors`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await mount(page, id);
    await expect(page.locator("body")).not.toBeEmpty();
    await dispose(page);
    expect(errors).toEqual([]);
  });
}
test("checkbox, switch and radio retain native label behavior", async ({ page }) => {
  for (const id of ["checkbox", "switch"]) {
    await mount(page, id);
    const control = page.locator("input");
    const initial = await control.isChecked();
    await page.locator("label").click();
    expect(await control.isChecked()).toBe(!initial);
    await control.focus();
    await page.keyboard.press("Space");
    expect(await control.isChecked()).toBe(initial);
  }
  await mount(page, "radio");
  await page.locator('label[for="semana"]').click();
  await expect(page.locator("#semana")).toBeChecked();
  await expect(page.locator("#dia")).not.toBeChecked();
});
test("collapse toggles, disposes listeners and reinitializes", async ({ page }) => {
  await mount(page, "collapse");
  const trigger = page.locator('[data-fs="collapse"]');
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await trigger.click();
  await expect(page.locator("#detalhes")).toBeHidden();
  await dispose(page);
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await page.addScriptTag({ content: scripts.collapse });
  await trigger.click();
  await expect(page.locator("#detalhes")).toBeVisible();
});
test("accordion exclusivity and teardown", async ({ page }) => {
  await mount(page, "accordion");
  const buttons = page.locator(".fs-accordion-button");
  await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "true");
  await buttons.nth(1).click();
  await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "false");
  await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "true");
  await dispose(page);
  await buttons.nth(0).click();
  await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "false");
  await page.addScriptTag({ content: scripts.accordion });
  await buttons.nth(0).click();
  await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "true");
});
test("tabs keyboard selection and teardown", async ({ page }) => {
  await mount(page, "tabs");
  const tabs = page.getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#seguranca")).toBeVisible();
  await dispose(page);
  await page.locator(".fs-nav-link").first().click();
  await expect(page.locator("#seguranca")).toHaveClass(/is-active/);
  await page.addScriptTag({ content: scripts.tabs });
  await page.getByRole("tab").first().click();
  await expect(page.locator("#perfil")).toBeVisible();
});
test("modal repeated open, Escape, focus return and teardown", async ({ page }) => {
  await mount(page, "modal");
  const trigger = page.locator('[data-fs="modal"]');
  for (let i = 0; i < 2; i++) {
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#meuModal")).toBeHidden();
    await expect(trigger).toBeFocused();
  }
  await trigger.click();
  await dispose(page);
  await expect(page.locator("#meuModal")).toBeHidden();
  await trigger.click();
  await expect(page.locator("#meuModal")).toBeHidden();
  await page.addScriptTag({ content: scripts.modal });
  await trigger.click();
  await page.getByRole("button", { name: "Cancelar" }).click();
  await expect(page.locator("#meuModal")).toBeHidden();
});
