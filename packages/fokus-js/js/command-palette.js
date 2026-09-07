import { lockScroll, unlockScroll, onClickOutside } from "./core/overlay.js";
import { createFocusTrap, onEscapeKey } from "./core/focus.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

let idCounter = 0;

function uniqueId(prefix) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function parseShortcut(spec) {
  const parts = spec.toLowerCase().split("+").map((part) => part.trim());
  return {
    mod: parts.includes("mod"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt"),
    key: parts[parts.length - 1],
  };
}

function matchesShortcut(event, shortcut) {
  const modPressed = event.ctrlKey || event.metaKey;
  return (
    event.key.toLowerCase() === shortcut.key &&
    shortcut.mod === modPressed &&
    shortcut.shift === event.shiftKey &&
    shortcut.alt === event.altKey
  );
}

// Command Palette: combina o filtro/navegação do Combobox (`.fs-dropdown-item`
// reaproveitado da listbox) com o overlay/focus trap do Modal — mas é
// componente próprio (não estende nenhum dos dois) porque a combinação
// específica (diálogo sempre com listbox visível + atalho global) não
// corresponde a nenhum dos dois padrões isoladamente.
export class CommandPalette {
  constructor(triggerEl, options = {}) {
    const targetSelector = triggerEl.getAttribute("data-fs-target");
    const paletteEl = targetSelector ? document.querySelector(targetSelector) : null;

    if (!paletteEl) {
      throw new Error("FokusStyles.CommandPalette: painel não encontrado (data-fs-target).");
    }

    this.triggerEl = triggerEl;
    this.paletteEl = paletteEl;
    this.dialogEl = paletteEl.querySelector(".fs-command-palette-dialog") ?? paletteEl;
    this.inputEl = paletteEl.querySelector(".fs-command-palette-input");
    this.listEl = paletteEl.querySelector(".fs-command-palette-list");
    this.isOpen = false;
    this.activeIndex = -1;
    this._focusTrap = null;
    this._outsideClickCleanup = null;

    if (!this.listEl.id) this.listEl.id = uniqueId("fs-command-palette-listbox");

    paletteEl.setAttribute("role", "dialog");
    paletteEl.setAttribute("aria-modal", "true");

    this.inputEl.setAttribute("role", "combobox");
    this.inputEl.setAttribute("aria-expanded", "false");
    this.inputEl.setAttribute("aria-autocomplete", "list");
    this.inputEl.setAttribute("aria-controls", this.listEl.id);
    this.inputEl.setAttribute("autocomplete", "off");
    this.listEl.setAttribute("role", "listbox");

    this._getItems().forEach((item) => {
      if (!item.id) item.id = uniqueId("fs-command-palette-option");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", "false");
    });

    this._handleTriggerClick = this._handleTriggerClick.bind(this);
    this._handleInput = this._handleInput.bind(this);
    this._handleKeydown = this._handleKeydown.bind(this);
    this._handleItemMousedown = this._handleItemMousedown.bind(this);
    this._handleItemClick = this._handleItemClick.bind(this);
    this._handleGlobalShortcut = this._handleGlobalShortcut.bind(this);

    triggerEl.addEventListener("click", this._handleTriggerClick);
    this.inputEl.addEventListener("input", this._handleInput);
    this.inputEl.addEventListener("keydown", this._handleKeydown);
    this.listEl.addEventListener("mousedown", this._handleItemMousedown);
    this.listEl.addEventListener("click", this._handleItemClick);

    const shortcut = options.shortcut ?? triggerEl.getAttribute("data-fs-shortcut");
    this._shortcut = shortcut ? parseShortcut(shortcut) : null;
    if (this._shortcut) document.addEventListener("keydown", this._handleGlobalShortcut);

    this._removeEscapeListener = onEscapeKey(() => {
      if (this.isOpen) this.hide();
    });

    instances.set(triggerEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _getItems() {
    return Array.from(this.listEl.querySelectorAll(".fs-dropdown-item"));
  }

  _getSelectableItems() {
    return this._getItems().filter((item) => !item.hidden && !item.hasAttribute("data-fs-empty") && !item.classList.contains("is-disabled"));
  }

  _filter(query) {
    const normalized = query.trim().toLowerCase();

    this._getItems().forEach((item) => {
      if (item.hasAttribute("data-fs-empty")) return;
      item.hidden = normalized.length > 0 && !item.textContent.toLowerCase().includes(normalized);
    });

    const emptyEl = this.listEl.querySelector("[data-fs-empty]");
    if (emptyEl) emptyEl.hidden = this._getSelectableItems().length > 0;
  }

  _setActiveIndex(index) {
    const items = this._getSelectableItems();
    if (items.length === 0) {
      this.activeIndex = -1;
      this.inputEl.removeAttribute("aria-activedescendant");
      return;
    }

    const previous = items[this.activeIndex];
    previous?.classList.remove("is-active");

    this.activeIndex = ((index % items.length) + items.length) % items.length;
    const current = items[this.activeIndex];
    current.classList.add("is-active");
    current.scrollIntoView({ block: "nearest" });
    this.inputEl.setAttribute("aria-activedescendant", current.id);
  }

  _selectItem(item) {
    const label = item.textContent.trim();
    const value = item.getAttribute("data-value") ?? label;

    this.hide();

    this.triggerEl.dispatchEvent(
      new CustomEvent("fs:command-palette:selected", { bubbles: true, detail: { value, label } }),
    );
  }

  _handleTriggerClick(event) {
    event.preventDefault();
    this.toggle();
  }

  _handleInput() {
    this._filter(this.inputEl.value);
    this._setActiveIndex(0);
  }

  _handleKeydown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this._setActiveIndex(this.activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this._setActiveIndex(this.activeIndex - 1);
    } else if (event.key === "Enter") {
      if (this.activeIndex >= 0) {
        event.preventDefault();
        this._selectItem(this._getSelectableItems()[this.activeIndex]);
      }
    }
  }

  _handleItemMousedown(event) {
    if (event.target.closest(".fs-dropdown-item")) event.preventDefault();
  }

  _handleItemClick(event) {
    const item = event.target.closest(".fs-dropdown-item:not(.is-disabled)");
    if (!item || item.hasAttribute("data-fs-empty")) return;

    this._selectItem(item);
  }

  _handleGlobalShortcut(event) {
    if (!matchesShortcut(event, this._shortcut)) return;
    event.preventDefault();
    this.toggle();
  }

  show() {
    if (this.isOpen) return;
    this.isOpen = true;

    const theme = this.triggerEl.closest("[data-theme]")?.getAttribute("data-theme");
    if (theme) {
      this.paletteEl.setAttribute("data-theme", theme);
    } else {
      this.paletteEl.removeAttribute("data-theme");
    }

    this.paletteEl.classList.add("is-open");
    lockScroll();

    this.inputEl.value = "";
    this._filter("");
    this._setActiveIndex(0);
    this.inputEl.setAttribute("aria-expanded", "true");

    this._focusTrap = createFocusTrap(this.dialogEl);
    this._focusTrap.activate();

    this._outsideClickCleanup = onClickOutside(this.dialogEl, () => this.hide());

    this.triggerEl.dispatchEvent(new CustomEvent("fs:command-palette:shown", { bubbles: true }));
  }

  hide() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.paletteEl.classList.remove("is-open");
    unlockScroll();
    this.inputEl.setAttribute("aria-expanded", "false");

    this._focusTrap?.deactivate();
    this._focusTrap = null;

    this._outsideClickCleanup?.();
    this._outsideClickCleanup = null;

    this.triggerEl.focus();

    this.triggerEl.dispatchEvent(new CustomEvent("fs:command-palette:hidden", { bubbles: true }));
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
    this.triggerEl.removeEventListener("click", this._handleTriggerClick);
    this.inputEl.removeEventListener("input", this._handleInput);
    this.inputEl.removeEventListener("keydown", this._handleKeydown);
    this.listEl.removeEventListener("mousedown", this._handleItemMousedown);
    this.listEl.removeEventListener("click", this._handleItemClick);
    if (this._shortcut) document.removeEventListener("keydown", this._handleGlobalShortcut);
    instances.delete(this.triggerEl);
  }
}

autoInit("command-palette", CommandPalette);
