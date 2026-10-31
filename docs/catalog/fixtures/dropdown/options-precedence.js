import { Dropdown } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="dropdown"]')]
  .map((element) => {
    // ESM imports can auto-init before this script; replace defaults explicitly.
    Dropdown.getInstance(element)?.dispose();
    return new Dropdown(element, { placement: "right", align: "center" });
  });
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
