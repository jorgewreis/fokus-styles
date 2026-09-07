const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => el.offsetParent !== null);
}

export function createFocusTrap(container) {
  function handleKeydown(event) {
    if (event.key !== "Tab") return;

    const focusable = getFocusableElements(container);

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  container.addEventListener("keydown", handleKeydown);

  return {
    activate() {
      const focusable = getFocusableElements(container);
      if (focusable.length > 0) focusable[0].focus();
    },
    deactivate() {
      container.removeEventListener("keydown", handleKeydown);
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
