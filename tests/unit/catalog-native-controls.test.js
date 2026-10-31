import { readFileSync } from 'node:fs';
import { it,expect,afterEach } from 'vitest';
const read=(c,id)=>readFileSync(`docs/catalog/fixtures/${c}/${id}.html`,'utf8');
const mount=(c,id)=>document.body.innerHTML=read(c,id);
afterEach(()=>document.body.innerHTML='');
for(const [component,cls] of [['checkbox','check'],['radio','radio'],['switch','switch']]) {
 it(`${component}: actual native markup toggles, preserves disabled and label association`,()=>{
  mount(component,'native-states');
  const inputs=[...document.querySelectorAll('input')];
  for(const input of inputs)expect(input.nextElementSibling.htmlFor).toBe(input.id);
  expect(inputs[1].checked).toBe(true);inputs[0].click();expect(inputs[0].checked).toBe(true);
  if(component==='radio')expect(inputs[1].checked).toBe(false);
  inputs[2].click();expect(inputs[2].checked).toBe(false);expect(inputs[2].disabled).toBe(true);
 });
 it(`${component}: local gap token has a real SCSS consumer`,()=>{
  const css=readFileSync(`docs/catalog/fixtures/${component}/native-tokens.css`,'utf8');
  const scss=readFileSync('packages/fokus-components/scss/forms/_check-radio-switch.scss','utf8');
  expect(css).toContain(`.native-token.fs-${cls}`);expect(css).toContain(`--fs-${cls}-gap: 1rem`);expect(scss).toContain(`var(--fs-${cls}-gap)`);
 });
}
it('readonly is submitted while disabled is omitted, validation is explicit',()=>{
 mount('input','native-states');const form=document.createElement('form');form.innerHTML=document.body.innerHTML;
 const data=new FormData(form);expect(data.get('record')).toBe('CAT-137');expect(data.has('disabled')).toBe(false);
 expect(form.querySelector('[type=email]').validity.valueMissing).toBe(true);
 expect(form.querySelector('[type=email]').getAttribute('aria-invalid')).toBe('true');
});
it('native select has no custom JS marker and preserves unavailable option',()=>{
 mount('input','native-sizes');const select=document.querySelector('select');expect(select.hasAttribute('data-fs')).toBe(false);expect(select.options[2].disabled).toBe(true);
});
it('file selection only declares native filters, no upload or fake validation',()=>{
 mount('file-upload','native-states');expect(document.querySelector('#native-images').accept).toBe('image/png,image/jpeg');expect(document.querySelector('#native-images').multiple).toBe(true);expect(document.querySelector('#native-file-disabled').disabled).toBe(true);expect(document.querySelector('[data-fs]')).toBeNull();
});
it('all twelve examples are registered without scripts and preserve complete base',()=>{
 const registry=JSON.parse(readFileSync('docs/catalog/examples.json','utf8'));
 const ids=['checkbox','radio','switch','input','input-group','file-upload'];
 const entries=ids.flatMap(c=>registry[c].filter(e=>e.id.startsWith('native-')));
 expect(entries).toHaveLength(12);for(const e of entries)expect(e.js).toBeUndefined();
 expect(Object.values(registry).flat().length).toBeGreaterThanOrEqual(137);
});
