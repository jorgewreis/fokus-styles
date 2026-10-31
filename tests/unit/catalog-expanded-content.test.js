import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const mount = id => { document.body.innerHTML = readFileSync(`docs/catalog/fixtures/${id}/basic.html`, "utf8"); };
afterEach(() => { document.body.innerHTML = ""; });

describe("adapted self-contained content fixtures", () => {
  for (const id of ["avatar", "icon-link", "menu", "pagination", "progress", "rating", "ratio", "input-group"]) {
    it(`${id}: local resources and named controls`, () => {
      mount(id);
      expect(document.querySelector("script, img[src], iframe, [onclick]")).toBeNull();
      for (const link of document.querySelectorAll("a[href]")) {
        expect(link.getAttribute("href")).toMatch(/^#[a-z]/);
        expect(document.getElementById(link.hash.slice(1))).not.toBeNull();
      }
      for (const el of document.querySelectorAll('[role="img"], [role="progressbar"], nav, input')) {
        expect(el.getAttribute("aria-label")?.trim() || [...(el.labels ?? [])].some(label => label.textContent.trim())).toBeTruthy();
      }
    });
  }
  it("rating expands all five native values and label activation remains exclusive", () => {
    mount("rating");
    const inputs = [...document.querySelectorAll('input[type="radio"]')];
    expect(inputs.map(input => input.value)).toEqual(["5", "4", "3", "2", "1"]);
    expect(document.querySelector("legend").textContent).toBe("Avaliação do exemplo");
    document.querySelector('label[for="nota-3"]').click();
    expect(inputs.filter(input => input.checked).map(input => input.value)).toEqual(["3"]);
    document.querySelector('label[for="nota-5"]').click();
    expect(inputs.filter(input => input.checked).map(input => input.value)).toEqual(["5"]);
  });
  it("progress CSS value and named ARIA value agree", () => {
    mount("progress");
    const bar = document.querySelector('[role="progressbar"]');
    expect(bar.getAttribute("aria-valuenow")).toBe(bar.firstElementChild.style.getPropertyValue("--fs-progress-value"));
    expect(bar.getAttribute("aria-valuemin")).toBe("0");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
  });
  it("pagination exposes named navigation, current page and non-actionable previous item", () => {
    mount("pagination");
    expect(document.querySelector('[aria-current="page"]').textContent).toBe("2");
    const disabled = document.querySelector('[aria-disabled="true"]');
    expect(disabled.tagName).toBe("SPAN");
    expect(disabled.hasAttribute("tabindex")).toBe(false);
    expect(disabled.hasAttribute("href")).toBe(false);
  });
  it("ratio has a single self-contained named visual child", () => {
    mount("ratio");
    const ratio = document.querySelector(".fs-ratio");
    expect(ratio.children.length).toBe(1);
    expect(ratio.firstElementChild.tagName).toBe("svg");
    expect(ratio.firstElementChild.getAttribute("viewBox")).toBe("0 0 400 300");
  });
});
