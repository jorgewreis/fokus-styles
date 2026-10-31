import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const cases=['checkbox','radio','switch','input','input-group','file-upload'].flatMap(c=>['native-states',['checkbox','radio','switch'].includes(c)?'native-tokens':'native-sizes'].map(id=>[c,id]));
async function mount(page,c,id){await page.setContent(`<!doctype html><html lang="pt-BR"><title>Controles nativos</title><body><main>${readFileSync(`${root}docs/catalog/fixtures/${c}/${id}.html`,'utf8')}</main></body></html>`);await page.addStyleTag({path:root+'dist/css/fokus.css'});if(id==='native-tokens')await page.addStyleTag({path:`${root}docs/catalog/fixtures/${c}/${id}.css`});}
for(const [c,id] of cases)test(`${c}/${id}: named native controls, themes and narrow layout`,async({page})=>{
 await mount(page,c,id);
 for(const theme of ['light','dark'])for(const width of [375,1280]){
  await page.setViewportSize({width,height:900});await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()).violations).toEqual([]);
});
for(const c of ['checkbox','switch'])test(`${c}: Space toggles and disabled remains unchanged`,async({page})=>{
 await mount(page,c,'native-states');const inputs=page.locator('input');await inputs.nth(0).focus();await inputs.nth(0).press('Space');await expect(inputs.nth(0)).toBeChecked();await expect(inputs.nth(2)).toBeDisabled();await expect(inputs.nth(2)).not.toBeChecked();
});
test('radio keyboard moves exclusive selection',async({page})=>{await mount(page,'radio','native-states');const inputs=page.locator('input');await inputs.nth(1).focus();await inputs.nth(1).press('ArrowLeft');await expect(inputs.nth(0)).toBeChecked();await expect(inputs.nth(1)).not.toBeChecked();});
test('files remain local and multiple selection is supported',async({page})=>{await mount(page,'file-upload','native-sizes');await page.locator('#native-file-large').setInputFiles([{name:'one.txt',mimeType:'text/plain',buffer:Buffer.from('one')},{name:'two.txt',mimeType:'text/plain',buffer:Buffer.from('two')}]);expect(await page.locator('#native-file-large').evaluate(el=>el.files.length)).toBe(2);});
