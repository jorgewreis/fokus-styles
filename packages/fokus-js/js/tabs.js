import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();
let idCounter = 0;

export class Tabs {
  constructor(tablistEl) {
    this.tablistEl = tablistEl;
    this.tabs = Array.from(tablistEl.querySelectorAll(".fs-nav-link"));
    this.manualActivation = tablistEl.getAttribute("data-tabs-activation") === "manual";

    tablistEl.setAttribute("role", "tablist");

    this.tabs.forEach((tab) => {
      const isActive = tab.classList.contains("is-active");

      idCounter += 1;
      if (!tab.id) tab.id = `fokus-tab-${idCounter}`;

      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");

      const paneSelector = tab.getAttribute("data-fs-target");
      const pane = paneSelector ? document.querySelector(paneSelector) : null;

      if (pane) {
        pane.setAttribute("role", "tabpanel");
        pane.setAttribute("aria-labelledby", tab.id);
        pane.setAttribute("tabindex", "0");
        pane.hidden = !isActive;
      }
    });

    this._handleClick = this._handleClick.bind(this);
    this._handleKeydown = this._handleKeydown.bind(this);

    tablistEl.addEventListener("click", this._handleClick);
    tablistEl.addEventListener("keydown", this._handleKeydown);

    instances.set(tablistEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  static getOrCreateInstance(el) { return this.getInstance(el) ?? new Tabs(el); }
  static show(el, tab) { return this.getOrCreateInstance(el).show(tab); }
  static dispose(el) { return this.getInstance(el)?.dispose(); }

  _handleClick(event) {
    const tab = event.target.closest(".fs-nav-link:not(.is-disabled)");
    if (!tab || !this.tabs.includes(tab)) return;
    this.show(tab);
  }

  _handleKeydown(event) {
    const enabledTabs = this.tabs.filter((tab) => !tab.classList.contains("is-disabled"));
    const currentIndex = enabledTabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = null;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % enabledTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = enabledTabs.length - 1;

    if (nextIndex === null) return;

    event.preventDefault();
      const nextTab = enabledTabs[nextIndex];
      nextTab.focus();
      if (!this.manualActivation) this.show(nextTab);
  }

  show(tab) {
    if (tab.classList.contains("is-active")) return;

    this.tabs.forEach((otherTab) => {
      const isActive = otherTab === tab;

      otherTab.classList.toggle("is-active", isActive);
      otherTab.setAttribute("aria-selected", String(isActive));
      otherTab.setAttribute("tabindex", isActive ? "0" : "-1");

      const paneSelector = otherTab.getAttribute("data-fs-target");
      const pane = paneSelector ? document.querySelector(paneSelector) : null;
      pane?.classList.toggle("is-active", isActive);
      if (pane) pane.hidden = !isActive;
    });

    tab.dispatchEvent(new CustomEvent("fs:shown", { bubbles: true }));
    tab.dispatchEvent(
      new CustomEvent("fs:tab:changed", { bubbles: true, detail: { target: tab.getAttribute("data-fs-target") } }),
    );
  }

  dispose() {
    this.tablistEl.removeEventListener("click", this._handleClick);
    this.tablistEl.removeEventListener("keydown", this._handleKeydown);
    instances.delete(this.tablistEl);
  }
}

autoInit("tabs", Tabs);
