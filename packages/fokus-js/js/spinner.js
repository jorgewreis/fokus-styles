import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();
export class Spinner {
  constructor(element) {
    if (!element || element.nodeType !== 1) {
      throw new TypeError("FokusStyles.Spinner: elemento raiz inválido.");
    }
    this.element = element;
    this._setLoading(element.hasAttribute("data-fs-loading") && element.getAttribute("data-fs-loading") !== "false");
    instances.set(element, this);
  }
  static getInstance(el) { return instances.get(el); }
  static getOrCreateInstance(el) { return this.getInstance(el) ?? new Spinner(el); }
  _setLoading(value) {
    this.loading = Boolean(value);
    this.element.setAttribute("aria-busy", String(this.loading));
    this.element.toggleAttribute("data-fs-loading", this.loading);
  }
  start() { this._setLoading(true); this.element.dispatchEvent(new CustomEvent("fs:loading:start", { bubbles: true })); }
  stop() { this._setLoading(false); this.element.dispatchEvent(new CustomEvent("fs:loading:stop", { bubbles: true })); }
  toggle() { this.loading ? this.stop() : this.start(); }
  dispose() {
    if (instances.get(this.element) === this) instances.delete(this.element);
  }
}
autoInit("spinner", Spinner);
