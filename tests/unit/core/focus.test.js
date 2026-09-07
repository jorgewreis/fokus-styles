import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getFocusableElements, createFocusTrap, onEscapeKey } from "../../../packages/fokus-js/js/core/focus.js";

function pressKey(target, key, options = {}) {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...options });
  target.dispatchEvent(event);
  return event;
}

describe("getFocusableElements", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("retorna apenas elementos focáveis, habilitados e sem tabindex=-1", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <button>A</button>
      <button disabled>B</button>
      <input type="text">
      <a href="#">Link</a>
      <a>Sem href</a>
      <div tabindex="0">Div focável</div>
      <div tabindex="-1">Div não focável</div>
    `;
    document.body.appendChild(container);

    expect(getFocusableElements(container)).toHaveLength(4);
  });
});

describe("createFocusTrap", () => {
  let container;
  let first;
  let last;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = '<button id="first">Primeiro</button><button id="middle">Meio</button><button id="last">Último</button>';
    document.body.appendChild(container);
    first = container.querySelector("#first");
    last = container.querySelector("#last");
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("activate() foca o primeiro elemento focável", () => {
    createFocusTrap(container).activate();
    expect(document.activeElement).toBe(first);
  });

  it("Tab no último elemento cicla de volta para o primeiro", () => {
    createFocusTrap(container).activate();
    last.focus();

    const event = pressKey(container, "Tab");

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it("Shift+Tab no primeiro elemento cicla para o último", () => {
    createFocusTrap(container).activate();
    first.focus();

    const event = pressKey(container, "Tab", { shiftKey: true });

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it("deactivate() para de interceptar Tab", () => {
    const trap = createFocusTrap(container);
    trap.activate();
    trap.deactivate();
    last.focus();

    const event = pressKey(container, "Tab");

    expect(event.defaultPrevented).toBe(false);
  });
});

describe("onEscapeKey", () => {
  it("chama o callback ao pressionar Escape", () => {
    const callback = vi.fn();
    onEscapeKey(callback);

    pressKey(document, "Escape");

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("ignora outras teclas", () => {
    const callback = vi.fn();
    onEscapeKey(callback);

    pressKey(document, "Enter");

    expect(callback).not.toHaveBeenCalled();
  });

  it("a função de limpeza remove o listener", () => {
    const callback = vi.fn();
    const cleanup = onEscapeKey(callback);
    cleanup();

    pressKey(document, "Escape");

    expect(callback).not.toHaveBeenCalled();
  });
});
