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

test("range keyboard and file selection preserve native behavior", async ({ page }) => {
  await mount(page, "range");
  const slider = page.getByRole("slider", { name: "Volume" });
  await slider.focus(); await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveValue("41");
  await mount(page, "file-upload");
  await page.getByLabel("Escolher arquivo").setInputFiles({ name: "example.txt", mimeType: "text/plain", buffer: Buffer.from("catalog fixture") });
  expect(await page.locator('input[type="file"]').evaluate(el => el.files[0].name)).toBe("example.txt");
});

test("responsive breakpoint and reduced-motion placeholder follow compiled CSS", async ({ page }) => {
  await mount(page, "responsive");
  await page.setViewportSize({ width: 639, height: 720 });
  await expect(page.locator(".fs-stack")).toHaveCSS("flex-direction", "column");
  await page.setViewportSize({ width: 640, height: 720 });
  await expect(page.locator(".fs-stack")).toHaveCSS("flex-direction", "row");
  await mount(page, "placeholder");
  await expect(page.locator(".fs-placeholder-glow")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".fs-placeholder-wave")).toHaveCSS("animation-name", "none");
  await expect(page.getByRole("status")).toHaveText("Carregando resumo…");
});

test("dropdown repeated keyboard open, Escape, focus and teardown", async ({ page }) => {
  await mount(page, "dropdown");
  const toggle = page.getByRole("button", { name: "Opções" });
  for (let i = 0; i < 2; i++) {
    await toggle.focus(); await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "Editar" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "Duplicar" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  }
  await toggle.click(); await dispose(page);
  await expect(page.locator("#meu-menu")).toBeHidden();
  await toggle.click(); await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await page.addScriptTag({ content: scripts.dropdown });
  await toggle.click(); await expect(page.getByRole("menu")).toBeVisible();
});

test("tag canceled dismiss, teardown and reinitialization", async ({ page }) => {
  await mount(page, "tag");
  const tag = page.locator('[data-fs="tag"]');
  await tag.evaluate(el => el.addEventListener("fs:tag:dismissed", event => event.preventDefault(), { once: true }));
  await page.getByRole("button", { name: "Remover tag Frontend" }).click();
  await expect(tag).toBeVisible();
  await dispose(page);
  await page.getByRole("button", { name: "Remover tag Frontend" }).click();
  await expect(tag).toBeVisible();
  await page.addScriptTag({ content: scripts.tag });
  await page.getByRole("button", { name: "Remover tag Frontend" }).click();
  await expect(tag).toHaveCount(0);
});

test("stepper cancel, forward/back, completion and teardown", async ({ page }) => {
  await mount(page, "stepper");
  const root = page.locator('[data-fs="stepper"]');
  const panels = page.locator(".fs-step-panel");
  const next = page.getByRole("button", { name: "Avançar" });
  const prev = page.getByRole("button", { name: "Voltar" });
  await expect(prev).toBeDisabled();
  await root.evaluate(el => el.addEventListener("fs:stepper:beforechange", event => event.preventDefault(), { once: true }));
  await next.click(); await expect(panels.nth(0)).toBeVisible();
  await next.click(); await expect(panels.nth(1)).toBeVisible();
  await prev.click(); await expect(panels.nth(0)).toBeVisible();
  await next.click(); await next.click(); await next.click();
  await expect(page.locator(".fs-step-completed")).toHaveCount(3);
  await prev.click(); await expect(panels.nth(1)).toBeVisible();
  await dispose(page); await next.click(); await expect(panels.nth(1)).toBeVisible();
  await page.addScriptTag({ content: scripts.stepper });
  await next.click(); await expect(panels.nth(2)).toBeVisible();
});
