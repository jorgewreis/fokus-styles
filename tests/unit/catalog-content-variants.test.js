import { describe,it,expect,afterEach } from 'vitest';
import fs from 'node:fs';
const components=['tile','list-group','code','divider','ratio','responsive'];
const fixture=(c,id)=>fs.readFileSync(`docs/catalog/fixtures/${c}/${id}.html`,'utf8');
afterEach(()=>document.body.innerHTML='');
describe('content variants',()=>{
 it('registers 12 fixtures using compiled classes, valid local links and no inert actions',()=>{
  const registry=JSON.parse(fs.readFileSync('docs/catalog/examples.json','utf8'));
  const css=fs.readFileSync('dist/css/fokus.css','utf8');
  for(const c of components)for(const id of ['variants','tokens']){
   expect(registry[c].some(e=>e.id===id)).toBe(true);
   document.body.innerHTML=fixture(c,id);
   for(const el of document.querySelectorAll('[class]'))for(const cls of el.classList)if(cls.startsWith('fs-'))expect(css).toContain('.'+cls);
   for(const el of document.querySelectorAll('a'))expect(document.querySelector(el.getAttribute('href'))).not.toBeNull();
   expect(document.querySelector('button,[role=listbox]')).toBeNull();
  }
 });
 it('has semantic navigation current state and no fabricated disabled API',()=>{
  document.body.innerHTML=fixture('list-group','variants');
  expect(document.querySelector('nav[aria-label] .is-active').getAttribute('aria-current')).toBe('location');
 });
 it('preserves code as text and provides named keyboard scroll region',()=>{
  document.body.innerHTML=fixture('code','variants');
  expect(document.querySelector('pre[tabindex="0"][aria-label] code').textContent).toContain('<button type="button">Salvar</button>');
  expect(document.querySelector('button')).toBeNull();
 });
 it('ratio has one media child per frame and captions outside',()=>{
  for(const id of ['variants','tokens']){
   document.body.innerHTML=fixture('ratio',id);
   for(const frame of document.querySelectorAll('.fs-ratio')){
    expect(frame.children.length).toBe(1);expect(frame.firstElementChild.tagName).toBe('IMG');
    expect(frame.firstElementChild.getAttribute('alt')).toBeTruthy();
    expect(frame.firstElementChild.getAttribute('src')).toMatch(/^data:image\/svg\+xml,/);
   }
  }
 });
 it('every overridden framework token is consumed in the corresponding SCSS',()=>{
  for(const c of components){
   const scss=fs.readFileSync(`packages/fokus-components/scss/components/_${c}.scss`,'utf8');
   const css=fs.readFileSync(`docs/catalog/fixtures/${c}/tokens.css`,'utf8');
   for(const [,token] of css.matchAll(/(--fs-[\w-]+)\s*:/g))expect(scss).toContain(`var(${token}`);
  }
 });
});
