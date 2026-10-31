import { NotificationCenter, Toast } from "fokus-styles/js";

const trigger = document.querySelector('[data-fs="notification-center"]');
const instance = NotificationCenter.getInstance(trigger) ?? new NotificationCenter(trigger);
const add = document.getElementById("demo-notification");
const push = () => instance.push({ title: "Exemplo local", body: "Nenhum dado foi enviado.", variant: "info", autohide: false });
const focusPanel = () => instance.panelEl.querySelector("button")?.focus();
add.addEventListener("click", push);
trigger.addEventListener("fs:notification:opened", focusPanel);
window.addEventListener("pagehide", () => {
  add.removeEventListener("click", push);
  trigger.removeEventListener("fs:notification:opened", focusPanel);
  instance.dispose();
  for (const element of instance.toastContainer.querySelectorAll(".fs-toast")) {
    Toast.getInstance(element)?.dispose();
    element.remove();
  }
}, { once: true });
