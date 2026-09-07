import { afterEach, describe, expect, it } from "vitest";
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
    document.body.innerHTML = '<nav data-fs-scrollspy><a href="#one">Um</a><a href="#two">Dois</a></nav><section id="one"></section><section id="two"></section>';
    const nav = document.querySelector("nav");
    const instance = new Scrollspy(nav);
    instance.activate(document.querySelector("#two"));
    expect(nav.querySelector('a[href="#two"]').classList.contains("is-active")).toBe(true);
    instance.dispose();
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
