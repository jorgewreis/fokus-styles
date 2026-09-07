import { lockScroll, unlockScroll, onClickOutside } from "./core/overlay.js";
import { createFocusTrap, onEscapeKey } from "./core/focus.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

export class Modal {
  constructor(triggerEl, options = {}) {
    const targetSelector = triggerEl.getAttribute("data-fs-target");
    const modalEl = targetSelector ? document.querySelector(targetSelector) : null;

    if (!modalEl) {
      throw new Error("FokusStyles.Modal: elemento do modal não encontrado (data-fs-target).");
    }

    this.triggerEl = triggerEl;
    this.modalEl = modalEl;
    this.dialogEl = modalEl.querySelector(".fs-modal-dialog") ?? modalEl;
    this.staticBackdrop = (options.backdrop ?? modalEl.getAttribute("data-backdrop")) === "static";
    this.isOpen = false;
    this._focusTrap = null;
    this._outsideClickCleanup = null;

    modalEl.setAttribute("role", "dialog");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.setAttribute("aria-hidden", "true");
    const titleEl = modalEl.querySelector(".fs-modal-title");
    if (titleEl) {
      if (!titleEl.id) titleEl.id = `fs-modal-title-${Math.random().toString(36).slice(2)}`;
      modalEl.setAttribute("aria-labelledby", titleEl.id);
    }

    this._handleTriggerClick = this._handleTriggerClick.bind(this);
    this._handleDismissClick = this._handleDismissClick.bind(this);

    triggerEl.addEventListener("click", this._handleTriggerClick);
    modalEl.addEventListener("click", this._handleDismissClick);

    this._removeEscapeListener = onEscapeKey(() => {
      if (this.isOpen && !this.staticBackdrop) this.hide();
    });

    instances.set(triggerEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  static getOrCreateInstance(el, options = {}) {
    return this.getInstance(el) ?? new Modal(el, options);
  }

  static show(el, options = {}) { return this.getOrCreateInstance(el, options).show(); }
  static hide(el) { return this.getInstance(el)?.hide(); }
  static toggle(el, options = {}) { return this.getOrCreateInstance(el, options).toggle(); }

  _handleTriggerClick(event) {
    event.preventDefault();
    this.show();
  }

  _handleDismissClick(event) {
    if (event.target.closest('[data-fs-dismiss="modal"]')) {
      this.hide();
    }
  }

  show() {
    if (this.isOpen) return;
    this.triggerEl.dispatchEvent(new CustomEvent("fs:show", { bubbles: true }));
    this.isOpen = true;

    this.modalEl.classList.add("is-open");
    this.modalEl.setAttribute("aria-hidden", "false");
    lockScroll();

    this._focusTrap = createFocusTrap(this.dialogEl);
    this._focusTrap.activate();

    if (!this.staticBackdrop) {
      this._outsideClickCleanup = onClickOutside(this.dialogEl, () => this.hide());
    }

    this.triggerEl.dispatchEvent(new CustomEvent("fs:shown", { bubbles: true }));
    this.triggerEl.dispatchEvent(new CustomEvent("fs:modal:shown", { bubbles: true }));
  }

  hide() {
    if (!this.isOpen) return;
    this.triggerEl.dispatchEvent(new CustomEvent("fs:hide", { bubbles: true }));
    this.isOpen = false;

    this.modalEl.classList.remove("is-open");
    this.modalEl.setAttribute("aria-hidden", "true");
    unlockScroll();

    this._focusTrap?.deactivate();
    this._focusTrap = null;

    this._outsideClickCleanup?.();
    this._outsideClickCleanup = null;

    this.triggerEl.focus();

    this.triggerEl.dispatchEvent(new CustomEvent("fs:hidden", { bubbles: true }));
    this.triggerEl.dispatchEvent(new CustomEvent("fs:modal:hidden", { bubbles: true }));
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
    this.modalEl.removeEventListener("click", this._handleDismissClick);
    instances.delete(this.triggerEl);
  }
}

autoInit("modal", Modal);
