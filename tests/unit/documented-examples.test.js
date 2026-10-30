import { afterEach, describe, expect, it } from "vitest";
import { readFileSync, mkdtempSync, mkdirSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { compileString } from "sass";
import { autoInit } from "../../packages/fokus-js/js/core/register.js";
import { Modal } from "../../packages/fokus-js/js/modal.js";
import { Navbar } from "../../packages/fokus-js/js/navbar.js";
import { Scrollspy } from "../../packages/fokus-js/js/scrollspy.js";

const root = process.cwd();
const blocks = (file, language) => [...readFileSync(path.join(root, file), "utf8")
  .matchAll(new RegExp("```" + language + "\\n([\\s\\S]*?)```", "g"))].map((match) => match[1]);
let instance;
afterEach(() => { instance?.dispose(); instance = null; document.body.innerHTML = ""; });

describe("copyable documentation examples", () => {
  it("initializes the onboarding modal on the trigger, opens and dismisses it", () => {
    document.body.innerHTML = blocks("docs/getting-started/usage.md", "html")[0];
    autoInit("modal", Modal);
    document.dispatchEvent(new Event("DOMContentLoaded"));
    const trigger = document.querySelector('[data-fs="modal"]');
    instance = Modal.getInstance(trigger);
    expect(instance).toBeDefined();
    trigger.click();
    expect(document.querySelector("#meuModal").classList.contains("is-open")).toBe(true);
    document.querySelector('[data-fs-dismiss="modal"]').click();
    expect(instance.isOpen).toBe(false);
  });
  it("initializes the documented navbar and restores focus on Escape", () => {
    document.body.innerHTML = blocks("docs/components/navbar.md", "html")[0];
    autoInit("navbar", Navbar);
    document.dispatchEvent(new Event("DOMContentLoaded"));
    instance = Navbar.getInstance(document.querySelector("nav"));
    const button = document.querySelector("button");
    button.click();
    expect(instance.isOpen()).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    instance.menuEl.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(instance.isOpen()).toBe(false);
    expect(document.activeElement).toBe(button);
  });
  it("initializes scrollspy with the documented data attribute", () => {
    document.body.innerHTML = blocks("docs/components/scrollspy.md", "html")[0];
    autoInit("scrollspy", Scrollspy);
    document.dispatchEvent(new Event("DOMContentLoaded"));
    instance = Scrollspy.getInstance(document.querySelector("nav"));
    expect(instance).toBeDefined();
    instance.activate(document.querySelector("#detalhes"));
    expect(document.querySelector('a[href="#detalhes"]').classList.contains("is-active")).toBe(true);
  });
  it("compiles every Sass onboarding/configuration block as a consumer and emits expected CSS", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "fokus-docs-consumer-"));
    mkdirSync(path.join(dir, "node_modules"));
    symlinkSync(root, path.join(dir, "node_modules/fokus-styles"), "dir");
    try {
      for (const file of ["docs/getting-started/installation.md", "docs/guides/theming.md", "docs/guides/utility-api.md"]) {
        for (const snippet of blocks(file, "scss")) {
          const css = compileString(snippet, { loadPaths: [path.join(dir, "node_modules")], logger: { warn() {} } }).css;
          expect(css, file).toContain(".fs-btn");
          if (file === "docs/getting-started/installation.md") {
            for (const exampleFile of ["docs/getting-started/usage.md", "docs/components/navbar.md", "docs/components/carousel.md", "docs/components/tabs.md", "docs/guides/recipes.md"]) {
              for (const html of blocks(exampleFile, "html")) {
                for (const match of html.matchAll(/class="([^"]+)"/g)) {
                  for (const name of match[1].split(/\s+/).filter((name) => name.startsWith("fs-"))) {
                    expect(css, `${exampleFile}: ${name}`).toMatch(new RegExp("\\." + name + "(?![a-zA-Z0-9_-])"));
                  }
                }
              }
            }
          }
          if (snippet.includes("$radius-md: 10px")) expect(css).toContain("--fs-radius-md: 10px");
          if (snippet.includes('$font-family-sans: ("Inter"')) expect(css).toContain("Inter");
          if (snippet.includes("$fs-utilities:")) expect(css).toContain(".fs-u-object-cover");
        }
      }
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }, 30000);
});
