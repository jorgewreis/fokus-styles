import { escapeHtml } from "./core/html.js";
import { Toast } from "./toast.js";
import { normalizeVariant } from "./core/variant.js";
import { computePosition, applyPosition } from "./core/positioning.js";
import { onClickOutside } from "./core/overlay.js";
import { onEscapeKey } from "./core/focus.js";
import { applyThemeContext } from "./core/theme.js";
import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

let idCounter = 0;

function formatTime(time) {
  const date = new Date(time);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

// Notification Center (Etapa 10): não é um "componente visual" novo — orquestra
// múltiplas instâncias de FokusStyles.Toast (js/toast.js) e mantém um histórico. Um
// `push()` cria um toast na hora (mesma marcação de mockup/accordion-tabs-toast)
// e registra a notificação; o painel (posicionado como o Dropdown, via
// js/core/positioning.js) lista o histórico, com contador de não-lidas no
// gatilho. Persistência opcional em localStorage (`data-storage="local"`).
export class NotificationCenter {
  constructor(triggerEl, options = {}) {
    const panelSelector = options.target ?? triggerEl.getAttribute("data-fs-target");
    const panelEl = panelSelector ? document.querySelector(panelSelector) : null;

    if (!panelEl) {
      throw new Error("FokusStyles.NotificationCenter: painel não encontrado (data-fs-target).");
    }

    this.triggerEl = triggerEl;
    this.panelEl = panelEl;
    this.storage = options.storage ?? triggerEl.getAttribute("data-storage") ?? "memory";
    this.storageKey = options.storageKey ?? triggerEl.getAttribute("data-storage-key") ?? "fokus-notifications";

    const containerSelector = options.toastContainer ?? triggerEl.getAttribute("data-toast-container");
    this.toastContainer = containerSelector ? document.querySelector(containerSelector) : this._ensureToastContainer();

    this.isOpen = false;
    this._outsideClickCleanup = null;
    this.history = this._load();

    this.badgeEl = triggerEl.querySelector(".fs-notification-badge");
    this.listEl = panelEl.querySelector(".fs-notification-list");
    this.emptyEl = panelEl.querySelector(".fs-notification-empty");

    document.body.appendChild(this.panelEl);

    triggerEl.setAttribute("aria-haspopup", "dialog");
    triggerEl.setAttribute("aria-expanded", "false");
    if (panelEl.id) triggerEl.setAttribute("aria-controls", panelEl.id);
    if (!panelEl.getAttribute("role")) panelEl.setAttribute("role", "region");
    if (!panelEl.getAttribute("aria-label")) panelEl.setAttribute("aria-label", "Notificações");

    this._handleTriggerClick = this._handleTriggerClick.bind(this);
    this._handlePanelClick = this._handlePanelClick.bind(this);

    triggerEl.addEventListener("click", this._handleTriggerClick);
    panelEl.addEventListener("click", this._handlePanelClick);

    this._removeEscapeListener = onEscapeKey(() => {
      if (this.isOpen) {
        this.close();
        this.triggerEl.focus();
      }
    });

    this._render();
    instances.set(triggerEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _ensureToastContainer() {
    let container = document.querySelector(".fs-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "fs-toast-container";
      document.body.appendChild(container);
    }
    return container;
  }

  _load() {
    if (this.storage !== "local") return [];
    try {
      const stored = JSON.parse(localStorage.getItem(this.storageKey));
      if (!Array.isArray(stored)) return [];
      return stored.filter((record) => record && typeof record === "object"
        && typeof record.id === "string" && record.id.length > 0)
        .map((record) => ({
          id: record.id,
          title: typeof record.title === "string" ? record.title : "",
          body: typeof record.body === "string" ? record.body : "",
          variant: normalizeVariant(record.variant),
          time: Number.isFinite(record.time) && !Number.isNaN(new Date(record.time).getTime()) ? record.time : 0,
          read: record.read === true,
        }));
    } catch {
      return [];
    }
  }

  _persist() {
    if (this.storage !== "local") return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history));
    } catch {
      // Cota cheia ou storage indisponível: histórico segue em memória.
    }
  }

  get unreadCount() {
    return this.history.filter((record) => !record.read).length;
  }

  // Empilha um toast e registra a notificação. Retorna o id do registro.
  push(options = {}) {
    const { title = "", body = "", variant = "primary", autohide = true, delay } = options;

    do { idCounter += 1; } while (this.history.some((record) => record.id === `n-${idCounter}`));
    const safeVariant = normalizeVariant(variant);
    const record = { id: `n-${idCounter}`, title, body, variant: safeVariant, time: Date.now(), read: this.isOpen };
    this.history.unshift(record);
    this._persist();
    this._render();

    this._showToast({ title, body, variant: safeVariant, autohide, delay });

    this.triggerEl.dispatchEvent(new CustomEvent("fs:notification:pushed", { bubbles: true, detail: { record } }));
    return record.id;
  }

  _showToast({ title, body, variant, autohide, delay }) {
    const toastEl = document.createElement("div");
    toastEl.className = `fs-toast fs-toast-${normalizeVariant(variant)}`;
    if (delay != null) toastEl.setAttribute("data-delay", String(delay));
    if (!autohide) toastEl.setAttribute("data-autohide", "false");
    toastEl.innerHTML = `
      <div class="fs-toast-header">
        <span>${escapeHtml(title)}</span>
        <button type="button" class="fs-btn-close" data-fs-dismiss="toast" aria-label="Fechar"></button>
      </div>
      ${body ? `<div class="fs-toast-body">${escapeHtml(body)}</div>` : ""}
    `;
    this.toastContainer.appendChild(toastEl);

    const toast = new Toast(toastEl);
    toastEl.addEventListener("fs:toast:hidden", () => {
      toast.dispose();
      toastEl.remove();
    });
    toast.show();
  }

  remove(id) {
    this.history = this.history.filter((record) => record.id !== id);
    this._persist();
    this._render();
  }

  clear() {
    this.history = [];
    this._persist();
    this._render();
    this.triggerEl.dispatchEvent(new CustomEvent("fs:notification:cleared", { bubbles: true }));
  }

  getAll() {
    return this.history.slice();
  }

  _updateBadge() {
    if (!this.badgeEl) return;
    const count = this.unreadCount;
    this.badgeEl.textContent = String(count);
    this.badgeEl.toggleAttribute("hidden", count === 0);
  }

  _render() {
    if (this.listEl) {
      const items = this.history.map((record) => {
        const item = document.createElement("li");
        item.className = `fs-notification-item fs-notification-item-${normalizeVariant(record.variant)}${record.read ? "" : " fs-notification-item-unread"}`;
        // IDs can come from persisted data; never interpolate them into HTML.
        item.dataset.id = record.id;
        item.innerHTML = `
          <div class="fs-notification-item-content">
            <p class="fs-notification-item-title">${escapeHtml(record.title)}</p>
            ${record.body ? `<p class="fs-notification-item-text">${escapeHtml(record.body)}</p>` : ""}
            <span class="fs-notification-item-time">${formatTime(record.time)}</span>
          </div>
          <button type="button" class="fs-btn-close" data-notification-dismiss aria-label="Remover notificação"></button>`;
        return item;
      });
      this.listEl.replaceChildren(...items);
    }
    this.emptyEl?.toggleAttribute("hidden", this.history.length > 0);
    this._updateBadge();
  }

  _handleTriggerClick(event) {
    event.preventDefault();
    this.toggle();
  }

  _handlePanelClick(event) {
    if (event.target.closest('[data-notification="clear"]')) {
      this.clear();
      return;
    }

    const dismissBtn = event.target.closest("[data-notification-dismiss]");
    if (dismissBtn) {
      const id = dismissBtn.closest(".fs-notification-item")?.dataset.id;
      if (id) this.remove(id);
    }
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;

    applyThemeContext(this.panelEl, this.triggerEl);

    this.panelEl.classList.add("is-open");

    const position = computePosition(this.triggerEl, this.panelEl, {
      placement: "bottom",
      align: "end",
      offset: 4,
    });
    applyPosition(this.panelEl, position);

    this.triggerEl.setAttribute("aria-expanded", "true");

    // Abrir = ler tudo.
    this.history.forEach((record) => {
      record.read = true;
    });
    this._persist();
    this._render();

    this._outsideClickCleanup = onClickOutside(this.panelEl, (event) => {
      if (this.triggerEl.contains(event.target)) return;
      this.close();
    });

    this.triggerEl.dispatchEvent(new CustomEvent("fs:notification:opened", { bubbles: true }));
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.panelEl.classList.remove("is-open");
    this.panelEl.style.removeProperty("position");
    this.panelEl.style.removeProperty("top");
    this.panelEl.style.removeProperty("left");
    this.triggerEl.setAttribute("aria-expanded", "false");

    this._outsideClickCleanup?.();
    this._outsideClickCleanup = null;

    this.triggerEl.dispatchEvent(new CustomEvent("fs:notification:closed", { bubbles: true }));
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  dispose() {
    this.close();
    this._removeEscapeListener();
    this.triggerEl.removeEventListener("click", this._handleTriggerClick);
    this.panelEl.removeEventListener("click", this._handlePanelClick);
    instances.delete(this.triggerEl);
  }
}

autoInit("notification-center", NotificationCenter);
