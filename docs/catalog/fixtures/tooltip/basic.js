import { Tooltip } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="tooltip"]')]
  .map((element) => Tooltip.getInstance(element) ?? new Tooltip(element));
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
