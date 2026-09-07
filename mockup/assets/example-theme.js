// Os exemplos são carregados em iframes pelos laboratórios. O tema vem da
// página-pai via query string, para que uma única ação altere toda a página.
const exampleTheme = new URLSearchParams(window.location.search).get("theme");

if (exampleTheme === "dark") {
  document.documentElement.setAttribute("data-fs-theme", "dark");
  document.documentElement.setAttribute("data-theme", "dark");
} else {
  document.documentElement.setAttribute("data-fs-theme", "light");
  document.documentElement.removeAttribute("data-theme");
}
