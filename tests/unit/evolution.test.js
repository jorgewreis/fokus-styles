import { afterEach, describe, expect, it, vi } from "vitest";
import { Theme } from "../../packages/fokus-js/js/theme.js";
import { FormValidation } from "../../packages/fokus-js/js/form-validation.js";
import { Navbar } from "../../packages/fokus-js/js/navbar.js";
import { Scrollspy } from "../../packages/fokus-js/js/scrollspy.js";
import { Accordion } from "../../packages/fokus-js/js/accordion.js";
import { Modal } from "../../packages/fokus-js/js/modal.js";
import { Offcanvas } from "../../packages/fokus-js/js/offcanvas.js";

afterEach(() => { document.body.innerHTML = ""; });

describe("Fokus Styles evolution API", () => {
  it("aplica o color mode canônico e mantém o atributo legado", () => {
    Theme.set("dark");
    expect(document.documentElement.getAttribute("data-fs-theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("controla Navbar com API idempotente e devolve foco no fechamento", () => {
    document.body.innerHTML = '<nav data-fs="navbar"><button data-fs-toggle="navbar" data-fs-target="#menu" aria-expanded="false">Menu</button><div id="menu" class="fs-navbar-collapse" hidden>Links</div></nav>';
    const nav = document.querySelector("nav");
    const instance = Navbar.getOrCreateInstance(nav);
    expect(Navbar.getOrCreateInstance(nav)).toBe(instance);
    instance.show();
    expect(document.querySelector("#menu").hidden).toBe(false);
    instance.hide();
    expect(document.activeElement).toBe(nav.querySelector("button"));
  });

  it("auto-initializes Navbar from the public data-fs selector", async () => {
    vi.resetModules();
    document.body.innerHTML = '<nav data-fs="navbar"><button data-fs-toggle="navbar">Menu</button><div class="fs-navbar-collapse"></div></nav>';
    const { Navbar: FreshNavbar } = await import("../../packages/fokus-js/js/fokus.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));
    const nav = document.querySelector('[data-fs="navbar"]');

    expect(FreshNavbar.getInstance(nav)).toBeDefined();
    FreshNavbar.getInstance(nav).dispose();
  });

  it("fecha Navbar com Escape, anuncia eventos e define erro para markup incompleto", () => {
    document.body.innerHTML = '<nav data-fs="navbar"><button data-fs-toggle="navbar" aria-expanded="false">Menu</button><div class="fs-navbar-collapse" hidden><a href="#">Link</a></div></nav>';
    const nav = document.querySelector("nav");
    const toggle = nav.querySelector("[data-fs-toggle]");
    const events = [];
    nav.addEventListener("fs:shown", () => events.push("shown"));
    nav.addEventListener("fs:hidden", () => events.push("hidden"));
    const navbar = Navbar.getOrCreateInstance(nav);

    navbar.show();
    nav.querySelector(".fs-navbar-collapse").dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(nav.querySelector(".fs-navbar-collapse").hidden).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
    expect(events).toEqual(["shown", "hidden"]);
    navbar.dispose();
    expect(() => new Navbar(document.createElement("nav"))).toThrowError(
      "FokusStyles.Navbar: botão toggler e menu de colapso são obrigatórios.",
    );
  });

  it("preserves a replacement Navbar when an older instance is disposed again", () => {
    document.body.innerHTML = '<nav data-fs="navbar"><button data-fs-toggle="navbar">Menu</button><div class="fs-navbar-collapse"></div></nav>';
    const nav = document.querySelector("nav");
    const original = Navbar.getOrCreateInstance(nav);
    original.dispose();
    const replacement = Navbar.getOrCreateInstance(nav);

    original.dispose();

    expect(Navbar.getInstance(nav)).toBe(replacement);
    replacement.dispose();
  });

  it("dispose removes Navbar click and Escape listeners", () => {
    document.body.innerHTML = '<nav data-fs="navbar"><button data-fs-toggle="navbar">Menu</button><div class="fs-navbar-collapse"></div></nav>';
    const nav = document.querySelector("nav");
    const toggle = nav.querySelector("button");
    const menu = nav.querySelector(".fs-navbar-collapse");
    const navbar = new Navbar(nav);
    navbar.dispose();

    toggle.click();
    expect(navbar.isOpen()).toBe(false);
    navbar.show();
    menu.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(navbar.isOpen()).toBe(true);
    expect(Navbar.getInstance(nav)).toBeUndefined();
  });

  it("marca campos inválidos sem depender de tooltip", () => {
    document.body.innerHTML = '<form data-fs="form-validation"><input required></form>';
    const form = document.querySelector("form");
    const instance = new FormValidation(form);
    const event = new SubmitEvent("submit", { cancelable: true });
    form.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(form.querySelector("input").getAttribute("aria-invalid")).toBe("true");
    instance.dispose();
  });

  it("ativa links do Scrollspy", () => {
    document.body.innerHTML = '<nav data-fs="scrollspy"><a href="#one">Um</a><a href="#two">Dois</a></nav><section id="one"></section><section id="two"></section>';
    const nav = document.querySelector("nav");
    const instance = new Scrollspy(nav);
    instance.activate(document.querySelector("#two"));
    expect(nav.querySelector('a[href="#two"]').classList.contains("is-active")).toBe(true);
    instance.dispose();
  });

  it("mantém o contrato de evento e o fallback por scroll sem IntersectionObserver", () => {
    const previousObserver = globalThis.IntersectionObserver;
    const previousHeight = Object.getOwnPropertyDescriptor(window, "innerHeight");
    delete globalThis.IntersectionObserver;
    document.body.innerHTML = '<nav><a href="#one">Um</a><a href="#two">Dois</a></nav><section id="one"></section><section id="two"></section>';
    const nav = document.querySelector("nav");
    const first = document.querySelector("#one");
    const second = document.querySelector("#two");
    Object.defineProperty(first, "getBoundingClientRect", { value: () => ({ top: 100 }) });
    Object.defineProperty(second, "getBoundingClientRect", { value: () => ({ top: 200 }) });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 1000 });
    const activated = [];
    nav.addEventListener("fs:scrollspy:activate", (event) => activated.push(event.detail.section));
    const scrollspy = new Scrollspy(nav);

    try {
      window.dispatchEvent(new Event("scroll"));

      expect(nav.querySelector('a[href="#two"]').classList.contains("is-active")).toBe(true);
      expect(activated).toEqual([second]);
      expect(nav.querySelector('a[href="#one"]')?.getAttribute("href")).toBe("#one");
      expect(nav.querySelector('a[href="#one"]').tabIndex).toBe(0);
      expect(Scrollspy.getInstance(nav)).toBe(scrollspy);
    } finally {
      scrollspy.dispose();
      if (previousObserver !== undefined) globalThis.IntersectionObserver = previousObserver;
      else delete globalThis.IntersectionObserver;
      if (previousHeight) Object.defineProperty(window, "innerHeight", previousHeight);
      else delete window.innerHeight;
    }
    expect(Scrollspy.getInstance(nav)).toBeUndefined();
    window.dispatchEvent(new Event("scroll"));
    expect(activated).toHaveLength(1);
  });

  it("auto-initializes Scrollspy from the runtime selector without changing native link keyboard behavior", async () => {
    vi.resetModules();
    document.body.innerHTML = '<nav data-fs="scrollspy"><a href="#target">Destino</a></nav><section id="target"></section>';
    const { Scrollspy: FreshScrollspy } = await import("../../packages/fokus-js/js/fokus.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));
    const nav = document.querySelector('[data-fs="scrollspy"]');

    expect(FreshScrollspy.getInstance(nav)).toBeDefined();
    expect(nav.querySelector("a").tabIndex).toBe(0);
    FreshScrollspy.getInstance(nav).dispose();
  });

  it("preserves a replacement Scrollspy when an older instance is disposed again", () => {
    document.body.innerHTML = '<nav><a href="#target">Destino</a></nav><section id="target"></section>';
    const nav = document.querySelector("nav");
    const original = Scrollspy.getOrCreateInstance(nav);
    original.dispose();
    const replacement = Scrollspy.getOrCreateInstance(nav);

    original.dispose();

    expect(Scrollspy.getInstance(nav)).toBe(replacement);
    replacement.dispose();
  });

  it("preserva um painel aberto no modo always-open", () => {
    document.body.innerHTML = '<div data-fs="accordion" data-fs-always-open="true"><div class="fs-accordion-item"><button class="fs-accordion-button" aria-expanded="true">Um</button><div class="fs-accordion-collapse"><div class="fs-accordion-body">Conteúdo</div></div></div></div>';
    const accordion = new Accordion(document.querySelector("[data-fs=accordion]"));
    const button = document.querySelector(".fs-accordion-button");
    button.click();
    expect(button.getAttribute("aria-expanded")).toBe("true");
    accordion.dispose();
  });

  it("aceita gatilho data-fs-toggle e eventos comuns no Modal", () => {
    document.body.innerHTML = '<button data-fs-toggle="modal" data-fs-target="#dialog">Abrir</button><div id="dialog"><div class="fs-modal-dialog"><h2 class="fs-modal-title">Diálogo</h2></div></div>';
    const trigger = document.querySelector("button");
    const shown = [];
    trigger.addEventListener("fs:shown", () => shown.push(true));
    const modal = Modal.getOrCreateInstance(trigger);
    modal.show();
    expect(shown).toHaveLength(1);
    modal.dispose();
  });

  it("expõe a API estática e eventos comuns do Offcanvas", () => {
    document.body.innerHTML = '<button data-fs-target="#panel">Abrir</button><div id="panel" class="fs-offcanvas"><div class="fs-offcanvas-body"><button>Conteúdo</button></div></div>';
    const trigger = document.querySelector("button");
    const events = [];
    trigger.addEventListener("fs:shown", () => events.push("shown"));
    Offcanvas.show(trigger, { backdrop: false });
    expect(events).toEqual(["shown"]);
    Offcanvas.hide(trigger);
  });
});
