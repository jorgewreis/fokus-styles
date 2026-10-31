import { Datepicker } from "fokus-styles/js";
const input = document.querySelector("#month-end");
const instance = new Datepicker(input, { placement: "bottom" });
// Nome no DOM gerado: não depende de gridEl, ausente no contrato tipado.
instance.panelEl.querySelector('[role="grid"]').setAttribute("aria-label", "Data de referência");
const onChange = (event) => { document.querySelector("#date-result").textContent = `Data ISO: ${event.detail.value}`; };
input.addEventListener("fs:datepicker:changed", onChange);
window.addEventListener("pagehide", () => { input.removeEventListener("fs:datepicker:changed", onChange); instance.dispose(); }, { once: true });
