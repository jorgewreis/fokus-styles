const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => el.offsetParent !== null);
}

export function createFocusTrap(container) {
  const inertSiblings = [];
  const setSiblingsInert = (value) => {
    if (!container.parentElement) return;
    [...container.parentElement.children].filter((el) => el !== container).forEach((el) => {
      if (value) {
        inertSiblings.push({ el, value: el.inert, ariaHidden: el.getAttribute("aria-hidden") });
        el.inert = true;
        el.setAttribute("aria-hidden", "true");
      } else {
        const previous = inertSiblings.find((item) => item.el === el);
        if (previous) {
          el.inert = previous.value;
          previous.ariaHidden === null ? el.removeAttribute("aria-hidden") : el.setAttribute("aria-hidden", previous.ariaHidden);
        }
      }
    });
  };
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
      setSiblingsInert(true);
      const focusable = getFocusableElements(container);
      if (focusable.length > 0) focusable[0].focus();
    },
    deactivate() {
      container.removeEventListener("keydown", handleKeydown);
      setSiblingsInert(false);
      inertSiblings.length = 0;
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
