import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, it, expect } from "vitest";
const read = (file) => readFileSync(file, "utf8");
const examples = JSON.parse(read("docs/catalog/examples.json"));
const provenance = JSON.parse(read("docs/catalog/fixture-provenance.json"));

describe("curated catalog fixtures", () => {
  for (const [component, entries] of Object.entries(examples)) {
    for (const entry of entries) {
      it(`${component}/${entry.id} preserves complete documented markup and CSS classes`, () => {
        const html = read(entry.html);
        const source = provenance[`${component}/${entry.id}`] ?? provenance[component];
        const original = source.sourceCode ?? html;
        if (source.mode === "authored-runtime") {
          expect(source.implementation.length).toBeGreaterThan(0);
          expect(source.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
        } else {
          expect(read(source.source)).toContain(original.trimEnd());
          expect(read(source.source).split("\n").slice(source.startLine - 1).join("\n").startsWith(original)).toBe(true);
          if (source.sourceCode) {
            expect(createHash("sha256").update(original).digest("hex")).toBe(source.sourceSha256);
            if (original !== html) expect(source.transformations.length).toBeGreaterThan(0);
            if (source.transformations.every(t => typeof t === "object" && "from" in t && "to" in t)) {
              let transformed = original;
              for (const transformation of source.transformations) {
                expect(transformed).toContain(transformation.from);
                transformed = transformed.replaceAll(transformation.from, transformation.to);
              }
              expect(transformed).toBe(html);
            }
          }
        }
        for (const implementation of source.implementation ?? []) {
          expect(createHash("sha256").update(read(implementation.path)).digest("hex")).toBe(implementation.sha256);
        }
        expect(createHash("sha256").update(html).digest("hex")).toBe(source.sha256);
        expect(html).not.toMatch(/\.\.\.|<script\b|\bon\w+\s*=/i);
        const container = document.createElement("div");
        container.innerHTML = html;
        const css = read("dist/css/fokus.css");
        for (const element of container.querySelectorAll("[class]")) {
          for (const className of element.classList) {
            if (className.startsWith("fs-")) expect(css, className).toContain(`.${className}`);
          }
        }
        const ids = [...container.querySelectorAll("[id]")].map(el => el.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const el of container.querySelectorAll("[for], [data-fs-target]")) {
          const id = el.getAttribute("for") ?? el.getAttribute("data-fs-target").slice(1);
          expect(ids).toContain(id);
        }
        for (const element of container.querySelectorAll("[aria-labelledby], [aria-describedby], [aria-controls]")) {
          for (const attribute of ["aria-labelledby", "aria-describedby", "aria-controls"]) {
            for (const target of (element.getAttribute(attribute) ?? "").split(/\s+/).filter(Boolean)) expect(ids, `${component}: ${attribute}=${target}`).toContain(target);
          }
        }
        expect(entry.limitations.length).toBeGreaterThan(0);
        if (entry.js) {
          const js = read(entry.js);
          if (source.scriptKind !== "demo-dom") expect(js).toMatch(/from "fokus-styles\/js"/);
          else expect(js).toContain("controller.abort()");
          expect(js).toContain("pagehide");
          if (component !== "alert-dialog" && source.scriptKind !== "demo-dom") expect(js).toContain("instance.dispose()");
        }
      });
    }
  }
});

// Exercise the actual selected markup, not a parallel hand-written test fixture.
import { Accordion } from "../../packages/fokus-js/js/accordion.js";
import { Tabs } from "../../packages/fokus-js/js/tabs.js";
import { Collapse } from "../../packages/fokus-js/js/collapse.js";
import { Modal } from "../../packages/fokus-js/js/modal.js";
import { afterEach, vi } from "vitest";
afterEach(() => { document.body.innerHTML = ""; vi.restoreAllMocks(); });
for (const [id, Constructor] of Object.entries({ accordion: Accordion, tabs: Tabs, collapse: Collapse, modal: Modal })) {
  it(`${id} selected fixture initializes, changes state, disposes and reinitializes`, async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true });
    document.body.innerHTML = read(examples[id][0].html);
    const element = document.querySelector(`[data-fs="${id}"]`);
    const instance = new Constructor(element);
    expect(Constructor.getInstance(element)).toBe(instance);
    if (id === "accordion") {
      const buttons = [...element.querySelectorAll("button")];
      buttons[1].click();
      await Promise.resolve(); await Promise.resolve();
      expect(buttons[1].getAttribute("aria-expanded")).toBe("true");
      expect(buttons[0].getAttribute("aria-expanded")).toBe("false");
    } else if (id === "tabs") {
      element.querySelectorAll("a")[1].click();
      expect(document.querySelector("#seguranca").classList.contains("is-active")).toBe(true);
    } else {
      instance.show();
      await Promise.resolve(); await Promise.resolve();
      if (id === "modal") expect(document.querySelector("#meuModal").classList.contains("is-open")).toBe(true);
      else expect(element.getAttribute("aria-expanded")).toBe("true");
      instance.hide();
      await Promise.resolve(); await Promise.resolve();
    }
    instance.dispose();
    expect(Constructor.getInstance(element)).toBeUndefined();
    const replacement = new Constructor(element);
    expect(Constructor.getInstance(element)).toBe(replacement);
    replacement.dispose();
  });
}

