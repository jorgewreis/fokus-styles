import { createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

export class Theme {
  constructor(root = document.documentElement) { this.root = root; instances.set(root, this); }
  static getInstance(root = document.documentElement) { return instances.get(root); }
  static getOrCreateInstance(root = document.documentElement) { return this.getInstance(root) ?? new Theme(root); }
  static set(mode, root = document.documentElement) { return this.getOrCreateInstance(root).set(mode); }
  get() { return this.root.getAttribute("data-fs-theme") ?? this.root.getAttribute("data-theme") ?? "light"; }
  set(mode) {
    if (!["light", "dark", "auto"].includes(mode)) throw new TypeError("FokusStyles.Theme: modo inválido.");
    this.root.setAttribute("data-fs-theme", mode);
    this.root.setAttribute("data-theme", mode === "dark" ? "dark" : "light");
    this.root.dispatchEvent(new CustomEvent("fs:theme:change", { bubbles: true, detail: { mode } }));
    return this;
  }
  dispose() { instances.delete(this.root); }
}
