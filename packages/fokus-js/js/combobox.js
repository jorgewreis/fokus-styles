import { computePosition, applyPosition } from "./core/positioning.js";
import { onClickOutside } from "./core/overlay.js";
import { onEscapeKey } from "./core/focus.js";
import { applyThemeContext } from "./core/theme.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

let idCounter = 0;

function uniqueId(prefix) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export class Combobox {
  constructor(inputEl, options = {}) {
    const targetSelector = inputEl.getAttribute("data-fs-target");
    const listboxEl = targetSelector ? document.querySelector(targetSelector) : inputEl.nextElementSibling;

    if (!listboxEl) {
      throw new Error("FokusStyles.Combobox: listbox não encontrada (data-fs-target).");
    }

    this.inputEl = inputEl;
    this.listboxEl = listboxEl;
    this.placement = options.placement ?? inputEl.getAttribute("data-placement") ?? "bottom";
    this.isOpen = false;
    this.activeIndex = -1;
    this.value = null;
    this._outsideClickCleanup = null;

    if (!this.listboxEl.id) this.listboxEl.id = uniqueId("fs-combobox-listbox");

    document.body.appendChild(this.listboxEl);

    this.inputEl.setAttribute("role", "combobox");
    this.inputEl.setAttribute("aria-expanded", "false");
    this.inputEl.setAttribute("aria-autocomplete", "list");
    this.inputEl.setAttribute("aria-controls", this.listboxEl.id);
    this.inputEl.setAttribute("autocomplete", "off");
    this.listboxEl.setAttribute("role", "listbox");

    this._getOptions().forEach((option) => {
      if (!option.id) option.id = uniqueId("fs-combobox-option");
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");
    });

    this._handleInput = this._handleInput.bind(this);
    this._handleKeydown = this._handleKeydown.bind(this);
    this._handleOptionMousedown = this._handleOptionMousedown.bind(this);
    this._handleOptionClick = this._handleOptionClick.bind(this);

    this.inputEl.addEventListener("input", this._handleInput);
    this.inputEl.addEventListener("keydown", this._handleKeydown);
    this.listboxEl.addEventListener("mousedown", this._handleOptionMousedown);
    this.listboxEl.addEventListener("click", this._handleOptionClick);

    this._removeEscapeListener = onEscapeKey(() => {
      if (this.isOpen) this.hide();
    });

    instances.set(inputEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _getOptions() {
    return Array.from(this.listboxEl.querySelectorAll(".fs-dropdown-item"));
  }

  _getSelectableOptions() {
    return this._getOptions().filter(
      (option) => !option.hidden && !option.hasAttribute("data-fs-empty") && !option.classList.contains("is-disabled"),
    );
  }

  _filter(query) {
    const normalized = query.trim().toLowerCase();

    this._getOptions().forEach((option) => {
      if (option.hasAttribute("data-fs-empty")) return;
      option.hidden = normalized.length > 0 && !option.textContent.toLowerCase().includes(normalized);
    });

    const emptyEl = this.listboxEl.querySelector("[data-fs-empty]");
    if (emptyEl) emptyEl.hidden = this._getSelectableOptions().length > 0;
  }

  _setActiveIndex(index) {
    const options = this._getSelectableOptions();
    if (options.length === 0) {
      this.activeIndex = -1;
      this.inputEl.removeAttribute("aria-activedescendant");
      return;
    }

    const previous = options[this.activeIndex];
    previous?.classList.remove("is-active");

    this.activeIndex = ((index % options.length) + options.length) % options.length;
    const current = options[this.activeIndex];
    current.classList.add("is-active");
    current.scrollIntoView({ block: "nearest" });
    this.inputEl.setAttribute("aria-activedescendant", current.id);
  }

  _selectOption(option) {
    const label = option.textContent.trim();
    this.value = option.getAttribute("data-value") ?? label;
    this.inputEl.value = label;

    this._getOptions().forEach((item) => item.setAttribute("aria-selected", String(item === option)));

    this.hide();
    this.inputEl.focus();

    this.inputEl.dispatchEvent(new Event("change", { bubbles: true }));
    this.inputEl.dispatchEvent(
      new CustomEvent("fs:combobox:changed", { bubbles: true, detail: { value: this.value, label } }),
    );
  }

  _handleInput() {
    this._filter(this.inputEl.value);
    this.show();
    this._setActiveIndex(-1);
  }

  _handleKeydown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!this.isOpen) {
        this.show();
      } else {
        this._setActiveIndex(this.activeIndex + 1);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!this.isOpen) {
        this.show();
      } else {
        this._setActiveIndex(this.activeIndex - 1);
      }
    } else if (event.key === "Home" && this.isOpen) {
      event.preventDefault();
      this._setActiveIndex(0);
    } else if (event.key === "End" && this.isOpen) {
      event.preventDefault();
      this._setActiveIndex(this._getSelectableOptions().length - 1);
    } else if (event.key === "Enter") {
      if (this.isOpen && this.activeIndex >= 0) {
        event.preventDefault();
        this._selectOption(this._getSelectableOptions()[this.activeIndex]);
      }
    }
  }

  _handleOptionMousedown(event) {
    // Impede que o input perca foco antes do `click` do item ser processado
    // (perder foco fecharia a listbox via `onClickOutside` antes da seleção).
    if (event.target.closest(".fs-dropdown-item")) event.preventDefault();
  }

  _handleOptionClick(event) {
    const option = event.target.closest(".fs-dropdown-item:not(.is-disabled)");
    if (!option || option.hasAttribute("data-fs-empty")) return;

    this._selectOption(option);
  }

  show() {
    if (this.isOpen) return;
    this.isOpen = true;

    applyThemeContext(this.listboxEl, this.inputEl);

    this.listboxEl.classList.add("is-open");
    this.listboxEl.style.width = `${this.inputEl.offsetWidth}px`;

    const position = computePosition(this.inputEl, this.listboxEl, {
      placement: this.placement,
      align: "start",
      offset: 4,
    });
    applyPosition(this.listboxEl, position);

    this.inputEl.setAttribute("aria-expanded", "true");

    this._outsideClickCleanup = onClickOutside(this.listboxEl, (event) => {
      if (this.inputEl.contains(event.target)) return;
      this.hide();
    });

    this.inputEl.dispatchEvent(new CustomEvent("fs:combobox:shown", { bubbles: true }));
  }

  hide() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this._getSelectableOptions()[this.activeIndex]?.classList.remove("is-active");
    this.activeIndex = -1;
    this.inputEl.removeAttribute("aria-activedescendant");

    this.listboxEl.classList.remove("is-open");
    this.listboxEl.style.removeProperty("position");
    this.listboxEl.style.removeProperty("top");
    this.listboxEl.style.removeProperty("left");
    this.listboxEl.style.removeProperty("width");
    this.inputEl.setAttribute("aria-expanded", "false");

    this._outsideClickCleanup?.();
    this._outsideClickCleanup = null;

    this.inputEl.dispatchEvent(new CustomEvent("fs:combobox:hidden", { bubbles: true }));
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
    this.inputEl.removeEventListener("input", this._handleInput);
    this.inputEl.removeEventListener("keydown", this._handleKeydown);
    this.listboxEl.removeEventListener("mousedown", this._handleOptionMousedown);
    this.listboxEl.removeEventListener("click", this._handleOptionClick);
    instances.delete(this.inputEl);
  }
}

autoInit("combobox", Combobox);
