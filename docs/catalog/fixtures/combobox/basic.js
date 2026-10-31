import { Combobox } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="combobox"]')]
  .map((element) => Combobox.getInstance(element) ?? new Combobox(element));

window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
