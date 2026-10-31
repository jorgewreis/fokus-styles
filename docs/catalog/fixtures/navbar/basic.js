import { Navbar } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="navbar"]')]
  .map((element) => Navbar.getInstance(element) ?? new Navbar(element));
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
