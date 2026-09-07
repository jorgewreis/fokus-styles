import { describe, it, expect, vi, afterEach } from "vitest";
import { collapse, expand, onTransitionEnd } from "../../../packages/fokus-js/js/core/transition.js";

function dispatchTransitionEnd(el, propertyName = "height") {
  const event = new Event("transitionend", { bubbles: false });
  event.propertyName = propertyName;
  el.dispatchEvent(event);
}

async function flushDoubleRaf() {
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

describe("collapse / expand com prefers-reduced-motion: reduce", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("collapse() esconde o elemento imediatamente, sem animar", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true });
    const el = document.createElement("div");
    document.body.appendChild(el);

    await collapse(el);

    expect(el.style.display).toBe("none");
  });

  it("expand() exibe o elemento imediatamente, sem animar", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true });
    const el = document.createElement("div");
    el.style.display = "none";
    document.body.appendChild(el);

    await expand(el);

    expect(el.style.display).toBe("");
  });
});

describe("collapse / expand com transição", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("collapse() resolve após o transitionend e limpa os estilos inline", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false });
    const el = document.createElement("div");
    Object.defineProperty(el, "scrollHeight", { configurable: true, value: 120 });
    document.body.appendChild(el);

    const done = collapse(el, { duration: 10 });

    await flushDoubleRaf();
    dispatchTransitionEnd(el);
    await done;

    expect(el.style.display).toBe("none");
    expect(el.style.height).toBe("");
    expect(el.style.overflow).toBe("");
    expect(el.style.transition).toBe("");
  });

  it("expand() resolve após o transitionend e limpa os estilos inline", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false });
    const el = document.createElement("div");
    el.style.display = "none";
    Object.defineProperty(el, "scrollHeight", { configurable: true, value: 120 });
    document.body.appendChild(el);

    const done = expand(el, { duration: 10 });

    await flushDoubleRaf();
    dispatchTransitionEnd(el);
    await done;

    expect(el.style.display).toBe("");
    expect(el.style.height).toBe("");
    expect(el.style.overflow).toBe("");
  });
});

describe("onTransitionEnd", () => {
  it("resolve apenas quando a propriedade esperada termina a transição", async () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    let resolved = false;
    onTransitionEnd(el, "height").then(() => {
      resolved = true;
    });

    dispatchTransitionEnd(el, "opacity");
    await Promise.resolve();
    expect(resolved).toBe(false);

    dispatchTransitionEnd(el, "height");
    await Promise.resolve();
    expect(resolved).toBe(true);
  });
});
