import { Popover } from "fokus-styles/js";
const trigger = document.querySelector('[data-fs="popover"]');
const instance = Popover.getInstance(trigger) ?? new Popover(trigger);
window.addEventListener("pagehide", () => { instance.dispose(); }, { once: true });
