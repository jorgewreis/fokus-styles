import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Toast } from "../../packages/fokus-js/js/toast.js";

function buildToast({ delay, autohide, progress } = {}) {
  const el = document.createElement("div");
  el.className = "fs-toast";
  if (delay !== undefined) el.setAttribute("data-delay", String(delay));
  if (autohide !== undefined) el.setAttribute("data-autohide", String(autohide));
  if (progress !== undefined) el.setAttribute("data-toast-progress", String(progress));
  el.innerHTML = `
    <div class="fs-toast-header">
      <span>Título</span>
      <button type="button" class="fs-btn-close" data-fs-dismiss="toast"></button>
    </div>
    <div class="fs-toast-body">Corpo</div>
  `;
  document.body.appendChild(el);

  return { el, toast: new Toast(el) };
}

describe("Toast", () => {
  beforeEach(() => {
    // prefers-reduced-motion: reduce evita depender de transitionend nestes testes.
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("getInstance() retorna a instância criada", () => {
    const { el, toast } = buildToast();
    expect(Toast.getInstance(el)).toBe(toast);
  });

  it("começa escondido (display:none) e com role/aria-live de status", () => {
    const { el } = buildToast();

    expect(el.style.display).toBe("none");
    expect(el.getAttribute("role")).toBe("status");
    expect(el.getAttribute("aria-live")).toBe("polite");
  });

  it("show() torna o toast visível", () => {
    const { el, toast } = buildToast();
    toast.show();

    expect(el.style.display).not.toBe("none");
  });

  it("hide() esconde o toast novamente", () => {
    const { el, toast } = buildToast();
    toast.show();
    toast.hide();

    expect(el.style.display).toBe("none");
  });

  it("clicar em [data-fs-dismiss=toast] fecha o toast", () => {
    const { el, toast } = buildToast();
    toast.show();

    el.querySelector('[data-fs-dismiss="toast"]').click();

    expect(el.style.display).toBe("none");
  });

  it("dispara fs:toast:shown e fs:toast:hidden", async () => {
    const { el, toast } = buildToast();
    const shownHandler = vi.fn();
    const hiddenHandler = vi.fn();
    el.addEventListener("fs:toast:shown", shownHandler);
    el.addEventListener("fs:toast:hidden", hiddenHandler);

    toast.show();
    await Promise.resolve();
    expect(shownHandler).toHaveBeenCalledTimes(1);

    toast.hide();
    await Promise.resolve();
    expect(hiddenHandler).toHaveBeenCalledTimes(1);
  });

  it("some sozinho após o delay padrão de auto-dismiss (4000ms)", () => {
    vi.useFakeTimers();
    const { el, toast } = buildToast();

    toast.show();
    expect(el.style.display).not.toBe("none");

    vi.advanceTimersByTime(4000);

    expect(el.style.display).toBe("none");
  });

  it("respeita data-delay customizado", () => {
    vi.useFakeTimers();
    const { el, toast } = buildToast({ delay: 1000 });

    toast.show();
    vi.advanceTimersByTime(999);
    expect(el.style.display).not.toBe("none");

    vi.advanceTimersByTime(1);
    expect(el.style.display).toBe("none");
  });

  it("data-autohide=false desativa o timer de auto-dismiss", () => {
    vi.useFakeTimers();
    const { el, toast } = buildToast({ autohide: "false" });

    toast.show();
    vi.advanceTimersByTime(10000);

    expect(el.style.display).not.toBe("none");
  });

  it("pausa e retoma o timer sem reiniciar o tempo já consumido", () => {
    vi.useFakeTimers();
    const { el, toast } = buildToast({ delay: 1000 });

    toast.show();
    vi.advanceTimersByTime(400);
    el.dispatchEvent(new Event("mouseenter"));
    vi.advanceTimersByTime(1000);
    expect(el.style.display).not.toBe("none");

    el.dispatchEvent(new Event("mouseleave"));
    vi.advanceTimersByTime(599);
    expect(el.style.display).not.toBe("none");
    vi.advanceTimersByTime(1);
    expect(el.style.display).toBe("none");
  });

  it("marca o Toast como pausado durante foco e remove a marca ao sair", () => {
    const { el, toast } = buildToast();
    toast.show();
    el.dispatchEvent(new FocusEvent("focusin"));
    expect(el.classList.contains("is-paused")).toBe(true);
    el.dispatchEvent(new FocusEvent("focusout"));
    expect(el.classList.contains("is-paused")).toBe(false);
  });

  it("configura a duração do indicador opcional", () => {
    const { el, toast } = buildToast({ delay: 2500, progress: true });
    toast.show();
    expect(el.style.getPropertyValue("--fs-toast-duration")).toBe("2500ms");
    expect(el.classList.contains("is-progressing")).toBe(true);
  });

  it("mantém o progresso visual desativado quando o auto-dismiss está desativado", () => {
    const { el, toast } = buildToast({ autohide: "false", progress: true });
    toast.show();
    expect(el.style.getPropertyValue("--fs-toast-duration")).toBe("4000ms");
  });

  it("dispose() cancela o timer pendente e remove o registro da instância", () => {
    vi.useFakeTimers();
    const { el, toast } = buildToast();

    toast.show();
    toast.dispose();

    expect(Toast.getInstance(el)).toBeUndefined();
  });
});
