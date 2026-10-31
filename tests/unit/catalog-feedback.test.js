import { readFileSync } from 'node:fs';
import { afterEach, expect, it, vi } from 'vitest';
import { Stepper } from '../../packages/fokus-js/js/stepper.js';
import { Toast } from '../../packages/fokus-js/js/toast.js';
import { NotificationCenter } from '../../packages/fokus-js/js/notification-center.js';
const cases=JSON.parse(readFileSync('docs/catalog/feedback-cases.json'));
const constructors={stepper:Stepper,toast:Toast,'notification-center':NotificationCenter};
function execute(e){if(e.js)new Function('Stepper','Toast','NotificationCenter',readFileSync(e.js,'utf8').replace(/^import[^\n]+\n/,''))(Stepper,Toast,NotificationCenter);}
function mount(c,id){const e=cases.find(e=>e.component===c&&e.id===id);document.body.innerHTML=readFileSync(e.html,'utf8');execute(e);return document.querySelector(`[data-fs="${c}"]`);}
afterEach(()=>{window.dispatchEvent(new Event('pagehide'));document.body.innerHTML='';vi.useRealTimers();vi.restoreAllMocks();});
for(const e of cases)it(`${e.component}/${e.id}: initializer, cleanup and repeat`,()=>{
 document.body.innerHTML=readFileSync(e.html,'utf8');execute(e);window.dispatchEvent(new Event('pagehide'));
 for(const el of document.querySelectorAll(`[data-fs="${e.component}"]`))expect(constructors[e.component]?.getInstance(el)).toBeUndefined();
 execute(e);
 for(const el of document.querySelectorAll(`[data-fs="${e.component}"]`))expect(constructors[e.component]?.getInstance(el)).toBeDefined();
});
it('stepper validation cancels, signals error, clears and completes',()=>{
 const el=mount('stepper','validation-error');const instance=Stepper.getInstance(el);instance.next();expect(instance.current).toBe(0);expect(el.querySelector('.fs-step-error')).not.toBeNull();expect(document.activeElement.id).toBe('feedback-confirm');
 document.getElementById('feedback-confirm').checked=true;instance.next();expect(instance.current).toBe(1);expect(el.querySelector('.fs-step-error')).toBeNull();instance.next();instance.next();expect(document.getElementById('feedback-status').textContent).toContain('concluídas');expect(el.querySelectorAll('.fs-step-completed')).toHaveLength(3);instance.prev();expect(instance.finished).toBe(false);
});
it('nonlinear stepper keyboard changes target panel',()=>{
 const el=mount('stepper','nonlinear-vertical');const steps=el.querySelectorAll('.fs-step');steps[2].dispatchEvent(new KeyboardEvent('keydown',{key:' ',bubbles:true,cancelable:true}));expect(steps[2].getAttribute('aria-current')).toBe('step');expect(document.getElementById('feedback-panel-2').classList.contains('is-active')).toBe(true);
});
it('toast timers pause on focus then resume, dismiss and reopen',()=>{
 vi.useFakeTimers();const el=mount('toast','timed-progress');const instance=Toast.getInstance(el);document.getElementById('feedback-show').click();vi.advanceTimersByTime(200);el.dispatchEvent(new Event('focusin'));vi.advanceTimersByTime(2000);expect(instance.isOpen).toBe(true);expect(el.classList.contains('is-paused')).toBe(true);el.dispatchEvent(new Event('focusout'));vi.advanceTimersByTime(1600);expect(instance.isOpen).toBe(false);document.getElementById('feedback-show').click();el.querySelector('button').click();expect(instance.isOpen).toBe(false);
});
it('persistent toast variants do not autohide',()=>{vi.useFakeTimers();mount('toast','persistent-variants');document.getElementById('feedback-show').click();vi.advanceTimersByTime(5000);for(const el of document.querySelectorAll('.fs-toast')){expect(Toast.getInstance(el).isOpen).toBe(true);expect(el.getAttribute('role')).toBe('status');}});
it('history reads all, literal text, remove and clear; pagehide disposes generated toasts',()=>{
 const el=mount('notification-center','history-actions');const instance=NotificationCenter.getInstance(el);document.getElementById('demo-notification').click();expect(instance.unreadCount).toBe(1);expect(document.querySelector('.fs-notification-item-title').textContent).toBe('Aviso <local> literal');expect(document.querySelector('.fs-notification-item-title local')).toBeNull();el.click();expect(instance.unreadCount).toBe(0);document.getElementById('feedback-remove').click();expect(instance.getAll()).toHaveLength(0);document.getElementById('demo-notification').click();document.querySelector('[data-notification="clear"]').click();expect(instance.getAll()).toHaveLength(0);window.dispatchEvent(new Event('pagehide'));expect(document.querySelector('#demo-toast-container .fs-toast')).toBeNull();
});
for(const c of ['placeholder','skeleton'])it(`${c}: busy state agrees with visible content`,()=>{mount(c,'loading-complete');document.getElementById('feedback-toggle').click();expect(document.getElementById('feedback-region').getAttribute('aria-busy')).toBe('false');expect(document.getElementById('feedback-loaded').hidden).toBe(false);expect(document.getElementById('feedback-loading').hidden).toBe(true);});
it('empty state supports recovery without losing focus',()=>{mount('empty-state','recoverable');const b=document.getElementById('feedback-toggle');b.focus();b.click();expect(document.getElementById('feedback-empty').hidden).toBe(true);expect(document.activeElement).toBe(b);});
