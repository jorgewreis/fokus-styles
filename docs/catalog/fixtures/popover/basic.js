import { Popover } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="popover"]')]
  .map((element) => Popover.getInstance(element) ?? new Popover(element));
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
