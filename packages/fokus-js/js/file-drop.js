import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

// Evolui o upload de arquivo (scss/forms/_forms.scss, Fase 6) com
// arrastar-e-soltar sobre o `.fs-file-label`. Auto-init com
// `data-fs="file-drop"` no próprio `<label for="...">` — o input nativo
// associado é resolvido pelo atributo `for`, mesmo vínculo que já existe
// entre `.fs-file-input`/`.fs-file-label`.
export class FileDrop {
  constructor(labelEl) {
    const inputEl = document.getElementById(labelEl.getAttribute("for"));

    if (!inputEl) {
      throw new Error("FokusStyles.FileDrop: input associado (via for=) não encontrado.");
    }

    this.labelEl = labelEl;
    this.inputEl = inputEl;
    this._dragDepth = 0;

    this._handleDragEnter = this._handleDragEnter.bind(this);
    this._handleDragOver = this._handleDragOver.bind(this);
    this._handleDragLeave = this._handleDragLeave.bind(this);
    this._handleDrop = this._handleDrop.bind(this);

    labelEl.addEventListener("dragenter", this._handleDragEnter);
    labelEl.addEventListener("dragover", this._handleDragOver);
    labelEl.addEventListener("dragleave", this._handleDragLeave);
    labelEl.addEventListener("drop", this._handleDrop);

    instances.set(labelEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  // Conta entradas/saídas (dragenter/dragleave também disparam nos filhos do
  // label, ex. o texto do hint) — só remove o estado visual quando a
  // contagem volta a zero, senão `.is-dragover` pisca ao arrastar por cima
  // de um elemento interno.
  _handleDragEnter(event) {
    event.preventDefault();
    this._dragDepth += 1;
    this.labelEl.classList.add("is-dragover");
  }

  _handleDragOver(event) {
    event.preventDefault();
  }

  _handleDragLeave(event) {
    event.preventDefault();
    this._dragDepth = Math.max(0, this._dragDepth - 1);
    if (this._dragDepth === 0) {
      this.labelEl.classList.remove("is-dragover");
    }
  }

  _handleDrop(event) {
    event.preventDefault();
    this._dragDepth = 0;
    this.labelEl.classList.remove("is-dragover");

    if (this.inputEl.disabled) return;

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    this.inputEl.files = files;
    this.inputEl.dispatchEvent(new Event("change", { bubbles: true }));
  }

  dispose() {
    this.labelEl.removeEventListener("dragenter", this._handleDragEnter);
    this.labelEl.removeEventListener("dragover", this._handleDragOver);
    this.labelEl.removeEventListener("dragleave", this._handleDragLeave);
    this.labelEl.removeEventListener("drop", this._handleDrop);
    instances.delete(this.labelEl);
  }
}

autoInit("file-drop", FileDrop);
