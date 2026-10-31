import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { buildSync } from 'esbuild';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
for(const [c,id] of [['offcanvas','static-end'],['offcanvas','no-backdrop-bottom'],['popover','focus-bottom-start'],['alert-dialog','warning-copy']])test(`${c}/${id} opens, scans and closes`,async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setContent(`<!doctype html><html lang="pt-BR"><title>Overlays</title><body><main>${readFileSync(`${root}docs/catalog/fixtures/${c}/${id}.html`,'utf8')}</main></body></html>`);
 await page.addStyleTag({path:root+'dist/css/fokus.css'});
 await page.addScriptTag({content:buildSync({entryPoints:[`${root}docs/catalog/fixtures/${c}/${id}.js`],bundle:true,write:false,format:'iife'}).outputFiles[0].text});
 const trigger=page.locator('main > button');
 if(c==='popover')await trigger.focus();else await trigger.click();
 await expect(page.getByRole('dialog')).toBeVisible();
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()).violations).toEqual([]);
 if(id==='static-end'){await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toBeVisible();}
 if(c==='alert-dialog')await page.getByRole('button',{name:'Continuar editando'}).click();else await page.locator(`[data-fs-dismiss="${c}"]`).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
});
