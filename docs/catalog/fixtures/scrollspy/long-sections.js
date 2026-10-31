import { Scrollspy } from "fokus-styles/js";

const nav = document.querySelector('[data-fs="scrollspy"]');
const syncCurrent = event => {
  for (const link of nav.querySelectorAll('a[href^="#"]')) {
    if (link.getAttribute("href") === `#${event.detail.section.id}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
};
nav.addEventListener("fs:scrollspy:activate", syncCurrent);
const instance = Scrollspy.getInstance(nav) ?? new Scrollspy(nav);
instance.activate(document.getElementById("introducao"));
window.addEventListener("pagehide", () => {
  instance.dispose();
  nav.removeEventListener("fs:scrollspy:activate", syncCurrent);
}, { once: true });