import { Dropdown } from "../../packages/fokus-js/js/dropdown.js";
import { Tag } from "../../packages/fokus-js/js/tag.js";
import { Stepper } from "../../packages/fokus-js/js/stepper.js";

it("dropdown fixture supports repeated keyboard open, Escape, teardown and reinitialization", () => {
  document.body.innerHTML = read(examples.dropdown[0].html);
  const toggle = document.querySelector('[data-fs="dropdown"]');
  const menu = document.querySelector("#meu-menu");
  const instance = new Dropdown(toggle);
  for (let n = 0; n < 2; n++) {
    toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(menu.querySelector("a"));
    menu.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
  }
  instance.show(); instance.dispose();
  expect(Dropdown.getInstance(toggle)).toBeUndefined();
  expect(menu.parentElement.className).toBe("fs-dropdown");
  toggle.click(); expect(menu.classList.contains("is-open")).toBe(false);
  const replacement = new Dropdown(toggle);
  toggle.click(); expect(menu.classList.contains("is-open")).toBe(true);
  replacement.dispose();
});

it("tag fixture permits cancellation and loading, then teardown and reinitialization", () => {
  document.body.innerHTML = read(examples.tag[0].html);
  const tag = document.querySelector('[data-fs="tag"]');
  const button = tag.querySelector("button");
  const instance = new Tag(tag);
  tag.addEventListener("fs:tag:dismissed", event => event.preventDefault(), { once: true });
  button.click(); expect(tag.isConnected).toBe(true);
  instance.setLoading(true); expect(button.disabled).toBe(true);
  expect(instance.dismiss()).toBe(false);
  instance.setLoading(false); instance.dispose();
  expect(Tag.getInstance(tag)).toBeUndefined();
  button.click(); expect(tag.isConnected).toBe(true);
  const replacement = new Tag(tag);
  button.click(); expect(tag.isConnected).toBe(false);
  replacement.dispose();
});

it("stepper fixture cancels transitions, moves forward/back, completes and tears down", () => {
  document.body.innerHTML = read(examples.stepper[0].html);
  const element = document.querySelector('[data-fs="stepper"]');
  const instance = new Stepper(element);
  const next = element.querySelector('[data-stepper="next"]');
  const prev = element.querySelector('[data-stepper="prev"]');
  expect(prev.disabled).toBe(true);
  element.addEventListener("fs:stepper:beforechange", event => event.preventDefault(), { once: true });
  next.click(); expect(instance.current).toBe(0);
  next.click(); expect(instance.current).toBe(1);
  prev.click(); expect(instance.current).toBe(0);
  next.click(); next.click(); next.click(); expect(instance.finished).toBe(true);
  prev.click(); expect(instance.finished).toBe(false);
  const current = instance.current;
  instance.dispose(); expect(Stepper.getInstance(element)).toBeUndefined();
  next.click(); expect(instance.current).toBe(current);
  const replacement = new Stepper(element);
  next.click(); expect(replacement.current).toBe(2);
  replacement.dispose();
});
