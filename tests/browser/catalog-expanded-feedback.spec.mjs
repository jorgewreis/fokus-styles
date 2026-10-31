import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";
const root = fileURLToPath(new URL("../../", import.meta.url));
const ids = ["alert-dialog", "carousel", "file-upload-advanced", "notification-center", "scrollspy"];
const scripts = Object.fromEntries(ids.map(id => [id, buildSync({ entryPoints: [`${root}docs/catalog/fixtures/${id}/basic.js`], bundle: true, write: false, format: "iife" }).outputFiles[0].text]));
async function mount(page, id) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Fixture ${id}</title><body>${readFileSync(`${root}docs/catalog/fixtures/${id}/basic.html`, "utf8")}</body></html>`);
  await page.addStyleTag({ path: `${root}dist/css/fokus.css` });
  await page.addScriptTag({ content: scripts[id] });
}
const dispose = page => page.evaluate(() => window.dispatchEvent(new Event("pagehide")));

test("confirm fixture cancels, restores focus, confirms and cancels on pagehide", async ({ page }) => {
  await mount(page, "alert-dialog");
  const trigger = page.getByRole("button", { name: "Excluir conta", exact: true });
  await trigger.click(); await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).toHaveCount(0); await expect(trigger).toBeFocused();
  await trigger.click(); await page.getByRole("button", { name: "Confirmar demonstração" }).click();
  await expect(page.getByRole("status")).toContainText("nenhum dado foi excluído");
  await trigger.click(); await dispose(page); await expect(page.getByRole("dialog")).toHaveCount(0);
  await trigger.click(); await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.addScriptTag({ content: scripts["alert-dialog"] }); await trigger.click(); await expect(page.getByRole("dialog")).toBeVisible();
});

test("carousel fixture decodes local images, keyboard switches and teardown stops controls", async ({ page }) => {
  await mount(page, "carousel");
  expect(await page.locator("img").evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  const carousel = page.locator('[data-fs="carousel"]');
  await carousel.focus(); await page.keyboard.press("End");
  await expect(page.locator(".fs-carousel-item").nth(1)).toHaveAttribute("aria-hidden", "false");
  await dispose(page); await page.getByRole("button", { name: "Próximo slide" }).click();
  await expect(page.locator(".fs-carousel-item").nth(1)).toHaveAttribute("aria-hidden", "false");
  await page.addScriptTag({ content: scripts.carousel }); await page.getByRole("button", { name: "Próximo slide" }).click();
  await expect(page.locator(".fs-carousel-item").nth(0)).toHaveAttribute("aria-hidden", "false");
});

test("advanced upload fixture chooses local file, exposes named progress and removes it", async ({ page }) => {
  await mount(page, "file-upload-advanced");
  await page.locator('input[type="file"]').setInputFiles({ name: "demo.txt", mimeType: "text/plain", buffer: Buffer.from("demo") });
  await expect(page.getByRole("progressbar", { name: "Progresso de demo.txt" })).toHaveAttribute("aria-valuenow", "0");
  await page.getByRole("button", { name: "Remover demo.txt" }).click(); await expect(page.locator(".fs-file-upload-item")).toHaveCount(0);
  await page.locator('input[type="file"]').setInputFiles({ name: "again.txt", mimeType: "text/plain", buffer: Buffer.from("demo") });
  await dispose(page); await expect(page.locator(".fs-file-upload-item")).toHaveCount(0);
});

test("notification fixture opens readable panel, Escape returns focus, teardown removes toast", async ({ page }) => {
  await mount(page, "notification-center");
  await page.getByRole("button", { name: "Adicionar notificação de exemplo" }).click();
  await expect(page.locator(".fs-notification-badge")).toHaveText("1");
  const trigger = page.getByRole("button", { name: "Notificações", exact: true });
  await trigger.click(); await expect(page.getByRole("dialog", { name: "Notificações" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Limpar tudo" })).toBeFocused();
  await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
  await trigger.click(); await page.getByRole("button", { name: "Limpar tudo" }).click();
  await expect(page.locator(".fs-notification-empty")).toBeVisible();
  await dispose(page); await expect(page.locator(".fs-toast")).toHaveCount(0);
});

test("scrollspy fixture scrolls between actual sections and announces current location", async ({ page }) => {
  await mount(page, "scrollspy");
  await page.locator("#detalhes").scrollIntoViewIfNeeded();
  await expect(page.locator('a[href="#detalhes"]')).toHaveAttribute("aria-current", "location");
  await page.locator("#introducao").scrollIntoViewIfNeeded();
  await expect(page.locator('a[href="#introducao"]')).toHaveAttribute("aria-current", "location");
  await dispose(page); await page.locator("#detalhes").scrollIntoViewIfNeeded();
  await expect(page.locator('a[href="#introducao"]')).toHaveAttribute("aria-current", "location");
});

import AxeBuilder from "@axe-core/playwright";
for (const id of ids) {
  test(`${id}: selected fixture state has no automated WCAG A/AA violations`, async ({ page }) => {
    await mount(page, id);
    if (id === "alert-dialog") await page.getByRole("button", { name: "Excluir conta", exact: true }).click();
    if (id === "file-upload-advanced") await page.locator('input[type="file"]').setInputFiles({ name: "audit.txt", mimeType: "text/plain", buffer: Buffer.from("demo") });
    if (id === "notification-center") {
      await page.getByRole("button", { name: "Adicionar notificação de exemplo" }).click();
      await page.getByRole("button", { name: "Notificações", exact: true }).click();
    }
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()).violations).toEqual([]);
    await dispose(page);
  });
}
