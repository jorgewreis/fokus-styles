import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import * as sass from "sass";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function compileUtilities(source = '@use "scss/entries/utilities-entry";') {
  return sass.compileString(source, {
    loadPaths: [root, path.join(root, "packages", "fokus-core", "scss"), path.join(root, "packages", "fokus-utilities", "scss")],
    style: "expanded",
  }).css;
}

describe("utility CSS contract", () => {
  it("emits the public categories with important declarations", () => {
    const css = compileUtilities();

    for (const selector of [
      ".fs-u-columns-2",
      ".fs-u-box-border",
      ".fs-u-overflow-x-auto",
      ".fs-u-overscroll-contain",
      ".fs-u-flex-md-row",
      ".fs-u-grid-cols-lg-3",
      ".fs-u-px-md-4",
      ".fs-u-max-w-full",
      ".fs-u-leading-relaxed",
      ".fs-u-border-1",
      ".fs-u-blur-sm",
      ".fs-u-transition-colors",
      ".fs-u-rotate-90",
      ".fs-u-cursor-pointer",
      ".fs-u-object-cover",
      ".fs-u-z-modal",
      ".fs-u-bg-primary-subtle",
      ".fs-u-border-primary-subtle",
      ".fs-u-text-primary-emphasis",
      ".fs-u-aspect-video",
      ".fs-u-accent-primary",
      ".fs-u-focus-ring",
    ]) {
      expect(css).toContain(selector);
    }

    expect(css).toContain("grid-template-columns: repeat(3, minmax(0, 1fr)) !important");
    expect(css).toContain("padding-inline: 1.5rem !important");
    expect(css).toContain("@media (min-width: 1024px)");
  }, 30000);

  it("keeps the legacy utility aliases available", () => {
    const css = compileUtilities();

    for (const selector of [
      ".fs-u-d-flex",
      ".fs-u-mt-3",
      ".fs-u-gx-2",
      ".fs-u-text-center",
      ".fs-u-fw-medium",
      ".fs-u-fs-lg",
    ]) {
      expect(css).toContain(selector);
    }
  });

  it("does not emit a disabled category", () => {
    const css = compileUtilities(`
      @use "settings/config" with (
        $fs-config: (
          columns: none,
          layout: (box-sizing),
          utilities: all
        )
      );
      @use "utilities";
    `);

    expect(css).not.toContain(".fs-u-columns-2");
    expect(css).toContain(".fs-u-box-border");
  });

  it("supports extending the declarative Sass registry", () => {
    const css = compileUtilities(`
      @use "settings/utilities" as settings-utils with (
        $fs-utilities: (
          "content-visibility": (
            property: content-visibility,
            class: content,
            values: (auto: auto),
            category: interactivity,
            important: true
          )
        )
      );
      @use "utilities";
    `);

    expect(css).toContain(".fs-u-content-auto");
    expect(css).toContain("content-visibility: auto !important");
  });

  it("generates responsive, state, print and CSS-variable variants", () => {
    const css = compileUtilities(`
      @use "settings/utilities" as settings-utils with (
        $fs-utilities: (
          "demo": (
            property: opacity,
            class: demo,
            values: (75: 0.75),
            category: interactivity,
            responsive: true,
            states: (hover: hover, focus-visible: focus-visible),
            print: true,
            important: true
          ),
          "demo-variable": (
            property: color,
            class: demo-color,
            values: (primary: red),
            category: colors,
            css-var: true,
            css-variable-name: fs-demo-color,
            important: false
          )
        )
      );
      @use "utilities";
    `);

    expect(css).toContain(".fs-u-demo-md-75");
    expect(css).toContain(".fs-u-demo-75-hover:hover");
    expect(css).toContain(".fs-u-demo-75-focus-visible:focus-visible");
    expect(css).toContain(".fs-u-demo-75-print");
    expect(css).toContain("--fs-demo-color: red");
  });

  it("honors helper and print feature flags", () => {
    const css = compileUtilities(`
      @use "settings/config" with (
        $fs-enable-helpers: false,
        $fs-enable-print-utilities: false
      );
      @use "utilities";
    `);

    expect(css).not.toContain(".fs-u-aspect-video");
    expect(css).not.toContain(".fs-u-print-hide");
  });
});
