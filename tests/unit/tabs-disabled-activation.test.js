import { afterEach, expect, it, vi } from 'vitest';
import { Tabs } from '../../packages/fokus-js/js/tabs.js';
const instances = [];
afterEach(() => { instances.splice(0).forEach(x => x.dispose()); document.body.innerHTML = ''; });
function mount(attribute = '', element = 'a') {
  document.body.innerHTML = `<div id="tabs"><button class="fs-nav-link is-active" data-fs-target="#a">A</button><${element} href="#blocked" class="fs-nav-link" ${attribute} data-fs-target="#b"><span>B</span></${element}><button class="fs-nav-link" data-fs-target="#c">C</button></div><section id="a"></section><section id="b"></section><section id="c"></section>`;
  const tabs = new Tabs(document.getElementById('tabs')); instances.push(tabs);
  return tabs;
}
it.each(['aria-disabled="true"', 'data-mark-class'])('unavailable %s prevents descendant click/auxclick/Enter/Space before item handlers', attribute => {
  const tabs = mount(attribute); const item = tabs.tabs[1];
  if (attribute === 'data-mark-class') item.classList.add('is-disabled');
  const span = item.querySelector('span'); const action = vi.fn();
  for (const type of ['click', 'auxclick', 'keydown']) span.addEventListener(type, action);
  for (const event of [new MouseEvent('click', { bubbles: true, cancelable: true }), new MouseEvent('auxclick', { bubbles: true, cancelable: true }), ...['Enter', ' '].map(key => new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))]) {
    span.dispatchEvent(event); expect(event.defaultPrevented).toBe(true);
  }
  expect(action).not.toHaveBeenCalled();
  expect(tabs.tabs[0].getAttribute('aria-selected')).toBe('true');
  expect(document.getElementById('b').hidden).toBe(true);
});
it.each(['aria', 'class', 'native', 'fieldset'])('arrows skip %s disabled while direct show leaves selection untouched', mode => {
  const tabs = mount('', 'button'); const item = tabs.tabs[1];
  if (mode === 'aria') item.setAttribute('aria-disabled', 'true');
  if (mode === 'class') item.classList.add('is-disabled');
  if (mode === 'native') item.disabled = true;
  if (mode === 'fieldset') { const fieldset = document.createElement('fieldset'); fieldset.disabled = true; item.before(fieldset); fieldset.append(item); }
  tabs.show(item); expect(tabs.tabs[0].getAttribute('aria-selected')).toBe('true');
  tabs.tabs[0].focus(); tabs.tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  expect(document.activeElement).toBe(tabs.tabs[2]);
  expect(tabs.tabs[2].getAttribute('aria-selected')).toBe('true');
  const event = new MouseEvent('click', { bubbles: true, cancelable: true }); item.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
});
it('enabled link preserves default and consumer handler order', () => {
  const tabs = mount(); const item = tabs.tabs[1]; const order = [];
  item.addEventListener('click', () => order.push('consumer'));
  item.addEventListener('fs:tab:changed', () => order.push('changed'));
  const event = new MouseEvent('click', { bubbles: true, cancelable: true }); item.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(false);
  expect(order).toEqual(['consumer', 'changed']);
  expect(item.getAttribute('aria-selected')).toBe('true');
});
it('foreign/null tabs cannot clear panels or dispatch change', () => {
  const tabs = mount(); const changed = vi.fn(); tabs.tablistEl.addEventListener('fs:tab:changed', changed);
  tabs.show(document.createElement('button')); tabs.show(null);
  expect(changed).not.toHaveBeenCalled();
  expect(tabs.tabs[0].getAttribute('aria-selected')).toBe('true');
  expect(document.getElementById('a').hidden).toBe(false);
});
it('dynamic disabled and disposal remove only guards owned by this instance', () => {
  const tabs = mount('aria-disabled="true"'); const item = tabs.tabs[1]; const action = vi.fn(); item.addEventListener('click', action);
  item.setAttribute('aria-disabled', 'false'); item.click(); expect(action).toHaveBeenCalledTimes(1);
  item.setAttribute('aria-disabled', 'true'); tabs.dispose();
  const event = new MouseEvent('click', { bubbles: true, cancelable: true }); item.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(false); expect(action).toHaveBeenCalledTimes(2);
  const next = new Tabs(tabs.tablistEl); instances.push(next); item.click();
  expect(action).toHaveBeenCalledTimes(2);
});
