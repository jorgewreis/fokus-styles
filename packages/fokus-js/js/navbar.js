import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

export class Navbar {
  constructor(navbarEl) {
    this.navbarEl = navbarEl;
    this.toggleEl = navbarEl.querySelector('[data-fs-toggle="navbar"]');
    const target = this.toggleEl?.getAttribute("data-fs-target");
    this.menuEl = target ? document.querySelector(target) : navbarEl.querySelector(".fs-navbar-collapse");
    if (!this.toggleEl || !this.menuEl) return;
    this._toggle = () => this.toggle();
    this._escape = (event) => { if (event.key === "Escape" && this.isOpen()) this.hide(); };
    this.toggleEl.addEventListener("click", this._toggle);
    this.menuEl.addEventListener("keydown", this._escape);
    instances.set(navbarEl, this);
  }
  static getInstance(el) { return instances.get(el); }
  static getOrCreateInstance(el) { return this.getInstance(el) ?? new Navbar(el); }
  isOpen() { return this.menuEl?.classList.contains("is-open"); }
  show() { this.menuEl.classList.add("is-open"); this.menuEl.hidden = false; this.toggleEl.setAttribute("aria-expanded", "true"); this.navbarEl.dispatchEvent(new CustomEvent("fs:shown", { bubbles: true })); }
  hide() { this.menuEl.classList.remove("is-open"); this.menuEl.hidden = true; this.toggleEl.setAttribute("aria-expanded", "false"); this.toggleEl.focus(); this.navbarEl.dispatchEvent(new CustomEvent("fs:hidden", { bubbles: true })); }
  toggle() { this.isOpen() ? this.hide() : this.show(); }
  dispose() { this.toggleEl?.removeEventListener("click", this._toggle); this.menuEl?.removeEventListener("keydown", this._escape); instances.delete(this.navbarEl); }
}

autoInit("navbar", Navbar);
