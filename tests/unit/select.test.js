import { describe, it, expect, afterEach, vi } from "vitest";
import { Select } from "../../packages/fokus-js/js/select.js";

function buildSelect() {
  const select = document.createElement("select");
  select.innerHTML = `
    <option>São Paulo</option>
    <option>Rio de Janeiro</option>
    <option disabled>Minas Gerais</option>
  `;
  document.body.appendChild(select);

  return { select, instance: new Select(select) };
}

describe("Select", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("lança erro se o elemento não for um <select>", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    expect(() => new Select(div)).toThrow();
  });

  it("esconde o <select> nativo e gera o toggle + menu customizados", () => {
    const { select } = buildSelect();

    expect(select.style.display).toBe("none");
    expect(document.querySelector(".fs-form-select")).not.toBeNull();
    expect(document.querySelectorAll(".fs-dropdown-item")).toHaveLength(3);
  });

  it("o toggle mostra o texto da opção selecionada inicialmente", () => {
    const { instance } = buildSelect();
    expect(instance.toggleEl.textContent).toBe("São Paulo");
  });

  it("usa role=listbox/option em vez do role=menu herdado do Dropdown", () => {
    const { instance } = buildSelect();
    expect(instance.toggleEl.getAttribute("aria-haspopup")).toBe("listbox");
    expect(instance.menuEl.getAttribute("role")).toBe("listbox");
    expect(instance.menuEl.querySelectorAll('[role="option"]')).toHaveLength(3);
  });

  it("a opção desabilitada vira um .dropdown-item.disabled", () => {
    const { instance } = buildSelect();
    const items = instance.menuEl.querySelectorAll(".fs-dropdown-item");
    expect(items[2].classList.contains("is-disabled")).toBe(true);
  });

  it("clicar num item atualiza o <select> nativo, o texto do toggle e o estado aria-selected", () => {
    const { select, instance } = buildSelect();
    const items = instance.menuEl.querySelectorAll(".fs-dropdown-item");

    items[1].click();

    expect(select.value).toBe("Rio de Janeiro");
    expect(instance.toggleEl.textContent).toBe("Rio de Janeiro");
    expect(items[1].getAttribute("aria-selected")).toBe("true");
    expect(items[0].getAttribute("aria-selected")).toBe("false");
  });

  it("clicar num item dispara change nativo e fs:select:changed", () => {
    const { select, instance } = buildSelect();
    const changeHandler = vi.fn();
    const fokusHandler = vi.fn();
    select.addEventListener("change", changeHandler);
    select.addEventListener("fs:select:changed", fokusHandler);

    instance.menuEl.querySelectorAll(".fs-dropdown-item")[1].click();

    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect(fokusHandler).toHaveBeenCalledTimes(1);
    expect(fokusHandler.mock.calls[0][0].detail.value).toBe("Rio de Janeiro");
  });

  it("clicar num item desabilitado não altera a seleção", () => {
    const { select, instance } = buildSelect();

    instance.menuEl.querySelectorAll(".fs-dropdown-item")[2].click();

    expect(select.value).toBe("São Paulo");
  });

  it("dispose() remove a marcação customizada e restaura o <select> nativo", () => {
    const { select, instance } = buildSelect();
    instance.dispose();

    expect(select.style.display).toBe("");
    expect(document.querySelector(".fs-form-select")).toBeNull();
  });
});
