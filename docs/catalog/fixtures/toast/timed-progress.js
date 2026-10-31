import { Toast } from "fokus-styles/js";
const instances = [...document.querySelectorAll('[data-fs="toast"]')].map(el => Toast.getInstance(el) ?? new Toast(el));
const controller = new AbortController();
document.getElementById('feedback-show').addEventListener('click', () => instances.forEach(instance => instance.show()), { signal: controller.signal });
window.addEventListener('pagehide', () => { controller.abort(); instances.forEach(instance => instance.dispose()); }, { once: true });
