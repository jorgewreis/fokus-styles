import { describe, it, expect, afterEach, vi } from "vitest";
import { Dropdown } from "../../packages/fokus-js/js/dropdown.js";

function buildDropdown() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <button type="button" id="toggle">Abrir</button>
    <div class="fs-dropdown-menu" id="menu">
      <a href="#" class="fs-dropdown-item">Item 1</a>
      <a href="#" class="fs-dropdown-item">Item 2</a>
      <a href="#" class="fs-dropdown-item is-disabled">Item 3 (desabilitado)</a>
    </div>
  `;
  document.body.appendChild(wrapper);

  const toggle = wrapper.querySelector("#toggle");
  const menu = wrapper.querySelector("#menu");

  return { toggle, menu, dropdown: new Dropdown(toggle) };
}

describe("Dropdown", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("getInstance() retorna a instância criada", () => {
    const { toggle, dropdown } = buildDropdown();
    expect(Dropdown.getInstance(toggle)).toBe(dropdown);
  });

  it("reanexa o menu a document.body e define os atributos ARIA", () => {
    const { toggle, menu } = buildDropdown();

    expect(menu.parentElement).toBe(document.body);
    expect(toggle.getAttribute("aria-haspopup")).toBe("menu");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(menu.getAttribute("role")).toBe("menu");
  });

  it("show() abre o menu, foca o primeiro item habilitado e atualiza aria-expanded", () => {
    const { menu, toggle, dropdown } = buildDropdown();
    dropdown.show();

    expect(menu.classList.contains("is-open")).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement.textContent).toBe("Item 1");
  });

  it("hide() fecha o menu e restaura aria-expanded", () => {
    const { menu, toggle, dropdown } = buildDropdown();
    dropdown.show();
    dropdown.hide();

    expect(menu.classList.contains("is-open")).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("toggle() alterna entre aberto e fechado", () => {
    const { menu, dropdown } = buildDropdown();

    dropdown.toggle();
    expect(menu.classList.contains("is-open")).toBe(true);

    dropdown.toggle();
    expect(menu.classList.contains("is-open")).toBe(false);
  });

  it("dispara fs:dropdown:shown e fs:dropdown:hidden", () => {
    const { toggle, dropdown } = buildDropdown();
    const shownHandler = vi.fn();
    const hiddenHandler = vi.fn();
    toggle.addEventListener("fs:dropdown:shown", shownHandler);
    toggle.addEventListener("fs:dropdown:hidden", hiddenHandler);

    dropdown.show();
    expect(shownHandler).toHaveBeenCalledTimes(1);

    dropdown.hide();
    expect(hiddenHandler).toHaveBeenCalledTimes(1);
  });

  it("ArrowDown/ArrowUp navegam apenas entre os itens habilitados", () => {
    const { menu, dropdown } = buildDropdown();
    dropdown.show();

    const items = menu.querySelectorAll(".fs-dropdown-item:not(.is-disabled)");
    items[0].focus();

    menu.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(document.activeElement).toBe(items[1]);

    menu.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect(document.activeElement).toBe(items[0]);
  });

  it("abre e foca o primeiro ou último item por ArrowDown/ArrowUp no toggle", () => {
    const { toggle, menu, dropdown } = buildDropdown();
    const items = menu.querySelectorAll(".fs-dropdown-item:not(.is-disabled)");

    toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(dropdown.isOpen).toBe(true);
    expect(document.activeElement).toBe(items[0]);

    dropdown.hide();
    toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect(document.activeElement).toBe(items[1]);
  });

  it("Escape fecha o menu e devolve o foco ao toggle", () => {
    const { toggle, menu, dropdown } = buildDropdown();
    dropdown.show();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(menu.classList.contains("is-open")).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it("clicar em um item fecha o menu e devolve o foco ao toggle", () => {
    const { toggle, menu, dropdown } = buildDropdown();
    dropdown.show();

    menu.querySelector(".fs-dropdown-item").click();

    expect(menu.classList.contains("is-open")).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it("dispose() remove o registro da instância", () => {
    const { toggle, dropdown } = buildDropdown();
    dropdown.dispose();

    expect(Dropdown.getInstance(toggle)).toBeUndefined();
  });

  it("reconhece aria-disabled e publica o posicionamento resolvido", () => {
    const { toggle, menu, dropdown } = buildDropdown();
    menu.querySelector(".fs-dropdown-item").setAttribute("aria-disabled", "true");
    dropdown.show();

    expect(menu.getAttribute("data-placement")).toBe("bottom");
    expect(document.activeElement.textContent).toContain("Item 2");
  });
});
