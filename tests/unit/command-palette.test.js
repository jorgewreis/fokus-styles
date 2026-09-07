import { describe, it, expect, afterEach, vi } from "vitest";
import { CommandPalette } from "../../packages/fokus-js/js/command-palette.js";

function buildCommandPalette(options) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <button type="button" id="trigger" data-fs-target="#palette">Abrir</button>
    <div id="palette">
      <div class="fs-command-palette-dialog">
        <input type="text" class="fs-command-palette-input">
        <ul class="fs-command-palette-list">
          <li class="fs-dropdown-item" data-value="new-file">Novo arquivo</li>
          <li class="fs-dropdown-item" data-value="open-settings">Abrir configurações</li>
          <li class="fs-dropdown-item is-disabled" data-value="disabled">Indisponível</li>
          <li class="fs-dropdown-item is-disabled" data-fs-empty hidden>Nenhum comando encontrado.</li>
        </ul>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  const trigger = wrapper.querySelector("#trigger");
  const palette = wrapper.querySelector("#palette");

  return { trigger, palette, instance: new CommandPalette(trigger, options) };
}

describe("CommandPalette", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("lança erro se o painel (data-fs-target) não existir", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);

    expect(() => new CommandPalette(trigger)).toThrow();
  });

  it("define os atributos ARIA do diálogo, do input e das opções", () => {
    const { palette, instance } = buildCommandPalette();

    expect(palette.getAttribute("role")).toBe("dialog");
    expect(palette.getAttribute("aria-modal")).toBe("true");
    expect(instance.inputEl.getAttribute("role")).toBe("combobox");
    expect(instance.inputEl.getAttribute("aria-controls")).toBe(instance.listEl.id);
    expect(instance.listEl.getAttribute("role")).toBe("listbox");

    const options = instance.listEl.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(4);
  });

  it("getInstance() retorna a instância criada", () => {
    const { trigger, instance } = buildCommandPalette();
    expect(CommandPalette.getInstance(trigger)).toBe(instance);
  });

  it("clicar no gatilho abre o painel, limpa o input e foca nele", () => {
    const { trigger, palette, instance } = buildCommandPalette();

    trigger.click();

    expect(palette.classList.contains("is-open")).toBe(true);
    expect(instance.inputEl.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(instance.inputEl);
  });

  it("digitar filtra os itens por substring (case-insensitive)", () => {
    const { instance } = buildCommandPalette();
    instance.show();

    instance.inputEl.value = "config";
    instance.inputEl.dispatchEvent(new Event("input", { bubbles: true }));

    const items = instance.listEl.querySelectorAll(".fs-dropdown-item:not([data-fs-empty])");
    expect(items[0].hidden).toBe(true); // Novo arquivo
    expect(items[1].hidden).toBe(false); // Abrir configurações
  });

  it("mostra o item data-fs-empty quando nenhum comando corresponde à busca", () => {
    const { instance } = buildCommandPalette();
    instance.show();

    instance.inputEl.value = "zzz";
    instance.inputEl.dispatchEvent(new Event("input", { bubbles: true }));

    expect(instance.listEl.querySelector("[data-fs-empty]").hidden).toBe(false);
  });

  it("ArrowDown/ArrowUp navegam só entre itens habilitados e visíveis", () => {
    const { instance } = buildCommandPalette();
    instance.show();

    let active = instance.listEl.querySelector(".is-active");
    expect(active.textContent).toBe("Novo arquivo");

    instance.inputEl.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    active = instance.listEl.querySelector(".is-active");
    expect(active.textContent).toBe("Abrir configurações");
  });

  it("Enter seleciona o item ativo: dispara fs:command-palette:selected e fecha", () => {
    const { trigger, palette, instance } = buildCommandPalette();
    const handler = vi.fn();
    trigger.addEventListener("fs:command-palette:selected", handler);
    instance.show();

    instance.inputEl.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail).toEqual({ value: "new-file", label: "Novo arquivo" });
    expect(palette.classList.contains("is-open")).toBe(false);
  });

  it("clicar num item dispara fs:command-palette:selected com o valor certo", () => {
    const { instance, trigger } = buildCommandPalette();
    const handler = vi.fn();
    trigger.addEventListener("fs:command-palette:selected", handler);
    instance.show();

    instance.listEl.querySelectorAll(".fs-dropdown-item")[1].dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    instance.listEl.querySelectorAll(".fs-dropdown-item")[1].click();

    expect(handler.mock.calls[0][0].detail.value).toBe("open-settings");
  });

  it("clicar num item desabilitado não seleciona nada", () => {
    const { instance, trigger } = buildCommandPalette();
    const handler = vi.fn();
    trigger.addEventListener("fs:command-palette:selected", handler);
    instance.show();

    instance.listEl.querySelectorAll(".fs-dropdown-item")[2].click();

    expect(handler).not.toHaveBeenCalled();
  });

  it("Escape fecha o painel e devolve o foco ao gatilho", () => {
    const { trigger, palette, instance } = buildCommandPalette();
    instance.show();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(palette.classList.contains("is-open")).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it("options.shortcut (equivalente a data-fs-shortcut) abre/fecha via atalho global", () => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <button type="button" id="trigger2" data-fs-target="#palette2"></button>
      <div id="palette2">
        <div class="fs-command-palette-dialog">
          <input type="text" class="fs-command-palette-input">
          <ul class="fs-command-palette-list"><li class="fs-dropdown-item">Item</li></ul>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);
    const trigger = wrapper.querySelector("#trigger2");
    const palette = wrapper.querySelector("#palette2");
    new CommandPalette(trigger, { shortcut: "mod+k" });

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
    expect(palette.classList.contains("is-open")).toBe(true);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
    expect(palette.classList.contains("is-open")).toBe(false);
  });

  it("dispose() remove o registro da instância", () => {
    const { trigger, instance } = buildCommandPalette();
    instance.dispose();

    expect(CommandPalette.getInstance(trigger)).toBeUndefined();
  });
});
