import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

function computePercent(inputEl) {
  const min = Number(inputEl.min || 0);
  const max = Number(inputEl.max || 100);
  const value = Number(inputEl.value);

  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
}

// Range/Slider: o <input type="range"> nativo já cobre teclado (setas,
// Home/End, PageUp/Down) e ARIA (role=slider implícito, aria-valuenow
// automático) sem nenhum JS — este componente só resolve dois pontos que
// o CSS puro não alcança: (1) pintar a trilha preenchida até o valor atual
// via `--fs-range-percent` (truque necessário porque só o Firefox suporta
// `::-moz-range-progress`; ver _range.scss); (2) espelhar o valor num
// `<output>` associado (`data-fs-target`), pra quem não consegue perceber
// a posição do thumb só visualmente.
export class RangeSlider {
  constructor(inputEl) {
    const targetSelector = inputEl.getAttribute("data-fs-target");
    const outputEl = targetSelector ? document.querySelector(targetSelector) : null;

    this.inputEl = inputEl;
    this.outputEl = outputEl;

    this._handleInput = this._handleInput.bind(this);
    inputEl.addEventListener("input", this._handleInput);

    this._render();

    instances.set(inputEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _handleInput() {
    this._render();
  }

  _render() {
    this.inputEl.style.setProperty("--fs-range-percent", `${computePercent(this.inputEl)}%`);
    if (this.outputEl) this.outputEl.textContent = this.inputEl.value;
  }

  dispose() {
    this.inputEl.removeEventListener("input", this._handleInput);
    instances.delete(this.inputEl);
  }
}

autoInit("range", RangeSlider);
