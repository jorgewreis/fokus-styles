import { describe, it, expect, afterEach } from "vitest";
import { DataTable } from "../../packages/fokus-js/js/datatable.js";

function buildDataTable({ pageSize } = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "fs-datatable";
  if (pageSize) wrapper.setAttribute("data-fs-page-size", String(pageSize));
  wrapper.innerHTML = `
    <div class="fs-datatable-toolbar">
      <input type="search" data-fs-datatable-filter>
    </div>
    <table class="fs-table">
      <thead>
        <tr>
          <th data-fs-sort="name" scope="col">Nome</th>
          <th data-fs-sort="age" scope="col">Idade</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Carla</td><td>28</td></tr>
        <tr><td>Ana</td><td>35</td></tr>
        <tr><td>Bruno</td><td>19</td></tr>
      </tbody>
    </table>
    <div data-fs-datatable-empty class="fs-empty-state" hidden>
      <p class="fs-empty-state-title">Nenhum resultado</p>
    </div>
    <div data-fs-datatable-loading class="fs-datatable-loading" hidden>Carregando…</div>
    <div data-fs-datatable-error class="fs-datatable-error" hidden>
      <p data-fs-datatable-error-message></p>
    </div>
  `;
  document.body.appendChild(wrapper);

  return { wrapper, dataTable: new DataTable(wrapper, pageSize ? {} : { pageSize: 10 }) };
}

