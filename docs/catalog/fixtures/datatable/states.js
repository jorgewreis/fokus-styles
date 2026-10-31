import { DataTable } from "fokus-styles/js";
const root = document.querySelector("[data-fs=datatable]");
const instance = DataTable.getInstance(root) ?? new DataTable(root);
const controller = new AbortController();
const options = { signal: controller.signal };
document.querySelector("#load").addEventListener("click", () => instance.setLoading(true), options);
document.querySelector("#error").addEventListener("click", () => instance.setError("Falha demonstrativa. Tente recuperar."), options);
document.querySelector("#recover").addEventListener("click", () => {
  instance.setLoading(false);
  instance.setError(null);
}, options);
window.addEventListener("pagehide", () => {
  controller.abort();
  instance.dispose();
}, { once: true });
