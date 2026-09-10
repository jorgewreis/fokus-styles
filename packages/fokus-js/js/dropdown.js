import { computePosition, applyPosition, watchPosition } from "./core/positioning.js";
import { onClickOutside } from "./core/overlay.js";
import { onEscapeKey } from "./core/focus.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

export class Dropdown {
  constructor(toggleEl, options = {}) {
    const targetSelector = toggleEl.getAttribute("data-fs-target");
    const menuEl = targetSelector ? document.querySelector(targetSelector) : toggleEl.nextElementSibling;

    if (!menuEl) {
      throw new Error("FokusStyles.Dropdown: elemento do menu não encontrado (data-fs-target).");
    }

    this.toggleEl = toggleEl;
    this.menuEl = menuEl;
    this.placement = options.placement ?? toggleEl.getAttribute("data-placement") ?? "bottom";
    this.align = options.align ?? toggleEl.getAttribute("data-align") ?? "start";
    this.isOpen = false;
    this._outsideClickCleanup = null;
    this._positionCleanup = null;
    this._originalParent = this.menuEl.parentNode;
    this._originalNextSibling = this.menuEl.nextSibling;

    document.body.appendChild(this.menuEl);

    if (!this.toggleEl.id) this.toggleEl.id = `fs-dropdown-toggle-${Math.random().toString(36).slice(2)}`;
    this.toggleEl.setAttribute("aria-haspopup", "menu");
    this.toggleEl.setAttribute("aria-expanded", "false");
    this.toggleEl.setAttribute("aria-controls", this.menuEl.id || `fs-dropdown-${Math.random().toString(36).slice(2)}`);
    if (!this.menuEl.id) this.menuEl.id = this.toggleEl.getAttribute("aria-controls");
    if (!this.menuEl.hasAttribute("role")) this.menuEl.setAttribute("role", "menu");
    this.menuEl.setAttribute("aria-orientation", "vertical");
    this.menuEl.setAttribute("aria-labelledby", this.toggleEl.id || this.toggleEl.getAttribute("aria-controls"));
    this.menuEl.querySelectorAll(".fs-dropdown-item").forEach((item) => {
      if (!item.hasAttribute("role")) item.setAttribute("role", "menuitem");
      if (this._isDisabled(item)) item.setAttribute("aria-disabled", "true");
    });
    this.menuEl.querySelectorAll(".fs-dropdown-divider").forEach((divider) => divider.setAttribute("role", "separator"));
    this.menuEl.querySelectorAll(".fs-dropdown-header").forEach((header) => header.setAttribute("role", "presentation"));

    this._handleToggleClick = this._handleToggleClick.bind(this);
    this._handleToggleKeydown = this._handleToggleKeydown.bind(this);
    this._handleMenuKeydown = this._handleMenuKeydown.bind(this);
    this._handleMenuClick = this._handleMenuClick.bind(this);

    this.toggleEl.addEventListener("click", this._handleToggleClick);
    this.toggleEl.addEventListener("keydown", this._handleToggleKeydown);
    this.menuEl.addEventListener("keydown", this._handleMenuKeydown);
    this.menuEl.addEventListener("click", this._handleMenuClick);

    this._removeEscapeListener = onEscapeKey(() => {
      if (this.isOpen) {
        this.hide();
        this.toggleEl.focus();
      }
    });

    instances.set(toggleEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  static getOrCreateInstance(el, options = {}) { return this.getInstance(el) ?? new Dropdown(el, options); }
  static show(el, options = {}) { return this.getOrCreateInstance(el, options).show(); }
  static hide(el) { return this.getInstance(el)?.hide(); }
  static toggle(el, options = {}) { return this.getOrCreateInstance(el, options).toggle(); }

  _handleToggleClick(event) {
    event.preventDefault();
    this.toggle();
  }

  _handleToggleKeydown(event) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    event.preventDefault();
    if (!this.isOpen) this.show();

    const items = this._items();
    (event.key === "ArrowUp" ? items.at(-1) : items[0])?.focus();
  }

  _handleMenuClick(event) {
    if (event.target.closest(".fs-dropdown-item, [data-fs-dropdown-dismiss]")) {
      this.hide();
      this.toggleEl.focus();
    }
  }

  _handleMenuKeydown(event) {
    const items = this._items();
    const currentIndex = items.indexOf(document.activeElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      this.hide();
      this.toggleEl.focus();
    }
  }

  show() {
    if (this.isOpen) return;
    this.isOpen = true;

    const themeRoot = this.toggleEl.closest("[data-theme], [data-fs-theme]");
    const theme = themeRoot?.getAttribute("data-theme") ?? themeRoot?.getAttribute("data-fs-theme");
    if (theme) {
      this.menuEl.setAttribute("data-theme", theme);
    } else {
      this.menuEl.removeAttribute("data-theme");
    }

    this.menuEl.classList.add("is-open");

    const position = computePosition(this.toggleEl, this.menuEl, {
      placement: this.placement,
      align: this.align,
      offset: 4,
    });
    applyPosition(this.menuEl, position);
    this.menuEl.dataset.placement = position.placement;
    this.menuEl.dataset.align = this.align;
    this._positionCleanup = watchPosition(this.toggleEl, this.menuEl, {
      placement: this.placement,
      align: this.align,
      offset: 4,
    });

    this.toggleEl.setAttribute("aria-expanded", "true");

    const firstItem = this._items()[0];
    firstItem?.focus();

    this._outsideClickCleanup = onClickOutside(this.menuEl, (event) => {
      if (this.toggleEl.contains(event.target)) return;
      this.hide();
    });

    this.toggleEl.dispatchEvent(new CustomEvent("fs:shown", { bubbles: true }));
    this.toggleEl.dispatchEvent(new CustomEvent("fs:dropdown:shown", { bubbles: true }));
  }

  hide() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.menuEl.classList.remove("is-open");
    this.menuEl.style.removeProperty("position");
    this.menuEl.style.removeProperty("top");
    this.menuEl.style.removeProperty("left");
    delete this.menuEl.dataset.placement;
    delete this.menuEl.dataset.align;
    this.toggleEl.setAttribute("aria-expanded", "false");

    this._outsideClickCleanup?.();
    this._outsideClickCleanup = null;
    this._positionCleanup?.();
    this._positionCleanup = null;

    this.toggleEl.dispatchEvent(new CustomEvent("fs:hidden", { bubbles: true }));
    this.toggleEl.dispatchEvent(new CustomEvent("fs:dropdown:hidden", { bubbles: true }));
  }

  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  _isDisabled(item) {
    return item.classList.contains("is-disabled") || item.disabled || item.getAttribute("aria-disabled") === "true";
  }

  _items() {
    return Array.from(this.menuEl.querySelectorAll(".fs-dropdown-item")).filter((item) => !this._isDisabled(item));
  }

  dispose() {
    this.hide();
    this._removeEscapeListener();
    this.toggleEl.removeEventListener("click", this._handleToggleClick);
    this.toggleEl.removeEventListener("keydown", this._handleToggleKeydown);
    this.menuEl.removeEventListener("keydown", this._handleMenuKeydown);
    this.menuEl.removeEventListener("click", this._handleMenuClick);
    if (this._originalParent) {
      this._originalParent.insertBefore(this.menuEl, this._originalNextSibling);
    }
    instances.delete(this.toggleEl);
  }
}

autoInit("dropdown", Dropdown);
