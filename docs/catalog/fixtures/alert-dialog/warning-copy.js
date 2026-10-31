import { confirm } from "fokus-styles/js";
const trigger = document.getElementById("preview-confirm");
const result = document.getElementById("preview-result");
let pending = false;
let disposed = false;
let ownedDialog = null;
const open = async () => {
  if (pending || disposed) return;
  pending = true;
  trigger.disabled = true;
  const existing = new Set(document.querySelectorAll(".fs-alert-dialog"));
  const promise = confirm({ title: "Sair sem salvar?", message: "Texto literal: <rascunho> & alterações locais.", confirmText: "Sair na demonstração", cancelText: "Continuar editando", variant: "warning" });
  ownedDialog = [...document.querySelectorAll(".fs-alert-dialog")].find(el => !existing.has(el));
  const confirmed = await promise;
  ownedDialog = null;
  pending = false;
  trigger.disabled = false;
  if (!disposed) trigger.focus();
  if (!disposed) result.textContent = confirmed ? "Saída simulada; nenhum dado alterado." : "Edição mantida na demonstração.";
};
trigger.addEventListener("click", open);
window.addEventListener("pagehide", () => {
  disposed = true;
  trigger.removeEventListener("click", open);
  ownedDialog?.querySelector('[data-action="cancel"]')?.click();
}, { once: true });
