import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const sourcePath = path.resolve("packages/fokus-components/scss/forms/_check-radio-switch.scss");
const source = fs.readFileSync(sourcePath, "utf8");

describe("Check, Radio e Switch", () => {
  it("expõe tokens locais e propriedades lógicas", () => {
    expect(source).toContain("--fs-check-size");
    expect(source).toContain("--fs-radio-dot-size");
    expect(source).toContain("--fs-switch-on-offset");
    expect(source).toContain("padding-inline-start");
    expect(source).toContain("inset-inline-start");
    expect(source).not.toMatch(/padding-left|\bleft\s*:/);
  });

  it("cobre preferências e estados do sistema", () => {
    expect(source).toContain("prefers-reduced-motion");
    expect(source).toContain("prefers-contrast");
    expect(source).toContain("forced-colors");
    expect(source).toContain(":indeterminate");
    expect(source).toContain('aria-invalid="true"');
  });

  it("mantém a semântica nativa e a associação por label", () => {
    document.body.innerHTML = `
      <fieldset class="fs-form-fieldset">
        <legend>Contato</legend>
        <div class="fs-radio">
          <input type="radio" name="contact" id="contact-email" class="fs-radio-input">
          <label for="contact-email" class="fs-radio-label">E-mail</label>
        </div>
      </fieldset>`;
    const input = document.querySelector("input");
    const label = document.querySelector("label");
    label.click();
    expect(input.type).toBe("radio");
    expect(input.checked).toBe(true);
    expect(label.htmlFor).toBe(input.id);
  });
});
