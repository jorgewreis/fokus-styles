import { afterEach, expect, it } from 'vitest';
import { DataTable } from '../../packages/fokus-js/js/datatable.js';
const instances = [];
afterEach(() => { instances.splice(0).forEach(x => x.dispose()); document.body.innerHTML = ''; });
function mount(value, attribute = true) {
  document.body.innerHTML = '<div><table class="fs-table"><tbody><tr><td>A</td></tr><tr><td>B</td></tr><tr><td>C</td></tr></tbody></table></div>';
  const el = document.querySelector('div');
  if (attribute) el.setAttribute('data-fs-page-size', String(value));
  const table = new DataTable(el, attribute ? {} : { pageSize: value });
  instances.push(table);
  return table;
}
it.each([0.01, 0.5, 0.999, 0, -1, Infinity, -Infinity, NaN, 'bad', ''])('invalid size %s uses finite nonzero fallback', value => {
  const table = mount(value);
  expect(table.pageSize).toBe(10);
  expect(table.pageCount).toBe(1);
  expect(document.querySelectorAll('tbody tr:not([hidden])')).toHaveLength(3);
  expect(document.querySelector('[data-fs-datatable-pagination]').innerHTML).not.toMatch(/NaN|Infinity/);
});
it('subunit numeric JS option cannot hide every row', () => {
  const table = mount(0.5, false);
  expect(table.pageSize).toBe(10);
  table.goToPage(100);
  expect(table.currentPage).toBe(1);
  expect(table.rowCount).toBe(3);
});
it.each([[1, 1, 3], [1.9, 1, 3], [2.8, 2, 2]])('valid size %s preserves historical flooring', (input, size, pages) => {
  const table = mount(input);
  expect(table.pageSize).toBe(size);
  expect(table.pageCount).toBe(pages);
  expect(document.querySelectorAll('tbody tr:not([hidden])')).toHaveLength(size);
});
