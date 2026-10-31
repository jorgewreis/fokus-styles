import { NestedMenu } from "fokus-styles/js";
const element = document.querySelector('[data-fs="nested-menu"]');
const instance = NestedMenu.getInstance(element) ?? new NestedMenu(element);
window.addEventListener("pagehide", () => instance.dispose(), { once: true });
