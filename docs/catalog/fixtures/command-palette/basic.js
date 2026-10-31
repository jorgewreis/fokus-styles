import { CommandPalette } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="command-palette"]')]
  .map((element) => CommandPalette.getInstance(element) ?? new CommandPalette(element));

window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
