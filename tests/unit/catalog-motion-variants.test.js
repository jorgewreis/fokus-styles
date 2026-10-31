import { readFileSync } from 'node:fs';
import { it,expect,afterEach,vi } from 'vitest';
import { Collapse } from '../../packages/fokus-js/js/collapse.js';
import { Tag } from '../../packages/fokus-js/js/tag.js';
import { Carousel } from '../../packages/fokus-js/js/carousel.js';
const read=(c,id,ext)=>readFileSync(`docs/catalog/fixtures/${c}/${id}.${ext}`,'utf8');
function mount(c,id,C){document.body.innerHTML=read(c,id,'html');run(c,id,C);}
function run(c,id,C){new Function(C.name,read(c,id,'js').replace(/^import[^\n]+\n/,''))(C);}
const dispose=()=>window.dispatchEvent(new Event('pagehide'));
afterEach(()=>{dispose();document.body.innerHTML='';vi.restoreAllMocks();});
it('open collapse toggles with reduced motion, emits events and disposes',async()=>{
 vi.spyOn(window,'matchMedia').mockReturnValue({matches:true});mount('collapse','initial-open',Collapse);
 const trigger=document.querySelector('button'),panel=document.querySelector('.fs-collapse');
 expect(trigger.getAttribute('aria-expanded')).toBe('true');const hidden=vi.fn();trigger.addEventListener('fs:collapse:hidden',hidden);
 trigger.click();await Promise.resolve();expect(trigger.getAttribute('aria-expanded')).toBe('false');await vi.waitFor(()=>expect(hidden).toHaveBeenCalledOnce());expect(panel.style.display).toBe('none');
 trigger.click();await Promise.resolve();expect(trigger.getAttribute('aria-expanded')).toBe('true');dispose();expect(Collapse.getInstance(trigger)).toBeUndefined();trigger.click();expect(trigger.getAttribute('aria-expanded')).toBe('true');
 run('collapse','initial-open',Collapse);expect(Collapse.getInstance(trigger)).toBeDefined();
});
it('loading tag prevents dismissal and completion handler is cleaned up',()=>{
 mount('tag','loading-recovery',Tag);const tag=document.querySelector('[data-fs=tag]'),button=tag.querySelector('button');const instance=Tag.getInstance(tag);
 expect(instance.dismiss()).toBe(false);expect(button.disabled).toBe(true);document.querySelector('#complete-tag').click();expect(button.disabled).toBe(false);expect(tag.hasAttribute('aria-busy')).toBe(false);
 const loading=vi.spyOn(instance,'setLoading');dispose();document.querySelector('#complete-tag').click();expect(loading).not.toHaveBeenCalled();expect(Tag.getInstance(tag)).toBeUndefined();
 run('tag','loading-recovery',Tag);button.click();expect(tag.isConnected).toBe(false);
});
it('truncated tag keeps full text and dismissal transfers focus to next tag',()=>{
 mount('tag','truncated-group',Tag);const buttons=[...document.querySelectorAll('button')];expect(document.querySelector('.fs-tag-label').textContent).toBe('Revisão de acessibilidade entre navegadores');buttons[0].focus();buttons[0].click();expect(document.activeElement).toBe(buttons[1]);expect(document.querySelectorAll('[data-fs=tag]')).toHaveLength(1);
});
it('manual fade switches slides, counter and live region then removes handlers',()=>{
 mount('carousel','manual-fade',Carousel);const root=document.querySelector('[data-fs=carousel]'),next=root.querySelector('.fs-carousel-control-next');const inner=root.querySelector('.fs-carousel-inner');
 expect(inner.getAttribute('aria-live')).toBe('polite');expect(root.querySelector('[data-fs-carousel-counter]').textContent).toBe('1 de 3');next.click();expect(root.querySelector('[data-fs-carousel-counter]').textContent).toBe('2 de 3');expect(root.querySelectorAll('.fs-carousel-item')[0].getAttribute('aria-hidden')).toBe('true');
 root.dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true}));expect(root.querySelector('[data-fs-carousel-counter]').textContent).toBe('3 de 3');dispose();next.click();expect(root.querySelector('[data-fs-carousel-counter]').textContent).toBe('3 de 3');expect(Carousel.getInstance(root)).toBeUndefined();run('carousel','manual-fade',Carousel);expect(Carousel.getInstance(root)).toBeDefined();
});
it('single carousel is static with no navigation tab stop',()=>{
 mount('carousel','single-static',Carousel);const root=document.querySelector('[data-fs=carousel]');expect(root.classList.contains('is-static')).toBe(true);expect(root.hasAttribute('tabindex')).toBe(false);Carousel.getInstance(root).next();expect(root.querySelectorAll('.is-active')).toHaveLength(1);
});
