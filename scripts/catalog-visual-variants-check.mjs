import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { writeOrCheck } from './catalog.mjs';
import { createPreviewServer } from './catalog-preview-server.mjs';
const catalog=writeOrCheck(true);
const server=createPreviewServer({catalog});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try {
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:'+server.address().port;
 let count=0;
 for(const component of ['button','alert','badge','card','table','datatable']) for(const variant of ['variants','states','tokens']) {
  await page.goto(base+'/previews/'+component+'/'+variant);
  await page.waitForFunction(()=>document.documentElement.dataset.previewReady==='true');
  for(const theme of ['light','dark']) for(const width of [375,1280]) {
   await page.setViewportSize({width,height:900});
   await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   assert(await page.locator('body').isVisible());
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,component+'/'+variant+' overflows');
  }
  if(component==='button' && variant==='tokens'){
   const b=page.locator('button');
   assert.equal(await b.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(22, 78, 99)');
   await b.hover();assert.equal(await b.evaluate(el=>getComputedStyle(el).getPropertyValue('--fs-btn-bg').trim()),'#155e75');
  }
  if(component==='alert' && variant==='states'){
   for(let n=0;n<2;n++){await page.getByRole('button',{name:'Fechar aviso'}).click();assert(await page.locator('#notice').isHidden());await page.getByRole('button',{name:'Restaurar aviso'}).click();assert(await page.locator('#notice').isVisible());}
  }
  if(component==='datatable'){
   if(variant==='states') for(let n=0;n<2;n++){
    await page.locator('#load').click();assert.equal(await page.locator('table').getAttribute('aria-busy'),'true');assert(await page.locator('[data-fs-datatable-loading]').isVisible());
    await page.locator('#error').click();assert(await page.locator('[data-fs-datatable-error]').isVisible());
    await page.locator('#recover').click();assert(await page.locator('table').isVisible());
   }
   await page.getByRole('button',{name:'Valor'}).click();
   assert.equal(await page.locator('tbody tr:not([hidden])').first().innerText(),'Davi\tR$ 5,00');
   await page.locator('input').fill('inexistente');assert(await page.locator('[data-fs-datatable-empty]').isVisible());
   await page.locator('input').fill('');assert(await page.locator('[data-fs-datatable-empty]').isHidden());
  }
  count++;
 }
 assert.deepEqual(errors,[]);
 console.log('PASS '+count+' fixtures; light/dark × 375/1280; tokens; repeated dismiss/recover; numeric sort/filter/empty.');
} finally {await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
