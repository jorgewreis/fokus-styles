import { NestedMenu } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="nested-menu"]')]
  .map((element) => NestedMenu.getInstance(element) ?? new NestedMenu(element));
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
