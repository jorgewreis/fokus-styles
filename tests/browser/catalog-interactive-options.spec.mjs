import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { buildSync } from 'esbuild';
const examples=JSON.parse(readFileSync('docs/catalog/examples.json'));
const cases=Object.entries(examples).filter(([c])=>['accordion','modal','dropdown','tabs','tooltip'].includes(c)).flatMap(([c,es])=>es.filter(e=>e.id!=='basic').map(e=>({c,...e})));
for(const e of cases){
 const script=buildSync({entryPoints:[e.js],bundle:true,write:false,format:'iife'}).outputFiles[0].text;
 test(`${e.c}/${e.id}: state, keyboard, lifecycle and axe`,async({page},testInfo)=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>${e.title}</title><body><main>${readFileSync(e.html,'utf8')}</main></body></html>`);
  await page.addStyleTag({path:'dist/css/fokus.css'});await page.addScriptTag({content:script});
  const trigger=page.locator(`[data-fs="${e.c}"]`);
  if(e.c==='accordion'){
   const buttons=trigger.locator('button');await buttons.nth(1).click();await expect(buttons.nth(0)).toHaveAttribute('aria-expanded','true');await expect(buttons.nth(1)).toHaveAttribute('aria-expanded','true');
   await buttons.nth(0).click();await expect(buttons.nth(0)).toHaveAttribute('aria-expanded',e.id==='multiple'?'false':'true');
  }else if(e.c==='modal'){
   for(let n=0;n<2;n++){
    await trigger.click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
    if(e.id==='static-backdrop')await expect(page.getByRole('dialog')).toBeVisible();else{await expect(page.locator('.fs-modal')).toBeHidden();await trigger.click();}
    await page.getByRole('button',{name:'Cancelar',exact:true}).click();await expect(trigger).toBeFocused();
   }
   await trigger.click();
  }else if(e.c==='dropdown'){
   await trigger.focus();await page.keyboard.press('ArrowDown');await expect(page.getByRole('menuitem',{name:'Abrir',exact:true})).toBeFocused();
   await page.keyboard.press('ArrowDown');await expect(page.getByRole('menuitem',{name:'Voltar',exact:true})).toBeFocused();await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await trigger.click();
  }else if(e.c==='tabs'){
   const tabs=page.getByRole('tab');await tabs.nth(0).focus();await page.keyboard.press('ArrowDown');await expect(tabs.nth(2)).toBeFocused();await expect(tabs.nth(2)).toHaveAttribute('aria-selected',e.id==='vertical-manual'?'false':'true');
   await page.keyboard.press('Enter');await expect(tabs.nth(2)).toHaveAttribute('aria-selected','true');await expect(page.locator('#privacy')).toBeVisible();
  }else{
   await trigger.focus();await expect(page.getByRole('tooltip')).toBeVisible();await expect(page.getByRole('tooltip')).toHaveText('Ajuda complementar');await page.keyboard.press('Escape');await expect(page.getByRole('tooltip')).toBeHidden();await trigger.blur();await trigger.focus();
  }
  await page.screenshot({path:testInfo.outputPath(`${e.c}-${e.id}-state.png`),fullPage:true});
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()).violations).toEqual([]);
  await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await page.addScriptTag({content:script});await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));expect(errors).toEqual([]);
 });
}
