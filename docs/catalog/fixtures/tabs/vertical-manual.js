import { Tabs } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="tabs"]')]
  .map((element) => Tabs.getInstance(element) ?? new Tabs(element));
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
