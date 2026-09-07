import { collapse, expand } from "./core/transition.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();
let idCounter = 0;

export class Accordion {
  constructor(accordionEl) {
    this.accordionEl = accordionEl;
    this.exclusive = accordionEl.getAttribute("data-multiple") !== "true" && accordionEl.getAttribute("data-fs-always-open") !== "true";
    this.alwaysOpen = accordionEl.getAttribute("data-fs-always-open") === "true";
    this.items = [];

    const buttons = Array.from(accordionEl.querySelectorAll(".fs-accordion-button"));

    buttons.forEach((button) => {
      const panel = button.closest(".fs-accordion-item").querySelector(".fs-accordion-collapse");

      idCounter += 1;
      if (!panel.id) panel.id = `fokus-accordion-panel-${idCounter}`;
      if (!button.id) button.id = `fokus-accordion-button-${idCounter}`;

      button.setAttribute("aria-controls", panel.id);
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", button.id);

      const startsOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(startsOpen));
      if (!startsOpen) {
        panel.style.display = "none";
      }
      panel.hidden = !startsOpen;

      const entry = { button, panel, handleClick: () => this._toggle(entry) };
      this.items.push(entry);
      button.addEventListener("click", entry.handleClick);
    });

    instances.set(accordionEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _toggle(entry) {
    const isOpen = entry.button.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      if (this.alwaysOpen) return;
      this._close(entry);
      return;
    }

    if (this.exclusive) {
      this.items
        .filter((other) => other !== entry && other.button.getAttribute("aria-expanded") === "true")
        .forEach((other) => this._close(other));
    }

    this._open(entry);
  }

  _open(entry) {
    entry.button.setAttribute("aria-expanded", "true");
    entry.panel.hidden = false;
    expand(entry.panel).then(() => {
      entry.button.dispatchEvent(new CustomEvent("fs:accordion:shown", { bubbles: true }));
    });
  }

  _close(entry) {
    entry.button.setAttribute("aria-expanded", "false");
    collapse(entry.panel).then(() => {
      entry.panel.hidden = true;
      entry.button.dispatchEvent(new CustomEvent("fs:accordion:hidden", { bubbles: true }));
    });
  }

  dispose() {
    this.items.forEach((entry) => entry.button.removeEventListener("click", entry.handleClick));
    instances.delete(this.accordionEl);
  }
}

autoInit("accordion", Accordion);
