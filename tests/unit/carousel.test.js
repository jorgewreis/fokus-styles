import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { Carousel } from "../../packages/fokus-js/js/carousel.js";

function buildCarousel({ autoplay = false, interval, slides = 3, toggle = false, counter = false, progress = false, drag = true } = {}) {
  const container = document.createElement("div");
  const autoplayAttr = autoplay ? ` data-autoplay="true"` : "";
  const intervalAttr = interval ? ` data-interval="${interval}"` : "";
  const items = Array.from(
    { length: slides },
    (_, index) => `<div class="fs-carousel-item${index === 0 ? " is-active" : ""}">Slide ${index + 1}</div>`,
  ).join("");
  const indicators = Array.from(
    { length: slides },
    (_, index) => `<li><button type="button" aria-label="Slide ${index + 1}"></button></li>`,
  ).join("");
  container.innerHTML = `
    <div class="fs-carousel" id="carousel"${autoplayAttr}${intervalAttr}${drag ? "" : ' data-drag="false"'}>
      <div class="fs-carousel-inner">${items}</div>
      <button class="fs-carousel-control-prev" type="button" aria-label="Anterior"></button>
      <button class="fs-carousel-control-next" type="button" aria-label="Próximo"></button>
      ${toggle ? '<button class="fs-carousel-control-toggle" type="button" data-fs-carousel-toggle></button>' : ""}
      <ol class="fs-carousel-indicators">${indicators}</ol>
      ${counter ? '<span data-fs-carousel-counter></span>' : ""}
      ${progress ? '<div data-fs-carousel-progress><span></span></div>' : ""}
    </div>
  `;
  document.body.appendChild(container);
  const el = container.querySelector("#carousel");
  return { container, el, carousel: new Carousel(el) };
}

function dispatchPointer(target, type, { clientX, clientY = 0, pointerId = 1, pointerType = "mouse" } = {}) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    clientX: { value: clientX },
    clientY: { value: clientY },
    pointerId: { value: pointerId },
    pointerType: { value: pointerType },
    isPrimary: { value: true },
    button: { value: 0 },
  });
  target.dispatchEvent(event);
}

