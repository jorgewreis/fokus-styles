import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { writeOrCheck } from './catalog.mjs';
import { createPreviewServer } from './catalog-preview-server.mjs';
const catalog=writeOrCheck(true);
assert(catalog.coverage.examples>0,'At least one reviewed executable fixture is required');
const server=createPreviewServer({catalog}); await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try {
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=`http://127.0.0.1:${server.address().port}`;let count=0;
 for(const c of catalog.contracts) {
  await page.goto(`${base}/components/${c.id}`);
  assert.equal(await page.locator('iframe').count(),c.examples.length);
  for(const [i,e] of c.examples.entries()) {
   const element=page.locator('iframe').nth(i);assert.equal(await element.getAttribute('sandbox'),'allow-scripts');
   const frame=await (await element.elementHandle()).contentFrame();await frame.waitForFunction(()=>document.documentElement.dataset.previewReady==='true');
   assert(await frame.evaluate(()=>{try{void parent.document;return false;}catch{return true;}}),'Parent must remain inaccessible');
   assert(await frame.evaluate(()=>[...document.styleSheets].some(s=>s.href?.endsWith('/dist/css/fokus.css'))));
   if(c.id==='modal') {
    const trigger=frame.locator('[data-fs="modal"]');const dialog=frame.locator('.fs-modal');
    for(let n=0;n<2;n++) {await trigger.click();await dialog.waitFor({state:'visible'});assert(await dialog.evaluate(el=>el.contains(document.activeElement)));await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});assert(await trigger.evaluate(el=>el===document.activeElement));}
   }
   if(c.id==='collapse') {const trigger=frame.locator('[data-fs="collapse"]');await trigger.click();await frame.waitForFunction(()=>document.querySelector('[data-fs="collapse"]').getAttribute('aria-expanded')==='true');}
   if(c.id==='tabs') {const tabs=frame.getByRole('tab');await tabs.nth(1).click();assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');}
   count++;
  }
 }
 assert.deepEqual(errors,[]);console.log(`PASS: ${count} HTTP previews, opaque sandbox, runtime ready, Modal focus/Escape repeated, Collapse and Tabs.`);
} finally {await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
