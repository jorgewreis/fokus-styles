import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
import {buildSync} from 'esbuild';
const css=readFileSync('dist/css/fokus.css','utf8');
const p=JSON.parse(readFileSync('docs/catalog/navigation-provenance.json'));
test('Navigation provenance: source hashes intact and exactly 11 additions',()=>{
 assert.equal(p.examples.length,11);assert.equal(new Set(p.examples.map(e=>e.component)).size,8);
 for(const s of p.sources)assert.equal(createHash('sha256').update(readFileSync(s.path)).digest('hex'),s.sha256,s.path);
});
for(const e of p.examples)test(`${e.component}/${e.id}: valid local DOM, runtime and teardown`,async()=>{
 const dom=new JSDOM(readFileSync(e.html,'utf8'),{url:'http://localhost/',runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window,d=w.document;
 w.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});w.HTMLElement.prototype.scrollIntoView=()=>{};
 w.IntersectionObserver=class{observe(){}disconnect(){}};
 for(const el of d.querySelectorAll('[class]'))for(const cls of el.classList)if(cls.startsWith('fs-'))assert(css.includes('.'+cls),`Uncompiled class ${cls}`);
 const ids=[...d.querySelectorAll('[id]')].map(x=>x.id);assert.equal(ids.length,new Set(ids).size);
 for(const a of d.querySelectorAll('a[href^="#"]'))assert(d.getElementById(a.getAttribute('href').slice(1)),a.outerHTML);
 assert.equal(d.querySelectorAll('[aria-disabled="true"][href]').length,0);
 if(e.js){
  const script=buildSync({entryPoints:[e.js],bundle:true,write:false,format:'iife'}).outputFiles[0].text;w.eval(script);await new Promise(r=>setTimeout(r,30));
  if(e.component==='navbar'){const b=d.querySelector('button');b.click();assert.equal(b.getAttribute('aria-expanded'),'true');d.querySelector('.fs-navbar-collapse').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(b.getAttribute('aria-expanded'),'false');}
  if(e.component==='breadcrumb'){assert(d.querySelector('.fs-breadcrumb-more'));assert.equal(d.querySelectorAll('.fs-dropdown-item').length,2);}
  if(e.component==='tree-view'){const item=d.querySelector('[data-value="index"]');item.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));assert.equal(d.querySelector('#tree-status').textContent,'Selecionado: index');assert.equal(item.getAttribute('aria-selected'),'true');}
  if(e.component==='command-palette'){d.querySelector('button').click();const input=d.querySelector('input');input.value='zzzz';input.dispatchEvent(new w.Event('input'));assert.equal(d.querySelector('[data-fs-empty]').hidden,false);input.value='Config';input.dispatchEvent(new w.Event('input'));input.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));assert.equal(d.querySelector('#command-status').textContent,'Selecionado: settings');}
  if(e.component==='nested-menu'){d.querySelector('button').click();assert(d.querySelector('#nested-root').classList.contains('is-open'));}
  if(e.component==='scrollspy')assert(d.querySelector('[aria-current="location"]'));
  w.dispatchEvent(new w.Event('pagehide'));if(e.component==='breadcrumb')assert.equal(d.querySelector('.fs-breadcrumb-more'),null);
  w.eval(script);w.dispatchEvent(new w.Event('pagehide'));
 }
 w.close();
});
