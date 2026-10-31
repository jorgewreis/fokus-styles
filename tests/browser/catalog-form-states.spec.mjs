import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { buildSync } from 'esbuild';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const ids = ['combobox', 'datepicker', 'select', 'file-upload-advanced', 'range'];
const scripts = Object.fromEntries(ids.map(id => [id, buildSync({entryPoints: [`${root}docs/catalog/fixtures/${id}/states.js`], bundle:true, write:false, format:'iife'}).outputFiles[0].text]));
async function mount(page, id) {
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setContent(`<!doctype html><html lang="pt-BR"><title>${id}</title><body><main>${readFileSync(`${root}docs/catalog/fixtures/${id}/states.html`,'utf8')}</main></body></html>`);
 await page.addStyleTag({path:`${root}dist/css/fokus.css`});
 await page.addScriptTag({content:scripts[id]});
}
const dispose = page => page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
test('Combobox empty, disabled, keyboard selection and teardown', async ({page}) => {
 await mount(page,'combobox'); const input=page.getByRole('combobox',{name:'Cidade'});
 await input.fill('zzz'); await expect(page.locator('[data-fs-empty]')).toBeVisible();
 await input.press('Enter'); await expect(page.locator('#city-result')).toContainText('Nenhuma seleção');
 await input.fill(''); await input.press('Home'); await input.press('ArrowDown'); await input.press('Enter');
 await expect(input).toHaveValue('São Paulo'); await expect(page.locator('#city-result')).toContainText('(sp)');
 await dispose(page); await input.press('ArrowDown'); await expect(input).toHaveAttribute('aria-expanded','false');
 await page.addScriptTag({content:scripts.combobox}); await input.press('ArrowDown'); await expect(input).toHaveAttribute('aria-expanded','true');
});
test('Datepicker clamps January 31 to February 28, ISO event and teardown', async ({page}) => {
 await mount(page,'datepicker'); const input=page.getByRole('combobox',{name:'Data de referência'});
 await input.press('ArrowDown'); await page.keyboard.press('PageDown'); await page.keyboard.press('Enter');
 await expect(input).toHaveValue('28/02/2026'); await expect(page.locator('#date-result')).toHaveText('Data ISO: 2026-02-28');
 await expect(input).toBeFocused(); await expect(input).toHaveAttribute('aria-expanded','false');
 await dispose(page); await input.press('ArrowDown'); await expect(input).toHaveAttribute('aria-expanded','false');
 await page.addScriptTag({content:scripts.datepicker}); await input.press('ArrowDown'); await expect(page.getByRole('grid',{name:'Data de referência'})).toBeVisible();
});
test('Select sizes, unavailable option and form reset survive reinitialization', async ({page}) => {
 await mount(page,'select'); const toggle=page.getByRole('button',{name:'Plano Básico',exact:true});
 await expect(toggle).toHaveClass(/fs-form-select-sm/);
 await expect(page.getByRole('button',{name:'Plano indisponível Sem vagas'})).toBeDisabled();
 await toggle.click(); await expect(page.getByRole('option',{name:'Futuro (indisponível)'})).toHaveAttribute('aria-disabled','true');
 await page.getByRole('option',{name:'Profissional',exact:true}).click(); await expect(page.locator('#plan')).toHaveValue('pro');
 await page.getByRole('button',{name:'Restaurar plano'}).click(); await expect(toggle).toBeVisible(); await expect(page.locator('#plan')).toHaveValue('basic');
 await dispose(page); await expect(page.locator('#plan')).toBeVisible(); await page.addScriptTag({content:scripts.select}); await expect(toggle).toBeVisible(); await expect(page.locator('.fs-form-select-dropdown')).toHaveCount(2);
});
test('Upload progress error recovery removal and teardown are local', async ({page}) => {
 await mount(page,'file-upload-advanced');
 await page.locator('#local-files').setInputFiles([{name:'example.txt',mimeType:'text/plain',buffer:Buffer.from('local')}]);
 const progress=page.getByRole('progressbar',{name:'Progresso de example.txt'});
 await expect(progress).toHaveAttribute('aria-valuenow','0');
 await page.getByRole('button',{name:'Simular 50%'}).click(); await expect(progress).toHaveAttribute('aria-valuenow','50');
 await page.getByRole('button',{name:'Simular falha'}).click(); await expect(page.locator('.fs-file-upload-item')).toHaveClass(/is-error/);
 await page.getByRole('button',{name:'Simular conclusão'}).click(); await expect(progress).toHaveAttribute('aria-valuenow','100'); await expect(page.locator('.fs-file-upload-item')).not.toHaveClass(/is-error/);
 await page.getByRole('button',{name:'Remover example.txt'}).click(); await expect(page.locator('#upload-state')).toHaveText('0 arquivo(s) restante(s).');
 await dispose(page); await page.addScriptTag({content:scripts['file-upload-advanced']});
 await page.locator('#local-files').setInputFiles([{name:'again.txt',mimeType:'text/plain',buffer:Buffer.from('again')}]); await expect(page.locator('.fs-file-upload-item')).toHaveCount(1);
 await dispose(page); await expect(page.locator('.fs-file-upload-item')).toHaveCount(0);
});
test('Range steps bounds output and disabled native state', async ({page}) => {
 await mount(page,'range'); const input=page.getByRole('slider',{name:'Intensidade em passos de 25'});
 await input.press('ArrowRight'); await expect(input).toHaveValue('75'); await expect(page.locator('#stepped-output')).toHaveText('75');
 await expect(input).toHaveCSS('--fs-range-percent','75%');
 await input.press('Home'); await expect(page.locator('#stepped-output')).toHaveText('0');
 await input.press('End'); await expect(page.locator('#stepped-output')).toHaveText('100');
 await expect(page.locator('#fixed')).toBeDisabled();
 await page.locator('#negative').press('ArrowLeft'); await expect(page.locator('#negative-output')).toHaveText('-5'); await expect(page.locator('#negative')).toHaveCSS('--fs-range-percent','25%');
 await dispose(page); await input.press('Home'); await expect(input).toHaveValue('0'); await expect(page.locator('#stepped-output')).toHaveText('100');
 await page.addScriptTag({content:scripts.range}); await expect(page.locator('#stepped-output')).toHaveText('0');
});
for (const id of ids) test(`${id}: states axe (targeted automated scan only)`, async ({page}) => {
 await mount(page,id);
 if(id==='combobox') await page.locator('#city').press('ArrowDown');
 if(id==='datepicker') await page.locator('#month-end').press('ArrowDown');
 if(id==='select') await page.getByRole('button',{name:'Plano Básico',exact:true}).click();
 if(id==='file-upload-advanced') { await page.locator('#local-files').setInputFiles([{name:'accessible.txt',mimeType:'text/plain',buffer:Buffer.from('test')}]); await page.locator('#fail').click(); }
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()).violations).toEqual([]);
});
