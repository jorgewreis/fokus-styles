import { describe, it, expect, afterEach, vi } from "vitest";
import { Tabs } from "../../packages/fokus-js/js/tabs.js";

function buildTabs() {
  const container = document.createElement("div");
  container.innerHTML = `
    <div class="fs-tabs" id="tablist">
      <a href="#" class="fs-nav-link is-active" data-fs-target="#pane1">Perfil</a>
      <a href="#" class="fs-nav-link" data-fs-target="#pane2">Segurança</a>
      <a href="#" class="fs-nav-link is-disabled" data-fs-target="#pane3">Notificações</a>
    </div>
    <div class="fs-tab-content">
      <div class="fs-tab-pane is-active" id="pane1">Conteúdo 1</div>
      <div class="fs-tab-pane" id="pane2">Conteúdo 2</div>
      <div class="fs-tab-pane" id="pane3">Conteúdo 3</div>
    </div>
  `;
  document.body.appendChild(container);

  const tablistEl = container.querySelector("#tablist");
  return { container, tablistEl, tabs: new Tabs(tablistEl) };
}

describe("Tabs", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("getInstance() retorna a instância criada", () => {
    const { tablistEl, tabs } = buildTabs();
    expect(Tabs.getInstance(tablistEl)).toBe(tabs);
  });

  it("define role=tablist/tab/tabpanel e aria-selected/tabindex conforme o estado inicial", () => {
    const { tablistEl } = buildTabs();
    const links = tablistEl.querySelectorAll(".fs-nav-link");

    expect(tablistEl.getAttribute("role")).toBe("tablist");
    expect(links[0].getAttribute("role")).toBe("tab");
    expect(links[0].getAttribute("aria-selected")).toBe("true");
    expect(links[0].getAttribute("tabindex")).toBe("0");
    expect(links[1].getAttribute("aria-selected")).toBe("false");
    expect(links[1].getAttribute("tabindex")).toBe("-1");

    const pane2 = document.getElementById("pane2");
    expect(pane2.getAttribute("role")).toBe("tabpanel");
    expect(pane2.getAttribute("aria-labelledby")).toBe(links[1].id);
  });

  it("clicar numa aba ativa ela e o painel correspondente, desativando as demais", () => {
    const { container } = buildTabs();
    const links = container.querySelectorAll(".fs-nav-link");

    links[1].click();

    expect(links[1].classList.contains("is-active")).toBe(true);
    expect(links[0].classList.contains("is-active")).toBe(false);
    expect(document.getElementById("pane2").classList.contains("is-active")).toBe(true);
    expect(document.getElementById("pane1").classList.contains("is-active")).toBe(false);
  });

  it("clicar numa aba desabilitada não faz nada", () => {
    const { container } = buildTabs();
    const links = container.querySelectorAll(".fs-nav-link");

    links[2].click();

    expect(links[2].classList.contains("is-active")).toBe(false);
    expect(links[0].classList.contains("is-active")).toBe(true);
  });

  it("ArrowRight/ArrowLeft navegam pulando abas desabilitadas", () => {
    const { container } = buildTabs();
    const links = container.querySelectorAll(".fs-nav-link");
    links[0].focus();

    container.querySelector("#tablist").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    // só existem 2 abas habilitadas (0 e 1); da 0 avança pra 1.
    expect(document.activeElement).toBe(links[1]);
    expect(links[1].classList.contains("is-active")).toBe(true);

    container.querySelector("#tablist").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    // de volta pra 0, pulando a aba desabilitada (2).
    expect(document.activeElement).toBe(links[0]);
  });

  it("End move para a última aba habilitada, não para a última aba do DOM", () => {
    const { container } = buildTabs();
    const links = container.querySelectorAll(".fs-nav-link");
    links[0].focus();

    container.querySelector("#tablist").dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));

    expect(document.activeElement).toBe(links[1]);
  });

  it("dispara fs:tab:changed com o target no detail", () => {
    const { container } = buildTabs();
    const links = container.querySelectorAll(".fs-nav-link");
    const handler = vi.fn();
    links[1].addEventListener("fs:tab:changed", handler);

    links[1].click();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail.target).toBe("#pane2");
  });

  it("dispose() remove os listeners e o registro da instância", () => {
    const { tablistEl, tabs } = buildTabs();
    tabs.dispose();

    expect(Tabs.getInstance(tablistEl)).toBeUndefined();
  });

  it("aceita gatilhos declarados com role=tab", () => {
    const root = document.createElement("div");
    root.innerHTML = '<div data-fs="tabs"><button role="tab" data-fs-tab-target="#custom-pane">Custom</button></div><div id="custom-pane">Conteúdo</div>';
    document.body.appendChild(root);
    const tabs = new Tabs(root.querySelector('[data-fs="tabs"]'));

    expect(tabs.tabs[0].getAttribute("aria-selected")).toBe("false");
    tabs.tabs[0].click();
    expect(tabs.tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(document.getElementById("custom-pane").hidden).toBe(false);
  });
});
