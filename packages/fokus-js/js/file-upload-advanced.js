import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

let idCounter = 0;

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = -1;

  do {
    value /= 1024;
    unitIndex += 1;
  } while (value >= 1024 && unitIndex < units.length - 1);

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

function fileExtension(name) {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1, dot + 5).toUpperCase();
}

// Upload avançado: evolução de js/file-drop.js — múltiplos arquivos,
// preview por arquivo (thumbnail de imagem via createObjectURL, nome,
// tamanho), progresso individual e remoção por item. Não faz upload de
// verdade (agnóstico de backend/protocolo): só mantém a lista de arquivos
// e expõe `setProgress`/`setError` pro consumidor chamar a partir do
// próprio XHR/fetch. Compõe com data-fs="file-drop" na mesma label (ver
// mockup/file-upload-advanced.html) pra ganhar arrastar-e-soltar de graça.
export class FileUploadAdvanced {
  constructor(rootEl) {
    const inputEl = rootEl.querySelector(".fs-file-input");
    if (!inputEl) {
      throw new Error("FokusStyles.FileUploadAdvanced: .fs-file-input não encontrado.");
    }

    this.rootEl = rootEl;
    this.inputEl = inputEl;
    this.listEl = rootEl.querySelector(".fs-file-upload-list");
    if (!this.listEl) {
      this.listEl = document.createElement("ul");
      this.listEl.className = "fs-file-upload-list";
      rootEl.appendChild(this.listEl);
    }

    this._items = new Map();

    this._handleChange = this._handleChange.bind(this);
    this._handleListClick = this._handleListClick.bind(this);

    inputEl.addEventListener("change", this._handleChange);
    this.listEl.addEventListener("click", this._handleListClick);

    instances.set(rootEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  getFiles() {
    return Array.from(this._items.values()).map((item) => item.file);
  }

  setProgress(id, percent) {
    const item = this._items.get(id);
    if (!item) return;

    item.progress = Math.min(100, Math.max(0, percent));
    item.error = null;
    this._renderItem(id);
  }

  setError(id, message) {
    const item = this._items.get(id);
    if (!item) return;

    item.error = message;
    this._renderItem(id);
  }

  remove(id) {
    const item = this._items.get(id);
    if (!item) return;

    if (item.thumbUrl) URL.revokeObjectURL(item.thumbUrl);
    this._items.delete(id);

    const itemEl = this.listEl.querySelector(`[data-file-id="${id}"]`);
    itemEl?.remove();

    this.rootEl.dispatchEvent(
      new CustomEvent("fs:file-upload:removed", { bubbles: true, detail: { id, file: item.file } }),
    );
  }

  _handleChange() {
    const files = Array.from(this.inputEl.files ?? []);
    if (files.length === 0) return;

    const added = [];
    for (const file of files) {
      idCounter += 1;
      const id = `file-${idCounter}`;
      const thumbUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      this._items.set(id, { file, progress: 0, error: null, thumbUrl });
      added.push({ id, file });
      this._appendItem(id);
    }

    this.rootEl.dispatchEvent(new CustomEvent("fs:file-upload:added", { bubbles: true, detail: { items: added } }));
  }

  _handleListClick(event) {
    const removeBtn = event.target.closest("[data-file-upload-remove]");
    if (!removeBtn) return;

    const itemEl = removeBtn.closest("[data-file-id]");
    if (itemEl) this.remove(itemEl.getAttribute("data-file-id"));
  }

  _appendItem(id) {
    const item = this._items.get(id);
    const li = document.createElement("li");
    li.className = "fs-file-upload-item";
    li.setAttribute("data-file-id", id);
    this.listEl.appendChild(li);
    this._renderItem(id, item);
  }

  _renderItem(id, itemArg) {
    const item = itemArg ?? this._items.get(id);
    if (!item) return;

    const li = this.listEl.querySelector(`[data-file-id="${id}"]`);
    if (!li) return;

    const { file, progress, error, thumbUrl } = item;
    const thumb = thumbUrl
      ? `<img src="${thumbUrl}" alt="">`
      : escapeHtml(fileExtension(file.name) || "?");

    li.classList.toggle("is-error", Boolean(error));
    li.innerHTML = `
      <div class="fs-file-upload-thumb">${thumb}</div>
      <div class="fs-file-upload-info">
        <p class="fs-file-upload-name">${escapeHtml(file.name)}</p>
        <p class="fs-file-upload-size">${error ? escapeHtml(error) : formatBytes(file.size)}</p>
        <div class="fs-progress fs-progress-sm" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso de ${escapeHtml(file.name)}">
          <div class="fs-progress-bar${error ? " fs-progress-bar-danger" : ""}" style="--fs-progress-value: ${progress};"></div>
        </div>
      </div>
      <button type="button" class="fs-btn-close fs-file-upload-remove" data-file-upload-remove aria-label="Remover ${escapeHtml(file.name)}"></button>
    `;
  }

  dispose() {
    this.inputEl.removeEventListener("change", this._handleChange);
    this.listEl.removeEventListener("click", this._handleListClick);

    for (const item of this._items.values()) {
      if (item.thumbUrl) URL.revokeObjectURL(item.thumbUrl);
    }
    this._items.clear();

    instances.delete(this.rootEl);
  }
}

autoInit("file-upload-advanced", FileUploadAdvanced);
