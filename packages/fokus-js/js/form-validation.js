import { autoInit, createInstanceRegistry } from "./core/register.js";

const instances = createInstanceRegistry();

export class FormValidation {
  constructor(form) { this.form = form; this._submit = (event) => this.validate(event); form.addEventListener("submit", this._submit); instances.set(form, this); }
  static getInstance(el) { return instances.get(el); }
  static getOrCreateInstance(el) { return this.getInstance(el) ?? new FormValidation(el); }
  validate(event) {
    const valid = this.form.checkValidity();
    this.form.classList.add("fs-was-validated");
    this.form.querySelectorAll('[required], [aria-required="true"]').forEach((field) => field.setAttribute("aria-invalid", String(!field.checkValidity())));
    if (!valid) { event.preventDefault(); event.stopPropagation(); }
    this.form.dispatchEvent(new CustomEvent("fs:form:validated", { bubbles: true, detail: { valid } }));
    return valid;
  }
  dispose() { this.form.removeEventListener("submit", this._submit); instances.delete(this.form); }
}

autoInit("form-validation", FormValidation);
