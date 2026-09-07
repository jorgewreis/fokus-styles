import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();
export class Spinner {
  constructor(element) {
    this.element = element;
    this._setLoading(element.hasAttribute("data-fs-loading") && element.getAttribute("data-fs-loading") !== "false");
    instances.set(element, this);
  }
  static getInstance(el) { return instances.get(el); }
  static getOrCreateInstance(el) { return this.getInstance(el) ?? new Spinner(el); }
  _setLoading(value) { this.loading = value; this.element.toggleAttribute("aria-busy", value); this.element.toggleAttribute("data-fs-loading", value); }
  start() { this._setLoading(true); this.element.dispatchEvent(new CustomEvent("fs:loading:start", { bubbles: true })); }
  stop() { this._setLoading(false); this.element.dispatchEvent(new CustomEvent("fs:loading:stop", { bubbles: true })); }
  toggle() { this.loading ? this.stop() : this.start(); }
  dispose() { instances.delete(this.element); }
}
autoInit("spinner", Spinner);
