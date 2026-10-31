import { RangeSlider } from "fokus-styles/js";
const instances = [...document.querySelectorAll('[data-fs="range"]')].map((input) => RangeSlider.getInstance(input) ?? new RangeSlider(input));
window.addEventListener("pagehide", () => { instances.forEach((instance) => instance.dispose()); }, { once: true });
