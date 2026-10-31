import {it,expect,afterEach,vi} from 'vitest';
import {Dropdown} from '../../packages/fokus-js/js/dropdown.js';
const created=[];
afterEach(()=>{for(const instance of created.splice(0))instance.dispose();document.body.innerHTML='';});
function build(attrs='class="fs-dropdown-item is-disabled"'){
 document.body.innerHTML=`<button id="toggle">Abrir</button><div class="fs-dropdown-menu"><a href="#allowed" class="fs-dropdown-item" id="enabled">Ativo</a><a href="#blocked" ${attrs} id="disabled"><span id="child">Indisponível</span></a><button class="fs-dropdown-item" disabled id="native">Nativo</button></div>`;
 const instance=new Dropdown(document.getElementById('toggle'));created.push(instance);instance.show();return{instance,item:document.getElementById('disabled'),child:document.getElementById('child'),menu:instance.menuEl};
}
for(const attrs of ['class="fs-dropdown-item is-disabled"','class="fs-dropdown-item" aria-disabled="true"'])it(`capture blocks disabled descendant click/auxclick before application handlers: ${attrs}`,()=>{
 const{instance,item,child}=build(attrs);const action=vi.fn();child.addEventListener('click',action);item.addEventListener('click',action);item.addEventListener('auxclick',action);const active=document.activeElement;
 for(const type of ['click','auxclick']){const event=new MouseEvent(type,{bubbles:true,cancelable:true,button:type==='auxclick'?1:0});expect(child.dispatchEvent(event)).toBe(false);expect(event.defaultPrevented).toBe(true);expect(instance.isOpen).toBe(true);expect(document.activeElement).toBe(active);}expect(action).not.toHaveBeenCalled();
});
it('disabled Enter/Space are cancelled before key handlers, but arrows still navigate',()=>{
 const{instance,item}=build();const action=vi.fn();item.addEventListener('keydown',action);item.focus();for(const key of ['Enter',' ']){const event=new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});item.dispatchEvent(event);expect(event.defaultPrevented).toBe(true);}expect(action).not.toHaveBeenCalled();item.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,cancelable:true}));expect(document.activeElement.id).toBe('enabled');expect(instance.isOpen).toBe(true);
});
it('native disabled items are also guarded against synthetic dispatch',()=>{const{instance}=build();const event=new MouseEvent('click',{bubbles:true,cancelable:true});document.getElementById('native').dispatchEvent(event);expect(event.defaultPrevented).toBe(true);expect(instance.isOpen).toBe(true);});
it('enabled click keeps target-handler order, default behavior and close/focus semantics',()=>{
 const{instance}=build();const order=[];const target=document.getElementById('enabled');target.addEventListener('click',()=>order.push('target'));instance.toggleEl.addEventListener('fs:dropdown:hidden',()=>order.push('hidden'));const event=new MouseEvent('click',{bubbles:true,cancelable:true});target.dispatchEvent(event);expect(event.defaultPrevented).toBe(false);expect(order).toEqual(['target','hidden']);expect(instance.isOpen).toBe(false);expect(document.activeElement).toBe(instance.toggleEl);
});
it('dynamic ARIA disabled is honored and listeners are removed across repeated dispose/reinit',()=>{
 let{instance,item}=build('class="fs-dropdown-item"');const toggle=instance.toggleEl;for(let cycle=0;cycle<3;cycle++){
  item.setAttribute('aria-disabled','true');const blocked=new MouseEvent('click',{bubbles:true,cancelable:true});item.dispatchEvent(blocked);expect(blocked.defaultPrevented).toBe(true);instance.dispose();const after=new MouseEvent('click',{bubbles:true,cancelable:true});item.dispatchEvent(after);expect(after.defaultPrevented).toBe(false);expect(Dropdown.getInstance(toggle)).toBeUndefined();instance=new Dropdown(toggle);created.push(instance);instance.show();
 }
});
