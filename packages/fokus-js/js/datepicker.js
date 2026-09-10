import { computePosition, applyPosition, watchPosition } from "./core/positioning.js";
import { onClickOutside } from "./core/overlay.js";
import { onEscapeKey } from "./core/focus.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("pt-BR", { weekday: "narrow" });
const HEADER_FORMATTER = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

let idCounter = 0;

function uniqueId(prefix) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toDisplay(date) {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function parseDisplay(value) {
  const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return null;
  return date.getFullYear() === Number(year) && date.getMonth() === Number(month) - 1 && date.getDate() === Number(day)
    ? date
    : null;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function addMonthsClamped(date, months) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

function buildMonthCells(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    const day = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    cells.push({ year: month === 0 ? year - 1 : year, month: prevMonth, day, outside: true });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ year, month, day, outside: false });
  }

  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    const nextMonth = month === 11 ? 0 : month + 1;
    cells.push({ year: month === 11 ? year + 1 : year, month: nextMonth, day: nextDay, outside: true });
    nextDay += 1;
  }

  return cells;
}

export class Datepicker {
  constructor(inputEl, options = {}) {
    const targetSelector = inputEl.getAttribute("data-fs-target");
    const panelEl = targetSelector ? document.querySelector(targetSelector) : inputEl.nextElementSibling;

    if (!panelEl) {
      throw new Error("FokusStyles.Datepicker: painel não encontrado (data-fs-target).");
    }

    this.inputEl = inputEl;
    this.panelEl = panelEl;
    this.placement = options.placement ?? inputEl.getAttribute("data-placement") ?? "bottom";
    this.isOpen = false;
    this._suppressNextFocus = false;

    const initial = parseDisplay(inputEl.value);
    this.selectedDate = initial;
    this.viewDate = initial ? new Date(initial) : new Date();
    this.value = initial ? toISO(initial) : null;
    this._outsideClickCleanup = null;
    this._positionCleanup = null;
    this._originalParent = panelEl.parentNode;
    this._originalNextSibling = panelEl.nextSibling;

    if (!this.panelEl.id) this.panelEl.id = uniqueId("fs-datepicker-panel");

    document.body.appendChild(this.panelEl);

    // `role="combobox"` é obrigatório aqui: `aria-expanded` não é permitido
    // no role implícito de `<input type="text">` ("textbox"), só em roles
    // como combobox/button — sem isso o axe reprova (aria-allowed-attr).
    this.inputEl.setAttribute("role", "combobox");
    this.inputEl.setAttribute("aria-haspopup", "grid");
    this.inputEl.setAttribute("aria-expanded", "false");
    this.inputEl.setAttribute("aria-controls", this.panelEl.id);
    this.inputEl.setAttribute("autocomplete", "off");

    this.panelEl.classList.add("fs-datepicker-panel");
    this.panelEl.innerHTML =
      '<div class="fs-datepicker-header">' +
      '<button type="button" class="fs-datepicker-nav" data-fs-datepicker-prev aria-label="Mês anterior">‹</button>' +
      '<span class="fs-datepicker-title" aria-live="polite"></span>' +
      '<button type="button" class="fs-datepicker-nav" data-fs-datepicker-next aria-label="Próximo mês">›</button>' +
      "</div>" +
      '<div class="fs-datepicker-grid" role="grid"></div>';

    this.titleEl = this.panelEl.querySelector(".fs-datepicker-title");
    this.gridEl = this.panelEl.querySelector(".fs-datepicker-grid");
    this.prevBtn = this.panelEl.querySelector("[data-fs-datepicker-prev]");
    this.nextBtn = this.panelEl.querySelector("[data-fs-datepicker-next]");

    this._handleInputFocus = this._handleInputFocus.bind(this);
    this._handleInputKeydown = this._handleInputKeydown.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handlePrev = this._handlePrev.bind(this);
    this._handleNext = this._handleNext.bind(this);
    this._handleGridClick = this._handleGridClick.bind(this);
    this._handleGridKeydown = this._handleGridKeydown.bind(this);

    this.inputEl.addEventListener("focus", this._handleInputFocus);
    this.inputEl.addEventListener("keydown", this._handleInputKeydown);
    this.inputEl.addEventListener("change", this._handleInputChange);
    this.prevBtn.addEventListener("click", this._handlePrev);
    this.nextBtn.addEventListener("click", this._handleNext);
    this.gridEl.addEventListener("click", this._handleGridClick);
    this.gridEl.addEventListener("keydown", this._handleGridKeydown);

    this._removeEscapeListener = onEscapeKey(() => {
      if (this.isOpen) {
        this.hide();
        this._refocusInputWithoutReopening();
      }
    });

    instances.set(inputEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _handleInputFocus() {
    // Depois de selecionar uma data ou fechar com Escape, devolvemos o foco
    // pro input programaticamente — sem essa guarda, o próprio `.focus()`
    // disparia este handler de novo e reabriria o painel na hora.
    if (this._suppressNextFocus) {
      this._suppressNextFocus = false;
      return;
    }

    this.show();
  }

  _refocusInputWithoutReopening() {
    this._suppressNextFocus = true;
    this.inputEl.focus();
  }

  // O foco fica no input ao abrir (ver `_handleInputFocus`) — sem este
  // handler, `ArrowDown`/`ArrowUp` não teriam efeito nenhum, porque o
  // keydown do grid (`_handleGridKeydown`) só reage quando o foco real já
  // está num botão de dia. `ArrowDown` move o foco pro dia "tabável";
  // depois disso, o keydown do próprio grid assume a navegação.
  _handleInputKeydown(event) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    event.preventDefault();
    if (!this.isOpen) this.show();
    this._focusTabbable();
  }

  _handleInputChange() {
    const parsed = parseDisplay(this.inputEl.value);
    if (!parsed) return;

    this.selectedDate = parsed;
    this.viewDate = new Date(parsed);
    this.value = toISO(parsed);
    if (this.isOpen) this._render();
  }

  _handlePrev(event) {
    event.preventDefault();
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    this._render();
  }

  _handleNext(event) {
    event.preventDefault();
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this._render();
  }

  _handleGridClick(event) {
    const day = event.target.closest(".fs-datepicker-day:not(:disabled)");
    if (!day) return;

    this._selectDate(new Date(Number(day.dataset.year), Number(day.dataset.month), Number(day.dataset.day)));
  }

  _handleGridKeydown(event) {
    const current = event.target.closest(".fs-datepicker-day");
    if (!current) return;

    const currentDate = new Date(Number(current.dataset.year), Number(current.dataset.month), Number(current.dataset.day));
    let nextDate = null;

    switch (event.key) {
      case "ArrowRight":
        nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case "ArrowLeft":
        nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() - 1);
        break;
      case "ArrowDown":
        nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case "ArrowUp":
        nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() - 7);
        break;
      case "Home":
        nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() - nextDate.getDay());
        break;
      case "End":
        nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + (6 - nextDate.getDay()));
        break;
      case "PageUp":
        nextDate = event.shiftKey
          ? addMonthsClamped(currentDate, -12)
          : addMonthsClamped(currentDate, -1);
        break;
      case "PageDown":
        nextDate = event.shiftKey
          ? addMonthsClamped(currentDate, 12)
          : addMonthsClamped(currentDate, 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        this._selectDate(currentDate);
        return;
      default:
        return;
    }

    event.preventDefault();
    this._moveTo(nextDate);
  }

  _moveTo(date) {
    const sameMonth = date.getFullYear() === this.viewDate.getFullYear() && date.getMonth() === this.viewDate.getMonth();
    if (!sameMonth) this.viewDate = new Date(date.getFullYear(), date.getMonth(), 1);

    this._render(date);
    this._focusTabbable();
  }

  _selectDate(date) {
    this.selectedDate = date;
    this.viewDate = new Date(date);
    this.value = toISO(date);
    this.inputEl.value = toDisplay(date);

    this.hide();
    this._refocusInputWithoutReopening();

    this.inputEl.dispatchEvent(new Event("change", { bubbles: true }));
    this.inputEl.dispatchEvent(
      new CustomEvent("fs:datepicker:changed", { bubbles: true, detail: { value: this.value, date: new Date(date) } }),
    );
  }

  _focusTabbable() {
    this.gridEl.querySelector('.fs-datepicker-day[tabindex="0"]')?.focus();
  }

  _render(preferredDate) {
    this.titleEl.textContent = HEADER_FORMATTER.format(this.viewDate);

    const cells = buildMonthCells(this.viewDate);
    const today = new Date();
    const focusTarget = preferredDate ?? this.selectedDate ?? today;

    let tabbable = cells.find((cell) => !cell.outside && isSameDay(new Date(cell.year, cell.month, cell.day), focusTarget));
    if (!tabbable) tabbable = cells.find((cell) => !cell.outside) ?? cells[0];

    const weekdaysHtml = Array.from({ length: 7 }, (_, i) => {
      const base = new Date(2024, 0, 7 + i); // 2024-01-07 é um domingo — só uma referência pra formatar os rótulos.
      return `<div class="fs-datepicker-weekday" role="columnheader">${WEEKDAY_FORMATTER.format(base)}</div>`;
    }).join("");

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

    const weeksHtml = rows
      .map((row) => {
        const rowHtml = row
          .map((cell) => {
            const cellDate = new Date(cell.year, cell.month, cell.day);
            const isSelected = this.selectedDate ? isSameDay(cellDate, this.selectedDate) : false;
            const isToday = isSameDay(cellDate, today);
            const isTabbable = cell === tabbable;
            const classes = ["fs-datepicker-day"];
            if (cell.outside) classes.push("is-outside");
            if (isToday) classes.push("is-today");
            if (isSelected) classes.push("is-selected");

            return (
              `<button type="button" class="${classes.join(" ")}" role="gridcell" ` +
              `tabindex="${isTabbable ? "0" : "-1"}" aria-selected="${isSelected}" ` +
              `${isToday ? 'aria-current="date" ' : ""}` +
              `data-year="${cell.year}" data-month="${cell.month}" data-day="${cell.day}">${cell.day}</button>`
            );
          })
          .join("");

        return `<div class="fs-datepicker-week" role="row">${rowHtml}</div>`;
      })
      .join("");

    this.gridEl.innerHTML = `<div class="fs-datepicker-weekdays" role="row">${weekdaysHtml}</div>${weeksHtml}`;
  }

  show() {
    if (this.isOpen) return;
    this.isOpen = true;

    const themeRoot = this.inputEl.closest("[data-theme], [data-fs-theme]");
    const theme = themeRoot?.getAttribute("data-theme") ?? themeRoot?.getAttribute("data-fs-theme");
    if (theme) {
      this.panelEl.setAttribute("data-theme", theme);
    } else {
      this.panelEl.removeAttribute("data-theme");
    }

    this.panelEl.classList.add("is-open");

    const position = computePosition(this.inputEl, this.panelEl, {
      placement: this.placement,
      align: "start",
      offset: 4,
    });
    applyPosition(this.panelEl, position);
    this._positionCleanup = watchPosition(this.inputEl, this.panelEl, {
      placement: this.placement,
      align: "start",
      offset: 4,
    });

    this.inputEl.setAttribute("aria-expanded", "true");

    this._render(this.selectedDate ?? new Date());

    this._outsideClickCleanup = onClickOutside(this.panelEl, (event) => {
      if (this.inputEl.contains(event.target)) return;
      this.hide();
    });

    this.inputEl.dispatchEvent(new CustomEvent("fs:datepicker:shown", { bubbles: true }));
  }

  hide() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.panelEl.classList.remove("is-open");
    this.panelEl.style.removeProperty("position");
    this.panelEl.style.removeProperty("top");
    this.panelEl.style.removeProperty("left");
    this._positionCleanup?.();
    this._positionCleanup = null;
    this.inputEl.setAttribute("aria-expanded", "false");

    this._outsideClickCleanup?.();
    this._outsideClickCleanup = null;

    this.inputEl.dispatchEvent(new CustomEvent("fs:datepicker:hidden", { bubbles: true }));
  }

  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  dispose() {
    this.hide();
    this._removeEscapeListener();
    this.inputEl.removeEventListener("focus", this._handleInputFocus);
    this.inputEl.removeEventListener("keydown", this._handleInputKeydown);
    this.inputEl.removeEventListener("change", this._handleInputChange);
    this.prevBtn.removeEventListener("click", this._handlePrev);
    this.nextBtn.removeEventListener("click", this._handleNext);
    this.gridEl.removeEventListener("click", this._handleGridClick);
    this.gridEl.removeEventListener("keydown", this._handleGridKeydown);
    if (this._originalParent) {
      this._originalParent.insertBefore(this.panelEl, this._originalNextSibling);
    }
    instances.delete(this.inputEl);
  }
}

autoInit("datepicker", Datepicker);
