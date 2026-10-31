import { Toast } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="toast"]')]
  .map((element) => Toast.getInstance(element) ?? new Toast(element));
const trigger = document.getElementById("mostrar-toast");
const show = () => instances[0].show();
trigger.addEventListener("click", show);
window.addEventListener("pagehide", () => {
  trigger.removeEventListener("click", show);
  for (const instance of instances) instance.dispose();
}, { once: true });
