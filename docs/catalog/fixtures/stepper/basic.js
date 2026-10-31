import { Stepper } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="stepper"]')]
  .map((element) => Stepper.getInstance(element) ?? new Stepper(element));
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
