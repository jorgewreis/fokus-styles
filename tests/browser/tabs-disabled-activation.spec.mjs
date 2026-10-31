import { test, expect } from '@playwright/test';
import { buildSync } from 'esbuild';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const script = buildSync({ stdin: { contents: 'import { Tabs } from "./packages/fokus-js/js/tabs.js"; window.tabs = new Tabs(document.getElementById("tabs"));', resolveDir: root }, bundle: true, write: false, format: 'iife' }).outputFiles[0].text;
test('disabled tabs block native activation; enabled links retain their default', async ({ page }) => {
  await page.setContent('<!doctype html><html lang="pt-BR"><title>Tabs disabled</title><body><main><div id="tabs"><button class="fs-nav-link is-active" data-fs-target="#one">Um</button><a href="#blocked" aria-disabled="true" class="fs-nav-link" data-fs-target="#two">Indisponível</a><a href="#allowed" class="fs-nav-link" data-fs-target="#three">Permitido</a></div><section id="one">Um</section><section id="two">Dois</section><section id="three">Três</section><div id="allowed">Destino</div></main></body></html>');
  await page.addStyleTag({ path: root + 'dist/css/fokus.css' });
  await page.addScriptTag({ content: script });
  await page.getByRole('tab', { name: 'Indisponível' }).focus();
  await page.getByRole('tab', { name: 'Indisponível' }).press('Enter');
  expect(await page.evaluate(() => location.hash)).toBe('');
  await expect(page.getByRole('tab', { name: 'Um' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: 'Um' }).focus();
  await page.getByRole('tab', { name: 'Um' }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Permitido' })).toBeFocused();
  await page.getByRole('tab', { name: 'Permitido' }).press('Enter');
  expect(await page.evaluate(() => location.hash)).toBe('#allowed');
});
