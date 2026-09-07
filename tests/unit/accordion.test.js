import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Accordion } from "../../packages/fokus-js/js/accordion.js";

function buildAccordion({ multiple = false } = {}) {
  const el = document.createElement("div");
  if (multiple) el.setAttribute("data-multiple", "true");
  el.innerHTML = `
    <div class="fs-accordion-item">
      <h3 class="fs-accordion-header">
        <button type="button" class="fs-accordion-button" aria-expanded="true">Item 1</button>
      </h3>
      <div class="fs-accordion-collapse"><div class="fs-accordion-body">Corpo 1</div></div>
    </div>
    <div class="fs-accordion-item">
      <h3 class="fs-accordion-header">
        <button type="button" class="fs-accordion-button" aria-expanded="false">Item 2</button>
      </h3>
      <div class="fs-accordion-collapse"><div class="fs-accordion-body">Corpo 2</div></div>
    </div>
  `;
  document.body.appendChild(el);

  return { el, accordion: new Accordion(el) };
}

async function flushMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("Accordion", () => {
  beforeEach(() => {
    // prefers-reduced-motion: reduce evita depender de transitionend nestes testes.
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("getInstance() retorna a instância criada", () => {
    const { el, accordion } = buildAccordion();
    expect(Accordion.getInstance(el)).toBe(accordion);
  });

  it("esconde imediatamente os painéis que não começam abertos", () => {
    const { el } = buildAccordion();
    const panels = el.querySelectorAll(".fs-accordion-collapse");

    expect(panels[0].style.display).not.toBe("none");
    expect(panels[1].style.display).toBe("none");
  });

  it("liga botão e painel via aria-controls/aria-labelledby/role=region", () => {
    const { el } = buildAccordion();
    const button = el.querySelectorAll(".fs-accordion-button")[0];
    const panel = el.querySelectorAll(".fs-accordion-collapse")[0];

    expect(button.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(button.id);
    expect(panel.getAttribute("role")).toBe("region");
  });

  it("por padrão, abrir um item fecha os demais (exclusivo)", async () => {
    const { el } = buildAccordion();
    const buttons = el.querySelectorAll(".fs-accordion-button");

    buttons[1].click();
    await flushMicrotasks();

    expect(buttons[0].getAttribute("aria-expanded")).toBe("false");
    expect(buttons[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("com data-multiple=true, vários painéis podem ficar abertos ao mesmo tempo", async () => {
    const { el } = buildAccordion({ multiple: true });
    const buttons = el.querySelectorAll(".fs-accordion-button");

    buttons[1].click();
    await flushMicrotasks();

    expect(buttons[0].getAttribute("aria-expanded")).toBe("true");
    expect(buttons[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("clicar num item já aberto fecha ele mesmo", async () => {
    const { el } = buildAccordion();
    const buttons = el.querySelectorAll(".fs-accordion-button");

    buttons[0].click();
    await flushMicrotasks();

    expect(buttons[0].getAttribute("aria-expanded")).toBe("false");
  });

  it("dispara fs:accordion:shown e fs:accordion:hidden", async () => {
    const { el } = buildAccordion();
    const buttons = el.querySelectorAll(".fs-accordion-button");
    const shownHandler = vi.fn();
    const hiddenHandler = vi.fn();
    buttons[1].addEventListener("fs:accordion:shown", shownHandler);
    buttons[0].addEventListener("fs:accordion:hidden", hiddenHandler);

    buttons[1].click();
    await flushMicrotasks();

    expect(shownHandler).toHaveBeenCalledTimes(1);
    expect(hiddenHandler).toHaveBeenCalledTimes(1);
  });

  it("dispose() remove o registro da instância", () => {
    const { el, accordion } = buildAccordion();
    accordion.dispose();

    expect(Accordion.getInstance(el)).toBeUndefined();
  });
});
