import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

export class Stepper {
  constructor(stepperEl) {
    this.stepperEl = stepperEl;
    this.steps = Array.from(stepperEl.querySelectorAll(".fs-step"));
    this.linear = stepperEl.getAttribute("data-linear") !== "false";

    const contentPanels = Array.from(stepperEl.querySelectorAll(".fs-step-panel"));
    this.panels = this.steps.map((step, i) =>
      step.dataset.fsTarget ? stepperEl.querySelector(step.dataset.fsTarget) : contentPanels[i],
    );

    this.prevBtn = stepperEl.querySelector('[data-stepper="prev"]');
    this.nextBtn = stepperEl.querySelector('[data-stepper="next"]');
    this.finished = false;

    this.current = Math.max(
      this.steps.findIndex((step) => step.classList.contains("fs-step-active")),
      0,
    );

    this.steps.forEach((step, i) => {
      step.setAttribute("role", "listitem");
      step.handleClick = () => this._onStepClick(i);
      step.addEventListener("click", step.handleClick);
      step.handleKeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this._onStepClick(i);
        }
      };
      step.addEventListener("keydown", step.handleKeydown);
    });

    this._handlePrev = () => this.prev();
    this._handleNext = () => this.next();
    this.prevBtn?.addEventListener("click", this._handlePrev);
    this.nextBtn?.addEventListener("click", this._handleNext);

    this._render();
    instances.set(stepperEl, this);
  }

  static getInstance(el) {
    return instances.get(el);
  }

  _onStepClick(index) {
    // Modo linear: só permite voltar para passos já concluídos (ou o atual).
    if (this.linear && index > this.current) return;
    this.goTo(index);
  }

  _render() {
    this.steps.forEach((step, i) => {
      const isActive = i === this.current && !this.finished;
      const isCompleted = i < this.current || this.finished;

      step.classList.toggle("fs-step-active", isActive);
      step.classList.toggle("fs-step-completed", isCompleted);
      step.setAttribute("aria-current", isActive ? "step" : "false");

      const clickable = this.linear ? isCompleted : true;
      step.classList.toggle("fs-step-clickable", clickable);
      step.setAttribute("tabindex", clickable ? "0" : "-1");

      const panel = this.panels[i];
      if (panel) panel.classList.toggle("is-active", i === this.current);
    });

    if (this.prevBtn) this.prevBtn.disabled = this.current === 0 && !this.finished;
  }

  _change(to) {
    const from = this.current;
    const target = Math.max(0, Math.min(to, this.steps.length - 1));
    if (target === from && !this.finished) return false;

    const before = new CustomEvent("fs:stepper:beforechange", {
      bubbles: true,
      cancelable: true,
      detail: { from, to: target },
    });
    this.stepperEl.dispatchEvent(before);
    if (before.defaultPrevented) return false;

    this.finished = false;
    this.current = target;
    this._render();

    this.stepperEl.dispatchEvent(
      new CustomEvent("fs:stepper:changed", { bubbles: true, detail: { from, to: target } }),
    );
    return true;
  }

  next() {
    if (this.current < this.steps.length - 1) return this._change(this.current + 1);
    return this.complete();
  }

  prev() {
    return this._change(this.current - 1);
  }

  goTo(index) {
    return this._change(index);
  }

  setError(index, hasError = true) {
    const step = this.steps[index];
    if (step) step.classList.toggle("fs-step-error", hasError);
  }

  complete() {
    const before = new CustomEvent("fs:stepper:beforechange", {
      bubbles: true,
      cancelable: true,
      detail: { from: this.current, to: this.current, completing: true },
    });
    this.stepperEl.dispatchEvent(before);
    if (before.defaultPrevented) return false;

    this.finished = true;
    this._render();
    this.stepperEl.dispatchEvent(new CustomEvent("fs:stepper:completed", { bubbles: true }));
    return true;
  }

  dispose() {
    this.steps.forEach((step) => {
      step.removeEventListener("click", step.handleClick);
      step.removeEventListener("keydown", step.handleKeydown);
    });
    this.prevBtn?.removeEventListener("click", this._handlePrev);
    this.nextBtn?.removeEventListener("click", this._handleNext);
    instances.delete(this.stepperEl);
  }
}

autoInit("stepper", Stepper);
