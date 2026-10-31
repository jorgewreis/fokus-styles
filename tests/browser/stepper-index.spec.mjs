import { test, expect } from '@playwright/test';
import { buildSync } from 'esbuild';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const script = buildSync({ stdin: {
  contents: 'import { Stepper } from "./packages/fokus-js/js/stepper.js"; window.stepper = new Stepper(document.querySelector(".fs-stepper"));', resolveDir: root,
}, bundle: true, write: false, format: 'iife' }).outputFiles[0].text;
test('invalid programmatic indices preserve the active step and panel', async ({ page }) => {
  await page.setContent('<!doctype html><html lang="pt-BR"><title>Stepper index</title><body><main><div class="fs-stepper"><div role="list"><div class="fs-step fs-step-active">Um</div><div class="fs-step">Dois</div></div><section class="fs-step-panel is-active">Conteúdo um</section><section class="fs-step-panel">Conteúdo dois</section></div></main></body></html>');
  await page.addStyleTag({ path: root + 'dist/css/fokus.css' });
  await page.addScriptTag({ content: script });
  expect(await page.evaluate(() => [NaN, Infinity, -Infinity, 0.5, '1', undefined].map(value => window.stepper.goTo(value)))).toEqual([false, false, false, false, false, false]);
  await expect(page.locator('.fs-step-active')).toHaveText('Um');
  await expect(page.locator('.fs-step-panel.is-active')).toHaveText('Conteúdo um');
  expect(await page.evaluate(() => window.stepper.goTo(100))).toBe(true);
  await expect(page.locator('.fs-step-active')).toHaveText('Dois');
});
