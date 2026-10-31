import { Select } from "fokus-styles/js";
const instances = ["plan", "locked"].map((id) => {
  const native = document.getElementById(id);
  const instance = new Select(native);
  const toggle = native.nextElementSibling.querySelector("button");
  toggle.setAttribute("aria-labelledby", `${native.getAttribute("aria-labelledby")} ${toggle.id}`);
  document.getElementById(toggle.getAttribute("aria-controls")).querySelectorAll('[role="option"]').forEach((item, index) => {
    if (native.options[index].disabled) item.setAttribute("aria-disabled", "true");
  });
  return instance;
});
window.addEventListener("pagehide", () => { instances.forEach((instance) => instance.dispose()); }, { once: true });
