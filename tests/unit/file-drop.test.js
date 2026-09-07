import { describe, it, expect, afterEach, vi } from "vitest";
import { FileDrop } from "../../packages/fokus-js/js/file-drop.js";

function buildFileDrop({ disabled = false } = {}) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <input type="file" id="arquivo" ${disabled ? "disabled" : ""}>
    <label for="arquivo" class="fs-file-label fs-file-label-dropzone">Arraste um arquivo</label>
  `;
  document.body.appendChild(wrapper);

  const input = wrapper.querySelector("input");
  const label = wrapper.querySelector("label");

  // jsdom não permite atribuir `.files` diretamente por padrão (só navegadores
  // reais permitem essa atribuição vinda de um drop, por segurança) — redefine
  // a propriedade como gravável só para o teste poder inspecionar o resultado.
  let filesValue = input.files;
  Object.defineProperty(input, "files", {
    get: () => filesValue,
    set: (value) => {
      filesValue = value;
    },
    configurable: true,
  });

  return { input, label, fileDrop: new FileDrop(label) };
}

function dropEventWithFiles(files) {
  const event = new Event("drop", { bubbles: true, cancelable: true });
  event.dataTransfer = { files };
  return event;
}

describe("FileDrop", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("lança erro se o input associado (via for=) não existe", () => {
    const label = document.createElement("label");
    label.setAttribute("for", "nao-existe");
    document.body.appendChild(label);

    expect(() => new FileDrop(label)).toThrow();
  });

  it("getInstance() retorna a instância criada", () => {
    const { label, fileDrop } = buildFileDrop();
    expect(FileDrop.getInstance(label)).toBe(fileDrop);
  });

  it("dragenter adiciona .is-dragover, dragleave remove", () => {
    const { label } = buildFileDrop();

    label.dispatchEvent(new Event("dragenter", { bubbles: true, cancelable: true }));
    expect(label.classList.contains("is-dragover")).toBe(true);

    label.dispatchEvent(new Event("dragleave", { bubbles: true, cancelable: true }));
    expect(label.classList.contains("is-dragover")).toBe(false);
  });

  it("soltar um arquivo sincroniza input.files e dispara change nativo", () => {
    const { input, label } = buildFileDrop();
    const changeHandler = vi.fn();
    input.addEventListener("change", changeHandler);

    const file = { name: "foto.png" };
    label.dispatchEvent(dropEventWithFiles([file]));

    expect(input.files).toEqual([file]);
    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect(label.classList.contains("is-dragover")).toBe(false);
  });

  it("soltar sem arquivos não dispara change", () => {
    const { input, label } = buildFileDrop();
    const changeHandler = vi.fn();
    input.addEventListener("change", changeHandler);

    label.dispatchEvent(dropEventWithFiles([]));

    expect(changeHandler).not.toHaveBeenCalled();
  });

  it("input desabilitado ignora o drop", () => {
    const { input, label } = buildFileDrop({ disabled: true });
    const changeHandler = vi.fn();
    input.addEventListener("change", changeHandler);

    label.dispatchEvent(dropEventWithFiles([{ name: "foto.png" }]));

    expect(changeHandler).not.toHaveBeenCalled();
  });

  it("dispose() remove os listeners de drag-and-drop", () => {
    const { input, label, fileDrop } = buildFileDrop();
    fileDrop.dispose();

    const changeHandler = vi.fn();
    input.addEventListener("change", changeHandler);
    label.dispatchEvent(dropEventWithFiles([{ name: "foto.png" }]));

    expect(changeHandler).not.toHaveBeenCalled();
  });
});
