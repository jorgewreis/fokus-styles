import { FileUploadAdvanced } from "fokus-styles/js";
const root = document.querySelector("#uploads");
const instance = new FileUploadAdvanced(root);
const handles = new Map();
const status = document.querySelector("#upload-state");
const added = (event) => { event.detail.items.forEach((item) => handles.set(item.id, item.file)); status.textContent = `${instance.getFiles().length} arquivo(s) na simulação.`; };
const removed = (event) => { handles.delete(event.detail.id); status.textContent = `${instance.getFiles().length} arquivo(s) restante(s).`; };
root.addEventListener("fs:file-upload:added", added);
root.addEventListener("fs:file-upload:removed", removed);
const actions = [["half", () => { handles.forEach((file, id) => instance.setProgress(id, 50)); status.textContent = "Progresso simulado: 50%."; }], ["fail", () => { handles.forEach((file, id) => instance.setError(id, "Falha simulada; nenhum envio realizado")); status.textContent = "Falha simulada."; }], ["done", () => { handles.forEach((file, id) => instance.setProgress(id, 100)); status.textContent = "Conclusão simulada: 100%."; }]];
actions.forEach(([id, handler]) => document.getElementById(id).addEventListener("click", handler));
window.addEventListener("pagehide", () => {
  actions.forEach(([id, handler]) => document.getElementById(id).removeEventListener("click", handler));
  root.removeEventListener("fs:file-upload:added", added); root.removeEventListener("fs:file-upload:removed", removed);
  instance.dispose(); handles.clear(); instance.listEl.replaceChildren(); instance.inputEl.value = "";
}, { once: true });
