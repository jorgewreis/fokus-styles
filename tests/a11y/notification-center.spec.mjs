import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { buildSync } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const notificationCenterScript = buildSync({
  stdin: {
    contents: 'import { NotificationCenter } from "./packages/fokus-js/js/notification-center.js"; window.center = new NotificationCenter(document.querySelector("#trigger"));',
    resolveDir: rootDir,
  },
  bundle: true,
  write: false,
  format: "iife",
}).outputFiles[0].text;

async function mount(page) {
  await page.setContent(`<!doctype html><html lang="pt-BR"><head><title>Central de notificações</title></head><body>
    <main><h1>Minha conta</h1>
      <button id="trigger" type="button" data-fs="notification-center" data-fs-target="#panel" aria-label="Notificações">
        Notificações <span class="fs-notification-badge" hidden>0</span>
      </button>
      <section class="fs-notification-center" id="panel">
        <div class="fs-notification-center-header">
          <span class="fs-notification-center-title">Notificações</span>
          <button type="button" class="fs-btn fs-btn-sm" data-notification="clear">Limpar tudo</button>
        </div>
        <ul class="fs-notification-list"></ul>
        <p class="fs-notification-empty" hidden>Nenhuma notificação.</p>
      </section>
    </main><div class="fs-toast-container"></div>
  </body></html>`);
  await page.addStyleTag({ path: path.join(rootDir, "dist/css/fokus.css") });
  await page.addScriptTag({ content: notificationCenterScript });
  await page.evaluate(() => window.center.push({ title: "Atualização disponível", body: "Seu perfil foi atualizado.", autohide: false }));
}

test("NotificationCenter aberto mantém semântica e navegação por teclado", async ({ page }) => {
  await mount(page);
  await page.setViewportSize({ width: 320, height: 720 });

  const trigger = page.locator("#trigger");
  await expect(trigger).toHaveAccessibleName("Notificações: 1 notificação não lida");
  await trigger.focus();
  await trigger.press("Enter");

  const panel = page.getByRole("region", { name: "Notificações" });
  await expect(panel).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAccessibleName("Notificações");

  const axe = await new AxeBuilder({ page }).include("#panel").analyze();
  expect(axe.violations).toEqual([]);
  await page.screenshot({ path: path.join(rootDir, "test-results", "notification-center-open.png"), fullPage: true });

  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Fechar" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Limpar tudo" })).toBeFocused();
  await page.keyboard.press("Tab");
  const removeButton = page.getByRole("button", { name: "Remover notificação" });
  await expect(removeButton).toBeFocused();
  const box = await removeButton.boundingBox();
  expect(box).not.toBeNull();
  expect(box.width).toBeGreaterThanOrEqual(24);
  expect(box.height).toBeGreaterThanOrEqual(24);

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});
