const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => el.offsetParent !== null);
}

// Only the active trap isolates the page. Restore before recomputing so a
// sibling dialog can become active without inheriting another trap's inert.
const traps = [];
let isolated = [];

export function updateFocusIsolation(change = () => {}) {
  for (const { el, inert, inertAttribute, ariaHidden } of isolated) {
    el.inert = inert;
    if (inertAttribute === null) el.removeAttribute("inert");
    else el.setAttribute("inert", inertAttribute);
    if (ariaHidden === null) el.removeAttribute("aria-hidden");
    else el.setAttribute("aria-hidden", ariaHidden);
  }
  isolated = [];
  change();
  const container = traps.at(-1)?.container;
  for (let node = container; node?.parentElement && node !== document.body; node = node.parentElement) {
    for (const el of node.parentElement.children) {
      if (el === node) continue;
      isolated.push({ el, inert: el.inert, inertAttribute: el.getAttribute("inert"), ariaHidden: el.getAttribute("aria-hidden") });
      el.inert = true;
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    }
  }
}

export function createFocusTrap(container) {
  let addedTabindex = false;
  const trap = { container };
  let returnFocus;
  const focusFirst = () => {
    const first = getFocusableElements(container)[0];
    if (first) first.focus();
    else {
      if (!container.hasAttribute("tabindex")) {
        container.setAttribute("tabindex", "-1");
        addedTabindex = true;
      }
      container.focus();
    }
  };
  trap.focusFirst = focusFirst;
  function handleKeydown(event) {
    if (event.key !== "Tab" || traps.at(-1) !== trap) return;
    const focusable = getFocusableElements(container);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first) {
      event.preventDefault();
      focusFirst();
    } else if (event.shiftKey && (document.activeElement === first || document.activeElement === container)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === container)) {
      event.preventDefault();
      first.focus();
    }
  }

  return {
    activate() {
      if (traps.includes(trap)) return;
      returnFocus = document.activeElement;
      container.addEventListener("keydown", handleKeydown);
      updateFocusIsolation(() => {
        traps.push(trap);
        focusFirst();
      });
    },
    deactivate() {
      const wasTop = traps.at(-1) === trap;
      container.removeEventListener("keydown", handleKeydown);
      updateFocusIsolation(() => {
        const index = traps.indexOf(trap);
        if (index >= 0) traps.splice(index, 1);
        const active = traps.at(-1);
        if (wasTop && active) {
          if (returnFocus?.isConnected && active.container.contains(returnFocus)) returnFocus.focus();
          else active.focusFirst();
        }
      });
      if (addedTabindex) {
        container.removeAttribute("tabindex");
        addedTabindex = false;
      }
    },
  };
}

export function onEscapeKey(callback) {
  const handler = (event) => {
    if (event.key === "Escape") callback(event);
  };

  document.addEventListener("keydown", handler);

  return () => document.removeEventListener("keydown", handler);
}
