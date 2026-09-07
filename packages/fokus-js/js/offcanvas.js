import { lockScroll, unlockScroll, onClickOutside } from "./core/overlay.js";
import { createFocusTrap, onEscapeKey } from "./core/focus.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

export class Offcanvas {
  constructor(triggerEl, options = {}) {
    const targetSelector = triggerEl.getAttribute("data-fs-target");
    const offcanvasEl = targetSelector ? document.querySelector(targetSelector) : null;

    if (!offcanvasEl) {
      throw new Error("FokusStyles.Offcanvas: elemento não encontrado (data-fs-target).");
    }

    this.triggerEl = triggerEl;
    this.offcanvasEl = offcanvasEl;
    this.hasBackdrop = (options.backdrop ?? offcanvasEl.getAttribute("data-backdrop")) !== "false";
    this.staticBackdrop = (options.backdrop ?? offcanvasEl.getAttribute("data-backdrop")) === "static";
    this.isOpen = false;
    this._focusTrap = null;
    this._outsideClickCleanup = null;
    this._backdropEl = null;

    offcanvasEl.setAttribute("role", "dialog");
    offcanvasEl.setAttribute("aria-modal", "true");
    offcanvasEl.setAttribute("aria-hidden", "true");
    const titleEl = offcanvasEl.querySelector(".fs-offcanvas-title");
    if (titleEl) {
      if (!titleEl.id) titleEl.id = `fs-offcanvas-title-${Math.random().toString(36).slice(2)}`;
      offcanvasEl.setAttribute("aria-labelledby", titleEl.id);
    }

    this._handleTriggerClick = this._handleTriggerClick.bind(this);
    this._handleDismissClick = this._handleDismissClick.bind(this);

    triggerEl.addEventListener("click", this._handleTriggerClick);
    offcanvasEl.addEventListener("click", this._handleDismissClick);

    this._removeEscapeListener = onEscapeKey(() => {
      if (this.isOpen && !this.staticBackdrop) this.hide();
    });

    instances.set(triggerEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _handleTriggerClick(event) {
    event.preventDefault();
    this.show();
  }

  _handleDismissClick(event) {
    if (event.target.closest('[data-fs-dismiss="offcanvas"]')) {
      this.hide();
    }
  }

  show() {
    if (this.isOpen) return;
    this.isOpen = true;

    if (this.hasBackdrop) {
      this._backdropEl = document.createElement("div");
      this._backdropEl.className = "fs-offcanvas-backdrop";
      document.body.appendChild(this._backdropEl);
      // Força reflow antes de adicionar `.is-open` para a transição de opacidade
      // rodar (elemento recém-criado começa sem a classe).
      void this._backdropEl.offsetHeight;
      this._backdropEl.classList.add("is-open");
    }

    this.offcanvasEl.classList.add("is-open");
    this.offcanvasEl.setAttribute("aria-hidden", "false");
    lockScroll();

    this._focusTrap = createFocusTrap(this.offcanvasEl);
    // `visibility: hidden` mantém `offsetParent` não nulo (diferente de
    // `display: none`), então o elemento só fica de fato focável depois que o
    // navegador processa a transição de `visibility` para "visible" — em
    // Chromium isso só é garantido após um ciclo completo de paint, daí o
    // duplo requestAnimationFrame antes de mover o foco.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (this.isOpen) this._focusTrap.activate();
      });
    });

    if (!this.staticBackdrop) {
      this._outsideClickCleanup = onClickOutside(this.offcanvasEl, (event) => {
        if (this.triggerEl.contains(event.target)) return;
        this.hide();
      });
    }

    this.triggerEl.dispatchEvent(new CustomEvent("fs:offcanvas:shown", { bubbles: true }));
  }

  hide() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.offcanvasEl.classList.remove("is-open");
    this.offcanvasEl.setAttribute("aria-hidden", "true");
    unlockScroll();

    this._backdropEl?.remove();
    this._backdropEl = null;

    this._focusTrap?.deactivate();
    this._focusTrap = null;

    this._outsideClickCleanup?.();
    this._outsideClickCleanup = null;

    this.triggerEl.focus();

    this.triggerEl.dispatchEvent(new CustomEvent("fs:offcanvas:hidden", { bubbles: true }));
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
    this.offcanvasEl.removeEventListener("click", this._handleDismissClick);
    instances.delete(this.triggerEl);
  }
}

autoInit("offcanvas", Offcanvas);
