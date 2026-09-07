import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { Popover } from "../../packages/fokus-js/js/popover.js";

function buildPopover({ trigger = "click" } = {}) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <button type="button" id="trigger" data-fs-target="#myPopover" data-trigger="${trigger}">Abrir</button>
    <div class="fs-popover" id="myPopover">
      <div class="fs-popover-arrow"></div>
      <div class="fs-popover-header">Título</div>
      <div class="fs-popover-body">
        <button type="button" id="innerBtn">Ação interna</button>
        <button type="button" data-fs-dismiss="popover" id="dismissBtn">Fechar</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  const triggerEl = wrapper.querySelector("#trigger");
  const popoverEl = document.getElementById("myPopover");

  return { wrapper, triggerEl, popoverEl, popover: new Popover(triggerEl) };
}

describe("Popover", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("getInstance() retorna a instância criada", () => {
    const { triggerEl, popover } = buildPopover();
    expect(Popover.getInstance(triggerEl)).toBe(popover);
  });

  it("reanexa o painel a document.body e define ARIA", () => {
    const { triggerEl, popoverEl } = buildPopover();

    expect(popoverEl.parentElement).toBe(document.body);
    expect(popoverEl.getAttribute("role")).toBe("dialog");
    expect(popoverEl.getAttribute("aria-modal")).toBe("false");
    expect(popoverEl.getAttribute("aria-labelledby")).toBe(popoverEl.querySelector(".fs-popover-header").id);
    expect(triggerEl.getAttribute("aria-controls")).toBe(popoverEl.id);
    expect(triggerEl.getAttribute("aria-expanded")).toBe("false");
  });

  describe("trigger click (padrão)", () => {
    it("clique no gatilho alterna show e aria-expanded", () => {
      const { triggerEl, popoverEl } = buildPopover();

      triggerEl.click();
      expect(popoverEl.classList.contains("is-open")).toBe(true);
      expect(triggerEl.getAttribute("aria-expanded")).toBe("true");

      triggerEl.click();
      expect(popoverEl.classList.contains("is-open")).toBe(false);
      expect(triggerEl.getAttribute("aria-expanded")).toBe("false");
    });

    it("define data-placement no painel após abrir", () => {
      const { triggerEl, popoverEl } = buildPopover();
      triggerEl.click();
      expect(popoverEl.getAttribute("data-placement")).toBeTruthy();
    });

    it("clicar em conteúdo interno (não-dismiss) NÃO fecha o popover", async () => {
      const { triggerEl, popoverEl } = buildPopover();
      triggerEl.click();
      await new Promise((resolve) => setTimeout(resolve, 0));

      popoverEl.querySelector("#innerBtn").click();

      expect(popoverEl.classList.contains("is-open")).toBe(true);
    });

    it("elemento com data-fs-dismiss=popover fecha o painel", () => {
      const { triggerEl, popoverEl } = buildPopover();
      triggerEl.click();

      popoverEl.querySelector("#dismissBtn").click();

      expect(popoverEl.classList.contains("is-open")).toBe(false);
    });

    it("clique fora fecha o painel", async () => {
      const { triggerEl, popoverEl } = buildPopover();
      triggerEl.click();
      await new Promise((resolve) => setTimeout(resolve, 0));

      document.body.click();

      expect(popoverEl.classList.contains("is-open")).toBe(false);
    });

    it("Escape fecha e devolve o foco ao gatilho", () => {
      const { triggerEl, popoverEl } = buildPopover();
      triggerEl.click();

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

      expect(popoverEl.classList.contains("is-open")).toBe(false);
      expect(document.activeElement).toBe(triggerEl);
    });

    it("não bloqueia scroll nem cria focus trap (não é modal)", () => {
      const { triggerEl } = buildPopover();
      triggerEl.click();

      expect(document.body.style.overflow).toBe("");
    });

    it("dispara fs:popover:shown e fs:popover:hidden", () => {
      const { triggerEl, popover } = buildPopover();
      const shownHandler = vi.fn();
      const hiddenHandler = vi.fn();
      triggerEl.addEventListener("fs:popover:shown", shownHandler);
      triggerEl.addEventListener("fs:popover:hidden", hiddenHandler);

      popover.show();
      expect(shownHandler).toHaveBeenCalledTimes(1);

      popover.hide();
      expect(hiddenHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("trigger hover", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("mouseenter no gatilho mostra; mouseleave esconde após o delay", () => {
      const { triggerEl, popoverEl } = buildPopover({ trigger: "hover" });

      triggerEl.dispatchEvent(new MouseEvent("mouseenter"));
      expect(popoverEl.classList.contains("is-open")).toBe(true);

      triggerEl.dispatchEvent(new MouseEvent("mouseleave"));
      expect(popoverEl.classList.contains("is-open")).toBe(true); // ainda dentro do delay
      vi.advanceTimersByTime(150);
      expect(popoverEl.classList.contains("is-open")).toBe(false);
    });

    it("mover do gatilho para o próprio popover cancela o fechamento", () => {
      const { triggerEl, popoverEl } = buildPopover({ trigger: "hover" });

      triggerEl.dispatchEvent(new MouseEvent("mouseenter"));
      triggerEl.dispatchEvent(new MouseEvent("mouseleave"));
      vi.advanceTimersByTime(50);
      popoverEl.dispatchEvent(new MouseEvent("mouseenter"));
      vi.advanceTimersByTime(150);

      expect(popoverEl.classList.contains("is-open")).toBe(true);
    });
  });

  describe("trigger focus", () => {
    it("focus no gatilho mostra; focusout para fora do painel esconde", () => {
      const { triggerEl, popoverEl } = buildPopover({ trigger: "focus" });

      triggerEl.dispatchEvent(new Event("focus"));
      expect(popoverEl.classList.contains("is-open")).toBe(true);

      triggerEl.dispatchEvent(new FocusEvent("focusout", { relatedTarget: document.body }));
      expect(popoverEl.classList.contains("is-open")).toBe(false);
    });

    it("focusout do gatilho para dentro do painel mantém aberto", () => {
      const { triggerEl, popoverEl } = buildPopover({ trigger: "focus" });

      triggerEl.dispatchEvent(new Event("focus"));
      triggerEl.dispatchEvent(new FocusEvent("focusout", { relatedTarget: popoverEl.querySelector("#innerBtn") }));

      expect(popoverEl.classList.contains("is-open")).toBe(true);
    });
  });

  describe("trigger manual", () => {
    it("clique/hover/focus no gatilho não fazem nada automaticamente", () => {
      const { triggerEl, popoverEl } = buildPopover({ trigger: "manual" });

      triggerEl.click();
      triggerEl.dispatchEvent(new MouseEvent("mouseenter"));
      triggerEl.dispatchEvent(new Event("focus"));

      expect(popoverEl.classList.contains("is-open")).toBe(false);
    });

    it("só abre/fecha via API programática", () => {
      const { popoverEl, popover } = buildPopover({ trigger: "manual" });

      popover.show();
      expect(popoverEl.classList.contains("is-open")).toBe(true);

      popover.hide();
      expect(popoverEl.classList.contains("is-open")).toBe(false);
    });

    it("clique fora não fecha (sem onClickOutside registrado)", async () => {
      const { popoverEl, popover } = buildPopover({ trigger: "manual" });
      popover.show();
      await new Promise((resolve) => setTimeout(resolve, 0));

      document.body.click();

      expect(popoverEl.classList.contains("is-open")).toBe(true);
    });
  });

  it("dispose() restaura o painel e remove listeners e registro da instância", () => {
    const { wrapper, triggerEl, popover } = buildPopover();
    popover.dispose();

    expect(Popover.getInstance(triggerEl)).toBeUndefined();
    expect(wrapper.querySelector("#myPopover")).not.toBeNull();
  });
});
