import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { writeOrCheck } from './catalog.mjs';
import { createPreviewServer } from './catalog-preview-server.mjs';
const catalog=writeOrCheck(true), server=createPreviewServer({catalog});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try {
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:'+server.address().port;
 for(const c of ['tile','list-group','code','divider','ratio','responsive'])for(const id of ['variants','tokens']){
  await page.goto(`${base}/previews/${c}/${id}`);
  await page.waitForFunction(()=>document.documentElement.dataset.previewReady==='true');
  for(const theme of ['light','dark'])for(const width of [375,639,640,1280]){
   await page.setViewportSize({width,height:900});await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${c}/${id} overflow ${theme}/${width}`);
   if(c==='responsive'&&id==='variants')assert.equal(await page.locator('.fs-stack-md-row').evaluate(e=>getComputedStyle(e).flexDirection),width<640?'column':'row');
   if(c==='ratio')for(const frame of await page.locator('.fs-ratio').all()){
    const size=await frame.boundingBox();const ratio=await frame.evaluate(e=>parseFloat(getComputedStyle(e).getPropertyValue('--fs-ratio')));
    assert(Math.abs(size.height/size.width*100-ratio)<.1);
    assert(await frame.locator('img').evaluate(e=>e.complete&&e.naturalWidth>0));
   }
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS 12 fixtures × light/dark × 375/639/640/1280; overflow, ratio geometry/media, responsive breakpoint.');
}finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
