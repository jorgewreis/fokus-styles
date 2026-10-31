import { Combobox } from "fokus-styles/js";
const input = document.querySelector("#city");
// Opção explícita tem precedência sobre data-placement.
const instance = new Combobox(input, { placement: "bottom" });
const onChange = (event) => { document.querySelector("#city-result").textContent = `Selecionado: ${event.detail.label} (${event.detail.value})`; };
input.addEventListener("fs:combobox:changed", onChange);
window.addEventListener("pagehide", () => { input.removeEventListener("fs:combobox:changed", onChange); instance.dispose(); }, { once: true });
