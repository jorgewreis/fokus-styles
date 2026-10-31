import { Offcanvas } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="offcanvas"]')]
  .map((element) => Offcanvas.getInstance(element) ?? new Offcanvas(element));
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
