import { Breadcrumb } from "fokus-styles/js";
const element = document.querySelector('[data-fs="breadcrumb"]');
const instance = Breadcrumb.getInstance(element) ?? new Breadcrumb(element);
window.addEventListener("pagehide", () => instance.dispose(), { once: true });
