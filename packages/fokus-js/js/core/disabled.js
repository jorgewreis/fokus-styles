// Internal interaction predicate. ARIA/class state is local to the item;
// :disabled also respects native disabled fieldsets without inventing inheritance.
export function isDisabled(item) {
  return item.classList.contains("is-disabled") || item.matches(":disabled") || item.getAttribute("aria-disabled") === "true";
}

// Only unavailable activation is intercepted. Enabled handlers retain their
// original order/defaults; arrows, Escape and Tab remain component navigation.
export function guardDisabledActivation(root, selector) {
  const guard = (event) => {
    if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
    const item = event.target.closest?.(selector);
    if (!item || !root.contains(item) || !isDisabled(item)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  const types = ["click", "auxclick", "keydown"];
  types.forEach(type => root.addEventListener(type, guard, true));
  return () => types.forEach(type => root.removeEventListener(type, guard, true));
}
