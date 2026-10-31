import { confirm } from "fokus-styles/js";

const trigger = document.getElementById("btn-excluir");
const result = document.getElementById("confirm-result");
let pending = false;
let ownedDialog = null;
let disposed = false;
const open = async () => {
  if (pending || disposed) return;
  pending = true;
  trigger.disabled = true;
  const existing = new Set(document.querySelectorAll(".fs-alert-dialog"));
  const promise = confirm({ title: "Excluir conta?", message: "Demonstração: nenhum dado será excluído.", confirmText: "Confirmar demonstração", variant: "danger" });
  ownedDialog = [...document.querySelectorAll(".fs-alert-dialog")].find(el => !existing.has(el));
  const confirmed = await promise;
  ownedDialog = null;
  pending = false;
  trigger.disabled = false;
  if (!disposed) trigger.focus();
  if (!disposed) result.textContent = confirmed ? "Demonstração confirmada; nenhum dado foi excluído." : "Demonstração cancelada.";
};
trigger.addEventListener("click", open);
window.addEventListener("pagehide", () => {
  disposed = true;
  trigger.removeEventListener("click", open);
  ownedDialog?.querySelector('[data-action="cancel"]')?.click();
}, { once: true });
