import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Collapse } from "../../packages/fokus-js/js/collapse.js";

function buildCollapse({ startsOpen = false } = {}) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <button type="button" data-fs-target="#painel-1" ${startsOpen ? 'aria-expanded="true"' : ""}>Alternar</button>
    <div id="painel-1">Conteúdo</div>
  `;
  document.body.appendChild(wrapper);

  const trigger = wrapper.querySelector("button");
  return { trigger, panel: wrapper.querySelector("#painel-1"), collapse: new Collapse(trigger) };
}

async function flushMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("Collapse", () => {
  beforeEach(() => {
    // prefers-reduced-motion: reduce evita depender de transitionend nestes testes.
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("lança erro se data-fs-target não aponta para um elemento existente", () => {
    const trigger = document.createElement("button");
    trigger.setAttribute("data-fs-target", "#nao-existe");
    document.body.appendChild(trigger);

    expect(() => new Collapse(trigger)).toThrow();
  });

  it("getInstance() retorna a instância criada", () => {
    const { trigger, collapse } = buildCollapse();
    expect(Collapse.getInstance(trigger)).toBe(collapse);
  });

  it("começa fechado por padrão: aria-expanded=false e painel oculto", () => {
    const { trigger, panel } = buildCollapse();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(panel.style.display).toBe("none");
  });

  it("respeita aria-expanded=true inicial e mantém o painel visível", () => {
    const { trigger, panel } = buildCollapse({ startsOpen: true });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(panel.style.display).not.toBe("none");
  });

  it("liga gatilho e painel via aria-controls", () => {
    const { trigger, panel } = buildCollapse();
    expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
  });

  it("toggle() abre e fecha, disparando os eventos fs:collapse:shown/hidden", async () => {
    const { trigger, panel, collapse } = buildCollapse();
    const shownHandler = vi.fn();
    const hiddenHandler = vi.fn();
    trigger.addEventListener("fs:collapse:shown", shownHandler);
    trigger.addEventListener("fs:collapse:hidden", hiddenHandler);

    collapse.toggle();
    await flushMicrotasks();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(panel.style.display).not.toBe("none");
    expect(shownHandler).toHaveBeenCalledTimes(1);

    collapse.toggle();
    await flushMicrotasks();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(panel.style.display).toBe("none");
    expect(hiddenHandler).toHaveBeenCalledTimes(1);
  });

  it("clicar no gatilho alterna o painel", async () => {
    const { trigger, panel } = buildCollapse();

    trigger.click();
    await flushMicrotasks();

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(panel.style.display).not.toBe("none");
  });

  it("dispose() remove o registro da instância", () => {
    const { trigger, collapse } = buildCollapse();
    collapse.dispose();

    expect(Collapse.getInstance(trigger)).toBeUndefined();
  });
});
