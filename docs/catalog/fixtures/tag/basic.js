import { Tag } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="tag"]')]
  .map((element) => Tag.getInstance(element) ?? new Tag(element));
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
