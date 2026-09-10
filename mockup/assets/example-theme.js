// Os exemplos são carregados em iframes pelos laboratórios. O tema vem da
// página-pai via query string, para que uma única ação altere toda a página.
const exampleTheme = new URLSearchParams(window.location.search).get("theme");
const showcaseOnly = new URLSearchParams(window.location.search).get("showcase-only");

if (exampleTheme === "dark") {
  document.documentElement.setAttribute("data-fs-theme", "dark");
  document.documentElement.setAttribute("data-theme", "dark");
} else {
  document.documentElement.setAttribute("data-fs-theme", "light");
  document.documentElement.removeAttribute("data-theme");
}

function applyShowcaseState(state) {
  document.documentElement.dir = state.rtl ? "rtl" : "ltr";
  document.documentElement.toggleAttribute("data-showcase-forced-colors", Boolean(state.forcedColors));

  let style = document.getElementById("showcase-preview-state-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "showcase-preview-state-style";
    document.head.append(style);
  }
  style.textContent = state.reducedMotion
    ? "*, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .001ms !important; }"
    : "";
}

function applyShowcaseOnly() {
  if (!showcaseOnly) return;

  let selected;
  try {
    selected = document.querySelector(showcaseOnly)?.closest("[data-showcase-demo]");
  } catch {
    selected = null;
  }

  if (!selected) return;

  document.querySelectorAll("[data-showcase-demo]").forEach((demo) => {
    demo.hidden = demo !== selected;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyShowcaseOnly, { once: true });
} else {
  applyShowcaseOnly();
}

window.addEventListener("message", (event) => {
  if (event.source === window.parent && event.data?.type === "fokus-showcase-state") {
    applyShowcaseState(event.data);
  }
});
