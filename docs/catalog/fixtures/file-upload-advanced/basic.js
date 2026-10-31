import { FileUploadAdvanced } from "fokus-styles/js";

const root = document.querySelector('[data-fs="file-upload-advanced"]');
const instance = FileUploadAdvanced.getInstance(root) ?? new FileUploadAdvanced(root);
window.addEventListener("pagehide", () => {
  instance.dispose();
  root.querySelector(".fs-file-upload-list")?.replaceChildren();
  root.querySelector("input").value = "";
}, { once: true });
