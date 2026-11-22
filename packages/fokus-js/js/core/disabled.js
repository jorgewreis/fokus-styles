// Disabled state belongs to the interactive item itself. Native :disabled
// also handles controls disabled by a fieldset without inheriting ARIA state.
export function isDisabled(item) {
  return Boolean(
    item?.classList?.contains("is-disabled") ||
      item?.getAttribute?.("aria-disabled") === "true" ||
      item?.matches?.(":disabled"),
  );
}

// Prevent unavailable controls from activating before their target/bubble
// handlers run, while preserving navigation keys and all enabled defaults.
export function guardDisabledActivation(root, selector) {
  const guard = (event) => {
    if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
    const item = event.target.closest?.(selector);
    if (!item || !root.contains(item) || !isDisabled(item)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  const types = ["click", "auxclick", "keydown"];
  types.forEach((type) => root.addEventListener(type, guard, true));
  return () => types.forEach((type) => root.removeEventListener(type, guard, true));
}
