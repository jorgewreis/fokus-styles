import { Dropdown } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="dropdown"]')]
  .map((element) => Dropdown.getInstance(element) ?? new Dropdown(element));
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
