import { Tag } from "fokus-styles/js";
const element = document.getElementById("pending-tag");
const instance = Tag.getInstance(element) ?? new Tag(element);
const controller = new AbortController();
document.getElementById("complete-tag").addEventListener("click", () => instance.setLoading(false), { signal: controller.signal });
window.addEventListener("pagehide", () => { controller.abort(); instance.dispose(); }, { once: true });
