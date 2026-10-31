import {readFileSync} from 'node:fs';
import {it,expect,afterEach,vi} from 'vitest';
import {CommandPalette} from '../../packages/fokus-js/js/command-palette.js';
import {NotificationCenter} from '../../packages/fokus-js/js/notification-center.js';
import {Toast} from '../../packages/fokus-js/js/toast.js';
const read=p=>readFileSync(p,'utf8');
const instances=[];
afterEach(()=>{for(const i of instances.splice(0))i.dispose();for(const el of document.querySelectorAll('.fs-toast'))Toast.getInstance(el)?.dispose();document.body.innerHTML='';localStorage.clear();vi.restoreAllMocks();});
function palette(options){document.body.innerHTML=read('docs/catalog/fixtures/command-palette/basic.html');const trigger=document.querySelector('[data-fs=command-palette]');const instance=new CommandPalette(trigger,options);instances.push(instance);return {trigger,instance};}
it('mod matches Ctrl or Meta even from editable fields; exact modifiers are required',()=>{
 const {instance}=palette();const input=document.createElement('input');document.body.append(input);
 const key=(options)=>input.dispatchEvent(new KeyboardEvent('keydown',{key:'k',bubbles:true,cancelable:true,...options}));
 key({ctrlKey:true,shiftKey:true});expect(instance.isOpen).toBe(false);key({ctrlKey:true});expect(instance.isOpen).toBe(true);instance.hide();key({metaKey:true});expect(instance.isOpen).toBe(true);
});
it('empty explicit shortcut disables attribute shortcut; selection only emits data',()=>{
 const {trigger,instance}=palette({shortcut:''});document.dispatchEvent(new KeyboardEvent('keydown',{key:'k',ctrlKey:true,bubbles:true}));expect(instance.isOpen).toBe(false);
 const selected=vi.fn();trigger.addEventListener('fs:command-palette:selected',selected);instance.show();instance.inputEl.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));expect(selected).toHaveBeenCalledOnce();expect(selected.mock.calls[0][0].detail.value).toBe('new-file');expect(instance.isOpen).toBe(false);
});
it('disabled commands participate in text filtering but cannot suppress empty selectable state',()=>{
 const {instance}=palette();const item=document.createElement('li');item.className='fs-dropdown-item is-disabled';item.textContent='Somente bloqueado';instance.listEl.append(item);instance.show();instance.inputEl.value='bloqueado';instance.inputEl.dispatchEvent(new Event('input'));expect(item.hidden).toBe(false);expect(instance.listEl.querySelector('[data-fs-empty]').hidden).toBe(false);expect(instance.activeIndex).toBe(-1);instance.inputEl.value='ausente';instance.inputEl.dispatchEvent(new Event('input'));expect(item.hidden).toBe(true);
});
it('CommandPalette backdrop is fixed and does not consume Modal backdrop token',()=>{
 const scss=read('packages/fokus-components/scss/components/_command-palette.scss');expect(scss).toContain('background-color: rgb(0 0 0 / 50%)');expect(scss).not.toContain('var(--fs-modal-backdrop');expect(read('docs/components/command-palette.md')).toContain('não herda token de backdrop');
});
it('notification text is escaped; history clear and center dispose do not dispose its toast',()=>{
 vi.spyOn(window,'matchMedia').mockReturnValue({matches:true});document.body.innerHTML=read('docs/catalog/fixtures/notification-center/basic.html');const center=new NotificationCenter(document.querySelector('[data-fs=notification-center]'));instances.push(center);
 center.push({title:'<img src=x onerror=alert(1)>',body:'<b>literal</b>',autohide:false});const toast=document.querySelector('.fs-toast');expect(toast.textContent).toContain('<img src=x onerror=alert(1)>');expect(toast.querySelector('img,b')).toBeNull();expect(document.querySelector('.fs-notification-list').textContent).toContain('<b>literal</b>');center.clear();expect(center.getAll()).toHaveLength(0);expect(toast.isConnected).toBe(true);center.dispose();expect(Toast.getInstance(toast)).toBeDefined();
});
