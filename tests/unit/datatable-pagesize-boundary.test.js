import { afterEach, expect, it } from "vitest";
import { DataTable } from "../../packages/fokus-js/js/datatable.js";

const instances = [];

function mount(value, attribute = true) {
  document.body.innerHTML = '<div><table class="fs-table"><thead><tr><th>Nome</th></tr></thead><tbody><tr><td>A</td></tr><tr><td>B</td></tr><tr><td>C</td></tr></tbody></table></div>';
  const root = document.querySelector("div");
  if (attribute) root.setAttribute("data-fs-page-size", String(value));
  const table = new DataTable(root, attribute ? {} : { pageSize: value });
  instances.push(table);
  return table;
}

afterEach(() => {
  instances.splice(0).forEach((table) => table.dispose());
  document.body.innerHTML = "";
});

it.each([0.01, 0.5, 0.999, 0, -1, Infinity, -Infinity, NaN, "bad", ""])(
  "usa tamanho 10 para pageSize inválido %s",
  (value) => {
    const table = mount(value);
    expect(table.pageSize).toBe(10);
    expect(table.pageCount).toBe(1);
    expect(document.querySelectorAll("tbody tr:not([hidden])")).toHaveLength(3);
    expect(document.querySelector("[data-fs-datatable-pagination]").innerHTML).not.toMatch(/NaN|Infinity/);
  },
);

it("opção numérica subunitária não oculta linhas nem sai dos limites de paginação", () => {
  const table = mount(0.5, false);
  expect(table.pageSize).toBe(10);
  table.goToPage(100);
  expect(table.currentPage).toBe(1);
  expect(table.rowCount).toBe(3);
});

it.each([[1, 1, 3], [1.9, 1, 3], [2.8, 2, 2]])(
  "preserva floor histórico para tamanho válido %s",
  (input, size, pages) => {
    const table = mount(input);
    expect(table.pageSize).toBe(size);
    expect(table.pageCount).toBe(pages);
    expect(document.querySelectorAll("tbody tr:not([hidden])")).toHaveLength(size);
  },
);
