import { DataTable } from "fokus-styles/js";
const root=document.querySelector("[data-fs=datatable]");
const instance=DataTable.getInstance(root) ?? new DataTable(root);
window.addEventListener("pagehide",()=>instance.dispose(),{once:true});
document.querySelector("#load").addEventListener("click",()=>instance.setLoading(true));
document.querySelector("#error").addEventListener("click",()=>instance.setError("Falha demonstrativa. Tente recuperar."));
document.querySelector("#recover").addEventListener("click",()=>{instance.setLoading(false);instance.setError(null);});
