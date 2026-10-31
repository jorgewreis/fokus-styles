import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { expect, it, afterEach, vi } from 'vitest';
const ids = ['combobox','datepicker','select','file-upload-advanced','range'];
const scripts = Object.fromEntries(ids.map(id => [id, execFileSync(process.execPath, ['--input-type=module', '-e', 'import { buildSync } from "esbuild";process.stdout.write(buildSync({entryPoints:[process.argv[1]],bundle:true,write:false,format:"iife"}).outputFiles[0].text)', `docs/catalog/fixtures/${id}/states.js`], {encoding:'utf8'})]));
function mount(id) {
 document.body.innerHTML=readFileSync(`docs/catalog/fixtures/${id}/states.html`,'utf8');
 vi.spyOn(window,'matchMedia').mockReturnValue({matches:true});
 Element.prototype.scrollIntoView=vi.fn();
 window.eval(scripts[id]);
}
function key(el,key) { el.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true})); }
afterEach(()=>{window.dispatchEvent(new Event('pagehide')); document.body.innerHTML='';vi.restoreAllMocks();});
it('authored Combobox skips disabled and reports empty/selection',()=>{
 mount('combobox'); const input=document.querySelector('#city');
 input.value='zzz';input.dispatchEvent(new Event('input'));expect(document.querySelector('[data-fs-empty]').hidden).toBe(false);
 input.value='';input.dispatchEvent(new Event('input'));key(input,'Home');key(input,'ArrowDown');key(input,'Enter');
 expect(input.value).toBe('São Paulo');expect(document.querySelector('#city-result').textContent).toContain('(sp)');
 window.dispatchEvent(new Event('pagehide'));key(input,'ArrowDown');expect(input.getAttribute('aria-expanded')).toBe('false');
});
it('authored Datepicker month clamp and ISO event',()=>{
 mount('datepicker'); const input=document.querySelector('#month-end');key(input,'ArrowDown');key(document.activeElement,'PageDown');key(document.activeElement,'Enter');
 expect(input.value).toBe('28/02/2026');expect(document.querySelector('#date-result').textContent).toContain('2026-02-28');
});
it('authored Select sizes disabled and native reset',async()=>{
 mount('select');expect(document.querySelector('#plan').nextElementSibling.querySelector('button').className).toContain('fs-form-select-sm');
 expect(document.querySelector('#locked').nextElementSibling.querySelector('button').disabled).toBe(true);
 const options=document.querySelectorAll('[role="option"]');expect(options[2].getAttribute('aria-disabled')).toBe('true');options[1].click();expect(document.querySelector('#plan').value).toBe('pro');
 document.querySelector('form').reset();await new Promise(r=>setTimeout(r,10));expect(document.querySelector('#plan').value).toBe('basic');
 expect(document.querySelector('#plan').nextElementSibling.querySelector('button').textContent).toBe('Básico');
});
it('authored upload applies progress/error, recovers and removes',()=>{
 mount('file-upload-advanced');const input=document.querySelector('#local-files');
 Object.defineProperty(input,'files',{value:[new File(['local'],'example.txt',{type:'text/plain'})]});input.dispatchEvent(new Event('change'));
 document.querySelector('#half').click();expect(document.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe('50');
 document.querySelector('#fail').click();expect(document.querySelector('.fs-file-upload-item').classList.contains('is-error')).toBe(true);
 document.querySelector('#done').click();expect(document.querySelector('.fs-file-upload-item').classList.contains('is-error')).toBe(false);
 expect(document.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe('100');document.querySelector('[data-file-upload-remove]').click();expect(document.querySelector('#upload-state').textContent).toContain('0 arquivo');
});
it('authored Range synchronizes output percentage and cleans listener',()=>{
 mount('range');const input=document.querySelector('#negative');input.value='-5';input.dispatchEvent(new Event('input'));expect(document.querySelector('#negative-output').textContent).toBe('-5');expect(input.style.getPropertyValue('--fs-range-percent')).toBe('25%');
 window.dispatchEvent(new Event('pagehide'));input.value='5';input.dispatchEvent(new Event('input'));expect(document.querySelector('#negative-output').textContent).toBe('-5');
});
