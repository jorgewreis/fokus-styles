import { readFileSync } from 'node:fs';
import { it,expect,afterEach,vi } from 'vitest';
import { Offcanvas } from '../../packages/fokus-js/js/offcanvas.js';
import { Popover } from '../../packages/fokus-js/js/popover.js';
import { confirm } from '../../packages/fokus-js/js/confirm.js';
const read=(c,id,ext)=>readFileSync(`docs/catalog/fixtures/${c}/${id}.${ext}`,'utf8');
function mount(c,id,bindings){document.body.innerHTML=read(c,id,'html');new Function(...Object.keys(bindings),read(c,id,'js').replace(/^import[^\n]+\n/,''))(...Object.values(bindings));}
afterEach(()=>{window.dispatchEvent(new Event('pagehide'));document.body.innerHTML='';vi.restoreAllMocks();});
it('offcanvas static end ignores Escape and dismisses explicitly across repeated reinit',()=>{
 for(let n=0;n<2;n++){
  mount('offcanvas','static-end',{Offcanvas});const trigger=document.querySelector('[data-fs=offcanvas]');const instance=Offcanvas.getInstance(trigger);
  trigger.click();expect(instance.isOpen).toBe(true);expect(instance.staticBackdrop).toBe(true);expect(document.querySelector('.fs-offcanvas-backdrop')).not.toBeNull();
  document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));expect(instance.isOpen).toBe(true);
  document.querySelector('[data-fs-dismiss=offcanvas]').click();expect(instance.isOpen).toBe(false);
  window.dispatchEvent(new Event('pagehide'));expect(Offcanvas.getInstance(trigger)).toBeUndefined();
 }
});
it('offcanvas string false removes visual backdrop but keeps modal semantics and closes',()=>{
 mount('offcanvas','no-backdrop-bottom',{Offcanvas});const trigger=document.querySelector('[data-fs=offcanvas]');const instance=Offcanvas.getInstance(trigger);trigger.click();
 expect(instance.hasBackdrop).toBe(false);expect(document.querySelector('.fs-offcanvas-backdrop')).toBeNull();expect(instance.offcanvasEl.getAttribute('aria-modal')).toBe('true');
 document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));expect(instance.isOpen).toBe(false);
});
it('focus popover enters from focus, dismisses and restores trigger without immediate reopen',()=>{
 mount('popover','focus-bottom-start',{Popover});const trigger=document.querySelector('[data-fs=popover]');const instance=Popover.getInstance(trigger);trigger.focus();expect(instance.isOpen).toBe(true);
 const dismiss=document.querySelector('[data-fs-dismiss=popover]');dismiss.focus();expect(instance.isOpen).toBe(true);dismiss.click();expect(instance.isOpen).toBe(false);expect(document.activeElement).toBe(trigger);
 window.dispatchEvent(new Event('pagehide'));expect(Popover.getInstance(trigger)).toBeUndefined();
});
it('warning confirm escapes copy, prevents duplicate opening, resolves both outcomes and tears down pending dialog',async()=>{
 mount('alert-dialog','warning-copy',{confirm});const trigger=document.getElementById('preview-confirm');trigger.focus();trigger.click();trigger.click();
 expect(document.querySelectorAll('.fs-alert-dialog')).toHaveLength(1);expect(document.querySelector('.fs-alert-dialog-message').textContent).toBe('Texto literal: <rascunho> & alterações locais.');expect(document.querySelector('rascunho')).toBeNull();expect(document.querySelector('[data-action=confirm]').classList.contains('fs-btn-warning')).toBe(true);
 document.querySelector('[data-action=cancel]').click();await Promise.resolve();expect(document.getElementById('preview-result').textContent).toContain('Edição mantida');expect(document.querySelector('.fs-alert-dialog')).toBeNull();
 trigger.click();document.querySelector('[data-action=confirm]').click();await Promise.resolve();expect(document.getElementById('preview-result').textContent).toContain('Saída simulada');
 trigger.click();window.dispatchEvent(new Event('pagehide'));await Promise.resolve();expect(document.querySelector('.fs-alert-dialog')).toBeNull();trigger.click();expect(document.querySelector('.fs-alert-dialog')).toBeNull();
});
