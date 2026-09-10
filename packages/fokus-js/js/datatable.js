import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

// Quantos números de página exibir ao redor da atual (fora prev/next).
const PAGE_WINDOW = 5;

// Ícones de anterior/próxima (Lucide chevron-left/chevron-right), embutidos
// como string em vez de importados de `fokus-styles/icons` — esse subpath é
// opcional, e o módulo JavaScript não pode depender dele em runtime.
// `aria-hidden` porque o rótulo acessível real já vem do `aria-label` do
// botão (ver `_pageItem`).
const ICON_CHEVRON_LEFT =
  '<svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
const ICON_CHEVRON_RIGHT =
  '<svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

function compareValues(a, b) {
  const numA = Number(a);
  const numB = Number(b);
  if (a !== "" && b !== "" && !Number.isNaN(numA) && !Number.isNaN(numB)) {
    return numA - numB;
  }
  return a.localeCompare(b, "pt-BR", { sensitivity: "base" });
}

function compareTypedValues(a, b, type) {
  if (type === "date") {
    return new Date(a).getTime() - new Date(b).getTime();
  }
  if (type === "number" || type === "currency") {
    const normalize = (value) => Number(String(value).replace(/[^\d,-]/g, "").replace(/\./g, "").replace(",", "."));
    return normalize(a) - normalize(b);
  }
  return compareValues(a, b);
}

