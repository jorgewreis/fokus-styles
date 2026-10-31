import {readFileSync} from 'node:fs';
import {it,expect,afterEach,vi} from 'vitest';
import {FileDrop} from '../../packages/fokus-js/js/file-drop.js';
const read=p=>readFileSync(p,'utf8');
const mount=()=>document.body.innerHTML=read('docs/catalog/fixtures/file-upload/drop-contract.html');
const run=()=>new Function('FileDrop',read('docs/catalog/fixtures/file-upload/drop-contract.js').replace(/^import[^\n]+\n/,''))(FileDrop);
const dispose=()=>window.dispatchEvent(new Event('pagehide'));
afterEach(()=>{dispose();document.body.innerHTML='';vi.restoreAllMocks();});
it('documented file-drop selectors are labels bound to native file inputs',()=>{
 const blocks=[...read('docs/components/file-upload.md').matchAll(/```html\n([\s\S]*?)```/g)].map(m=>m[1]);
 let count=0;for(const html of blocks){document.body.innerHTML=html;for(const target of document.querySelectorAll('[data-fs="file-drop"]')){count++;expect(target.tagName).toBe('LABEL');expect(document.getElementById(target.htmlFor).type).toBe('file');const instance=new FileDrop(target);expect(FileDrop.getInstance(target)).toBe(instance);instance.dispose();}}
 expect(count).toBeGreaterThan(0);
});
it('FileDrop requires label for binding, not data-fs on input',()=>{mount();expect(()=>new FileDrop(document.querySelector('input'))).toThrow(/input associado/);});
it('real drop fixture handles drag depth, native change, disabled and repeated teardown',()=>{
 mount();const input=document.querySelector('input');const label=document.querySelector('[data-fs]');const lock=document.querySelector('button');let value=[];
 // JSDOM shim only for FileList assignment; browser suite uses actual DataTransfer.
 Object.defineProperty(input,'files',{get:()=>value,set:v=>value=v,configurable:true});
 const drop=files=>{const e=new Event('drop',{bubbles:true,cancelable:true});Object.defineProperty(e,'dataTransfer',{value:{files}});label.dispatchEvent(e);};
 for(let cycle=0;cycle<3;cycle++){
  run();label.dispatchEvent(new Event('dragenter'));label.dispatchEvent(new Event('dragenter'));label.dispatchEvent(new Event('dragleave'));expect(label.classList.contains('is-dragover')).toBe(true);
  const files=[new File(['plain'],'not-an-image.txt',{type:'text/plain'})];drop(files);expect(value).toBe(files);expect(document.querySelector('[role=status]').textContent).toContain('1 arquivo');expect(label.classList.contains('is-dragover')).toBe(false);
  lock.click();expect(input.disabled).toBe(true);drop([]);expect(value).toBe(files);drop([new File(['x'],'other.txt')]);expect(value).toBe(files);
  label.dispatchEvent(new Event('dragenter'));dispose();expect(FileDrop.getInstance(label)).toBeUndefined();expect(label.classList.contains('is-dragover')).toBe(false);expect(input.disabled).toBe(false);lock.click();expect(input.disabled).toBe(false);drop([]);expect(value).toBe(files);
 }
});
it('checkbox validity and radius documentation match compiled selectors and source tokens',()=>{
 const css=read('dist/css/fokus.css');const scss=read('packages/fokus-components/scss/forms/_check-radio-switch.scss');const doc=read('docs/components/checkbox.md');
 expect(css).toContain('.fs-check-input.is-valid + .fs-check-label::before');expect(css).toContain('.fs-check-input[aria-invalid=false] + .fs-check-label::before');expect(scss).toContain('--fs-check-radius: var(--fs-radius-sm)');expect(doc).toContain('`.is-valid`');expect(doc).not.toContain('não há estado visual separado');expect(doc).toContain('| `--fs-check-border-width` | `2px` |');expect(scss).toContain('--fs-check-border-width: 2px');expect(doc).toContain('não define borda tracejada');
});
it('rating selector fills selected and lower values in descending DOM',()=>{
 document.body.innerHTML=read('docs/catalog/fixtures/rating/sizes-disabled.html');const group=document.querySelector('.fs-rating');const labels=[...group.querySelectorAll('input:checked ~ .fs-rating-star')];expect(labels.map(label=>document.getElementById(label.htmlFor).value)).toEqual(['3','2','1']);expect(read('docs/components/rating.md')).toContain('menor valor');
});
it('documented input xs/xl selectors exist for both native control and native select',()=>{
 const css=read('dist/css/fokus.css');const doc=read('docs/components/input.md');for(const size of ['xs','sm','lg','xl']){expect(css).toContain(`.fs-form-control-${size}`);expect(css).toContain(`.fs-form-select-${size}`);expect(doc).toContain(`.fs-form-control-${size}`);}
});
