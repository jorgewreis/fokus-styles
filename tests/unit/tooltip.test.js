import { describe, it, expect, afterEach, vi } from "vitest";
import { Tooltip } from "../../packages/fokus-js/js/tooltip.js";

function buildTooltip(attrs = "") {
  const el = document.createElement("button");
  el.setAttribute("title", "Texto do tooltip");
  if (attrs) el.setAttribute("data-placement", attrs);
  document.body.appendChild(el);

  return { el, tooltip: new Tooltip(el) };
}

describe("Tooltip", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("lança erro se o elemento não tiver título", () => {
    const el = document.createElement("button");
    document.body.appendChild(el);

    expect(() => new Tooltip(el)).toThrow();
  });

  it("remove o atributo title nativo (evita o tooltip duplo do navegador)", () => {
    const { el } = buildTooltip();
    expect(el.hasAttribute("title")).toBe(false);
  });

  it("cria o elemento .tooltip em document.body, ligado por aria-describedby", () => {
    const { el } = buildTooltip();
    const tooltipEl = document.querySelector(".fs-tooltip");

    expect(tooltipEl).not.toBeNull();
    expect(tooltipEl.parentElement).toBe(document.body);
    expect(tooltipEl.getAttribute("role")).toBe("tooltip");
    expect(el.getAttribute("aria-describedby")).toBe(tooltipEl.id);
  });

  it("preserva outros IDs em aria-describedby e os restaura no dispose", () => {
    const el = document.createElement("button");
    el.setAttribute("title", "Texto do tooltip");
    el.setAttribute("aria-describedby", "descricao existente");
    document.body.appendChild(el);
    const tooltip = new Tooltip(el);
    expect(el.getAttribute("aria-describedby")).toContain("descricao existente");
    tooltip.dispose();
    expect(el.getAttribute("aria-describedby")).toBe("descricao existente");
  });

  it("usa title fornecido na instanciação manual", () => {
    const el = document.createElement("button");
    document.body.appendChild(el);
    const tooltip = new Tooltip(el, { title: "Texto manual" });
    expect(tooltip.tooltipEl.querySelector(".fs-tooltip-inner").textContent).toBe("Texto manual");
    tooltip.dispose();
  });

  it("mantém o offset padrão e aplica a variável de alinhamento da seta", () => {
    const { tooltip } = buildTooltip();
    tooltip.show();
    expect(tooltip.offset).toBe(8);
    expect(tooltip.tooltipEl.style.getPropertyValue("--fs-tooltip-arrow-offset")).toBeTruthy();
  });

  it("getInstance() retorna a instância criada", () => {
    const { el, tooltip } = buildTooltip();
    expect(Tooltip.getInstance(el)).toBe(tooltip);
  });

  it("mouseenter mostra e mouseleave esconde", () => {
    const { el, tooltip } = buildTooltip();

    el.dispatchEvent(new MouseEvent("mouseenter"));
    expect(tooltip.tooltipEl.classList.contains("is-open")).toBe(true);

    el.dispatchEvent(new MouseEvent("mouseleave"));
    expect(tooltip.tooltipEl.classList.contains("is-open")).toBe(false);
  });

  it("focus mostra e blur esconde", () => {
    const { el, tooltip } = buildTooltip();

    el.dispatchEvent(new FocusEvent("focus"));
    expect(tooltip.tooltipEl.classList.contains("is-open")).toBe(true);

    el.dispatchEvent(new FocusEvent("blur"));
    expect(tooltip.tooltipEl.classList.contains("is-open")).toBe(false);
  });

  it("Escape esconde o tooltip quando aberto", () => {
    const { el, tooltip } = buildTooltip();
    tooltip.show();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(tooltip.tooltipEl.classList.contains("is-open")).toBe(false);
  });

  it("dispara fs:tooltip:shown e fs:tooltip:hidden", () => {
    const { el, tooltip } = buildTooltip();
    const shownHandler = vi.fn();
    const hiddenHandler = vi.fn();
    el.addEventListener("fs:tooltip:shown", shownHandler);
    el.addEventListener("fs:tooltip:hidden", hiddenHandler);

    tooltip.show();
    expect(shownHandler).toHaveBeenCalledTimes(1);

    tooltip.hide();
    expect(hiddenHandler).toHaveBeenCalledTimes(1);
  });

  it("copia o data-theme do ancestral mais próximo do elemento de referência", () => {
    const themedWrapper = document.createElement("div");
    themedWrapper.setAttribute("data-theme", "dark");
    document.body.appendChild(themedWrapper);

    const el = document.createElement("button");
    el.setAttribute("title", "Texto");
    themedWrapper.appendChild(el);

    const tooltip = new Tooltip(el);
    tooltip.show();

    expect(tooltip.tooltipEl.getAttribute("data-theme")).toBe("dark");
  });

  it("dispose() remove o elemento do DOM e o registro da instância", () => {
    const { el, tooltip } = buildTooltip();
    tooltip.dispose();

    expect(document.querySelector(".fs-tooltip")).toBeNull();
    expect(Tooltip.getInstance(el)).toBeUndefined();
  });
});
