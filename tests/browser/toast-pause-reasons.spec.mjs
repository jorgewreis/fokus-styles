import { test, expect } from '@playwright/test';
import { buildSync } from 'esbuild';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const script = buildSync({ stdin: {
  contents: 'import { Toast } from "./packages/fokus-js/js/toast.js"; window.toast = new Toast(document.querySelector(".fs-toast")); window.toast.show();',
  resolveDir: root,
}, bundle: true, write: false, format: 'iife' }).outputFiles[0].text;

test('focus and hover overlap without expiring focused actions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setContent('<!doctype html><html lang="pt-BR"><title>Toast pause</title><body><main><button id="outside">Fora</button><div class="fs-toast" data-delay="1500" data-toast-progress="true"><button id="first">Primeira ação</button><button id="second">Segunda ação</button><div class="fs-toast-progress"></div></div></main></body></html>');
  await page.addStyleTag({ path: root + 'dist/css/fokus.css' });
  await page.addScriptTag({ content: script });
  await page.locator('#first').hover();
  await page.locator('#first').focus();
  await page.locator('#outside').hover();
  await page.waitForTimeout(1600);
  await expect(page.locator('.fs-toast')).toHaveClass(/is-paused/);
  expect(await page.evaluate(() => window.toast.isOpen)).toBe(true);
  await page.locator('#second').focus();
  await expect(page.locator('.fs-toast')).toHaveClass(/is-paused/);
  await page.locator('#first').hover();
  await page.locator('#outside').focus();
  await page.waitForTimeout(1600);
  expect(await page.evaluate(() => window.toast.isOpen)).toBe(true);
  await page.locator('#outside').hover();
  await expect.poll(() => page.evaluate(() => window.toast.isOpen)).toBe(false);
});
