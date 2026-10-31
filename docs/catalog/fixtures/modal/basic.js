import { Modal } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="modal"]')]
  .map((element) => Modal.getInstance(element) ?? new Modal(element));
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
