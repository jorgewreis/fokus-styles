import {readFileSync} from 'node:fs';
import {it,expect,afterEach} from 'vitest';
const mount=(c,id)=>document.body.innerHTML=readFileSync(`docs/catalog/fixtures/${c}/${id}.html`,'utf8');
const run=(c,id)=>new Function(readFileSync(`docs/catalog/fixtures/${c}/${id}.js`,'utf8'))();
const dispose=()=>window.dispatchEvent(new Event('pagehide'));
afterEach(()=>{dispose();document.body.innerHTML='';});
it('vertical group toggles independently, respects disabled and aborts all handlers on reinit',()=>{
 mount('button-group','vertical-toggles');const buttons=[...document.querySelectorAll('button')];
 for(let cycle=0;cycle<3;cycle++){
  run('button-group','vertical-toggles');const before=buttons[0].getAttribute('aria-pressed');buttons[0].click();expect(buttons[0].getAttribute('aria-pressed')).not.toBe(before);expect(buttons[1].getAttribute('aria-pressed')).toBe('false');buttons[2].click();expect(buttons[2].getAttribute('aria-pressed')).toBe('false');dispose();const after=buttons[0].getAttribute('aria-pressed');buttons[0].click();expect(buttons[0].getAttribute('aria-pressed')).toBe(after);
 }
});
it('close action restores focus and opener state with repeated cycles and cleanup',()=>{
 mount('close-button','restore-focus');const open=document.querySelector('#open-local-panel');const close=document.querySelector('#close-local-panel');const panel=document.querySelector('#local-panel');
 for(let cycle=0;cycle<3;cycle++){
  run('close-button','restore-focus');open.click();expect(panel.hidden).toBe(false);expect(open.getAttribute('aria-expanded')).toBe('true');expect(document.activeElement).toBe(close);close.click();expect(panel.hidden).toBe(true);expect(document.activeElement).toBe(open);dispose();open.click();expect(panel.hidden).toBe(true);
 }
});
it('segmented checkboxes are inclusive, sizes remain native and disabled cannot toggle',()=>{
 mount('segmented-control','inclusive-sizes');for(const group of document.querySelectorAll('.fs-segmented-control')){const inputs=group.querySelectorAll('input');inputs[1].click();expect(inputs[0].checked).toBe(true);expect(inputs[1].checked).toBe(true);inputs[2].click();expect(inputs[2].checked).toBe(false);}
});
it('avatar initials have explicit names and no fabricated presence attributes',()=>{mount('avatar','initials-shapes');for(const el of document.querySelectorAll('.fs-avatar')){expect(el.getAttribute('role')).toBe('img');expect(el.getAttribute('aria-label')).toBeTruthy();expect(el.hasAttribute('tabindex')).toBe(false);}});
it('icon links have working local destinations and distinct RTL/local-LTR arrow paths',()=>{mount('icon-link','direction-context');for(const a of document.querySelectorAll('a'))expect(document.querySelector(a.getAttribute('href'))).not.toBeNull();const paths=[...document.querySelectorAll('path')].map(el=>el.getAttribute('d'));expect(paths[0]).not.toBe(paths[1]);expect(document.querySelector('[dir=rtl] [dir=ltr] a')).not.toBeNull();});
it('rating has descending complete scale, initial score, exclusive selection and disabled group',()=>{
 mount('rating','sizes-disabled');const groups=document.querySelectorAll('.fs-rating');for(const group of groups){const inputs=[...group.querySelectorAll('input')];expect(inputs.map(i=>i.value)).toEqual(['5','4','3','2','1']);expect(inputs[2].checked).toBe(true);for(const i of inputs)expect(i.nextElementSibling.htmlFor).toBe(i.id);}
 const first=groups[0].querySelector('input');first.click();expect(first.checked).toBe(true);expect(groups[0].querySelectorAll(':checked')).toHaveLength(1);const disabled=groups[1].querySelector('input');disabled.click();expect(disabled.checked).toBe(false);
});