describe("DataTable", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("lança erro se .fs-table não existir", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    expect(() => new DataTable(el)).toThrow();
  });

  it("lança erro se <tbody> não existir", () => {
    const el = document.createElement("div");
    el.innerHTML = '<table class="fs-table"></table>';
    document.body.appendChild(el);

    expect(() => new DataTable(el)).toThrow();
  });

  it("getInstance() retorna a instância criada", () => {
    const { wrapper, dataTable } = buildDataTable();
    expect(DataTable.getInstance(wrapper)).toBe(dataTable);
  });

  it("envolve cabeçalhos data-fs-sort num botão e define aria-sort=none", () => {
    const { wrapper } = buildDataTable();
    const th = wrapper.querySelector('[data-fs-sort="name"]');

    expect(th.getAttribute("aria-sort")).toBe("none");
    expect(th.querySelector(".fs-datatable-sort-btn").textContent).toBe("Nome");
  });

  it("sort() ordena as linhas e alterna a direção em ciclo (asc → desc → none)", () => {
    const { wrapper, dataTable } = buildDataTable();

    dataTable.sort("name", "asc");
    let names = Array.from(wrapper.querySelectorAll("tbody tr:not([hidden]) td:first-child")).map((td) => td.textContent);
    expect(names).toEqual(["Ana", "Bruno", "Carla"]);
    expect(wrapper.querySelector('[data-fs-sort="name"]').getAttribute("aria-sort")).toBe("ascending");

    dataTable.sort("name", "desc");
    names = Array.from(wrapper.querySelectorAll("tbody tr:not([hidden]) td:first-child")).map((td) => td.textContent);
    expect(names).toEqual(["Carla", "Bruno", "Ana"]);

    dataTable.sort("name", "none");
    names = Array.from(wrapper.querySelectorAll("tbody tr:not([hidden]) td:first-child")).map((td) => td.textContent);
    expect(names).toEqual(["Carla", "Ana", "Bruno"]);
    expect(wrapper.querySelector('[data-fs-sort="name"]').getAttribute("aria-sort")).toBe("none");
  });

  it("clicar no botão de ordenação dispara fs:datatable:sorted", () => {
    const { wrapper } = buildDataTable();
    const btn = wrapper.querySelector('[data-fs-sort="age"] .fs-datatable-sort-btn');
    let detail = null;
    wrapper.addEventListener("fs:datatable:sorted", (e) => {
      detail = e.detail;
    });

    btn.click();

    expect(detail).toEqual({ key: "age", direction: "asc" });
    const ages = Array.from(wrapper.querySelectorAll("tbody tr:not([hidden]) td:last-child")).map((td) => td.textContent);
    expect(ages).toEqual(["19", "28", "35"]);
  });

  it("ordena numericamente, não como string (10 depois de 2)", () => {
    const { wrapper, dataTable } = buildDataTable();
    wrapper.querySelector("tbody").innerHTML = "<tr><td>X</td><td>10</td></tr><tr><td>Y</td><td>2</td></tr>";
    dataTable.refresh();

    dataTable.sort("age", "asc");
    const ages = Array.from(wrapper.querySelectorAll("tbody tr:not([hidden]) td:last-child")).map((td) => td.textContent);
    expect(ages).toEqual(["2", "10"]);
  });

  it("filter() filtra por substring em qualquer célula (case-insensitive) e reseta pra página 1", () => {
    const { wrapper, dataTable } = buildDataTable();

    dataTable.filter("an");
    const names = Array.from(wrapper.querySelectorAll("tbody tr:not([hidden]) td:first-child")).map((td) => td.textContent);
    expect(names).toEqual(["Ana"]);
    expect(dataTable.rowCount).toBe(1);
  });

  it("digitar no input de filtro filtra as linhas e dispara fs:datatable:filtered", () => {
    const { wrapper } = buildDataTable();
    const input = wrapper.querySelector("[data-fs-datatable-filter]");
    let detail = null;
    wrapper.addEventListener("fs:datatable:filtered", (e) => {
      detail = e.detail;
    });

    input.value = "bruno";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(detail).toEqual({ query: "bruno", matched: 1 });
    const visible = wrapper.querySelectorAll("tbody tr:not([hidden])");
    expect(visible).toHaveLength(1);
    expect(visible[0].textContent).toContain("Bruno");
  });

  it("mostra o empty state quando nenhuma linha corresponde ao filtro", () => {
    const { wrapper, dataTable } = buildDataTable();

    dataTable.filter("zzz");

    expect(wrapper.querySelector("[data-fs-datatable-empty]").hidden).toBe(false);
    expect(wrapper.querySelector(".fs-table").hidden).toBe(true);

    dataTable.filter("");
    expect(wrapper.querySelector("[data-fs-datatable-empty]").hidden).toBe(true);
    expect(wrapper.querySelector(".fs-table").hidden).toBe(false);
  });

  it("pagina as linhas conforme data-fs-page-size e oculta as demais", () => {
    const { wrapper, dataTable } = buildDataTable({ pageSize: 2 });

    expect(dataTable.pageCount).toBe(2);
    let visible = wrapper.querySelectorAll("tbody tr:not([hidden])");
    expect(visible).toHaveLength(2);

    dataTable.goToPage(2);
    visible = wrapper.querySelectorAll("tbody tr:not([hidden])");
    expect(visible).toHaveLength(1);
  });

  it("clicar num link de paginação navega e dispara fs:datatable:paged", () => {
    const { wrapper, dataTable } = buildDataTable({ pageSize: 2 });
    let detail = null;
    wrapper.addEventListener("fs:datatable:paged", (e) => {
      detail = e.detail;
    });

    const nextBtn = wrapper.querySelector('[data-fs-datatable-pagination] [aria-label="Próxima página"]');
    nextBtn.click();

    expect(dataTable.currentPage).toBe(2);
    expect(detail).toEqual({ page: 2, pageCount: 2 });
  });

  it("não pagina (nav oculta) quando tudo cabe numa página só", () => {
    const { wrapper } = buildDataTable({ pageSize: 10 });
    expect(wrapper.querySelector("[data-fs-datatable-pagination]").hidden).toBe(true);
  });

  it("setLoading(true) esconde a tabela e mostra o bloco de loading", () => {
    const { wrapper, dataTable } = buildDataTable();

    dataTable.setLoading(true);
    expect(wrapper.querySelector(".fs-table").hidden).toBe(true);
    expect(wrapper.querySelector("[data-fs-datatable-loading]").hidden).toBe(false);

    dataTable.setLoading(false);
    expect(wrapper.querySelector(".fs-table").hidden).toBe(false);
    expect(wrapper.querySelector("[data-fs-datatable-loading]").hidden).toBe(true);
  });

  it("setError() esconde a tabela, mostra o bloco de erro com a mensagem", () => {
    const { wrapper, dataTable } = buildDataTable();

    dataTable.setError("Falha ao carregar dados.");
    expect(wrapper.querySelector(".fs-table").hidden).toBe(true);
    const errorEl = wrapper.querySelector("[data-fs-datatable-error]");
    expect(errorEl.hidden).toBe(false);
    expect(errorEl.querySelector("[data-fs-datatable-error-message]").textContent).toBe("Falha ao carregar dados.");

    dataTable.setError(null);
    expect(wrapper.querySelector(".fs-table").hidden).toBe(false);
    expect(errorEl.hidden).toBe(true);
  });

  it("navegação por teclado (setas) move o foco entre células visíveis", () => {
    const { wrapper } = buildDataTable();
    const firstCell = wrapper.querySelector("tbody tr:first-child td:first-child");
    firstCell.focus();

    firstCell.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(document.activeElement).toBe(wrapper.querySelector("tbody tr:first-child td:last-child"));

    document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(document.activeElement).toBe(wrapper.querySelectorAll("tbody tr")[1].children[1]);
  });

  it("refresh() relê as linhas do DOM (para tbody substituído externamente)", () => {
    const { wrapper, dataTable } = buildDataTable();
    wrapper.querySelector("tbody").innerHTML = "<tr><td>Zeca</td><td>40</td></tr>";

    dataTable.refresh();

    expect(dataTable.rowCount).toBe(1);
    expect(wrapper.querySelectorAll("tbody tr:not([hidden])")).toHaveLength(1);
  });

  it("dispose() remove o registro da instância", () => {
    const { wrapper, dataTable } = buildDataTable();
    dataTable.dispose();

    expect(DataTable.getInstance(wrapper)).toBeUndefined();
  });
});
