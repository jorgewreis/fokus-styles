import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';
import {buildSync} from 'esbuild';
const cases=JSON.parse(readFileSync('docs/catalog/feedback-cases.json'));
for(const e of cases)for(const narrow of [false,true])test(`${e.component}/${e.id} ${narrow?'narrow-dark-rtl-reduce':'wide-light'}`,async({page})=>{
 await page.setViewportSize({width:narrow?390:1280,height:900});await page.emulateMedia({reducedMotion:narrow?'reduce':'no-preference'});
 await page.setContent(`<!doctype html><html lang="pt-BR" dir="${narrow?'rtl':'ltr'}" data-theme="${narrow?'dark':'light'}"><title>${e.title}</title><body><main><h1>${e.title}</h1>${readFileSync(e.html,'utf8')}</main></body></html>`);
 await page.addStyleTag({path:'dist/css/fokus.css'});let script;if(e.js){script=buildSync({entryPoints:[e.js],bundle:true,write:false,format:'iife'}).outputFiles[0].text;await page.addScriptTag({content:script});}
 if(e.component==='stepper'){
  if(e.id==='validation-error'){await page.getByRole('button',{name:'Avançar ou concluir'}).click();await expect(page.locator('#feedback-confirm')).toBeFocused();await page.locator('#feedback-confirm').check();await page.getByRole('button',{name:'Avançar ou concluir'}).click();}
  else {await page.locator('.fs-step').nth(2).focus();await page.keyboard.press('Enter');await expect(page.locator('#feedback-panel-2')).toBeVisible();}
 }
 if(e.component==='toast'){await page.locator('#feedback-show').click();await page.locator('.fs-toast button').first().focus();await expect(page.locator('.fs-toast').first()).toBeVisible();await expect(page.locator('.fs-toast').first()).toHaveClass(/is-paused/);}
 if(e.component==='notification-center'){await page.locator('#demo-notification').click();await page.locator('[data-fs="notification-center"]').click();await expect(page.locator('[data-notification="clear"]')).toBeFocused();await page.keyboard.press('Escape');await expect(page.locator('[data-fs="notification-center"]')).toBeFocused();}
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()).violations).toEqual([]);
 if(e.id==='loading-complete'){await page.locator('#feedback-toggle').click();await expect(page.locator('#feedback-loading')).toBeHidden();await expect(page.locator('#feedback-loaded')).toBeVisible();}
 if(e.component==='empty-state'){await page.locator('#feedback-toggle').click();await expect(page.locator('#feedback-empty')).toBeHidden();await expect(page.locator('#feedback-results')).toBeVisible();}
 if(narrow&&['skeleton','placeholder'].includes(e.component))expect(await page.locator(e.component==='skeleton'?'.fs-skeleton':'.fs-placeholder').first().evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 if(script){await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await page.addScriptTag({content:script});await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));}
});
