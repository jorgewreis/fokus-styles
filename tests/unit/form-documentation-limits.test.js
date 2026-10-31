import { afterEach, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { FileUploadAdvanced } from '../../packages/fokus-js/js/file-upload-advanced.js';
import { Select } from '../../packages/fokus-js/js/select.js';
import { Combobox } from '../../packages/fokus-js/js/combobox.js';
import { Datepicker } from '../../packages/fokus-js/js/datepicker.js';
const instances=[];
const doc=c=>readFileSync(`docs/components/${c}.md`,'utf8');
afterEach(()=>{for(const i of instances.splice(0))i.dispose();document.body.innerHTML='';vi.restoreAllMocks();});
it('documents upload accumulation and independent native FileList, not a validation/upload service',()=>{
 document.body.innerHTML='<div id="upload"><input type="file" class="fs-file-input" accept="image/png"></div>';
 const instance=new FileUploadAdvanced(document.querySelector('#upload'));instances.push(instance);
 const file=new File(['plain'],'not-image.txt',{type:'text/plain'});
 Object.defineProperty(instance.inputEl,'files',{value:[file]});
 instance.inputEl.dispatchEvent(new Event('change'));instance.inputEl.dispatchEvent(new Event('change'));
 expect(instance.getFiles()).toEqual([file,file]);
 const id=instance.listEl.children[0].dataset.fileId;instance.remove(id);
 expect(instance.getFiles()).toEqual([file]);expect(instance.inputEl.files).toEqual([file]);
 instance.dispose();expect(instance.getFiles()).toEqual([]);expect(instance.listEl.children).toHaveLength(1);
 expect(doc('file-upload-advanced')).toContain('**não implementada**');expect(doc('file-upload-advanced')).toContain('não reescreve');
});
it('upload escapes messages as text and requires finite progress supplied by application',()=>{
 document.body.innerHTML='<div id="upload"><input type="file" class="fs-file-input"></div>';
 const instance=new FileUploadAdvanced(document.querySelector('#upload'));instances.push(instance);
 Object.defineProperty(instance.inputEl,'files',{value:[new File(['x'],'<b>name.txt',{type:'text/plain'})]});instance.inputEl.dispatchEvent(new Event('change'));
 const id=instance.listEl.children[0].dataset.fileId;instance.setError(id,'<img src=x onerror=alert(1)>');
 expect(instance.listEl.querySelector('img,b')).toBeNull();expect(instance.listEl.querySelector('.fs-file-upload-size').textContent).toBe('<img src=x onerror=alert(1)>');
 instance.setProgress(id,150);expect(instance.listEl.querySelector('[role=progressbar]').getAttribute('aria-valuenow')).toBe('100');expect(instance.listEl.querySelector('.is-error')).toBeNull();
 instance.setProgress(id,NaN);expect(instance.listEl.querySelector('[role=progressbar]').getAttribute('aria-valuenow')).toBe('NaN');
 expect(doc('file-upload-advanced')).toContain('Number.isFinite(percent)');
});
it('select build snapshot ignores later disabled changes and optgroup inheritance, as documented limitations',()=>{
 document.body.innerHTML='<select data-size="xl"><optgroup label="Group" disabled><option>A</option></optgroup><option>B</option></select>';
 const native=document.querySelector('select');const instance=new Select(native);instances.push(instance);
 const toggle=native.nextElementSibling.querySelector('button');const items=[...document.querySelectorAll('.fs-dropdown-item')];
 expect(items[0].classList.contains('is-disabled')).toBe(false);expect(toggle.classList.contains('fs-form-select-xl')).toBe(false);
 native.disabled=true;native.value='B';native.dispatchEvent(new Event('change'));expect(toggle.disabled).toBe(false);expect(toggle.textContent).toBe('B');
 native.append(new Option('C','C'));native.dispatchEvent(new Event('change'));expect(document.querySelectorAll('.fs-dropdown-item')).toHaveLength(2);
 expect(doc('select')).toContain('disabled` do optgroup não é propagado');expect(doc('select')).toContain('não reconstrói opções');
});
it('combobox free-text editing keeps last confirmed value, not a current validated value',()=>{
 document.body.innerHTML='<input id="combo" data-fs-target="#choices"><ul id="choices"><li class="fs-dropdown-item" data-value="a">Alpha</li></ul>';
 vi.spyOn(Element.prototype,'scrollIntoView').mockImplementation(()=>{});
 const input=document.querySelector('input');const instance=new Combobox(input);instances.push(instance);document.querySelector('li').click();expect(instance.value).toBe('a');
 input.value='Other';input.dispatchEvent(new Event('input'));expect(instance.value).toBe('a');expect(input.value).toBe('Other');
 expect(doc('combobox')).toContain('editar o texto depois não limpa nem atualiza');
});
it('datepicker initializes ISO and invalid change clears state without HTML custom validity',()=>{
 document.body.innerHTML='<input value="31/01/2026" data-fs-target="#panel"><div id="panel"></div>';
 const input=document.querySelector('input');const instance=new Datepicker(input);instances.push(instance);expect(instance.value).toBe('2026-01-31');
 input.value='31/02/2026';input.dispatchEvent(new Event('change'));expect(instance.value).toBeNull();expect(instance.selectedDate).toBeNull();expect(input.value).toBe('31/02/2026');expect(input.validationMessage).toBe('');
 expect(doc('datepicker')).toContain('inclusive do valor inicial');expect(doc('datepicker')).toContain('não chama `setCustomValidity`');
});
