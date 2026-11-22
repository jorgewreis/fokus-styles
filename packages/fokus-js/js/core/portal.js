import { updateFocusIsolation } from "./focus.js";

// A popup belongs to its trigger's dialog, not the inert page behind it.
// Resolve on every open because applications can move triggers between dialogs.
export function createPortal(element, reference) {
  const parent = element.parentNode;
  const next = element.nextSibling;
  return {
    mount() {
      const root = reference.closest('.fs-modal-dialog, .fs-offcanvas, .fs-command-palette-dialog, [role="dialog"]') ?? document.body;
      if (element.parentNode !== root) updateFocusIsolation(() => root.appendChild(element));
    },
    restore() {
      if (parent) updateFocusIsolation(() => parent.insertBefore(element, next?.parentNode === parent ? next : null));
    },
  };
}
