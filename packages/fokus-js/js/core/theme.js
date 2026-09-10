export function applyThemeContext(targetEl, sourceEl) {
  targetEl.removeAttribute("data-theme");
  targetEl.removeAttribute("data-fs-theme");

  const themeAttr = sourceEl.hasAttribute("data-fs-theme") ? "data-fs-theme" : "data-theme";
  const theme = sourceEl.closest(`[${themeAttr}]`)?.getAttribute(themeAttr);
  if (theme) targetEl.setAttribute(themeAttr, theme);
}
