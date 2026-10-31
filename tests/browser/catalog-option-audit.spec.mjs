import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {buildSync} from 'esbuild';
const root=fileURLToPath(new URL('../../',import.meta.url));
const script=buildSync({entryPoints:[root+'docs/catalog/fixtures/file-upload/drop-contract.js'],bundle:true,write:false,format:'iife'}).outputFiles[0].text;
async function mount(page){await page.setContent(`<!doctype html><html lang="pt-BR"><title>Contrato FileDrop</title><body><main>${readFileSync(root+'docs/catalog/fixtures/file-upload/drop-contract.html','utf8')}</main></body></html>`);await page.addStyleTag({path:root+'dist/css/fokus.css'});await page.addScriptTag({content:script});}
async function drop(page,name){await page.evaluate(name=>{const data=new DataTransfer();data.items.add(new File(['local'],name,{type:'text/plain'}));document.querySelector('[data-fs=file-drop]').dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:data}));},name);}
test('actual FileList transfer does not filter accept and disabled blocks new drop',async({page})=>{await mount(page);await drop(page,'not-an-image.txt');expect(await page.locator('input[type=file]').evaluate(el=>el.files[0].name)).toBe('not-an-image.txt');await expect(page.getByRole('status')).toHaveText('1 arquivo(s) selecionado(s) localmente.');await page.getByRole('button',{name:'Bloquear seleção'}).click();await drop(page,'blocked.txt');expect(await page.locator('input[type=file]').evaluate(el=>el.files[0].name)).toBe('not-an-image.txt');await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await drop(page,'disposed.txt');expect(await page.locator('input[type=file]').evaluate(el=>el.files[0].name)).toBe('not-an-image.txt');});
test('file selection composition automated accessibility',async({page})=>{await mount(page);expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()).violations).toEqual([]);});
