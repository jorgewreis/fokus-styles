import { Tooltip } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="tooltip"]')]
  .map((element) => {
    // ESM imports can auto-init before this script; replace defaults explicitly.
    Tooltip.getInstance(element)?.dispose();
    return new Tooltip(element, { placement: "left-end", align: "end", offset: 16, title: "Texto de fallback", showDelay: 150, hideDelay: 50 });
  });
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
