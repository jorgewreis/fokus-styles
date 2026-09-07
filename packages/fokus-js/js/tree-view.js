import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

// Tree View: padrão WAI-ARIA Tree View
// (https://www.w3.org/WAI/ARIA/apg/patterns/treeview/). Cada nó é um `<li
// role="treeitem">` com `<span class="fs-tree-label">` (obrigatório) seguido,
// se houver filhos, de um `<ul>`/`<ol>` (`role="group"`, auto-anexado) —
// o botão `.fs-tree-toggle` é injetado automaticamente pelo JS nos nós com
// filhos, igual ao botão de ordenação do DataTable.
export class TreeView {
  constructor(rootEl) {
    this.rootEl = rootEl;
    rootEl.setAttribute("role", "tree");

    this._setupItems();

    this._handleClick = this._handleClick.bind(this);
    this._handleKeydown = this._handleKeydown.bind(this);
    this._handleFocusIn = this._handleFocusIn.bind(this);

    rootEl.addEventListener("click", this._handleClick);
    rootEl.addEventListener("keydown", this._handleKeydown);
    rootEl.addEventListener("focusin", this._handleFocusIn);

    this._resetRovingTabindex();

    instances.set(rootEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _setupItems() {
    Array.from(this.rootEl.querySelectorAll("li")).forEach((li) => {
      li.setAttribute("role", "treeitem");

      const group = this._group(li);
      if (!group) return;

      group.setAttribute("role", "group");
      if (!li.hasAttribute("aria-expanded")) li.setAttribute("aria-expanded", "false");
      group.hidden = li.getAttribute("aria-expanded") !== "true";

      const label = li.querySelector(":scope > .fs-tree-label") ?? li;
      if (!label.querySelector(":scope > .fs-tree-toggle")) {
        const toggle = document.createElement("span");
        toggle.className = "fs-tree-toggle";
        toggle.setAttribute("aria-hidden", "true");
        label.insertBefore(toggle, label.firstChild);
      }
    });
  }

  _group(item) {
    return item.querySelector(":scope > ul, :scope > ol");
  }

  _isExpanded(item) {
    return item.getAttribute("aria-expanded") === "true";
  }

  _isVisible(item) {
    let group = item.parentElement.closest('[role="group"]');
    while (group) {
      if (group.hidden) return false;
      group = group.parentElement.closest('[role="group"]');
    }
    return true;
  }

  _visibleItems() {
    return Array.from(this.rootEl.querySelectorAll('[role="treeitem"]')).filter((item) => this._isVisible(item));
  }

  _resetRovingTabindex() {
    const items = this._visibleItems();
    const current = items.find((item) => item.getAttribute("tabindex") === "0") ?? items[0];
    items.forEach((item) => item.setAttribute("tabindex", item === current ? "0" : "-1"));
  }

  expand(item) {
    const group = this._group(item);
    if (!group || this._isExpanded(item)) return;

    item.setAttribute("aria-expanded", "true");
    group.hidden = false;
    this._resetRovingTabindex();
    this.rootEl.dispatchEvent(new CustomEvent("fs:tree:expanded", { bubbles: true, detail: { item } }));
  }

  collapse(item) {
    const group = this._group(item);
    if (!group || !this._isExpanded(item)) return;

    item.setAttribute("aria-expanded", "false");
    group.hidden = true;
    this._resetRovingTabindex();
    this.rootEl.dispatchEvent(new CustomEvent("fs:tree:collapsed", { bubbles: true, detail: { item } }));
  }

  toggle(item) {
    if (this._isExpanded(item)) {
      this.collapse(item);
    } else {
      this.expand(item);
    }
  }

  select(item) {
    this.rootEl.querySelectorAll('[aria-selected="true"]').forEach((el) => el.setAttribute("aria-selected", "false"));
    item.setAttribute("aria-selected", "true");

    this.rootEl.dispatchEvent(
      new CustomEvent("fs:tree:selected", { bubbles: true, detail: { value: item.dataset.value ?? item.textContent.trim(), item } }),
    );
  }

  _handleClick(event) {
    const item = event.target.closest('[role="treeitem"]');
    if (!item) return;

    if (this._group(item)) this.toggle(item);
    this.select(item);
    item.focus();
  }

  _handleFocusIn(event) {
    const item = event.target.closest('[role="treeitem"]');
    if (!item || !this._isVisible(item)) return;

    this._visibleItems().forEach((el) => el.setAttribute("tabindex", el === item ? "0" : "-1"));
  }

  _handleKeydown(event) {
    const item = event.target.closest('[role="treeitem"]');
    if (!item) return;

    const items = this._visibleItems();
    const index = items.indexOf(item);
    const group = this._group(item);

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        items[index + 1]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        items[index - 1]?.focus();
        break;
      case "ArrowRight":
        event.preventDefault();
        if (group) {
          if (this._isExpanded(item)) items[index + 1]?.focus();
          else this.expand(item);
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (group && this._isExpanded(item)) {
          this.collapse(item);
        } else {
          item.parentElement.closest('[role="treeitem"]')?.focus();
        }
        break;
      case "Home":
        event.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (group) this.toggle(item);
        this.select(item);
        break;
      default:
        return;
    }
  }

  dispose() {
    this.rootEl.removeEventListener("click", this._handleClick);
    this.rootEl.removeEventListener("keydown", this._handleKeydown);
    this.rootEl.removeEventListener("focusin", this._handleFocusIn);
    instances.delete(this.rootEl);
  }
}

autoInit("tree-view", TreeView);
