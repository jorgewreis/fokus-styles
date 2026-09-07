import { describe, it, expect, afterEach } from "vitest";
import { RangeSlider } from "../../packages/fokus-js/js/range.js";

function buildRange({ min = 0, max = 100, value = 40, withOutput = true } = {}) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <input type="range" id="volume" min="${min}" max="${max}" value="${value}">
    ${withOutput ? '<output id="volume-output" for="volume"></output>' : ""}
  `;
  document.body.appendChild(wrapper);

  const input = wrapper.querySelector("input");
  if (withOutput) input.setAttribute("data-fs-target", "#volume-output");

  return { input, output: wrapper.querySelector("output") };
}

describe("RangeSlider", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("getInstance() retorna a instância criada", () => {
    const { input } = buildRange();
    const range = new RangeSlider(input);
    expect(RangeSlider.getInstance(input)).toBe(range);
  });

  it("calcula --fs-range-percent a partir de min/max/value no momento da criação", () => {
    const { input } = buildRange({ min: 0, max: 200, value: 50 });
    new RangeSlider(input);

    expect(input.style.getPropertyValue("--fs-range-percent")).toBe("25%");
  });

  it("atualiza --fs-range-percent e o output associado ao disparar input", () => {
    const { input, output } = buildRange({ min: 0, max: 100, value: 40 });
    new RangeSlider(input);

    expect(output.textContent).toBe("40");

    input.value = "80";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(output.textContent).toBe("80");
    expect(input.style.getPropertyValue("--fs-range-percent")).toBe("80%");
  });

  it("funciona sem output associado (data-fs-target ausente)", () => {
    const { input } = buildRange({ withOutput: false });
    expect(() => new RangeSlider(input)).not.toThrow();
  });

  it("dispose() remove o listener de input", () => {
    const { input, output } = buildRange({ value: 10 });
    const range = new RangeSlider(input);
    range.dispose();

    input.value = "90";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(output.textContent).toBe("10");
  });
});
