// Diagnostic evidence for documented pending work, not a recommendation to
// preserve defects. Replace these expectations when the contracts are hardened.
import { afterEach, expect, it } from 'vitest';
import { Tabs } from '../../packages/fokus-js/js/tabs.js';
import { NestedMenu } from '../../packages/fokus-js/js/nested-menu.js';
const instances = [];
afterEach(() => { instances.splice(0).forEach(x => x.dispose()); document.body.innerHTML = ''; });
function tabs(manual = false) {
  document.body.innerHTML = '<div id="tabs"><button class="fs-nav-link is-active">A</button><button class="fs-nav-link">B</button></div>';
  const root = document.querySelector('div');
  if (manual) root.dataset.tabsActivation = 'manual';
  const instance = new Tabs(root); instances.push(instance);
  return instance.tabs;
}
it('pending: manual focus does not transfer the sequential tab stop', () => {
  const [a, b] = tabs(true); a.focus();
  a.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  expect(document.activeElement).toBe(b);
  expect(b.tabIndex).toBe(-1);
  expect(a.tabIndex).toBe(0);
  expect(a.getAttribute('aria-selected')).toBe('true');
});
it('native disabled tabs are skipped without selecting them', () => {
  const [a, b] = tabs(); b.disabled = true; a.focus();
  a.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  expect(b.getAttribute('aria-selected')).toBe('false');
  expect(a.getAttribute('aria-selected')).toBe('true');
});
function menu() {
  document.body.innerHTML = '<button id="toggle">Menu</button><div class="fs-dropdown-menu"><button class="fs-dropdown-item" id="first">A</button><button class="fs-dropdown-item" disabled>B</button><a class="fs-dropdown-item is-disabled" href="#blocked">C</a></div>';
  const instance = new NestedMenu(document.querySelector('#toggle')); instances.push(instance); instance.show();
  return instance;
}
it('disabled NestedMenu link default is canceled', () => {
  menu(); const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  document.querySelector('a').dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
});
it('native disabled NestedMenu item is skipped during arrow traversal', () => {
  const instance = menu(); const last = document.createElement('button'); last.className = 'fs-dropdown-item'; instance.rootMenu.append(last); const first = document.querySelector('#first'); first.focus();
  first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  expect(document.activeElement).toBe(last);
});
