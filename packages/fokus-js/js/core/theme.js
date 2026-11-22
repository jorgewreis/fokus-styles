export function applyThemeContext(targetEl, sourceEl) {
  targetEl.removeAttribute("data-theme");
  targetEl.removeAttribute("data-fs-theme");

  const root = sourceEl.closest("[data-fs-theme], [data-theme]");
  const themeAttr = root?.hasAttribute("data-fs-theme") ? "data-fs-theme" : "data-theme";
  const theme = root?.getAttribute(themeAttr);
  if (theme) targetEl.setAttribute(themeAttr, theme);
}
