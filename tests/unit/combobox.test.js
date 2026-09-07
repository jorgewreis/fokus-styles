import { describe, it, expect, afterEach, vi } from "vitest";
import { Combobox } from "../../packages/fokus-js/js/combobox.js";

function buildCombobox() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <input type="text" id="input" data-fs-target="#listbox">
    <ul class="fs-dropdown-menu" id="listbox">
      <li class="fs-dropdown-item" data-value="react">React</li>
      <li class="fs-dropdown-item" data-value="vue">Vue</li>
      <li class="fs-dropdown-item is-disabled" data-value="angular">Angular (indisponível)</li>
      <li class="fs-dropdown-item is-disabled" data-fs-empty hidden>Nenhum resultado encontrado.</li>
    </ul>
  `;
  document.body.appendChild(wrapper);

  const input = wrapper.querySelector("#input");
  const listbox = wrapper.querySelector("#listbox");

  return { input, listbox, combobox: new Combobox(input) };
}

describe("Combobox", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("lança erro se a listbox (data-fs-target) não existir", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);

    expect(() => new Combobox(input)).toThrow();
  });

  it("reanexa a listbox a document.body e define os atributos ARIA do combobox", () => {
    const { input, listbox } = buildCombobox();

    expect(listbox.parentElement).toBe(document.body);
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(input.getAttribute("aria-controls")).toBe(listbox.id);
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(listbox.getAttribute("role")).toBe("listbox");
  });

  it("atribui role=option e id único a cada item", () => {
    const { listbox } = buildCombobox();
    const options = listbox.querySelectorAll('[role="option"]');

    expect(options).toHaveLength(4);
    const ids = Array.from(options).map((o) => o.id);
    expect(new Set(ids).size).toBe(4);
  });

  it("getInstance() retorna a instância criada", () => {
    const { input, combobox } = buildCombobox();
    expect(Combobox.getInstance(input)).toBe(combobox);
  });

  it("show()/hide() alternam is-open e aria-expanded", () => {
    const { input, listbox, combobox } = buildCombobox();

    combobox.show();
    expect(listbox.classList.contains("is-open")).toBe(true);
    expect(input.getAttribute("aria-expanded")).toBe("true");

    combobox.hide();
    expect(listbox.classList.contains("is-open")).toBe(false);
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("digitar filtra as opções por substring (case-insensitive) e mostra a listbox", () => {
    const { input, listbox } = buildCombobox();

    input.value = "vu";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(listbox.classList.contains("is-open")).toBe(true);
    const options = listbox.querySelectorAll(".fs-dropdown-item:not([data-fs-empty])");
    expect(options[0].hidden).toBe(true); // React
    expect(options[1].hidden).toBe(false); // Vue
  });

  it("mostra o item data-fs-empty quando nenhuma opção corresponde à busca", () => {
    const { input, listbox } = buildCombobox();

    input.value = "zzz";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(listbox.querySelector("[data-fs-empty]").hidden).toBe(false);
  });

  it("ArrowDown navega só entre opções habilitadas e visíveis, com wrap", () => {
    const { input, listbox, combobox } = buildCombobox();
    combobox.show();

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    let active = listbox.querySelector(".is-active");
    expect(active.textContent).toBe("React");
    expect(input.getAttribute("aria-activedescendant")).toBe(active.id);

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    active = listbox.querySelector(".is-active");
    expect(active.textContent).toBe("Vue");

    // Wrap: só há 2 opções habilitadas (Angular está disabled) — volta pra React.
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    active = listbox.querySelector(".is-active");
    expect(active.textContent).toBe("React");
  });

  it("Enter seleciona a opção ativa: preenche o input, marca aria-selected e fecha", () => {
    const { input, listbox, combobox } = buildCombobox();
    combobox.show();

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(input.value).toBe("Vue");
    expect(combobox.value).toBe("vue");
    expect(listbox.classList.contains("is-open")).toBe(false);
    const options = listbox.querySelectorAll(".fs-dropdown-item:not([data-fs-empty])");
    expect(options[1].getAttribute("aria-selected")).toBe("true");
    expect(options[0].getAttribute("aria-selected")).toBe("false");
  });

  it("clicar numa opção seleciona, dispara change e fs:combobox:changed", () => {
    const { input, listbox } = buildCombobox();
    const changeHandler = vi.fn();
    const fokusHandler = vi.fn();
    input.addEventListener("change", changeHandler);
    input.addEventListener("fs:combobox:changed", fokusHandler);

    listbox.querySelectorAll(".fs-dropdown-item")[0].dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    listbox.querySelectorAll(".fs-dropdown-item")[0].click();

    expect(input.value).toBe("React");
    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect(fokusHandler).toHaveBeenCalledTimes(1);
    expect(fokusHandler.mock.calls[0][0].detail.value).toBe("react");
  });

  it("clicar numa opção desabilitada não seleciona nada", () => {
    const { input, listbox } = buildCombobox();

    listbox.querySelectorAll(".fs-dropdown-item")[2].click();

    expect(input.value).toBe("");
  });

  it("Escape fecha a listbox sem alterar o valor do input", () => {
    const { input, listbox, combobox } = buildCombobox();
    input.value = "vu";
    combobox.show();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(listbox.classList.contains("is-open")).toBe(false);
    expect(input.value).toBe("vu");
  });

  it("dispose() remove o registro da instância", () => {
    const { input, combobox } = buildCombobox();
    combobox.dispose();

    expect(Combobox.getInstance(input)).toBeUndefined();
  });
});
