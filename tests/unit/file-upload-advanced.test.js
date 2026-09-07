import { describe, it, expect, afterEach, vi } from "vitest";
import { FileUploadAdvanced } from "../../packages/fokus-js/js/file-upload-advanced.js";

function buildUpload() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="fs-file-upload" id="upload">
      <input type="file" class="fs-file-input" id="anexos" multiple>
      <label for="anexos" class="fs-file-label">Escolher arquivos</label>
    </div>
  `;
  document.body.appendChild(wrapper);

  const rootEl = wrapper.querySelector("#upload");
  const input = wrapper.querySelector("input");

  let filesValue = input.files;
  Object.defineProperty(input, "files", {
    get: () => filesValue,
    set: (value) => {
      filesValue = value;
    },
    configurable: true,
  });

  return { rootEl, input, upload: new FileUploadAdvanced(rootEl) };
}

function makeFile(name, size, type = "text/plain") {
  const file = new File(["x".repeat(size)], name, { type });
  return file;
}

describe("FileUploadAdvanced", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("lança erro se .fs-file-input não existe", () => {
    const div = document.createElement("div");
    expect(() => new FileUploadAdvanced(div)).toThrow();
  });

  it("getInstance() retorna a instância criada", () => {
    const { rootEl, upload } = buildUpload();
    expect(FileUploadAdvanced.getInstance(rootEl)).toBe(upload);
  });

  it("selecionar arquivos via change adiciona itens à lista e a getFiles()", () => {
    const { input, upload } = buildUpload();
    const files = [makeFile("foto.png", 1024, "image/png"), makeFile("doc.pdf", 2048, "application/pdf")];
    input.files = files;
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(upload.getFiles()).toHaveLength(2);
    expect(upload.getFiles().map((f) => f.name)).toEqual(["foto.png", "doc.pdf"]);
  });

  it("dispara fs:file-upload:added com o id de cada item novo", () => {
    const { rootEl, input } = buildUpload();
    const handler = vi.fn();
    rootEl.addEventListener("fs:file-upload:added", handler);

    input.files = [makeFile("a.txt", 10)];
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);
    const { items } = handler.mock.calls[0][0].detail;
    expect(items).toHaveLength(1);
    expect(items[0].file.name).toBe("a.txt");
    expect(typeof items[0].id).toBe("string");
  });

  it("setProgress() atualiza --fs-progress-value do item", () => {
    const { rootEl, input, upload } = buildUpload();
    let id;
    rootEl.addEventListener("fs:file-upload:added", (e) => {
      id = e.detail.items[0].id;
    });

    input.files = [makeFile("a.txt", 10)];
    input.dispatchEvent(new Event("change", { bubbles: true }));

    upload.setProgress(id, 42);

    const bar = rootEl.querySelector(`[data-file-id="${id}"] .fs-progress-bar`);
    expect(bar.getAttribute("style")).toContain("--fs-progress-value: 42");
  });

  it("setError() marca o item com is-error e mostra a mensagem no lugar do tamanho", () => {
    const { rootEl, input, upload } = buildUpload();
    let id;
    rootEl.addEventListener("fs:file-upload:added", (e) => {
      id = e.detail.items[0].id;
    });

    input.files = [makeFile("a.txt", 10)];
    input.dispatchEvent(new Event("change", { bubbles: true }));

    upload.setError(id, "Arquivo muito grande");

    const itemEl = rootEl.querySelector(`[data-file-id="${id}"]`);
    expect(itemEl.classList.contains("is-error")).toBe(true);
    expect(itemEl.querySelector(".fs-file-upload-size").textContent).toBe("Arquivo muito grande");
  });

  it("clicar em remover tira o item da lista, de getFiles() e dispara fs:file-upload:removed", () => {
    const { rootEl, input, upload } = buildUpload();

    input.files = [makeFile("a.txt", 10)];
    input.dispatchEvent(new Event("change", { bubbles: true }));

    const handler = vi.fn();
    rootEl.addEventListener("fs:file-upload:removed", handler);

    const removeBtn = rootEl.querySelector("[data-file-upload-remove]");
    removeBtn.click();

    expect(upload.getFiles()).toHaveLength(0);
    expect(rootEl.querySelectorAll(".fs-file-upload-item")).toHaveLength(0);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("gera thumbnail (img) só para arquivos de imagem", () => {
    const { rootEl, input } = buildUpload();

    input.files = [makeFile("foto.png", 10, "image/png"), makeFile("doc.pdf", 10, "application/pdf")];
    input.dispatchEvent(new Event("change", { bubbles: true }));

    const items = rootEl.querySelectorAll(".fs-file-upload-item");
    expect(items[0].querySelector(".fs-file-upload-thumb img")).not.toBeNull();
    expect(items[1].querySelector(".fs-file-upload-thumb img")).toBeNull();
    expect(items[1].querySelector(".fs-file-upload-thumb").textContent).toBe("PDF");
  });

  it("dispose() remove os listeners", () => {
    const { rootEl, input, upload } = buildUpload();
    upload.dispose();

    input.files = [makeFile("a.txt", 10)];
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(rootEl.querySelectorAll(".fs-file-upload-item")).toHaveLength(0);
  });
});
