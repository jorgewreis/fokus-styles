import { NotificationCenter, Toast } from "fokus-styles/js";

const trigger = document.querySelector('[data-fs="notification-center"]');
const instance = NotificationCenter.getInstance(trigger) ?? new NotificationCenter(trigger);
const add = document.getElementById("demo-notification");
const push = () => instance.push({ title: "Aviso <local> literal", body: "Nenhum dado foi enviado.", variant: "warning", autohide: false });
const panel = document.getElementById("painel-notif");
const focusPanel = () => panel.querySelector("button")?.focus();
const remove = document.getElementById('feedback-remove');
const removeLatest = () => { const latest = instance.getAll()[0]; if (latest) instance.remove(latest.id); document.getElementById('feedback-status').textContent = `${instance.getAll().length} notificações no histórico.`; };
remove.addEventListener('click', removeLatest);
add.addEventListener("click", push);
trigger.addEventListener("fs:notification:opened", focusPanel);
window.addEventListener("pagehide", () => {
  add.removeEventListener("click", push);
  remove.removeEventListener("click", removeLatest);
  trigger.removeEventListener("fs:notification:opened", focusPanel);
  instance.dispose();
  for (const element of document.querySelectorAll("#demo-toast-container .fs-toast")) {
    Toast.getInstance(element)?.dispose();
    element.remove();
  }
}, { once: true });

