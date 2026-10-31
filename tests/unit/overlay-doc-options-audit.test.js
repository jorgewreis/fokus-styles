import { it,expect,afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { Offcanvas } from '../../packages/fokus-js/js/offcanvas.js';
import { Modal } from '../../packages/fokus-js/js/modal.js';
import { Popover } from '../../packages/fokus-js/js/popover.js';
import { Tooltip } from '../../packages/fokus-js/js/tooltip.js';
const created=[];
const raf=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
afterEach(()=>{created.splice(0).reverse().forEach(x=>x.dispose());document.body.innerHTML='';document.body.style.overflow='';});
it('offcanvas without visual backdrop still traps focus, isolates outside content and locks scroll',async()=>{
 document.body.innerHTML='<button id="outside">Fora</button><button id="trigger" data-fs-target="#panel">Abrir</button><div id="panel" class="fs-offcanvas" data-backdrop="false"><h3 class="fs-offcanvas-title">Painel</h3><button id="inside" data-fs-dismiss="offcanvas">Fechar</button></div>';
 const trigger=document.getElementById('trigger');const panel=document.getElementById('panel');const instance=new Offcanvas(trigger);created.push(instance);instance.show();await raf();
 expect(document.querySelector('.fs-offcanvas-backdrop')).toBeNull();expect(panel.getAttribute('aria-modal')).toBe('true');expect(document.body.style.overflow).toBe('hidden');expect(document.activeElement.id).toBe('inside');expect(document.getElementById('outside').hasAttribute('inert')).toBe(true);
 document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));expect(document.activeElement.id).toBe('inside');
 instance.hide();expect(document.body.style.overflow).toBe('');expect(document.activeElement).toBe(trigger);expect(document.getElementById('outside').hasAttribute('inert')).toBe(false);
});
it('offcanvas boolean false does not suppress backdrop unlike string data attribute',()=>{
 document.body.innerHTML='<button id="trigger" data-fs-target="#panel">Abrir</button><div id="panel" class="fs-offcanvas" data-backdrop="false"><button>Fechar</button></div>';
 const instance=new Offcanvas(document.getElementById('trigger'),{backdrop:false});created.push(instance);instance.show();expect(instance.hasBackdrop).toBe(true);expect(document.querySelector('.fs-offcanvas-backdrop')).not.toBeNull();
});
it('modal false does not disable Escape or turn modal into non-modal',()=>{
 document.body.innerHTML='<button id="trigger" data-fs-target="#modal">Abrir</button><div id="modal" class="fs-modal"><div class="fs-modal-dialog"><button>Fechar</button></div></div>';
 const instance=new Modal(document.getElementById('trigger'),{backdrop:false});created.push(instance);instance.show();expect(instance.modalEl.getAttribute('aria-modal')).toBe('true');expect(document.body.style.overflow).toBe('hidden');document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));expect(instance.isOpen).toBe(false);
});
it('popover dispose restores original parent and position instead of removing app-owned panel',()=>{
 document.body.innerHTML='<section id="original"><button id="trigger" data-fs-target="#details">Abrir</button><div id="details" class="fs-popover"><h3 class="fs-popover-header">Detalhes</h3></div><span id="after">Depois</span></section>';
 const panel=document.getElementById('details');const parent=panel.parentNode;const next=panel.nextSibling;const instance=new Popover(document.getElementById('trigger'));created.push(instance);instance.show();expect(panel.parentNode).toBe(document.body);instance.dispose();expect(panel.isConnected).toBe(true);expect(panel.parentNode).toBe(parent);expect(panel.nextSibling).toBe(next);
});
it('manual popover has no automatic Escape listener; hover does not open on focus',()=>{
 for(const mode of ['manual','hover']){
  document.body.innerHTML=`<button id="trigger" data-fs-target="#details" data-trigger="${mode}">Abrir</button><div id="details" class="fs-popover"><h3 class="fs-popover-header">Detalhes</h3></div>`;
  const trigger=document.getElementById('trigger');const instance=new Popover(trigger);created.push(instance);trigger.focus();expect(instance.isOpen).toBe(false);
  if(mode==='manual'){instance.show();document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));expect(instance.isOpen).toBe(true);}
  instance.dispose();
 }
});
it('tooltip preserves data-title, treats content as text and does not restore title on dispose',()=>{
 document.body.innerHTML='<button id="trigger" title="&lt;b&gt;Texto&lt;/b&gt;" data-title="Alternativo">Ajuda</button>';
 const trigger=document.getElementById('trigger');const instance=new Tooltip(trigger,{title:'Opção'});created.push(instance);instance.show();expect(document.querySelector('.fs-tooltip-inner').textContent).toBe('<b>Texto</b>');expect(document.querySelector('.fs-tooltip-inner b')).toBeNull();instance.dispose();expect(trigger.hasAttribute('title')).toBe(false);expect(trigger.getAttribute('data-title')).toBe('Alternativo');
 trigger.setAttribute('title','');expect(()=>new Tooltip(trigger,{title:'Opção'})).toThrow();
});
it('documentation records ownership and modal limitations',()=>{
 const read=c=>readFileSync(`docs/components/${c}.md`,'utf8');expect(read('offcanvas')).toContain('o painel permanece modal');expect(read('popover')).toContain('devolve o painel ao pai');expect(read('tooltip')).toContain('textContent');expect(read('alert-dialog')).toContain('não há token `--fs-alert-dialog-message`');
});
