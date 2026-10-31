import { Datepicker } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="datepicker"]')]
  .map((element) => Datepicker.getInstance(element) ?? new Datepicker(element));

for (const instance of instances) {
  instance.gridEl.setAttribute("aria-label", "Data de entrega");
}

window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
