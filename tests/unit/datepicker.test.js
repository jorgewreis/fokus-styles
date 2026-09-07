import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { Datepicker } from "../../packages/fokus-js/js/datepicker.js";

function buildDatepicker(initialValue = "") {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <input type="text" id="input" value="${initialValue}" data-fs-target="#panel">
    <div id="panel"></div>
  `;
  document.body.appendChild(wrapper);

  const input = wrapper.querySelector("#input");
  const panel = wrapper.querySelector("#panel");

  return { input, panel, datepicker: new Datepicker(input) };
}

function dayButton(panel, year, month, day) {
  return panel.querySelector(`.fs-datepicker-day[data-year="${year}"][data-month="${month}"][data-day="${day}"]`);
}

describe("Datepicker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 7)); // 2026-07-07, mesma data do rascunho/plano.
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("lança erro se o painel (data-fs-target) não existir", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);

    expect(() => new Datepicker(input)).toThrow();
  });

  it("reanexa o painel a document.body e define os atributos ARIA do input", () => {
    const { input, panel } = buildDatepicker();

    expect(panel.parentElement).toBe(document.body);
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-haspopup")).toBe("grid");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(input.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.querySelector('[role="grid"]')).not.toBeNull();
  });

  it("show()/hide() alternam is-open e aria-expanded", () => {
    const { input, panel, datepicker } = buildDatepicker();

    datepicker.show();
    expect(panel.classList.contains("is-open")).toBe(true);
    expect(input.getAttribute("aria-expanded")).toBe("true");

    datepicker.hide();
    expect(panel.classList.contains("is-open")).toBe(false);
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("focar o input abre o painel", () => {
    const { input, panel } = buildDatepicker();

    input.dispatchEvent(new Event("focus"));

    expect(panel.classList.contains("is-open")).toBe(true);
  });

  it("mostra o mês/ano do valor inicial (dd/mm/aaaa) já selecionado no grid", () => {
    const { panel, datepicker } = buildDatepicker("15/03/2026");
    datepicker.show();

    expect(panel.querySelector(".fs-datepicker-title").textContent).toMatch(/março.*2026/i);
    const selected = dayButton(panel, 2026, 2, 15); // mês 0-indexado: março = 2
    expect(selected.classList.contains("is-selected")).toBe(true);
  });

  it("clicar num dia seleciona: preenche o input, fecha o painel e dispara os eventos", () => {
    const { input, panel, datepicker } = buildDatepicker();
    const changeHandler = vi.fn();
    const fokusHandler = vi.fn();
    input.addEventListener("change", changeHandler);
    input.addEventListener("fs:datepicker:changed", fokusHandler);

    datepicker.show();
    dayButton(panel, 2026, 6, 20).click(); // julho = mês 6

    expect(input.value).toBe("20/07/2026");
    expect(datepicker.value).toBe("2026-07-20");
    expect(panel.classList.contains("is-open")).toBe(false);
    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect(fokusHandler).toHaveBeenCalledTimes(1);
    expect(fokusHandler.mock.calls[0][0].detail.value).toBe("2026-07-20");
  });

  it("clicar em dia desabilitado não seleciona nada", () => {
    const { input, panel, datepicker } = buildDatepicker();
    datepicker.show();

    const day = dayButton(panel, 2026, 6, 10);
    day.disabled = true;
    day.click();

    expect(input.value).toBe("");
  });

  it("os botões de navegação trocam o mês exibido sem alterar a seleção", () => {
    const { panel, datepicker } = buildDatepicker("15/03/2026");
    datepicker.show();

    panel.querySelector("[data-fs-datepicker-next]").click();
    expect(panel.querySelector(".fs-datepicker-title").textContent).toMatch(/abril.*2026/i);

    panel.querySelector("[data-fs-datepicker-prev]").click();
    panel.querySelector("[data-fs-datepicker-prev]").click();
    expect(panel.querySelector(".fs-datepicker-title").textContent).toMatch(/fevereiro.*2026/i);
  });

  it("ArrowDown com foco no input (não num dia) abre o painel e move o foco pro dia tabável", () => {
    const { input, panel, datepicker } = buildDatepicker();
    datepicker.show();

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

    expect(document.activeElement.classList.contains("fs-datepicker-day")).toBe(true);
  });

  it("ArrowDown com o painel fechado reabre e move o foco pro grid", () => {
    const { input, panel, datepicker } = buildDatepicker();

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

    expect(panel.classList.contains("is-open")).toBe(true);
    expect(document.activeElement.classList.contains("fs-datepicker-day")).toBe(true);
  });

  it("selecionar uma data e depois apertar ArrowDown no input reabre o painel (sem regressão do suppressNextFocus)", () => {
    const { input, panel, datepicker } = buildDatepicker();
    datepicker.show();

    dayButton(panel, 2026, 6, 10).click();
    expect(panel.classList.contains("is-open")).toBe(false);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(panel.classList.contains("is-open")).toBe(true);
  });

  it("ArrowRight move o foco um dia à frente, cruzando mês quando necessário", () => {
    const { panel, datepicker } = buildDatepicker();
    datepicker.show();

    dayButton(panel, 2026, 6, 31).focus();
    document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

    expect(panel.querySelector(".fs-datepicker-title").textContent).toMatch(/agosto.*2026/i);
    expect(document.activeElement).toBe(dayButton(panel, 2026, 7, 1));
  });

  it("ArrowDown move o foco uma semana à frente (7 dias)", () => {
    const { panel, datepicker } = buildDatepicker();
    datepicker.show();

    dayButton(panel, 2026, 6, 7).focus();
    document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

    expect(document.activeElement).toBe(dayButton(panel, 2026, 6, 14));
  });

  it("PageDown/PageUp navegam por mês; Shift+PageDown/PageUp navegam por ano", () => {
    const { panel, datepicker } = buildDatepicker();
    datepicker.show();

    dayButton(panel, 2026, 6, 7).focus();
    document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown", bubbles: true }));
    expect(panel.querySelector(".fs-datepicker-title").textContent).toMatch(/agosto.*2026/i);

    document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown", bubbles: true, shiftKey: true }));
    expect(panel.querySelector(".fs-datepicker-title").textContent).toMatch(/agosto.*2027/i);
  });

  it("Enter seleciona o dia com foco atual", () => {
    const { input, panel, datepicker } = buildDatepicker();
    datepicker.show();

    dayButton(panel, 2026, 6, 22).focus();
    document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(input.value).toBe("22/07/2026");
    expect(panel.classList.contains("is-open")).toBe(false);
  });

  it("Escape fecha o painel sem alterar o valor do input", () => {
    const { input, panel, datepicker } = buildDatepicker();
    input.value = "01/01/2026";
    datepicker.show();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(panel.classList.contains("is-open")).toBe(false);
    expect(input.value).toBe("01/01/2026");
  });

  it("dispose() remove o registro da instância", () => {
    const { input, datepicker } = buildDatepicker();
    datepicker.dispose();

    expect(Datepicker.getInstance(input)).toBeUndefined();
  });
});