export class DataTable {
  constructor(rootEl, options = {}) {
    const tableEl = rootEl.querySelector(".fs-table");
    if (!tableEl) {
      throw new Error("FokusStyles.DataTable: tabela não encontrada (.fs-table).");
    }

    const tbodyEl = tableEl.querySelector("tbody");
    if (!tbodyEl) {
      throw new Error("FokusStyles.DataTable: <tbody> não encontrado.");
    }

    this.rootEl = rootEl;
    this.tableEl = tableEl;
    this.theadEl = tableEl.querySelector("thead");
    this.tbodyEl = tbodyEl;
    const configuredPageSize = Number(rootEl.getAttribute("data-fs-page-size") ?? options.pageSize ?? 10);
    this.pageSize = Number.isFinite(configuredPageSize) && configuredPageSize > 0
      ? Math.floor(configuredPageSize)
      : 10;

    this.filterInput = rootEl.querySelector("[data-fs-datatable-filter]");
    this.emptyEl = rootEl.querySelector("[data-fs-datatable-empty]");
    this.loadingEl = rootEl.querySelector("[data-fs-datatable-loading]");
    this.errorEl = rootEl.querySelector("[data-fs-datatable-error]");

    this.paginationEl = rootEl.querySelector("[data-fs-datatable-pagination]");
    if (!this.paginationEl) {
      this.paginationEl = document.createElement("nav");
      this.paginationEl.setAttribute("data-fs-datatable-pagination", "");
      this.paginationEl.setAttribute("aria-label", "Paginação da tabela");
      rootEl.appendChild(this.paginationEl);
    }

    this.sortKey = null;
    this.sortDirection = "none";
    this.filterQuery = "";
    this.currentPage = 1;
    this._loading = false;
    this._error = null;
    this._rows = [];
    this._sortButtons = [];

    this._buildSortHeaders();
    this._readRows();

    this._handleSortClick = this._handleSortClick.bind(this);
    this._handleFilterInput = this._handleFilterInput.bind(this);
    this._handlePaginationClick = this._handlePaginationClick.bind(this);
    this._handleCellKeydown = this._handleCellKeydown.bind(this);
    this._handleCellFocusIn = this._handleCellFocusIn.bind(this);

    if (this.theadEl) this.theadEl.addEventListener("click", this._handleSortClick);
    if (this.filterInput) this.filterInput.addEventListener("input", this._handleFilterInput);
    this.paginationEl.addEventListener("click", this._handlePaginationClick);
    this.tbodyEl.addEventListener("keydown", this._handleCellKeydown);
    this.tbodyEl.addEventListener("focusin", this._handleCellFocusIn);

    this._render();
    this.tableEl.setAttribute("aria-busy", "false");

    instances.set(rootEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  get pageCount() {
    return Math.max(1, Math.ceil(this._matchedRows().length / this.pageSize));
  }

  get rowCount() {
    return this._matchedRows().length;
  }

  _buildSortHeaders() {
    if (!this.theadEl) return;

    this._sortButtons = Array.from(this.theadEl.querySelectorAll("th[data-fs-sort]")).map((th) => {
      const key = th.getAttribute("data-fs-sort");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "fs-datatable-sort-btn";
      btn.setAttribute("data-fs-sort-key", key);
      while (th.firstChild) btn.appendChild(th.firstChild);
      th.appendChild(btn);
      th.setAttribute("aria-sort", "none");
      return { th, key };
    });
  }

  _readRows() {
    this._rows = Array.from(this.tbodyEl.querySelectorAll(":scope > tr")).map((el, order) => ({
      el,
      order,
      cells: Array.from(el.children).map((cell) => (cell.getAttribute("data-fs-sort-value") ?? cell.textContent).trim()),
    }));
  }

  refresh() {
    this._readRows();
    this.currentPage = 1;
    this._render();
  }

  _matchedRows() {
    let rows = this._rows;

    if (this.filterQuery) {
      const query = this.filterQuery.toLowerCase();
      rows = rows.filter((row) => row.cells.some((cell) => cell.toLowerCase().includes(query)));
    }

    if (this.sortKey && this.sortDirection !== "none") {
      const th = this._sortButtons.find((entry) => entry.key === this.sortKey)?.th;
      const columnIndex = th ? Array.from(this.theadEl.querySelectorAll("th")).indexOf(th) : -1;
      const type = th?.getAttribute("data-fs-sort-type") ?? "text";

      if (columnIndex >= 0) {
        const direction = this.sortDirection === "asc" ? 1 : -1;
        rows = [...rows].sort((a, b) => direction * compareTypedValues(a.cells[columnIndex] ?? "", b.cells[columnIndex] ?? "", type));
      }
    } else {
      rows = [...rows].sort((a, b) => a.order - b.order);
    }

    return rows;
  }

  _nextDirection(key) {
    if (this.sortKey !== key) return "asc";
    if (this.sortDirection === "asc") return "desc";
    if (this.sortDirection === "desc") return "none";
    return "asc";
  }

  sort(key, direction = "asc") {
    this.sortKey = direction === "none" ? null : key;
    this.sortDirection = direction;
    this.currentPage = 1;
    this._render();
    this.rootEl.dispatchEvent(
      new CustomEvent("fs:datatable:sorted", { bubbles: true, detail: { key: this.sortKey, direction: this.sortDirection } }),
    );
  }

  filter(query) {
    this.filterQuery = (query ?? "").trim();
    if (this.filterInput) this.filterInput.value = this.filterQuery;
    this.currentPage = 1;
    this._render();
    this.rootEl.dispatchEvent(
      new CustomEvent("fs:datatable:filtered", { bubbles: true, detail: { query: this.filterQuery, matched: this.rowCount } }),
    );
  }

  goToPage(page) {
    const pageCount = this.pageCount;
    const requested = Number(page);
    const next = Number.isFinite(requested) ? Math.min(Math.max(1, Math.floor(requested)), pageCount) : 1;
    if (next === this.currentPage) return;

    this.currentPage = next;
    this._render();
    this.rootEl.dispatchEvent(new CustomEvent("fs:datatable:paged", { bubbles: true, detail: { page: this.currentPage, pageCount } }));
  }

  setLoading(isLoading) {
    this._loading = Boolean(isLoading);
    this.tableEl.setAttribute("aria-busy", String(this._loading));
    if (this._loading) this._error = null;
    this._syncVisibility();
  }

  setError(message) {
    this._error = message || null;
    if (this._error) this._loading = false;
    this.tableEl.setAttribute("aria-busy", String(this._loading));
    if (this.errorEl) {
      const messageEl = this.errorEl.querySelector("[data-fs-datatable-error-message]");
      if (messageEl) messageEl.textContent = this._error ?? "";
    }
    this._syncVisibility();
  }

  _syncVisibility() {
    const showLoading = this._loading;
    const showError = !this._loading && Boolean(this._error);
    const showTable = !showLoading && !showError;

    this.tableEl.hidden = !showTable;
    if (this.filterInput) this.filterInput.disabled = !showTable;
    if (this.loadingEl) this.loadingEl.hidden = !showLoading;
    if (this.errorEl) this.errorEl.hidden = !showError;

    if (!showTable) {
      this.paginationEl.hidden = true;
      if (this.emptyEl) this.emptyEl.hidden = true;
    } else {
      this._render();
    }
  }

  _render() {
    if (this._loading || this._error) return;

    const matched = this._matchedRows();
    const pageCount = Math.max(1, Math.ceil(matched.length / this.pageSize));
    this.currentPage = Math.min(Math.max(1, this.currentPage), pageCount);

    const start = (this.currentPage - 1) * this.pageSize;
    const pageRows = matched.slice(start, start + this.pageSize);

    // Reordena o DOM na ordem final (filtro + ordenação + página) movendo os
    // <tr> existentes em vez de recriá-los — preserva listeners/estado de
    // cada linha. As demais linhas (fora da página ou filtradas) só ficam
    // ocultas, sem sair da árvore.
    pageRows.forEach((row) => this.tbodyEl.appendChild(row.el));
    this._rows.forEach((row) => {
      row.el.hidden = !pageRows.includes(row);
    });

    const isEmpty = matched.length === 0;
    this.tableEl.hidden = isEmpty && Boolean(this.emptyEl);
    if (this.emptyEl) this.emptyEl.hidden = !isEmpty;

    this._renderPagination(pageCount);
    this._syncAriaSort();
    this._resetRovingTabindex();
  }

  _syncAriaSort() {
    this._sortButtons.forEach(({ th, key }) => {
      const direction = key === this.sortKey ? this.sortDirection : "none";
      th.setAttribute("aria-sort", direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none");
    });
  }

  _renderPagination(pageCount) {
    this.paginationEl.hidden = pageCount <= 1;
    if (pageCount <= 1) {
      this.paginationEl.innerHTML = "";
      return;
    }

    const end = Math.min(pageCount, Math.max(PAGE_WINDOW, this.currentPage + Math.floor(PAGE_WINDOW / 2)));
    const start = Math.max(1, end - PAGE_WINDOW + 1);

    const items = [this._pageItem(ICON_CHEVRON_LEFT, this.currentPage - 1, this.currentPage === 1, "Página anterior")];
    for (let page = start; page <= end; page += 1) {
      items.push(this._pageItem(String(page), page, false, `Página ${page}`, page === this.currentPage));
    }
    items.push(this._pageItem(ICON_CHEVRON_RIGHT, this.currentPage + 1, this.currentPage === pageCount, "Próxima página"));

    this.paginationEl.innerHTML = `<ul class="fs-pagination">${items.join("")}</ul>`;
  }

  _pageItem(label, page, disabled, ariaLabel, isActive = false) {
    const classes = ["fs-page-item"];
    if (disabled) classes.push("is-disabled");
    if (isActive) classes.push("is-active");

    return (
      `<li class="${classes.join(" ")}"><button type="button" class="fs-page-link" data-fs-page="${page}" ` +
      `aria-label="${ariaLabel}"${isActive ? ' aria-current="page"' : ""}${disabled ? " disabled" : ""}>${label}</button></li>`
    );
  }

  _handleSortClick(event) {
    const btn = event.target.closest("[data-fs-sort-key]");
    if (!btn) return;

    const key = btn.dataset.fsSortKey;
    this.sort(key, this._nextDirection(key));
  }

  _handleFilterInput() {
    this.filter(this.filterInput.value);
  }

  _handlePaginationClick(event) {
    const btn = event.target.closest("[data-fs-page]");
    if (!btn || btn.disabled) return;

    this.goToPage(Number(btn.dataset.fsPage));
  }

  _visibleCells() {
    return Array.from(this.tbodyEl.querySelectorAll("tr:not([hidden]) > td, tr:not([hidden]) > th"));
  }

  _resetRovingTabindex() {
    this._visibleCells().forEach((cell, index) => cell.setAttribute("tabindex", index === 0 ? "0" : "-1"));
  }

  _handleCellFocusIn(event) {
    const cell = event.target.closest("td, th");
    if (!cell || cell.parentElement.hidden) return;

    this._visibleCells().forEach((c) => c.setAttribute("tabindex", c === cell ? "0" : "-1"));
  }

  _handleCellKeydown(event) {
    const cell = event.target.closest("td, th");
    if (!cell) return;

    const rows = Array.from(this.tbodyEl.querySelectorAll("tr:not([hidden])"));
    const rowIndex = rows.indexOf(cell.parentElement);
    if (rowIndex === -1) return;

    const cellsInRow = Array.from(cell.parentElement.children);
    const colIndex = cellsInRow.indexOf(cell);
    const lastRow = rows[rows.length - 1];

    let target = null;
    switch (event.key) {
      case "ArrowRight":
        target = cellsInRow[colIndex + 1];
        break;
      case "ArrowLeft":
        target = cellsInRow[colIndex - 1];
        break;
      case "ArrowDown":
        target = rows[rowIndex + 1]?.children[colIndex];
        break;
      case "ArrowUp":
        target = rows[rowIndex - 1]?.children[colIndex];
        break;
      case "Home":
        target = event.ctrlKey ? rows[0]?.children[0] : cellsInRow[0];
        break;
      case "End":
        target = event.ctrlKey ? lastRow?.children[lastRow.children.length - 1] : cellsInRow[cellsInRow.length - 1];
        break;
      default:
        return;
    }

    if (!target) return;
    event.preventDefault();
    target.focus();
  }

  dispose() {
    if (this.theadEl) this.theadEl.removeEventListener("click", this._handleSortClick);
    if (this.filterInput) this.filterInput.removeEventListener("input", this._handleFilterInput);
    this.paginationEl.removeEventListener("click", this._handlePaginationClick);
    this.tbodyEl.removeEventListener("keydown", this._handleCellKeydown);
    this.tbodyEl.removeEventListener("focusin", this._handleCellFocusIn);
    instances.delete(this.rootEl);
  }
}

autoInit("datatable", DataTable);
