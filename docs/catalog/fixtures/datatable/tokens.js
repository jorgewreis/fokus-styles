import { DataTable } from "fokus-styles/js";
const root=document.querySelector("[data-fs=datatable]");
const instance=DataTable.getInstance(root) ?? new DataTable(root);
window.addEventListener("pagehide",()=>instance.dispose(),{once:true});
