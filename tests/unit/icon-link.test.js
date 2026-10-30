import { describe, expect, it } from "vitest";
import { compile } from "sass";
import postcss from "postcss";

const css = postcss.parse(compile("packages/fokus-components/scss/components/_icon-link.scss").css);

describe("icon-link compiled motion contract", () => {
  it("only displaces icons when motion is allowed", () => {
    const transforms = [];
    css.walkDecls("transform", declaration => {
      transforms.push(declaration.value);
      expect(declaration.parent.parent.name).toBe("media");
      expect(declaration.parent.parent.params).toBe("(prefers-reduced-motion: no-preference)");
    });
    expect(transforms).toEqual(["translateX(0.15em)", "translateX(-0.15em)"]);
  });
  it("uses inherited semantic direction and keeps reduced-motion transitions disabled", () => {
    let rtl, reduced;
    css.walkRules(".fs-icon-link:dir(rtl):hover svg", rule => { rtl = rule; });
    css.walkAtRules("media", rule => {
      if (rule.params === "(prefers-reduced-motion: reduce)") reduced = rule;
    });
    expect(rtl.first.value).toBe("translateX(-0.15em)");
    expect(reduced.first.selector).toBe(".fs-icon-link svg");
    expect(reduced.first.first.prop).toBe("transition");
    expect(reduced.first.first.value).toBe("none");
  });
});
