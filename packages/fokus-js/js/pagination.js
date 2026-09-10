import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();
export class Pagination {
  constructor(element) {
    this.element = element;
    this.total = Math.max(1, this._normalizePage(element.getAttribute("data-fs-pages"), element.querySelectorAll("[data-fs-page]").length || 1));
    this.current = Math.min(this.total, this._normalizePage(element.getAttribute("data-fs-page"), 1));
    this._click = (event) => {
      const button = event.target.closest("[data-fs-page]");
      if (!button || !this.element.contains(button)) return;
      event.preventDefault();
      this.goTo(button.getAttribute("data-fs-page"));
    };
    element.addEventListener("click", this._click);
    instances.set(element, this);
    this._render();
  }
  static getInstance(el) { return instances.get(el); }
  static getOrCreateInstance(el) { return this.getInstance(el) ?? new Pagination(el); }
  goTo(page) {
    const next = this._normalizePage(page, this.current);
    const bounded = Math.max(1, Math.min(this.total, next));
    if (bounded === this.current) return;
    this.current = bounded;
    this.element.setAttribute("data-fs-page", String(bounded));
    this._render();
    this.element.dispatchEvent(new CustomEvent("fs:pagination:change", { bubbles: true, detail: { page: bounded, total: this.total } }));
  }
  _render() {
    this.element.querySelectorAll("[data-fs-page]").forEach((item) => {
      const active = Number(item.getAttribute("data-fs-page")) === this.current;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
  }
  _normalizePage(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : fallback;
  }
  dispose() { this.element.removeEventListener("click", this._click); instances.delete(this.element); }
}
autoInit("pagination", Pagination);
