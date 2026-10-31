import { readFileSync } from 'node:fs';
import { afterEach, expect, it, vi } from 'vitest';
import { Accordion } from '../../packages/fokus-js/js/accordion.js';
import { Modal } from '../../packages/fokus-js/js/modal.js';
import { Dropdown } from '../../packages/fokus-js/js/dropdown.js';
import { Tabs } from '../../packages/fokus-js/js/tabs.js';
import { Tooltip } from '../../packages/fokus-js/js/tooltip.js';
const constructors = { accordion: Accordion, modal: Modal, dropdown: Dropdown, tabs: Tabs, tooltip: Tooltip };
const examples = JSON.parse(readFileSync('docs/catalog/examples.json'));
const instances = [];
function mount(component, id) {
 const entry=examples[component].find(e=>e.id===id);
 document.body.innerHTML=readFileSync(entry.html,'utf8');
 // Reproduce a ready document: module imports may already have auto-initialized.
 const initialEl=document.querySelector(`[data-fs="${component}"]`);
 const automatic=new constructors[component](initialEl);instances.push(automatic);
 const source=readFileSync(entry.js,'utf8');
 new Function(constructors[component].name,source.replace(/^import[^\n]+\n/,''))(constructors[component]);
 const el=document.querySelector(`[data-fs="${component}"]`);
 const instance=constructors[component].getInstance(el);instances.push(instance);
 return {el,instance};
}
function key(el,key){el.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));}
afterEach(()=>{window.dispatchEvent(new Event('pagehide'));for(const i of instances.splice(0))i?.dispose();document.body.innerHTML='';vi.useRealTimers();vi.restoreAllMocks();});
for(const [c,entries] of Object.entries(examples).filter(([c])=>constructors[c]))for(const e of entries.filter(e=>e.id!=='basic')){
 it(`${c}/${e.id}: actual initializer, pagehide and reinitialization`,()=>{
  const {el,instance}=mount(c,e.id);expect(instance).toBeDefined();
  window.dispatchEvent(new Event('pagehide'));expect(constructors[c].getInstance(el)).toBeUndefined();
  // Re-execute exactly the same initializer, retaining its options.
  new Function(constructors[c].name,readFileSync(e.js,'utf8').replace(/^import[^\n]+\n/,''))(constructors[c]);
  expect(constructors[c].getInstance(el)).toBeDefined();
 });
}
for(const id of ['multiple','always-open'])it(`accordion/${id}: concurrent open and repeated close`,async()=>{
 vi.spyOn(window,'matchMedia').mockReturnValue({matches:true});
 const {el}=mount('accordion',id);const buttons=el.querySelectorAll('button');
 buttons[1].click();await Promise.resolve();expect([...buttons].map(b=>b.getAttribute('aria-expanded'))).toEqual(['true','true']);
 buttons[0].click();await Promise.resolve();expect(buttons[0].getAttribute('aria-expanded')).toBe(id==='multiple'?'false':'true');
 buttons[0].click();await Promise.resolve();expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
});
for(const id of ['static-backdrop','false-option'])it(`modal/${id}: Escape, outside click, dismiss, repeat`,()=>{
 const {el,instance}=mount('modal',id);
 for(let n=0;n<2;n++){
 el.click();expect(instance.isOpen).toBe(true);key(instance.dialogEl,'Escape');
 expect(instance.isOpen).toBe(id==='static-backdrop');
 if(!instance.isOpen)el.click();
 instance.modalEl.dispatchEvent(new MouseEvent('click',{bubbles:true}));
 expect(instance.isOpen).toBe(id==='static-backdrop');
 if(!instance.isOpen)el.click();
 instance.modalEl.querySelector('[data-fs-dismiss]').click();expect(instance.isOpen).toBe(false);expect(document.activeElement).toBe(el);
 }
});
for(const id of ['top-end-disabled','options-precedence'])it(`dropdown/${id}: options, keyboard skips disabled, Escape restores`,()=>{
 const {el,instance}=mount('dropdown',id);expect(instance.placement).toBe(id==='options-precedence'?'right':'top');expect(instance.align).toBe(id==='options-precedence'?'center':'end');
 for(let n=0;n<2;n++){
 key(el,'ArrowDown');expect(instance.isOpen).toBe(true);expect(document.activeElement.textContent).toBe('Abrir');
 key(document.activeElement,'ArrowDown');expect(document.activeElement.textContent).toBe('Voltar');
 key(document.activeElement,'Home');expect(document.activeElement.textContent).toBe('Abrir');
 key(document.activeElement,'Escape');expect(instance.isOpen).toBe(false);expect(document.activeElement).toBe(el);
 }
});
for(const id of ['vertical-manual','vertical-automatic'])it(`tabs/${id}: vertical arrows, Home/End, disabled and activation`,()=>{
 const {el}=mount('tabs',id);const tabs=el.querySelectorAll('button');tabs[0].focus();key(tabs[0],'ArrowDown');expect(document.activeElement).toBe(tabs[2]);expect(tabs[2].getAttribute('aria-selected')).toBe(id==='vertical-manual'?'false':'true');
 tabs[2].click();expect(document.querySelector('#privacy').hidden).toBe(false);tabs[1].click();expect(tabs[2].getAttribute('aria-selected')).toBe('true');
 key(tabs[2],'Home');expect(document.activeElement).toBe(tabs[0]);key(tabs[0],'End');expect(document.activeElement).toBe(tabs[2]);
});
it('tooltip: delayed pointer, interruption, immediate focus, ARIA restoration',()=>{
 vi.useFakeTimers();const {el,instance}=mount('tooltip','delays-description');
 el.dispatchEvent(new Event('pointerenter'));vi.advanceTimersByTime(299);expect(instance.isOpen).toBe(false);
 el.dispatchEvent(new Event('pointerleave'));vi.advanceTimersByTime(500);expect(instance.isOpen).toBe(false);
 el.dispatchEvent(new Event('pointerenter'));vi.advanceTimersByTime(300);expect(instance.isOpen).toBe(true);
 el.dispatchEvent(new Event('pointerleave'));vi.advanceTimersByTime(99);expect(instance.isOpen).toBe(true);vi.advanceTimersByTime(1);expect(instance.isOpen).toBe(false);
 el.focus();expect(instance.isOpen).toBe(true);expect(el.getAttribute('aria-describedby')).toContain('tip-description');key(el,'Escape');expect(instance.isOpen).toBe(false);
 instance.dispose();expect(el.getAttribute('aria-describedby')).toBe('tip-description');expect(document.querySelector('[role=tooltip]')).toBeNull();
});
it('tooltip: JS option precedence and existing data-title priority',()=>{
 const {instance}=mount('tooltip','options-precedence');expect([instance.placement,instance.align,instance.offset,instance.showDelay,instance.hideDelay,instance.title]).toEqual(['left','end',16,150,50,'Ajuda complementar']);
});
it('tooltip: invalid numeric attributes fall back without negative timers',()=>{
 const {instance}=mount('tooltip','fallback-values');expect([instance.offset,instance.showDelay,instance.hideDelay]).toEqual([8,0,0]);
});
