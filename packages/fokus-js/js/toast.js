import { cancelHeightTransition, collapse, expand } from "./core/transition.js";
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
    this._pauseReasons = new Set();
    this._remaining = this.delay;
    this._startedAt = 0;
    this._progressTimer = null;

    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");
    toastEl.style.display = "none";

    this._handleDismissClick = this._handleDismissClick.bind(this);
    this._pause = (event) => {
      if (!this.isOpen) return;
      this._pauseReasons.add(event.type === "mouseenter" ? "hover" : "focus");
      if (this._paused) return;
      this._paused = true;
      clearTimeout(this._hideTimer);
      if (this.autohide) {
        this._remaining = Math.max(0, this._remaining - (Date.now() - this._startedAt));
      }
      this._updateProgress();
      clearInterval(this._progressTimer);
      this.toastEl.classList.add("is-paused");
    };
    this._resume = (event) => {
      if (event.type === "focusout" && toastEl.contains(event.relatedTarget)) return;
      this._pauseReasons.delete(event.type === "mouseleave" ? "hover" : "focus");
      if (!this.isOpen || !this._paused || this._pauseReasons.size) return;
      this._paused = false;
      this.toastEl.classList.remove("is-paused");
      this._scheduleHide();
      this._startProgress();
    };
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
    this._remaining = this.delay;
    this._startedAt = Date.now();
    this.toastEl.style.setProperty("--fs-toast-duration", `${this.delay}ms`);

    const expansion = expand(this.toastEl);
    this.toastEl.classList.remove("is-progressing");
    void this.toastEl.offsetWidth;
    if (this.toastEl.getAttribute("data-toast-progress") === "true" && this.autohide) {
      this.toastEl.classList.add("is-progressing");
      this._startProgress();
    }

    expansion.then((completed) => {
      if (!completed) return;
      this.toastEl.dispatchEvent(new CustomEvent("fs:shown", { bubbles: true }));
      this.toastEl.dispatchEvent(new CustomEvent("fs:toast:shown", { bubbles: true }));
    });

    this._scheduleHide();
  }

  _scheduleHide() {
    clearTimeout(this._hideTimer);
    if (this.autohide && !this._paused) {
      this._startedAt = Date.now();
      this._hideTimer = setTimeout(() => this.hide(), this._remaining);
    }
  }

  _updateProgress() {
    if (this.toastEl.getAttribute("data-toast-progress") !== "true" || !this.autohide) return;
    const remaining = this._paused ? this._remaining : this._remaining - (Date.now() - this._startedAt);
    const percentage = Math.max(0, Math.min(100, (remaining / this.delay) * 100));
    const progressEl = this.toastEl.querySelector(".fs-toast-progress");
    if (progressEl) progressEl.style.inlineSize = `${percentage}%`;
  }

  _startProgress() {
    if (this.toastEl.getAttribute("data-toast-progress") !== "true" || !this.autohide) return;
    clearInterval(this._progressTimer);
    this._updateProgress();
    this._progressTimer = setInterval(() => {
      if (!this.isOpen || this._paused) return;
      this._updateProgress();
    }, 50);
  }

  hide() {
    if (!this.isOpen) return;
    this.toastEl.dispatchEvent(new CustomEvent("fs:hide", { bubbles: true }));
    this.isOpen = false;

    clearTimeout(this._hideTimer);
    this._hideTimer = null;
    clearInterval(this._progressTimer);
    this._progressTimer = null;
    this._startedAt = 0;
    this._pauseReasons.clear();
    this._paused = false;
    this._remaining = this.delay;
    this.toastEl.classList.remove("is-paused");
    this.toastEl.classList.remove("is-progressing");
    const progressEl = this.toastEl.querySelector(".fs-toast-progress");
    if (progressEl) progressEl.style.removeProperty("inline-size");

    collapse(this.toastEl).then((completed) => {
      if (!completed) return;
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
    cancelHeightTransition(this.toastEl);
    clearTimeout(this._hideTimer);
    clearInterval(this._progressTimer);
    this.toastEl.removeEventListener("click", this._handleDismissClick);
    this.toastEl.removeEventListener("mouseenter", this._pause);
    this.toastEl.removeEventListener("mouseleave", this._resume);
    this.toastEl.removeEventListener("focusin", this._pause);
    this.toastEl.removeEventListener("focusout", this._resume);
    instances.delete(this.toastEl);
  }
}

autoInit("toast", Toast);
