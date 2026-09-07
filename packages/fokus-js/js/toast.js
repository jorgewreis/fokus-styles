import { collapse, expand } from "./core/transition.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

export class Toast {
  constructor(toastEl) {
    this.toastEl = toastEl;
    this.delay = Number(toastEl.getAttribute("data-delay")) || 4000;
    this.autohide = toastEl.getAttribute("data-autohide") !== "false";
    this.isOpen = false;
    this._hideTimer = null;

    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");
    toastEl.style.display = "none";

    this._handleDismissClick = this._handleDismissClick.bind(this);
    toastEl.addEventListener("click", this._handleDismissClick);

    instances.set(toastEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _handleDismissClick(event) {
    if (event.target.closest('[data-fs-dismiss="toast"]')) {
      this.hide();
    }
  }

  show() {
    if (this.isOpen) return;
    this.toastEl.dispatchEvent(new CustomEvent("fs:show", { bubbles: true }));
    this.isOpen = true;

    expand(this.toastEl).then(() => {
      this.toastEl.dispatchEvent(new CustomEvent("fs:shown", { bubbles: true }));
      this.toastEl.dispatchEvent(new CustomEvent("fs:toast:shown", { bubbles: true }));
    });

    if (this.autohide) {
      this._hideTimer = setTimeout(() => this.hide(), this.delay);
    }
  }

  hide() {
    if (!this.isOpen) return;
    this.toastEl.dispatchEvent(new CustomEvent("fs:hide", { bubbles: true }));
    this.isOpen = false;

    clearTimeout(this._hideTimer);
    this._hideTimer = null;

    collapse(this.toastEl).then(() => {
      this.toastEl.dispatchEvent(new CustomEvent("fs:hidden", { bubbles: true }));
      this.toastEl.dispatchEvent(new CustomEvent("fs:toast:hidden", { bubbles: true }));
    });
  }

  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  dispose() {
    clearTimeout(this._hideTimer);
    this.toastEl.removeEventListener("click", this._handleDismissClick);
    instances.delete(this.toastEl);
  }
}

autoInit("toast", Toast);
