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

    this.toggleEl.setAttribute("aria-haspopup", "menu");
    this.toggleEl.setAttribute("aria-expanded", "false");
    this.toggleEl.setAttribute("aria-controls", this.menuEl.id || `fs-dropdown-${Math.random().toString(36).slice(2)}`);
    if (!this.menuEl.id) this.menuEl.id = this.toggleEl.getAttribute("aria-controls");
    this.menuEl.setAttribute("role", "menu");
    this.menuEl.querySelectorAll(".fs-dropdown-item").forEach((item) => {
      if (!item.hasAttribute("role")) item.setAttribute("role", "menuitem");
    });

    this._handleToggleClick = this._handleToggleClick.bind(this);
    this._handleMenuKeydown = this._handleMenuKeydown.bind(this);
    this._handleMenuClick = this._handleMenuClick.bind(this);

    this.toggleEl.addEventListener("click", this._handleToggleClick);
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

  _handleMenuClick(event) {
    if (event.target.closest(".fs-dropdown-item")) {
      this.hide();
      this.toggleEl.focus();
    }
  }

  _handleMenuKeydown(event) {
    const items = Array.from(this.menuEl.querySelectorAll(".fs-dropdown-item:not(.is-disabled)"));
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

    const theme = this.toggleEl.closest("[data-theme]")?.getAttribute("data-theme");
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
    this._positionCleanup = watchPosition(this.toggleEl, this.menuEl, {
      placement: this.placement,
      align: this.align,
      offset: 4,
    });

    this.toggleEl.setAttribute("aria-expanded", "true");

    const firstItem = this.menuEl.querySelector(".fs-dropdown-item:not(.is-disabled)");
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

  dispose() {
    this.hide();
    this._removeEscapeListener();
    this.toggleEl.removeEventListener("click", this._handleToggleClick);
    this.menuEl.removeEventListener("keydown", this._handleMenuKeydown);
    this.menuEl.removeEventListener("click", this._handleMenuClick);
    if (this._originalParent) {
      this._originalParent.insertBefore(this.menuEl, this._originalNextSibling);
    }
    instances.delete(this.toggleEl);
  }
}

autoInit("dropdown", Dropdown);
