import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

export class Scrollspy {
  constructor(navEl) {
    this.navEl = navEl;
    this.links = [...navEl.querySelectorAll('a[href^="#"]')];
    this.sections = this.links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    this.observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && this.activate(entry.target)), { rootMargin: "-20% 0px -65%" });
    this.sections.forEach((section) => this.observer?.observe(section));
    this._onScroll = () => {
      if (this.observer) return;
      const current = this.sections.filter((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.35).at(-1);
      if (current) this.activate(current);
    };
    if (!this.observer) window.addEventListener("scroll", this._onScroll, { passive: true });
    instances.set(navEl, this);
  }
  static getInstance(el) { return instances.get(el); }
  static getOrCreateInstance(el) { return this.getInstance(el) ?? new Scrollspy(el); }
  activate(section) { this.links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${section.id}`)); this.navEl.dispatchEvent(new CustomEvent("fs:scrollspy:activate", { bubbles: true, detail: { section } })); }
  dispose() { this.observer?.disconnect(); window.removeEventListener("scroll", this._onScroll); instances.delete(this.navEl); }
}

autoInit("scrollspy", Scrollspy);
