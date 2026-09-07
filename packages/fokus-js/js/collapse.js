import { collapse, expand } from "./core/transition.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();
let idCounter = 0;

export class Collapse {
  constructor(triggerEl) {
    const targetSelector = triggerEl.getAttribute("data-fs-target");
    const collapseEl = targetSelector ? document.querySelector(targetSelector) : null;

    if (!collapseEl) {
      throw new Error("FokusStyles.Collapse: elemento não encontrado (data-fs-target).");
    }

    this.triggerEl = triggerEl;
    this.collapseEl = collapseEl;
    this.isOpen = triggerEl.getAttribute("aria-expanded") === "true";

    idCounter += 1;
    if (!collapseEl.id) collapseEl.id = `fokus-collapse-${idCounter}`;
    triggerEl.setAttribute("aria-controls", collapseEl.id);
    triggerEl.setAttribute("aria-expanded", String(this.isOpen));

    if (!this.isOpen) {
      collapseEl.style.display = "none";
    }

    this._handleClick = () => this.toggle();
    triggerEl.addEventListener("click", this._handleClick);

    instances.set(triggerEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  show() {
    if (this.isOpen) return;
    this.isOpen = true;

    this.triggerEl.setAttribute("aria-expanded", "true");
    expand(this.collapseEl).then(() => {
      this.triggerEl.dispatchEvent(new CustomEvent("fs:collapse:shown", { bubbles: true }));
    });
  }

  hide() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.triggerEl.setAttribute("aria-expanded", "false");
    collapse(this.collapseEl).then(() => {
      this.triggerEl.dispatchEvent(new CustomEvent("fs:collapse:hidden", { bubbles: true }));
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
    this.triggerEl.removeEventListener("click", this._handleClick);
    instances.delete(this.triggerEl);
  }
}

autoInit("collapse", Collapse);
