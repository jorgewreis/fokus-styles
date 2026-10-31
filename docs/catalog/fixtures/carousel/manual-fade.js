import { Carousel } from "fokus-styles/js";

const instances = [...document.querySelectorAll('[data-fs="carousel"]')]
  .map(element => Carousel.getInstance(element) ?? new Carousel(element));
window.addEventListener("pagehide", () => {
  for (const instance of instances) instance.dispose();
}, { once: true });
