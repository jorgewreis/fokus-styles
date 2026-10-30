import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NotificationCenter } from "../../packages/fokus-js/js/notification-center.js";

function build({ storage } = {}) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <button type="button" id="bell" data-fs-target="#panel"${storage ? ` data-storage="${storage}"` : ""}>
      Notificações
      <span class="fs-notification-badge" hidden>0</span>
    </button>
    <div class="fs-notification-center" id="panel">
      <div class="fs-notification-center-header">
        <span class="fs-notification-center-title">Notificações</span>
        <button type="button" class="fs-btn-close" data-notification="clear" aria-label="Limpar"></button>
      </div>
      <ul class="fs-notification-list"></ul>
      <div class="fs-notification-empty" hidden>Nenhuma notificação.</div>
    </div>
    <div class="fs-toast-container" id="toasts"></div>
  `;
  document.body.appendChild(wrapper);

  const trigger = wrapper.querySelector("#bell");
  return { wrapper, trigger, center: new NotificationCenter(trigger) };
}

describe("NotificationCenter", () => {
  beforeEach(() => {
    // prefers-reduced-motion: reduce evita depender de transitionend nos toasts.
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("getInstance() retorna a instância criada", () => {
    const { trigger, center } = build();
    expect(NotificationCenter.getInstance(trigger)).toBe(center);
  });

  it("push() registra a notificação, cria um toast e atualiza o contador", () => {
    const { center } = build();

    center.push({ title: "Backup concluído", body: "Tudo certo.", variant: "success" });

    expect(center.getAll()).toHaveLength(1);
    expect(document.querySelector("#toasts .fs-toast")).not.toBeNull();
    expect(document.querySelector(".fs-notification-item-title").textContent).toBe("Backup concluído");

    const badge = document.querySelector(".fs-notification-badge");
    expect(badge.hasAttribute("hidden")).toBe(false);
    expect(badge.textContent).toBe("1");
  });

  it("escapa HTML no título/corpo da notificação", () => {
    const { center } = build();
    center.push({ title: "<img src=x onerror=alert(1)>", body: "<b>oi</b>" });

    const item = document.querySelector(".fs-notification-item");
    expect(item.querySelector(".fs-notification-item-title").innerHTML).not.toContain("<img");
    expect(item.querySelector(".fs-notification-item-text").innerHTML).not.toContain("<b>");
  });

  it("open() marca tudo como lido (zera o contador) e mostra o painel", () => {
    const { trigger, center } = build();
    center.push({ title: "A" });
    center.push({ title: "B" });

    center.open();

    const panel = document.querySelector("#panel");
    expect(panel.classList.contains("is-open")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(center.unreadCount).toBe(0);
    expect(document.querySelector(".fs-notification-badge").hasAttribute("hidden")).toBe(true);
  });

  it("clicar em [data-notification-dismiss] remove só aquela notificação", () => {
    const { center } = build();
    center.push({ title: "A" });
    center.push({ title: "B" });

    // Mais recente primeiro: o primeiro item é "B".
    document.querySelector(".fs-notification-item [data-notification-dismiss]").click();

    expect(center.getAll().map((r) => r.title)).toEqual(["A"]);
  });

  it("o botão limpar do cabeçalho esvazia o histórico e mostra o estado vazio", () => {
    const { center } = build();
    center.push({ title: "A" });

    document.querySelector('[data-notification="clear"]').click();

    expect(center.getAll()).toHaveLength(0);
    expect(document.querySelector(".fs-notification-empty").hasAttribute("hidden")).toBe(false);
    expect(document.querySelector(".fs-notification-badge").hasAttribute("hidden")).toBe(true);
  });

  it("dispara fs:notification:pushed / opened / cleared", () => {
    const { trigger, center } = build();
    const pushed = vi.fn();
    const opened = vi.fn();
    const cleared = vi.fn();
    trigger.addEventListener("fs:notification:pushed", pushed);
    trigger.addEventListener("fs:notification:opened", opened);
    trigger.addEventListener("fs:notification:cleared", cleared);

    center.push({ title: "A" });
    center.open();
    center.clear();

    expect(pushed).toHaveBeenCalledTimes(1);
    expect(opened).toHaveBeenCalledTimes(1);
    expect(cleared).toHaveBeenCalledTimes(1);
  });

  it("data-storage=local persiste o histórico entre instâncias", () => {
    const first = build({ storage: "local" });
    first.center.push({ title: "Persistente" });
    first.center.dispose();
    first.wrapper.remove();

    const second = build({ storage: "local" });
    expect(second.center.getAll().map((r) => r.title)).toEqual(["Persistente"]);
  });

  it("dispose() remove o registro da instância", () => {
    const { trigger, center } = build();
    center.dispose();
    expect(NotificationCenter.getInstance(trigger)).toBeUndefined();
  });
  it.each(["primary", "secondary", "success", "warning", "danger", "info"])("preserva variante %s no toast e histórico", (variant) => {
    const { center } = build();
    center.push({ variant, autohide: false });
    expect(document.querySelector(`.fs-toast-${variant}`)).not.toBeNull();
    expect(document.querySelector(`.fs-notification-item-${variant}`)).not.toBeNull();
    center.dispose();
  });

  it.each(['x" data-injected="yes', 'x"><img src=x onerror="alert(1)">', "custom", null, {}])("normaliza variante inválida em push: %s", (variant) => {
    const { center } = build();
    center.push({ variant, autohide: false });
    expect(center.getAll()[0].variant).toBe("primary");
    expect(document.querySelector(".fs-notification-item-primary")).not.toBeNull();
    expect(document.querySelector('[data-injected], img, [onerror]')).toBeNull();
    center.dispose();
  });

  it.each([{}, "invalid", 42, null, [null, 42, {}, { id: 2 }]])("ignora armazenamento com formato inválido: %s", (stored) => {
    localStorage.setItem("fokus-notifications", JSON.stringify(stored));
    const { center } = build({ storage: "local" });
    expect(center.getAll()).toEqual([]);
    center.dispose();
  });

  it("ignora JSON corrompido sem impedir inicialização", () => {
    localStorage.setItem("fokus-notifications", "{");
    const { center } = build({ storage: "local" });
    expect(center.getAll()).toEqual([]);
    center.dispose();
  });

  it("trata IDs e variantes do storage como dados, não HTML, e mantém remoção", () => {
    const id = 'n-1" data-injected="yes"><img src=x onerror="alert(1)">';
    localStorage.setItem("fokus-notifications", JSON.stringify([
      { id, variant: 'x" data-injected="yes', title: "Legado", body: "<img src=x>", time: "inválido", read: "false" },
    ]));
    const { center } = build({ storage: "local" });
    expect(center.getAll()[0]).toMatchObject({ id, variant: "primary", time: 0, read: false });
    expect(document.querySelector(".fs-notification-item").dataset.id).toBe(id);
    expect(document.querySelector('[data-injected], img, [onerror]')).toBeNull();
    document.querySelector('[data-notification-dismiss]').click();
    expect(center.getAll()).toEqual([]);
    center.dispose();
  });

  it("não reutiliza ID existente no histórico persistido", () => {
    const { center } = build();
    const previous = center.push({ autohide: false });
    const next = `n-${Number(previous.slice(2)) + 1}`;
    center.history.push({ id: next, title: "Anterior", body: "", variant: "info", time: 0, read: false });
    expect(center.push({ autohide: false })).not.toBe(next);
    expect(new Set(center.getAll().map(r => r.id)).size).toBe(3);
    center.dispose();
  });

});
