import { computePosition, applyPosition, watchPosition } from "./core/positioning.js";
import { onClickOutside } from "./core/overlay.js";
import { onEscapeKey } from "./core/focus.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();
let idCounter = 0;
const HOVER_HIDE_DELAY = 100;

export class Popover {
  constructor(triggerEl, options = {}) {
    const targetSelector = triggerEl.getAttribute("data-fs-target");
    const popoverEl = targetSelector ? document.querySelector(targetSelector) : null;

    if (!popoverEl) {
      throw new Error("FokusStyles.Popover: elemento não encontrado (data-fs-target).");
    }

    this.triggerEl = triggerEl;
    this.popoverEl = popoverEl;
    this.placement = options.placement ?? triggerEl.getAttribute("data-placement") ?? "top";
    this.align = options.align ?? triggerEl.getAttribute("data-align") ?? "center";
    this.trigger = options.trigger ?? triggerEl.getAttribute("data-trigger") ?? "click";
    this.isOpen = false;
    this._outsideClickCleanup = null;
    this._removeEscapeListener = null;
    this._hideTimer = null;
    this._positionCleanup = null;
    this._originalParent = popoverEl.parentNode;
    this._originalNextSibling = popoverEl.nextSibling;

    document.body.appendChild(popoverEl);

    popoverEl.setAttribute("role", "dialog");
    popoverEl.setAttribute("aria-modal", "false");

    idCounter += 1;
    if (!popoverEl.id) popoverEl.id = `fokus-popover-${idCounter}`;

    const headerEl = popoverEl.querySelector(".fs-popover-header");
    if (headerEl) {
      if (!headerEl.id) headerEl.id = `fokus-popover-header-${idCounter}`;
      popoverEl.setAttribute("aria-labelledby", headerEl.id);
    }

    triggerEl.setAttribute("aria-controls", popoverEl.id);
    triggerEl.setAttribute("aria-expanded", "false");

    this._handleDismissClick = this._handleDismissClick.bind(this);
    popoverEl.addEventListener("click", this._handleDismissClick);

    this._bindTrigger();

    instances.set(triggerEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _bindTrigger() {
    if (this.trigger === "manual") return;

    if (this.trigger === "click") {
      this._handleTriggerClick = (event) => {
        event.preventDefault();
        this.toggle();
      };
      this.triggerEl.addEventListener("click", this._handleTriggerClick);
    } else if (this.trigger === "hover") {
      this._handleMouseEnter = () => {
        clearTimeout(this._hideTimer);
        this.show();
      };
      this._handleMouseLeave = () => {
        this._hideTimer = setTimeout(() => this.hide(), HOVER_HIDE_DELAY);
      };
      this.triggerEl.addEventListener("mouseenter", this._handleMouseEnter);
      this.triggerEl.addEventListener("mouseleave", this._handleMouseLeave);
      this.popoverEl.addEventListener("mouseenter", this._handleMouseEnter);
      this.popoverEl.addEventListener("mouseleave", this._handleMouseLeave);
    } else if (this.trigger === "focus") {
      this._handleTriggerFocus = () => this.show();
      this._handleTriggerFocusOut = (event) => {
        if (this.popoverEl.contains(event.relatedTarget)) return;
        this.hide();
      };
      this._handlePopoverFocusOut = (event) => {
        if (this.triggerEl.contains(event.relatedTarget) || this.popoverEl.contains(event.relatedTarget)) return;
        this.hide();
      };
      this.triggerEl.addEventListener("focus", this._handleTriggerFocus);
      this.triggerEl.addEventListener("focusout", this._handleTriggerFocusOut);
      this.popoverEl.addEventListener("focusout", this._handlePopoverFocusOut);
    }

    if (this.trigger !== "manual") {
      this._removeEscapeListener = onEscapeKey(() => {
        if (!this.isOpen) return;
        this.hide();
        this.triggerEl.focus();
      });
    }
  }

  _handleDismissClick(event) {
    if (event.target.closest('[data-fs-dismiss="popover"]')) {
      this.hide();
    }
  }

  show() {
    if (this.isOpen) return;
    this.isOpen = true;

    const theme = this.triggerEl.closest("[data-theme]")?.getAttribute("data-theme");
    if (theme) {
      this.popoverEl.setAttribute("data-theme", theme);
    } else {
      this.popoverEl.removeAttribute("data-theme");
    }

    this.popoverEl.classList.add("is-open");

    const position = computePosition(this.triggerEl, this.popoverEl, {
      placement: this.placement,
      align: this.align,
      offset: 10,
    });
    applyPosition(this.popoverEl, position);
    this._positionCleanup = watchPosition(this.triggerEl, this.popoverEl, {
      placement: this.placement,
      align: this.align,
      offset: 10,
    });
    this.popoverEl.setAttribute("data-placement", position.placement);

    this.triggerEl.setAttribute("aria-expanded", "true");

    if (this.trigger === "click") {
      this._outsideClickCleanup = onClickOutside(this.popoverEl, (event) => {
        if (this.triggerEl.contains(event.target)) return;
        this.hide();
      });
    }

    this.triggerEl.dispatchEvent(new CustomEvent("fs:popover:shown", { bubbles: true }));
  }

  hide() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.popoverEl.classList.remove("is-open");
    this._positionCleanup?.();
    this._positionCleanup = null;
    this.triggerEl.setAttribute("aria-expanded", "false");

    this._outsideClickCleanup?.();
    this._outsideClickCleanup = null;

    this.triggerEl.dispatchEvent(new CustomEvent("fs:popover:hidden", { bubbles: true }));
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
    clearTimeout(this._hideTimer);
    this._removeEscapeListener?.();
    this.popoverEl.removeEventListener("click", this._handleDismissClick);
    this.triggerEl.removeEventListener("click", this._handleTriggerClick);
    this.triggerEl.removeEventListener("mouseenter", this._handleMouseEnter);
    this.triggerEl.removeEventListener("mouseleave", this._handleMouseLeave);
    this.popoverEl.removeEventListener("mouseenter", this._handleMouseEnter);
    this.popoverEl.removeEventListener("mouseleave", this._handleMouseLeave);
    this.triggerEl.removeEventListener("focus", this._handleTriggerFocus);
    this.triggerEl.removeEventListener("focusout", this._handleTriggerFocusOut);
    this.popoverEl.removeEventListener("focusout", this._handlePopoverFocusOut);
    if (this._originalParent) {
      this._originalParent.insertBefore(this.popoverEl, this._originalNextSibling);
    }
    instances.delete(this.triggerEl);
  }
}

autoInit("popover", Popover);
