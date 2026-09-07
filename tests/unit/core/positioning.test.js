import { describe, it, expect, beforeEach } from "vitest";
import { computePosition, applyPosition } from "../../../packages/fokus-js/js/core/positioning.js";

function mockRect(el, rect) {
  el.getBoundingClientRect = () => ({
    top: rect.top ?? 0,
    left: rect.left ?? 0,
    right: (rect.left ?? 0) + (rect.width ?? 0),
    bottom: (rect.top ?? 0) + (rect.height ?? 0),
    width: rect.width ?? 0,
    height: rect.height ?? 0,
  });
}

describe("computePosition", () => {
  let reference;
  let floating;

  beforeEach(() => {
    reference = document.createElement("button");
    floating = document.createElement("div");
    document.body.append(reference, floating);
  });

  it("posiciona abaixo por padrão (bottom), respeitando o offset", () => {
    mockRect(reference, { top: 100, left: 100, width: 80, height: 40 });
    mockRect(floating, { width: 120, height: 60 });

    const position = computePosition(reference, floating, { placement: "bottom", offset: 8 });

    expect(position.placement).toBe("bottom");
    expect(position.top).toBe(148);
  });

  it("faz flip para o lado oposto quando não cabe no viewport", () => {
    mockRect(reference, { top: 700, left: 100, width: 80, height: 40 });
    mockRect(floating, { width: 120, height: 60 });

    const position = computePosition(reference, floating, { placement: "bottom", offset: 8 });

    expect(position.placement).toBe("top");
  });

  it("não faz flip quando nenhum dos dois lados cabe (mantém o solicitado)", () => {
    mockRect(reference, { top: 0, left: 100, width: 80, height: 40 });
    mockRect(floating, { width: 120, height: 1000 });

    const position = computePosition(reference, floating, { placement: "top", offset: 8 });

    expect(position.placement).toBe("top");
  });

  it("alinha ao início (align: start) por padrão de cross-axis", () => {
    mockRect(reference, { top: 100, left: 200, width: 80, height: 40 });
    mockRect(floating, { width: 300, height: 60 });

    const position = computePosition(reference, floating, { placement: "bottom", align: "start", offset: 0 });

    expect(position.left).toBe(200);
  });

  it("alinha ao fim (align: end)", () => {
    mockRect(reference, { top: 100, left: 200, width: 80, height: 40 });
    mockRect(floating, { width: 100, height: 60 });

    const position = computePosition(reference, floating, { placement: "bottom", align: "end", offset: 0 });

    expect(position.left).toBe(180);
  });

  it("centraliza no cross-axis quando align: center (padrão)", () => {
    mockRect(reference, { top: 100, left: 200, width: 80, height: 40 });
    mockRect(floating, { width: 40, height: 60 });

    const position = computePosition(reference, floating, { placement: "bottom", offset: 0 });

    expect(position.left).toBe(220);
  });

  it("aplica clamp para não vazar pela borda do viewport", () => {
    mockRect(reference, { top: 100, left: 0, width: 20, height: 40 });
    mockRect(floating, { width: 300, height: 60 });

    const position = computePosition(reference, floating, {
      placement: "bottom",
      align: "center",
      offset: 0,
      padding: 8,
    });

    expect(position.left).toBe(8);
  });
});

describe("applyPosition", () => {
  it("aplica position absolute e top/left inline em pixels", () => {
    const el = document.createElement("div");

    applyPosition(el, { top: 10, left: 20 });

    expect(el.style.position).toBe("absolute");
    expect(el.style.top).toBe("10px");
    expect(el.style.left).toBe("20px");
  });
});
