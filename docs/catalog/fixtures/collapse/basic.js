import { Collapse } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="collapse"]')]
  .map((element) => Collapse.getInstance(element) ?? new Collapse(element));
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
