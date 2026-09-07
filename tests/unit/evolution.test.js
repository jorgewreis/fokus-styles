import { afterEach, describe, expect, it } from "vitest";
import { Theme } from "../../packages/fokus-js/js/theme.js";
import { FormValidation } from "../../packages/fokus-js/js/form-validation.js";
import { Navbar } from "../../packages/fokus-js/js/navbar.js";
import { Scrollspy } from "../../packages/fokus-js/js/scrollspy.js";

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
});
