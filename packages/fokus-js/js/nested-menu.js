import { computePosition, applyPosition } from "./core/positioning.js";
import { onClickOutside } from "./core/overlay.js";
import { onEscapeKey } from "./core/focus.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

// Itens focáveis de um nível de menu: `.fs-dropdown-item` diretos (folhas) e o
// item de cada `.fs-dropdown-submenu` (que abre o próximo nível). Ignora
// divisores/headers e itens desabilitados.
function levelItems(menuEl) {
  const items = [];
  for (const child of menuEl.children) {
    let item = null;
    if (child.classList.contains("fs-dropdown-item")) {
      item = child;
    } else if (child.classList.contains("fs-dropdown-submenu")) {
      item = child.querySelector(":scope > .fs-dropdown-item");
    }
    if (item && !item.classList.contains("is-disabled")) items.push(item);
  }
  return items;
}

function isSubmenuParent(item) {
  return item.classList.contains("fs-dropdown-item-submenu");
}

// Nested Menu (Etapa 10): Dropdown com submenus recursivos. Reaproveita a
// marcação/estilo do Dropdown (`.fs-dropdown-menu`/`.fs-dropdown-item`); cada submenu
// é um `.fs-dropdown-menu` dentro de um `.fs-dropdown-submenu`. Hover abre por CSS
// (scss/components/_nested-menu.scss); aqui ficam clique, teclado (setas entre
// níveis) e o flip de borda. Componente próprio (não estende o Dropdown) porque
// a navegação por teclado é por nível, não linear sobre todos os itens.
export class NestedMenu {
  constructor(toggleEl, options = {}) {
    const targetSelector = toggleEl.getAttribute("data-fs-target");
    const rootMenu = targetSelector ? document.querySelector(targetSelector) : toggleEl.nextElementSibling;

    if (!rootMenu) {
      throw new Error("FokusStyles.NestedMenu: elemento do menu não encontrado (data-fs-target).");
    }

    this.toggleEl = toggleEl;
    this.rootMenu = rootMenu;
    this.placement = options.placement ?? toggleEl.getAttribute("data-placement") ?? "bottom";
    this.align = options.align ?? toggleEl.getAttribute("data-align") ?? "start";
    this.isOpen = false;
    this._outsideClickCleanup = null;

    document.body.appendChild(this.rootMenu);

    this.toggleEl.setAttribute("aria-haspopup", "menu");
    this.toggleEl.setAttribute("aria-expanded", "false");
    this.rootMenu.setAttribute("role", "menu");
    this.rootMenu.querySelectorAll(".fs-dropdown-menu").forEach((menu) => menu.setAttribute("role", "menu"));
    this.rootMenu.querySelectorAll(".fs-dropdown-item-submenu").forEach((item) => {
      item.setAttribute("aria-haspopup", "menu");
      item.setAttribute("aria-expanded", "false");
    });

    this._handleToggleClick = this._handleToggleClick.bind(this);
    this._handleMenuClick = this._handleMenuClick.bind(this);
    this._handleMenuKeydown = this._handleMenuKeydown.bind(this);
    this._handleMenuMouseover = this._handleMenuMouseover.bind(this);

    this.toggleEl.addEventListener("click", this._handleToggleClick);
    this.rootMenu.addEventListener("click", this._handleMenuClick);
    this.rootMenu.addEventListener("keydown", this._handleMenuKeydown);
    this.rootMenu.addEventListener("mouseover", this._handleMenuMouseover);

    this._removeEscapeListener = onEscapeKey(() => {
      if (this.isOpen) {
        this.hide();
        this.toggleEl.focus();
      }
    });

    instances.set(toggleEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _submenuOf(parentItem) {
    const submenu = parentItem.nextElementSibling;
    return submenu && submenu.classList.contains("fs-dropdown-menu") ? submenu : null;
  }

  _applyFlip(parentItem) {
    const submenu = this._submenuOf(parentItem);
    if (!submenu) return;

    const rect = parentItem.getBoundingClientRect();
    const width = submenu.offsetWidth || 180;
    const viewportWidth = document.documentElement.clientWidth;
    parentItem.parentElement.classList.toggle("fs-dropdown-submenu-left", rect.right + width > viewportWidth);
  }

  _openSubmenu(parentItem, focusFirst) {
    const submenu = this._submenuOf(parentItem);
    if (!submenu) return;

    // Fecha submenus irmãos abertos no mesmo nível (só um por nível).
    const level = parentItem.closest(".fs-dropdown-menu");
    level.querySelectorAll(":scope > .fs-dropdown-submenu > .fs-dropdown-menu.is-open").forEach((sibling) => {
      if (sibling !== submenu) {
        sibling.classList.remove("is-open");
        sibling.previousElementSibling?.setAttribute("aria-expanded", "false");
      }
    });

    this._applyFlip(parentItem);
    submenu.classList.add("is-open");
    parentItem.setAttribute("aria-expanded", "true");
    if (focusFirst) levelItems(submenu)[0]?.focus();
  }

  _closeSubmenu(parentItem) {
    const submenu = this._submenuOf(parentItem);
    if (!submenu) return;

    submenu.querySelectorAll(".fs-dropdown-menu.is-open").forEach((nested) => {
      nested.classList.remove("is-open");
      nested.previousElementSibling?.setAttribute("aria-expanded", "false");
    });
    submenu.classList.remove("is-open");
    parentItem.parentElement.classList.remove("fs-dropdown-submenu-left");
    parentItem.setAttribute("aria-expanded", "false");
  }

  _closeAllSubmenus() {
    this.rootMenu.querySelectorAll(".fs-dropdown-menu.is-open").forEach((submenu) => {
      submenu.classList.remove("is-open");
      submenu.previousElementSibling?.setAttribute("aria-expanded", "false");
    });
    this.rootMenu.querySelectorAll(".fs-dropdown-submenu-left").forEach((wrapper) => wrapper.classList.remove("fs-dropdown-submenu-left"));
  }

  _handleToggleClick(event) {
    event.preventDefault();
    this.toggle();
  }

  _handleMenuClick(event) {
    const item = event.target.closest(".fs-dropdown-item");
    if (!item || item.classList.contains("is-disabled")) return;

    if (isSubmenuParent(item)) {
      event.preventDefault();
      if (this._submenuOf(item)?.classList.contains("is-open")) {
        this._closeSubmenu(item);
      } else {
        this._openSubmenu(item, false);
      }
      return;
    }

    // Folha: fecha o menu inteiro e devolve o foco ao gatilho.
    this.hide();
    this.toggleEl.focus();
  }

  _handleMenuMouseover(event) {
    const hoveredParent = event.target.closest(".fs-dropdown-item-submenu");

    // Fecha submenus abertos por teclado (`.is-open`) que não estão no caminho do
    // item sob o mouse, pra hover e teclado não deixarem dois ramos abertos.
    this.rootMenu.querySelectorAll(".fs-dropdown-menu.is-open").forEach((submenu) => {
      if (!submenu.contains(event.target) && submenu !== hoveredParent?.nextElementSibling) {
        submenu.classList.remove("is-open");
        submenu.previousElementSibling?.setAttribute("aria-expanded", "false");
      }
    });

    if (hoveredParent) this._applyFlip(hoveredParent);
  }

  _handleMenuKeydown(event) {
    const active = document.activeElement;
    if (!active?.classList?.contains("fs-dropdown-item")) return;

    const menu = active.closest(".fs-dropdown-menu");
    const items = levelItems(menu);
    const index = items.indexOf(active);
    const parentWrapper = menu.parentElement;
    const inSubmenu = parentWrapper?.classList.contains("fs-dropdown-submenu");

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        items[(index + 1) % items.length]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
        break;
      case "ArrowRight":
        if (isSubmenuParent(active)) {
          event.preventDefault();
          this._openSubmenu(active, true);
        }
        break;
      case "ArrowLeft":
        if (inSubmenu) {
          event.preventDefault();
          const parentItem = parentWrapper.querySelector(":scope > .fs-dropdown-item");
          this._closeSubmenu(parentItem);
          parentItem.focus();
        }
        break;
      case "Enter":
      case " ":
        if (isSubmenuParent(active)) {
          event.preventDefault();
          if (this._submenuOf(active)?.classList.contains("is-open")) {
            this._closeSubmenu(active);
          } else {
            this._openSubmenu(active, true);
          }
        }
        break;
      case "Escape":
        if (inSubmenu) {
          event.preventDefault();
          event.stopPropagation();
          const parentItem = parentWrapper.querySelector(":scope > .fs-dropdown-item");
          this._closeSubmenu(parentItem);
          parentItem.focus();
        } else {
          event.preventDefault();
          this.hide();
          this.toggleEl.focus();
        }
        break;
      default:
        break;
    }
  }

  show() {
    if (this.isOpen) return;
    this.isOpen = true;

    const theme = this.toggleEl.closest("[data-theme]")?.getAttribute("data-theme");
    if (theme) {
      this.rootMenu.setAttribute("data-theme", theme);
    } else {
      this.rootMenu.removeAttribute("data-theme");
    }

    this.rootMenu.classList.add("is-open");

    const position = computePosition(this.toggleEl, this.rootMenu, {
      placement: this.placement,
      align: this.align,
      offset: 4,
    });
    applyPosition(this.rootMenu, position);

    this.toggleEl.setAttribute("aria-expanded", "true");
    levelItems(this.rootMenu)[0]?.focus();

    this._outsideClickCleanup = onClickOutside(this.rootMenu, (event) => {
      if (this.toggleEl.contains(event.target)) return;
      this.hide();
    });

    this.toggleEl.dispatchEvent(new CustomEvent("fs:nested-menu:shown", { bubbles: true }));
  }

  hide() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this._closeAllSubmenus();
    this.rootMenu.classList.remove("is-open");
    this.rootMenu.style.removeProperty("position");
    this.rootMenu.style.removeProperty("top");
    this.rootMenu.style.removeProperty("left");
    this.toggleEl.setAttribute("aria-expanded", "false");

    this._outsideClickCleanup?.();
    this._outsideClickCleanup = null;

    this.toggleEl.dispatchEvent(new CustomEvent("fs:nested-menu:hidden", { bubbles: true }));
  }

  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  dispose() {
    this.hide();
    this._removeEscapeListener();
    this.toggleEl.removeEventListener("click", this._handleToggleClick);
    this.rootMenu.removeEventListener("click", this._handleMenuClick);
    this.rootMenu.removeEventListener("keydown", this._handleMenuKeydown);
    this.rootMenu.removeEventListener("mouseover", this._handleMenuMouseover);
    instances.delete(this.toggleEl);
  }
}

autoInit("nested-menu", NestedMenu);
