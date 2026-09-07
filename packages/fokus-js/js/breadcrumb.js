import { Dropdown } from "./dropdown.js";
import { Tooltip } from "./tooltip.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

export class Breadcrumb {
  constructor(listEl, options = {}) {
    this.listEl = listEl;
    this.maxItems = Number(options.maxItems ?? listEl.getAttribute("data-max-items") ?? 4);
    this.items = Array.from(listEl.children).filter((el) => el.classList.contains("fs-breadcrumb-item"));
    this.isCollapsed = false;
    this._moreItem = null;
    this._dropdown = null;
    // Abaixo do breakpoint `sm` (scss/settings/_breakpoints.scss, 640px). Por
    // instância (em vez de módulo) para poder ser mockado por teste e para o
    // listener ser removido de forma isolada em dispose().
    this._collapseQuery = window.matchMedia("(max-width: 639.98px)");

    this._setupTruncation();

    this._handleMediaChange = () => this._render();
    this._collapseQuery.addEventListener("change", this._handleMediaChange);

    this._render();

    instances.set(listEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  // Trunca com reticências (CSS) e só anexa tooltip (js/tooltip.js) nos itens
  // cujo texto realmente transborda — evita tooltip redundante em labels
  // curtos que já cabem inteiros. Mede depois de `document.fonts.ready`: como
  // a tipografia é self-hosted (docs/definitions.md, seção 18.2), medir antes
  // da fonte carregar poderia usar a métrica do fallback do sistema e errar o
  // corte.
  _setupTruncation() {
    const targets = this.items.map((item) => item.querySelector("a") ?? item);
    targets.forEach((target) => target.classList.add("fs-breadcrumb-item-truncate"));

    const measure = () => {
      targets.forEach((target) => {
        if (target.scrollWidth > target.clientWidth) {
          target.setAttribute("data-title", target.textContent.trim());
          new Tooltip(target);
        }
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    } else {
      requestAnimationFrame(measure);
    }
  }

  _render() {
    const shouldCollapse = this._collapseQuery.matches && this.items.length > this.maxItems;

    if (shouldCollapse === this.isCollapsed) return;
    this.isCollapsed = shouldCollapse;

    if (shouldCollapse) {
      this._collapse();
    } else {
      this._expand();
    }
  }

  // Mantém o primeiro e o último nível visíveis; os intermediários viram um
  // único item "…" com dropdown (mesma composição de js/select.js: monta o
  // toggle + `.fs-dropdown-menu` como irmãos e deixa o Dropdown reposicionar).
  _collapse() {
    const hiddenItems = this.items.slice(1, -1);
    hiddenItems.forEach((item) => {
      item.style.display = "none";
    });

    const moreItem = document.createElement("li");
    moreItem.className = "fs-breadcrumb-item";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "fs-breadcrumb-more";
    toggle.setAttribute("aria-label", "Mostrar níveis ocultos");
    toggle.textContent = "…";

    const menu = document.createElement("div");
    menu.className = "fs-dropdown-menu";

    hiddenItems.forEach((item) => {
      const source = item.querySelector("a") ?? item;
      const isLink = source.tagName === "A";
      const link = document.createElement(isLink ? "a" : "span");
      link.className = "fs-dropdown-item";
      link.textContent = source.textContent.trim();
      if (isLink) link.href = source.getAttribute("href");
      menu.appendChild(link);
    });

    moreItem.appendChild(toggle);
    moreItem.appendChild(menu);
    this.items[0].insertAdjacentElement("afterend", moreItem);

    this._moreItem = moreItem;
    this._dropdown = new Dropdown(toggle);
  }

  _expand() {
    this.items.slice(1, -1).forEach((item) => {
      item.style.removeProperty("display");
    });

    this._dropdown?.dispose();
    this._dropdown = null;

    this._moreItem?.remove();
    this._moreItem = null;
  }

  dispose() {
    this._collapseQuery.removeEventListener("change", this._handleMediaChange);
    this._expand();
    instances.delete(this.listEl);
  }
}

autoInit("breadcrumb", Breadcrumb);