describe("Carousel", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    document.body.innerHTML = "";
  });

  it("getInstance() retorna a instância criada", () => {
    const { el, carousel } = buildCarousel();
    expect(Carousel.getInstance(el)).toBe(carousel);
    carousel.dispose();
  });

  it("define semântica, estado ativo e aria-live manual", () => {
    const { el, carousel } = buildCarousel();
    const items = el.querySelectorAll(".fs-carousel-item");
    expect(el.getAttribute("role")).toBe("group");
    expect(el.getAttribute("aria-roledescription")).toBe("carousel");
    expect(el.querySelector(".fs-carousel-inner").getAttribute("aria-live")).toBe("polite");
    expect(items[0].getAttribute("aria-hidden")).toBe("false");
    expect(items[1].getAttribute("aria-hidden")).toBe("true");
    expect(items[0].hasAttribute("inert")).toBe(false);
    expect(items[1].hasAttribute("inert")).toBe(true);
    carousel.dispose();
  });

  it("next(), prev() e goTo() preservam a navegação circular", () => {
    const { el, carousel } = buildCarousel();
    const items = el.querySelectorAll(".fs-carousel-item");
    carousel.next();
    expect(items[1].classList.contains("is-active")).toBe(true);
    carousel.prev();
    carousel.prev();
    expect(items[2].classList.contains("is-active")).toBe(true);
    carousel.goTo(1);
    expect(items[1].classList.contains("is-active")).toBe(true);
    carousel.dispose();
  });

  it("controles e indicadores navegam e sincronizam aria-current", () => {
    const { el, carousel } = buildCarousel();
    el.querySelector(".fs-carousel-control-next").click();
    const indicators = el.querySelectorAll(".fs-carousel-indicators button");
    indicators[2].click();
    expect(el.querySelectorAll(".fs-carousel-item")[2].classList.contains("is-active")).toBe(true);
    expect(indicators[2].getAttribute("aria-current")).toBe("true");
    carousel.dispose();
  });

  it("teclado navega apenas quando o próprio contêiner recebe o evento", () => {
    const { el, carousel } = buildCarousel();
    const items = el.querySelectorAll(".fs-carousel-item");
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    expect(items[2].classList.contains("is-active")).toBe(true);
    el.querySelector(".fs-carousel-control-next").dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    expect(items[2].classList.contains("is-active")).toBe(true);
    carousel.dispose();
  });

  it("dispara fs:carousel:slid com from/to no detail", () => {
    const { el, carousel } = buildCarousel();
    const handler = vi.fn();
    el.addEventListener("fs:carousel:slid", handler);
    carousel.next();
    expect(handler.mock.calls[0][0].detail).toEqual({ from: 0, to: 1 });
    carousel.dispose();
  });

  describe("autoplay", () => {
    beforeEach(() => vi.useFakeTimers());

    it("pausa temporariamente no hover e retoma ao sair", () => {
      const { el, carousel } = buildCarousel({ autoplay: true, interval: 1000 });
      const items = el.querySelectorAll(".fs-carousel-item");
      vi.advanceTimersByTime(1000);
      expect(items[1].classList.contains("is-active")).toBe(true);
      el.dispatchEvent(new MouseEvent("mouseenter"));
      vi.advanceTimersByTime(2000);
      expect(items[1].classList.contains("is-active")).toBe(true);
      el.dispatchEvent(new MouseEvent("mouseleave"));
      vi.advanceTimersByTime(1000);
      expect(items[2].classList.contains("is-active")).toBe(true);
      carousel.dispose();
    });

    it("pause() é persistente até play() e atualiza o toggle", () => {
      const { el, carousel } = buildCarousel({ autoplay: true, interval: 1000, toggle: true });
      const toggle = el.querySelector("[data-fs-carousel-toggle]");
      expect(toggle.getAttribute("aria-pressed")).toBe("true");
      carousel.pause();
      expect(el.classList.contains("is-autoplay-paused")).toBe(true);
      el.dispatchEvent(new MouseEvent("mouseleave"));
      vi.advanceTimersByTime(2000);
      expect(el.querySelectorAll(".fs-carousel-item")[0].classList.contains("is-active")).toBe(true);
      expect(toggle.getAttribute("aria-pressed")).toBe("false");
      carousel.play();
      expect(el.classList.contains("is-autoplay-paused")).toBe(false);
      vi.advanceTimersByTime(1000);
      expect(el.querySelectorAll(".fs-carousel-item")[1].classList.contains("is-active")).toBe(true);
      toggle.click();
      expect(toggle.getAttribute("aria-pressed")).toBe("false");
      carousel.dispose();
    });

    it("pausa na aba oculta e só retoma quando ela volta", () => {
      const { el, carousel } = buildCarousel({ autoplay: true, interval: 1000 });
      Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
      document.dispatchEvent(new Event("visibilitychange"));
      vi.advanceTimersByTime(2000);
      expect(el.querySelectorAll(".fs-carousel-item")[0].classList.contains("is-active")).toBe(true);
      Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
      document.dispatchEvent(new Event("visibilitychange"));
      vi.advanceTimersByTime(1000);
      expect(el.querySelectorAll(".fs-carousel-item")[1].classList.contains("is-active")).toBe(true);
      carousel.dispose();
    });
  });

  it("arrasta horizontalmente, volta ao estado ao cancelar e ignora controles", () => {
    const { el, carousel } = buildCarousel();
    const item = el.querySelector(".fs-carousel-item");
    dispatchPointer(item, "pointerdown", { clientX: 200 });
    dispatchPointer(el, "pointermove", { clientX: 120 });
    expect(el.classList.contains("is-dragging")).toBe(true);
    dispatchPointer(el, "pointercancel", { clientX: 120 });
    expect(el.classList.contains("is-dragging")).toBe(false);
    expect(el.querySelectorAll(".fs-carousel-item")[0].classList.contains("is-active")).toBe(true);
    dispatchPointer(item, "pointerdown", { clientX: 200 });
    dispatchPointer(el, "pointermove", { clientX: 100 });
    dispatchPointer(el, "pointerup", { clientX: 100 });
    expect(el.querySelectorAll(".fs-carousel-item")[1].classList.contains("is-active")).toBe(true);
    dispatchPointer(el.querySelector(".fs-carousel-control-next"), "pointerdown", { clientX: 200 });
    dispatchPointer(el, "pointermove", { clientX: 100 });
    dispatchPointer(el, "pointerup", { clientX: 100 });
    expect(el.querySelectorAll(".fs-carousel-item")[1].classList.contains("is-active")).toBe(true);
    carousel.dispose();
  });

  it("trata um único slide como estático e sem tab stop automático", () => {
    const { el, carousel } = buildCarousel({ slides: 1 });
    expect(el.classList.contains("is-static")).toBe(true);
    expect(el.hasAttribute("tabindex")).toBe(false);
    carousel.dispose();
  });

  it("sincroniza contador, progresso e a opção de desativar arraste", () => {
    const { el, carousel } = buildCarousel({ autoplay: true, counter: true, progress: true, drag: false });
    const counter = el.querySelector("[data-fs-carousel-counter]");
    const progress = el.querySelector("[data-fs-carousel-progress]");
    expect(counter.textContent).toBe("1 de 3");
    expect(progress.classList.contains("is-running")).toBe(true);
    carousel.next();
    expect(counter.textContent).toBe("2 de 3");
    dispatchPointer(el.querySelector(".fs-carousel-item"), "pointerdown", { clientX: 200 });
    dispatchPointer(el, "pointermove", { clientX: 100 });
    expect(el.classList.contains("is-dragging")).toBe(false);
    carousel.dispose();
  });

  it("dispose() para o timer, remove listeners e o registro", () => {
    const { el, carousel } = buildCarousel({ autoplay: true });
    carousel.dispose();
    expect(Carousel.getInstance(el)).toBeUndefined();
  });
});
