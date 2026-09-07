import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { lockScroll, unlockScroll, onClickOutside } from "../../../packages/fokus-js/js/core/overlay.js";

describe("lockScroll / unlockScroll", () => {
  afterEach(() => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  });

  it("bloqueia o scroll do body", () => {
    lockScroll();
    expect(document.body.style.overflow).toBe("hidden");
    unlockScroll();
  });

  it("só libera o scroll quando todas as referências (overlays aninhados) forem liberadas", () => {
    lockScroll();
    lockScroll();
    unlockScroll();
    expect(document.body.style.overflow).toBe("hidden");

    unlockScroll();
    expect(document.body.style.overflow).toBe("");
  });

  it("ignora unlockScroll extra sem deixar a contagem negativa", () => {
    unlockScroll();
    unlockScroll();

    lockScroll();
    expect(document.body.style.overflow).toBe("hidden");

    unlockScroll();
    expect(document.body.style.overflow).toBe("");
  });
});

describe("onClickOutside", () => {
  let el;

  beforeEach(() => {
    el = document.createElement("div");
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("não dispara para o clique que abriu o elemento (registro durante o dispatch)", () => {
    const callback = vi.fn();
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.addEventListener("click", () => onClickOutside(el, callback));

    trigger.click();

    expect(callback).not.toHaveBeenCalled();
  });

  it("dispara o callback já no primeiro clique fora após o registro, sem esperar outro tick", () => {
    const callback = vi.fn();
    onClickOutside(el, callback);

    document.body.click();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("não dispara o callback ao clicar dentro do elemento", () => {
    const callback = vi.fn();
    onClickOutside(el, callback);

    el.click();

    expect(callback).not.toHaveBeenCalled();
  });

  it("a função de limpeza remove o listener", () => {
    const callback = vi.fn();
    const cleanup = onClickOutside(el, callback);

    cleanup();
    document.body.click();

    expect(callback).not.toHaveBeenCalled();
  });
});
