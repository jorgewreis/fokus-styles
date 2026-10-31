import { Navbar } from "fokus-styles/js";
const element = document.querySelector('[data-fs="navbar"]');
const instance = Navbar.getInstance(element) ?? new Navbar(element);
window.addEventListener("pagehide", () => instance.dispose(), { once: true });
