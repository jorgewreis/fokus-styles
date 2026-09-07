import { describe, it, expect, afterEach, vi } from "vitest";
import { Modal } from "../../packages/fokus-js/js/modal.js";

function buildModal({ backdropStatic = false } = {}) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <button type="button" id="trigger" data-fs-target="#myModal">Abrir</button>
    <div class="fs-modal" id="myModal" ${backdropStatic ? 'data-backdrop="static"' : ""}>
      <div class="fs-modal-dialog">
        <div class="fs-modal-content">
          <div class="fs-modal-header">
            <h3 class="fs-modal-title">Título</h3>
            <button type="button" class="fs-btn-close" data-fs-dismiss="modal">x</button>
          </div>
          <div class="fs-modal-body">
            <button type="button" id="bodyBtn">Ação</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  const trigger = wrapper.querySelector("#trigger");
  const modalEl = wrapper.querySelector("#myModal");

  return { trigger, modalEl, modal: new Modal(trigger) };
}

describe("Modal", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.body.style.overflow = "";
  });

  it("getInstance() retorna a instância criada", () => {
    const { trigger, modal } = buildModal();
    expect(Modal.getInstance(trigger)).toBe(modal);
  });

  it("define role e aria-modal no elemento do modal", () => {
    const { modalEl } = buildModal();
    expect(modalEl.getAttribute("role")).toBe("dialog");
    expect(modalEl.getAttribute("aria-modal")).toBe("true");
  });

  it("clicar no trigger abre o modal, bloqueia o scroll e prende o foco no primeiro elemento focável", () => {
    const { trigger, modalEl } = buildModal();

    trigger.click();

    expect(modalEl.classList.contains("is-open")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement.textContent).toBe("x");
  });

  it("Escape fecha o modal, libera o scroll e devolve o foco ao trigger", () => {
    const { trigger, modalEl, modal } = buildModal();
    modal.show();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(modalEl.classList.contains("is-open")).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(trigger);
  });

  it("clique fora do modal-dialog (backdrop) fecha o modal", async () => {
    const { modalEl, modal } = buildModal();
    modal.show();

    await new Promise((resolve) => setTimeout(resolve, 0));
    modalEl.click();

    expect(modalEl.classList.contains("is-open")).toBe(false);
  });

  it("qualquer elemento com data-fs-dismiss=modal fecha o modal", () => {
    const { modalEl, modal } = buildModal();
    modal.show();

    modalEl.querySelector('[data-fs-dismiss="modal"]').click();

    expect(modalEl.classList.contains("is-open")).toBe(false);
  });

  it("data-backdrop=static ignora Escape e clique fora", async () => {
    const { modalEl, modal } = buildModal({ backdropStatic: true });
    modal.show();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(modalEl.classList.contains("is-open")).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 0));
    modalEl.click();
    expect(modalEl.classList.contains("is-open")).toBe(true);

    modalEl.querySelector('[data-fs-dismiss="modal"]').click();
    expect(modalEl.classList.contains("is-open")).toBe(false);
  });

  it("dispara fs:modal:shown e fs:modal:hidden", () => {
    const { trigger, modal } = buildModal();
    const shownHandler = vi.fn();
    const hiddenHandler = vi.fn();
    trigger.addEventListener("fs:modal:shown", shownHandler);
    trigger.addEventListener("fs:modal:hidden", hiddenHandler);

    modal.show();
    expect(shownHandler).toHaveBeenCalledTimes(1);

    modal.hide();
    expect(hiddenHandler).toHaveBeenCalledTimes(1);
  });

  it("dispose() remove o registro da instância", () => {
    const { trigger, modal } = buildModal();
    modal.dispose();

    expect(Modal.getInstance(trigger)).toBeUndefined();
  });
});
