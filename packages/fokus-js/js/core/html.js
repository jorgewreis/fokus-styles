// Escapes plain text for HTML text nodes, not attribute interpolation.
export function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}
