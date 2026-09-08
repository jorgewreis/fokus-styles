import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

// Badge dismissível / Tag: o único componente CSS-first desta leva que
// precisa de JS — só o suficiente pra remover o elemento do DOM ao clicar
// no .fs-btn-close, sem posicionamento/foco/overlay.
export class Tag {
  constructor(tagEl) {
    this.tagEl = tagEl;
    this._isLoading = tagEl.classList.contains("is-loading") || tagEl.getAttribute("aria-busy") === "true";

    this._handleClick = this._handleClick.bind(this);
    tagEl.addEventListener("click", this._handleClick);

    this.setLoading(this._isLoading);

    instances.set(tagEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _handleClick(event) {
    if (!this._isLoading && event.target.closest('[data-fs-dismiss="tag"]')) {
      this.dismiss();
    }
  }

  // Dispara um evento cancelável antes de remover (mesmo espírito de
  // fs:stepper:beforechange): preventDefault() bloqueia a remoção.
  dismiss() {
    if (this._isLoading) return false;

    const dismissButton = this.tagEl.querySelector('[data-fs-dismiss="tag"]');
    const shouldRestoreFocus = dismissButton && document.activeElement === dismissButton;
    const event = new CustomEvent("fs:tag:dismissed", { bubbles: true, cancelable: true });
    this.tagEl.dispatchEvent(event);
    if (event.defaultPrevented) return false;

    const focusTarget = shouldRestoreFocus ? this._getFocusTarget() : null;
    this.tagEl.remove();
    focusTarget?.focus();
    return true;
  }

  _getFocusTarget() {
    const group = this.tagEl.closest(".fs-tag-group");
    if (!group) return null;

    const buttons = [...group.querySelectorAll('[data-fs-dismiss="tag"]')]
      .filter((button) => !button.disabled && !button.hidden && button.getAttribute("aria-hidden") !== "true");
    const currentButton = this.tagEl.querySelector('[data-fs-dismiss="tag"]');
    const currentIndex = buttons.indexOf(currentButton);
    const remaining = buttons.filter((button) => button !== currentButton);

    return remaining[currentIndex] || remaining[currentIndex - 1] || null;
  }

  // Estado útil enquanto uma remoção ou atualização assíncrona está pendente.
  // Além da aparência, bloqueia o dismiss e comunica o estado a AT.
  setLoading(loading) {
    this._isLoading = Boolean(loading);
    this.tagEl.classList.toggle("is-loading", this._isLoading);
    if (this._isLoading) {
      this.tagEl.setAttribute("aria-busy", "true");
    } else {
      this.tagEl.removeAttribute("aria-busy");
    }

    const dismissButton = this.tagEl.querySelector('[data-fs-dismiss="tag"]');
    if (dismissButton) dismissButton.disabled = this._isLoading;

    return this;
  }

  dispose() {
    this.tagEl.removeEventListener("click", this._handleClick);
    instances.delete(this.tagEl);
  }
}

autoInit("tag", Tag);
