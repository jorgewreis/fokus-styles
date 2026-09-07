import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();
export class Pagination {
  constructor(element) {
    this.element = element;
    this.current = Number(element.getAttribute("data-fs-page")) || 1;
    this.total = Number(element.getAttribute("data-fs-pages")) || element.querySelectorAll("[data-fs-page]").length || 1;
    this._click = (event) => {
      const button = event.target.closest("[data-fs-page]");
      if (!button || !this.element.contains(button)) return;
      event.preventDefault();
      this.goTo(Number(button.getAttribute("data-fs-page")));
    };
    element.addEventListener("click", this._click);
    instances.set(element, this);
    this._render();
  }
  static getInstance(el) { return instances.get(el); }
  static getOrCreateInstance(el) { return this.getInstance(el) ?? new Pagination(el); }
  goTo(page) {
    const next = Math.max(1, Math.min(this.total, page));
    if (next === this.current) return;
    this.current = next;
    this.element.setAttribute("data-fs-page", String(next));
    this._render();
    this.element.dispatchEvent(new CustomEvent("fs:pagination:change", { bubbles: true, detail: { page: next, total: this.total } }));
  }
  _render() {
    this.element.querySelectorAll("[data-fs-page]").forEach((item) => {
      const active = Number(item.getAttribute("data-fs-page")) === this.current;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-current", active ? "page" : "false");
    });
  }
  dispose() { this.element.removeEventListener("click", this._click); instances.delete(this.element); }
}
autoInit("pagination", Pagination);
