import { describe,it,expect,afterEach } from "vitest";
import fs from "node:fs";
import { DataTable } from "../../packages/fokus-js/js/datatable.js";
const fixture=(c,id,ext="html")=>fs.readFileSync(new URL("../../docs/catalog/fixtures/"+c+"/"+id+"."+ext,import.meta.url),"utf8");
afterEach(()=>{document.body.innerHTML="";});
describe("visual variants fixtures",()=>{
 it("all 18 fixtures are registered and match real CSS classes",()=>{
  const registry=JSON.parse(fs.readFileSync("docs/catalog/examples.json","utf8"));
  const css=fs.readFileSync("dist/css/fokus.css","utf8");
  for(const c of ["button","alert","badge","card","table","datatable"]) for(const id of ["variants","states","tokens"]){
   expect(registry[c].some(e=>e.id===id)).toBe(true);
   document.body.innerHTML=fixture(c,id);
   for(const el of document.querySelectorAll("[class]")) for(const cls of el.classList)
    if(cls.startsWith("fs-")) expect(css,cls).toContain("."+cls);
  }
 });
 it("buttons use native disabled for disabled and busy demonstrations",()=>{
  document.body.innerHTML=fixture("button","states");
  expect(document.querySelectorAll("button:disabled").length).toBe(2);
  expect(document.querySelector('[aria-busy="true"]').disabled).toBe(true);
 });
 it("alert dismissal and restoration return focus, repeatedly",()=>{
  document.body.innerHTML=fixture("alert","states");
  new Function(fixture("alert","states","js"))();
  for(let n=0;n<3;n++){
   document.querySelector(".fs-alert-close").click();
   expect(document.querySelector("#notice").hidden).toBe(true);
   expect(document.activeElement.id).toBe("restore");
   document.querySelector("#restore").click();
   expect(document.querySelector("#notice").hidden).toBe(false);
   expect(document.activeElement.classList.contains("fs-alert-close")).toBe(true);
  }
  window.dispatchEvent(new Event("pagehide"));
  document.querySelector(".fs-alert-close").click();
  expect(document.querySelector("#notice").hidden).toBe(false);
 });
 for(const id of ["variants","states","tokens"]) it("DataTable "+id+" sorts, pages, filters, recovers and disposes",()=>{
  document.body.innerHTML=fixture("datatable",id);
  const root=document.querySelector("[data-fs=datatable]");
  const instance=new DataTable(root);
  expect(instance.pageCount).toBe(2);
  root.querySelector('[data-fs-sort="amount"] button').click();
  expect(root.querySelector("tbody tr:not([hidden])").textContent).toContain("Davi");
  instance.goToPage(2);
  expect(root.querySelector("tbody tr:not([hidden])").textContent).toContain("Clara");
  const input=root.querySelector("input");
  input.value="inexistente";input.dispatchEvent(new Event("input"));
  expect(root.querySelector("[data-fs-datatable-empty]").hidden).toBe(false);
  input.value="";input.dispatchEvent(new Event("input"));
  for(let n=0;n<3;n++){
   instance.setLoading(true);expect(instance.tableEl.getAttribute("aria-busy")).toBe("true");expect(input.disabled).toBe(true);
   instance.setError("Falha");expect(root.querySelector("[data-fs-datatable-error]").hidden).toBe(false);
   instance.setLoading(false);instance.setError(null);
   expect(instance.tableEl.hidden).toBe(false);expect(input.disabled).toBe(false);
  }
  instance.dispose();expect(DataTable.getInstance(root)).toBeUndefined();
 });
});
