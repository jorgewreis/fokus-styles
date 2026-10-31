import { Offcanvas } from "fokus-styles/js";
const trigger = document.querySelector('[data-fs="offcanvas"]');
const instance = Offcanvas.getInstance(trigger) ?? new Offcanvas(trigger);
window.addEventListener("pagehide", () => { instance.dispose(); }, { once: true });
