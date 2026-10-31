import { Select } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="select"]')]
  .map((element) => Select.getInstance(element) ?? new Select(element));

// O runtime não transfere o nome do select para o botão gerado.
for (const instance of instances) {
  const toggle = instance.selectEl.nextElementSibling.querySelector("button");
  toggle.setAttribute("aria-labelledby", `catalog-country-label ${toggle.id}`);
}

window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
