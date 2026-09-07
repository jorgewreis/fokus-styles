import { computePosition, applyPosition, watchPosition } from "./core/positioning.js";
import { onEscapeKey } from "./core/focus.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();
let idCounter = 0;

export class Tooltip {
  constructor(referenceEl, options = {}) {
    const title = referenceEl.getAttribute("title") ?? referenceEl.getAttribute("data-title") ?? options.title;

    if (!title) {
      throw new Error("FokusStyles.Tooltip: elemento sem texto (atributo title/data-title).");
    }

    referenceEl.removeAttribute("title");

    idCounter += 1;

    this.referenceEl = referenceEl;
    this.title = title;
    this.placement = options.placement ?? referenceEl.getAttribute("data-placement") ?? "top";
    this.isOpen = false;
    this.id = `fokus-tooltip-${idCounter}`;
    this._positionCleanup = null;
    this._originalDescribedBy = referenceEl.getAttribute("aria-describedby");

    this.tooltipEl = document.createElement("div");
    this.tooltipEl.className = "fs-tooltip";
    this.tooltipEl.id = this.id;
    this.tooltipEl.setAttribute("role", "tooltip");
    this.tooltipEl.innerHTML = '<div class="fs-tooltip-arrow"></div><div class="fs-tooltip-inner"></div>';
    this.tooltipEl.querySelector(".fs-tooltip-inner").textContent = this.title;
    document.body.appendChild(this.tooltipEl);

    referenceEl.setAttribute("aria-describedby", this.id);

    this._handleShow = this.show.bind(this);
    this._handleHide = this.hide.bind(this);

    referenceEl.addEventListener("mouseenter", this._handleShow);
    referenceEl.addEventListener("mouseleave", this._handleHide);
    referenceEl.addEventListener("focus", this._handleShow);
    referenceEl.addEventListener("blur", this._handleHide);

    this._removeEscapeListener = onEscapeKey(() => {
      if (this.isOpen) this.hide();
    });

    instances.set(referenceEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  show() {
    if (this.isOpen) return;
    this.isOpen = true;

    const theme = this.referenceEl.closest("[data-theme]")?.getAttribute("data-theme");
    if (theme) {
      this.tooltipEl.setAttribute("data-theme", theme);
    } else {
      this.tooltipEl.removeAttribute("data-theme");
    }

    this.tooltipEl.classList.add("is-open");

    const position = computePosition(this.referenceEl, this.tooltipEl, { placement: this.placement, offset: 10 });
    applyPosition(this.tooltipEl, position);
    this._positionCleanup = watchPosition(this.referenceEl, this.tooltipEl, {
      placement: this.placement,
      offset: 10,
    });
    this.tooltipEl.setAttribute("data-placement", position.placement);

    this.referenceEl.dispatchEvent(new CustomEvent("fs:tooltip:shown", { bubbles: true }));
  }

  hide() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.tooltipEl.classList.remove("is-open");
    this._positionCleanup?.();
    this._positionCleanup = null;

    this.referenceEl.dispatchEvent(new CustomEvent("fs:tooltip:hidden", { bubbles: true }));
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
    this.referenceEl.removeEventListener("mouseenter", this._handleShow);
    this.referenceEl.removeEventListener("mouseleave", this._handleHide);
    this.referenceEl.removeEventListener("focus", this._handleShow);
    this.referenceEl.removeEventListener("blur", this._handleHide);
    this._removeEscapeListener();
    if (this._originalDescribedBy === null) this.referenceEl.removeAttribute("aria-describedby");
    else this.referenceEl.setAttribute("aria-describedby", this._originalDescribedBy);
    this.tooltipEl.remove();
    instances.delete(this.referenceEl);
  }
}

autoInit("tooltip", Tooltip);
