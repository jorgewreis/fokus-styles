import { Tag } from "fokus-styles/js";
const element = document.getElementById("pending-tag");
const instance = Tag.getInstance(element) ?? new Tag(element);
const controller = new AbortController();
document.getElementById("complete-tag").addEventListener("click", () => {
  instance.setLoading(false);
  // O disabled inicial pertence a esta aplicação, não ao estado JS de loading.
  element.querySelector('[data-fs-dismiss="tag"]').disabled = false;
}, { signal: controller.signal });
window.addEventListener("pagehide", () => { controller.abort(); instance.dispose(); }, { once: true });
