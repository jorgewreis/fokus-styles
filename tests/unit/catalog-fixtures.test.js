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
        const source = provenance[component];
        expect(read(source.source)).toContain(html.trimEnd());
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
        expect(entry.limitations.length).toBeGreaterThan(0);
        if (entry.js) {
          const js = read(entry.js);
          expect(js).toMatch(/from "fokus-styles\/js"/);
          expect(js).toContain("instance.dispose()");
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
