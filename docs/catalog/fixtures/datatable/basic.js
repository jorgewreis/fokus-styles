import { DataTable } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="datatable"]')]
  .map((element) => DataTable.getInstance(element) ?? new DataTable(element));

window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
