import { afterEach,expect,it,vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { DataTable } from '../../packages/fokus-js/js/datatable.js';
import { TreeView } from '../../packages/fokus-js/js/tree-view.js';
import { Toast } from '../../packages/fokus-js/js/toast.js';
import { Tag } from '../../packages/fokus-js/js/tag.js';
import { Carousel } from '../../packages/fokus-js/js/carousel.js';
import { NestedMenu } from '../../packages/fokus-js/js/nested-menu.js';
const instances=[];const doc=c=>readFileSync(`docs/components/${c}.md`,'utf8');
afterEach(()=>{instances.splice(0).forEach(i=>i.dispose());document.body.innerHTML='';vi.restoreAllMocks();});
it('DataTable attribute pageSize wins and sort override also controls filtering',()=>{
 document.body.innerHTML='<div id="r" data-fs-page-size="2"><table class="fs-table"><thead><tr><th data-fs-sort="date">Date</th></tr></thead><tbody><tr><td data-fs-sort-value="2026-10-31">31 outubro</td></tr></tbody></table></div>';
 const d=new DataTable(document.querySelector('#r'),{pageSize:9});instances.push(d);expect(d.pageSize).toBe(2);d.filter('outubro');expect(d.rowCount).toBe(0);d.filter('2026');expect(d.rowCount).toBe(1);
 expect(doc('datatable')).toContain('tanto para ordenar');
});
it('DataTable untyped numeric text sorting and none match the public type declaration',()=>{
 document.body.innerHTML='<div id="r"><table class="fs-table"><thead><tr><th data-fs-sort="n">N</th></tr></thead><tbody><tr><td>10</td></tr><tr><td>2</td></tr></tbody></table></div>';
 const d=new DataTable(document.querySelector('#r'));instances.push(d);d.sort('n','asc');expect(document.querySelector('tbody tr').textContent).toBe('2');d.sort('n','none');expect(document.querySelector('tbody tr').textContent).toBe('10');
 expect(readFileSync('packages/fokus-js/js/datatable.d.ts','utf8')).toContain('direction?: "asc" | "desc" | "none"');expect(doc('datatable')).toContain('Runtime e declaração TypeScript aceitam');
});
it('TreeView fallback includes children and aria-disabled does not implement disabled interaction',()=>{
 document.body.innerHTML='<ul><li aria-disabled="true"><span class="fs-tree-label">Parent</span><ul><li><span class="fs-tree-label">Child</span></li></ul></li></ul>';
 const tree=new TreeView(document.querySelector('ul'));instances.push(tree);const selected=vi.fn();tree.rootEl.addEventListener('fs:tree:selected',selected);document.querySelector('.fs-tree-label').click();expect(selected.mock.calls[0][0].detail.value).toBe('ParentChild');expect(document.querySelector('li').getAttribute('aria-selected')).toBe('true');expect(doc('tree-view')).toContain('incluindo o texto dos descendentes');
});
it('Toast fallback and visibility use isOpen, and mouseleave preserves pause during internal focus',async()=>{
 vi.spyOn(window,'matchMedia').mockReturnValue({matches:true});document.body.innerHTML='<div class="fs-toast" data-delay="0"><button>Action</button></div>';
 const t=new Toast(document.querySelector('div'));instances.push(t);expect(t.delay).toBe(4000);t.show();await Promise.resolve();expect(t.isOpen).toBe(true);expect(t.toastEl.classList.contains('is-open')).toBe(false);
 t.toastEl.dispatchEvent(new Event('mouseenter'));t.toastEl.querySelector('button').focus();t.toastEl.dispatchEvent(new Event('mouseleave'));expect(document.activeElement.tagName).toBe('BUTTON');expect(t.toastEl.classList.contains('is-paused')).toBe(true);expect(doc('toast')).toContain('causas independentes de pausa');
});
it('Tag loading preserves consumer disabled, protected styling does not veto API dismissal',()=>{
 document.body.innerHTML='<span class="fs-tag fs-tag-protected"><button data-fs-dismiss="tag" disabled>Remove</button></span>';const t=new Tag(document.querySelector('span'));instances.push(t);expect(t.tagEl.querySelector('button').disabled).toBe(true);expect(t.dismiss()).toBe(true);expect(doc('tag')).toContain('não uma trava na API');
});
it('Carousel modulo wraps negative index and ignores NaN',()=>{
 document.body.innerHTML='<div><div class="fs-carousel-inner"><div class="fs-carousel-item is-active">A</div><div class="fs-carousel-item">B</div></div></div>';const c=new Carousel(document.querySelector('div'));instances.push(c);c.goTo(-1);expect(document.querySelector('.is-active').textContent).toBe('B');c.goTo(NaN);expect(document.querySelectorAll('.is-active')).toHaveLength(1);expect(document.querySelector('.is-active').textContent).toBe('B');expect(doc('carousel')).toContain('inteiro finito');
});
it('NestedMenu disabled contract uses class, not aria-disabled alone',()=>{
 document.body.innerHTML='<button id="toggle" data-fs-target="#menu">Menu</button><div id="menu" class="fs-dropdown-menu"><button class="fs-dropdown-item" aria-disabled="true">First</button><button class="fs-dropdown-item is-disabled">Second</button></div>';
 const n=new NestedMenu(document.querySelector('#toggle'));instances.push(n);n.show();expect(document.activeElement.textContent).toBe('First');document.activeElement.click();expect(n.isOpen).toBe(false);expect(doc('nested-menu')).toContain('aria-disabled` sozinho');
});
