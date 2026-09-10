import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

describe("Forms & Controls public contract", () => {
  test("exposes shared control tokens and progressive input features", () => {
    const rootTokens = read("packages/fokus-core/scss/tokens/_root.scss");
    const forms = read("packages/fokus-components/scss/forms/_forms.scss");

    expect(rootTokens).toContain("--fs-control-height-xs");
    expect(rootTokens).toContain("--fs-control-touch-target");
    expect(rootTokens).toContain("--fs-control-invalid-color");
    expect(forms).toContain(".fs-form-textarea");
    expect(forms).toContain(".fs-form-date");
    expect(forms).toContain(".fs-input-group-stack-sm");
    expect(forms).toContain("color-scheme: light;");
  });

  test("keeps explicit contracts for buttons, range and segmented controls", () => {
    const buttons = read("packages/fokus-components/scss/components/_buttons.scss");
    const range = read("packages/fokus-components/scss/forms/_range.scss");
    const segmented = read("packages/fokus-components/scss/components/_segmented-control.scss");

    expect(buttons).toContain(".fs-btn-icon");
    expect(buttons).toContain("aria-busy");
    expect(range).toContain(".fs-form-range-vertical");
    expect(range).toContain("accent-color");
    expect(segmented).toContain(".fs-segmented-control-vertical");
    expect(segmented).toContain("aria-invalid");
  });
});
