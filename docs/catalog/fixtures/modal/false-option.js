import { Modal } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="modal"]')]
  .map((element) => {
    // ESM imports can auto-init before this script; replace defaults explicitly.
    Modal.getInstance(element)?.dispose();
    return new Modal(element, { backdrop: false });
  });
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
