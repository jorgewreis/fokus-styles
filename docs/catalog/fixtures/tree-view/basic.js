import { TreeView } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="tree-view"]')]
  .map((element) => TreeView.getInstance(element) ?? new TreeView(element));

window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
