import { Accordion } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="accordion"]')]
  .map((element) => Accordion.getInstance(element) ?? new Accordion(element));
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
