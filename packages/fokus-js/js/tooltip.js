import { computePosition, applyPosition, watchPosition } from "./core/positioning.js";
import { onEscapeKey } from "./core/focus.js";
import { applyThemeContext } from "./core/theme.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();
let idCounter = 0;
let openInstance = null;
const DEFAULT_TOOLTIP_OFFSET = 8;

function toDelay(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function parsePlacement(value = "top") {
  const [placement, align = "center"] = value.split("-");
  return { placement, align: ["start", "center", "end"].includes(align) ? align : "center" };
}

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
    const parsedPlacement = parsePlacement(options.placement ?? referenceEl.getAttribute("data-placement") ?? "top");
    this.placement = parsedPlacement.placement;
    this.align = options.align ?? referenceEl.getAttribute("data-align") ?? parsedPlacement.align;
    this.offset = toDelay(options.offset ?? referenceEl.getAttribute("data-offset"), DEFAULT_TOOLTIP_OFFSET);
    this.showDelay = toDelay(options.showDelay ?? referenceEl.getAttribute("data-show-delay"), 0);
    this.hideDelay = toDelay(options.hideDelay ?? referenceEl.getAttribute("data-hide-delay"));
    this.isOpen = false;
    this.id = `fokus-tooltip-${idCounter}`;
    this._positionCleanup = null;
    this._showTimer = null;
    this._hideTimer = null;
    this._touchOpened = false;
    this._originalDescribedBy = referenceEl.getAttribute("aria-describedby");

    this.tooltipEl = document.createElement("div");
    this.tooltipEl.className = "fs-tooltip";
    this.tooltipEl.id = this.id;
    this.tooltipEl.setAttribute("role", "tooltip");
    this.tooltipEl.innerHTML = '<div class="fs-tooltip-arrow"></div><div class="fs-tooltip-inner"></div>';
    this.tooltipEl.querySelector(".fs-tooltip-inner").textContent = this.title;
    document.body.appendChild(this.tooltipEl);

    this._addDescribedBy();

    this._handleShow = () => this._scheduleShow(true);
    this._handleHide = () => this._scheduleHide();

    this._handlePointerEnter = () => this._scheduleShow();
    this._handlePointerLeave = () => this._scheduleHide();
    this._handlePointerDown = (event) => {
      if (event.pointerType === "touch") {
        if (this._touchOpened && this.isOpen) {
          this.hideImmediate();
          return;
        }
        this._touchOpened = true;
        this._scheduleShow(true);
      }
    };
    referenceEl.addEventListener("pointerenter", this._handlePointerEnter);
    referenceEl.addEventListener("pointerleave", this._handlePointerLeave);
    referenceEl.addEventListener("pointerdown", this._handlePointerDown);
    referenceEl.addEventListener("mouseenter", this._handlePointerEnter);
    referenceEl.addEventListener("mouseleave", this._handlePointerLeave);
    referenceEl.addEventListener("focus", this._handleShow);
    referenceEl.addEventListener("blur", this._handleHide);

    this._handleDocumentPointerDown = (event) => {
      if (this._touchOpened && !this.referenceEl.contains(event.target) && !this.tooltipEl.contains(event.target)) this.hide();
    };
    document.addEventListener("pointerdown", this._handleDocumentPointerDown, true);

    this._removeEscapeListener = onEscapeKey(() => {
      if (this.isOpen) this.hide();
    });

    instances.set(referenceEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _clearTimers() {
    clearTimeout(this._showTimer);
    clearTimeout(this._hideTimer);
    this._showTimer = null;
    this._hideTimer = null;
  }

  _addDescribedBy() {
    const ids = new Set((this.referenceEl.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean));
    ids.add(this.id);
    this.referenceEl.setAttribute("aria-describedby", [...ids].join(" "));
  }

  _scheduleShow(immediate = false) {
    this._clearTimers();
    if (this.isOpen) return;
    const delay = immediate ? 0 : this.showDelay;
    if (delay === 0) {
      this.show();
      return;
    }
    this._showTimer = setTimeout(() => this.show(), delay);
  }

  _scheduleHide(immediate = false) {
    this._clearTimers();
    if (!this.isOpen) return;
    const delay = immediate ? 0 : this.hideDelay;
    if (delay === 0) {
      this.hide();
      return;
    }
    this._hideTimer = setTimeout(() => this.hide(), delay);
  }

  show() {
    this._clearTimers();
    if (this.isOpen) return;
    if (openInstance && openInstance !== this) openInstance.hide(true);
    openInstance = this;
    this.isOpen = true;

    applyThemeContext(this.tooltipEl, this.referenceEl);

    this.tooltipEl.classList.add("is-open");

    const position = computePosition(this.referenceEl, this.tooltipEl, { placement: this.placement, align: this.align, offset: this.offset });
    applyPosition(this.tooltipEl, position);
    this._positionCleanup = watchPosition(this.referenceEl, this.tooltipEl, {
      placement: this.placement,
      align: this.align,
      offset: this.offset,
    });
    this.tooltipEl.setAttribute("data-placement", position.placement);
    this.tooltipEl.setAttribute("data-align", this.align);

    this.referenceEl.dispatchEvent(new CustomEvent("fs:tooltip:shown", { bubbles: true }));
  }

  hide() {
    this.hideImmediate();
  }

  hideImmediate() {
    this._clearTimers();
    if (!this.isOpen) return;
    this.isOpen = false;
    this._touchOpened = false;

    this.tooltipEl.classList.remove("is-open");
    this._positionCleanup?.();
    this._positionCleanup = null;

    this.referenceEl.dispatchEvent(new CustomEvent("fs:tooltip:hidden", { bubbles: true }));
    if (openInstance === this) openInstance = null;
  }

  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  dispose() {
    this.hideImmediate();
    this._clearTimers();
    this.referenceEl.removeEventListener("pointerenter", this._handlePointerEnter);
    this.referenceEl.removeEventListener("pointerleave", this._handlePointerLeave);
    this.referenceEl.removeEventListener("pointerdown", this._handlePointerDown);
    this.referenceEl.removeEventListener("mouseenter", this._handlePointerEnter);
    this.referenceEl.removeEventListener("mouseleave", this._handlePointerLeave);
    this.referenceEl.removeEventListener("focus", this._handleShow);
    this.referenceEl.removeEventListener("blur", this._handleHide);
    document.removeEventListener("pointerdown", this._handleDocumentPointerDown, true);
    this._removeEscapeListener();
    if (this._originalDescribedBy === null) this.referenceEl.removeAttribute("aria-describedby");
    else this.referenceEl.setAttribute("aria-describedby", this._originalDescribedBy);
    this.tooltipEl.remove();
    instances.delete(this.referenceEl);
  }
}

autoInit("tooltip", Tooltip);
