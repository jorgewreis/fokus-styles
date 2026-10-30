import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { compile } from "sass";
import { Scrollspy } from "../../packages/fokus-js/js/scrollspy.js";

const names = ["avatar", "button-group", "close-button", "code", "icon-link", "list-group", "placeholder", "ratio", "responsive", "scrollspy"];
const source = (name) => readFileSync(`docs/components/${name}.md`, "utf8");
const blocks = (name, language = "html") => [...source(name).matchAll(new RegExp("```" + language + "\\n([\\s\\S]*?)```", "g"))].map((match) => match[1]);
const render = (name) => { document.body.innerHTML = blocks(name).join("\n"); };
let css;
let spy;
beforeAll(() => { css = compile("scss/fokus.scss", { logger: { warn() {} } }).css; }, 30000);
afterEach(() => { spy?.dispose(); spy = undefined; document.body.innerHTML = ""; });

describe("completed component documentation contracts", () => {
  for (const name of names) {
    it(`${name}: every copyable class exists in the compiled distribution`, () => {
      expect(blocks(name).length).toBeGreaterThan(0);
      render(name);
      for (const element of document.querySelectorAll("[class]")) {
        for (const className of element.classList) {
          if (!className.startsWith("fs-")) continue;
          expect(css, `${name}: ${className}`).toMatch(new RegExp("\\." + className + "(?![a-zA-Z0-9_-])"));
        }
      }
    });
  }
  it("every documented custom property exists in compiled CSS", () => {
    for (const name of names) {
      for (const token of source(name).matchAll(/`(--fs-[a-z0-9-]+)`/g)) {
        // Explicitly named as a nonexistent token, rather than a customization API.
        if (token[1] === "--fs-avatar-size") continue;
        expect(css, `${name}: ${token[1]}`).toContain(token[1]);
      }
    }
  });
  it("executes the Scrollspy module lifecycle recipe", () => {
    render("scrollspy");
    const recipe = blocks("scrollspy", "js")[0].replace(/^import .*;\n/, "");
    new Function("Scrollspy", recipe)(Scrollspy);
    const nav = document.querySelector("nav");
    expect(Scrollspy.getInstance(nav)).toBeUndefined();
    expect(nav.querySelector(".is-active").getAttribute("href")).toBe("#introducao");
  });
  it("avatars expose names for images and initials", () => {
    render("avatar");
    expect(document.querySelector("img").getAttribute("alt")).toBeTruthy();
    for (const avatar of document.querySelectorAll("span.fs-avatar")) {
      expect(avatar.getAttribute("role")).toBe("img");
      expect(avatar.getAttribute("aria-label")).toBeTruthy();
    }
  });
  it("button groups preserve native buttons, direct children and labeled grouping", () => {
    render("button-group");
    for (const group of document.querySelectorAll(".fs-button-group")) {
      expect(group.getAttribute("role")).toBe("group");
      expect(group.getAttribute("aria-label")).toBeTruthy();
      for (const button of group.children) {
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.classList.contains("fs-btn")).toBe(true);
      }
    }
    expect(document.querySelector('[aria-pressed="true"]')).not.toBeNull();
    expect(document.querySelector("button[disabled]")).not.toBeNull();
  });
  it("executes the close-button recipe without submitting a form", () => {
    render("close-button");
    const button = document.querySelector("button");
    expect(button.type).toBe("button");
    expect(button.getAttribute("aria-label")).toBeTruthy();
    new Function(blocks("close-button", "js")[0])();
    button.click();
    expect(document.getElementById(button.getAttribute("aria-controls")).hidden).toBe(true);
  });
  it("code keeps escaped HTML as text and names the keyboard-scrollable region", () => {
    render("code");
    const pre = document.querySelector("pre");
    expect(pre.querySelector("code").textContent).toContain("<button>Salvar</button>");
    expect(pre.querySelector("button")).toBeNull();
    expect(pre.tabIndex).toBe(0);
    expect(pre.getAttribute("aria-label")).toBeTruthy();
  });
  it("icon links retain text and hide their decorative SVG", () => {
    render("icon-link");
    expect(document.querySelector("a").textContent.trim()).toBe("Ver documentação");
    expect(document.querySelector("svg").getAttribute("aria-hidden")).toBe("true");
    expect(document.querySelector("svg").getAttribute("focusable")).toBe("false");
  });
  it("list navigation marks the same link current and active", () => {
    render("list-group");
    const active = document.querySelector("nav .is-active");
    expect(active.getAttribute("aria-current")).toBe("page");
    expect(active.tagName).toBe("A");
    expect(document.querySelectorAll("ul > li")).toHaveLength(2);
  });
  it("placeholder shapes are not interactive or announced individually", () => {
    render("placeholder");
    expect(document.querySelector('[aria-busy="true"]')).not.toBeNull();
    for (const shape of document.querySelectorAll(".fs-placeholder")) {
      expect(shape.tagName).toBe("SPAN");
      expect(shape.getAttribute("aria-hidden")).toBe("true");
      expect(shape.hasAttribute("tabindex")).toBe(false);
    }
  });
  it("ratio frames each contain one informative media child", () => {
    render("ratio");
    for (const frame of document.querySelectorAll(".fs-ratio")) {
      expect(frame.children).toHaveLength(1);
      expect(frame.firstElementChild.getAttribute("alt")).toBeTruthy();
    }
  });
  it("responsive recipes preserve labels and table semantics", () => {
    render("responsive");
    expect(document.getElementById(document.querySelector("label").htmlFor)).not.toBeNull();
    expect(document.querySelector("caption").textContent).toBeTruthy();
    expect(document.querySelectorAll('th[scope="col"]')).toHaveLength(2);
    expect(document.querySelector(".fs-table-responsive").tabIndex).toBe(0);
  });
  it("scrollspy recipe combines CSS hook, singleton registry and aria-current event handler", () => {
    render("scrollspy");
    const nav = document.querySelector("nav");
    expect(nav.getAttribute("data-fs")).toBe("scrollspy");
    expect(nav.hasAttribute("data-fs-scrollspy")).toBe(true);
    expect(css).toContain("[data-fs-scrollspy] .is-active");
    new Function(blocks("scrollspy", "js")[1])();
    spy = Scrollspy.getOrCreateInstance(nav);
    expect(Scrollspy.getOrCreateInstance(nav)).toBe(spy);
    spy.activate(document.getElementById("introducao"));
    spy.activate(document.getElementById("detalhes"));
    expect(nav.querySelectorAll('[aria-current="location"]')).toHaveLength(1);
    expect(nav.querySelector('[aria-current="location"]').getAttribute("href")).toBe("#detalhes");
    spy.dispose();
    expect(Scrollspy.getInstance(nav)).toBeUndefined();
    expect(nav.querySelector(".is-active").getAttribute("href")).toBe("#detalhes");
  });
});
