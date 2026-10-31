import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { buildSync } from 'esbuild';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
for(const [c,id] of [['collapse','initial-open'],['tag','loading-recovery'],['tag','truncated-group'],['carousel','manual-fade'],['carousel','single-static']])test(`${c}/${id}: runtime, layout and automated accessibility`,async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setContent(`<!doctype html><html lang="pt-BR"><title>${c}</title><body><main>${readFileSync(`${root}docs/catalog/fixtures/${c}/${id}.html`,'utf8')}</main></body></html>`);await page.addStyleTag({path:root+'dist/css/fokus.css'});
 if(id==='truncated-group')await page.addStyleTag({path:root+`docs/catalog/fixtures/${c}/${id}.css`});
 await page.addScriptTag({content:buildSync({entryPoints:[root+`docs/catalog/fixtures/${c}/${id}.js`],bundle:true,write:false,format:'iife'}).outputFiles[0].text});
 if(c==='collapse'){await page.locator('button').click();await expect(page.locator('#open-details')).toBeHidden();await page.locator('button').click();await expect(page.locator('#open-details')).toBeVisible();}
 if(id==='loading-recovery'){await expect(page.getByRole('button',{name:'Remover tag Revisão pendente'})).toBeDisabled();await page.getByRole('button',{name:'Concluir simulação'}).click();await expect(page.getByRole('button',{name:'Remover tag Revisão pendente'})).toBeEnabled();}
 if(id==='manual-fade'){await page.locator('[data-fs=carousel]').press('End');await expect(page.locator('[data-fs-carousel-counter]')).toHaveText('3 de 3');}
 for(const width of [375,1280]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()).violations).toEqual([]);
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
});
