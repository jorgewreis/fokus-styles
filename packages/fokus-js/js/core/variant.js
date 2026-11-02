// Only documented semantic variants may become component class names.
const variants = new Set(["primary", "secondary", "success", "warning", "danger", "info"]);

export function normalizeVariant(value, fallback = "primary") {
  return variants.has(value) ? value : fallback;
}
