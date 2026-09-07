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
    this._paused = false;

    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");
    toastEl.style.display = "none";

    this._handleDismissClick = this._handleDismissClick.bind(this);
    this._pause = () => { this._paused = true; clearTimeout(this._hideTimer); };
    this._resume = () => { this._paused = false; if (this.isOpen && this.autohide) this._scheduleHide(); };
    toastEl.addEventListener("click", this._handleDismissClick);
    toastEl.addEventListener("mouseenter", this._pause);
    toastEl.addEventListener("mouseleave", this._resume);
    toastEl.addEventListener("focusin", this._pause);
    toastEl.addEventListener("focusout", this._resume);

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

    this._scheduleHide();
  }

  _scheduleHide() { clearTimeout(this._hideTimer); if (this.autohide && !this._paused) this._hideTimer = setTimeout(() => this.hide(), this.delay); }

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
    this.toastEl.removeEventListener("mouseenter", this._pause);
    this.toastEl.removeEventListener("mouseleave", this._resume);
    this.toastEl.removeEventListener("focusin", this._pause);
    this.toastEl.removeEventListener("focusout", this._resume);
    instances.delete(this.toastEl);
  }
}

autoInit("toast", Toast);
