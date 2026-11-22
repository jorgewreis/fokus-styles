import { afterEach, expect, it, vi } from "vitest";
import { Breadcrumb } from "../../packages/fokus-js/js/breadcrumb.js";
import { Tooltip } from "../../packages/fokus-js/js/tooltip.js";

const instances = [];
const originalFonts = Object.getOwnPropertyDescriptor(document, "fonts");

function deferredFonts() {
  let resolve;
  const ready = new Promise((done) => { resolve = done; });
  Object.defineProperty(document, "fonts", { configurable: true, value: { ready } });
  return resolve;
}

function mountBreadcrumb() {
  document.body.innerHTML = '<ol class="fs-breadcrumb"><li class="fs-breadcrumb-item"><a href="#detail" aria-describedby="help">Nome longo para tooltip</a></li></ol><p id="help">Ajuda</p>';
  const target = document.querySelector("a");
  Object.defineProperties(target, {
    scrollWidth: { configurable: true, value: 200 },
    clientWidth: { configurable: true, value: 20 },
  });
  return { list: document.querySelector("ol"), target };
}

function createBreadcrumb(list) {
  const instance = new Breadcrumb(list);
  instances.push(instance);
  return instance;
}

afterEach(() => {
  instances.splice(0).reverse().forEach((instance) => instance.dispose());
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (originalFonts) Object.defineProperty(document, "fonts", originalFonts);
  else delete document.fonts;
});

it("pending fonts cannot create tooltips after idempotent dispose", async () => {
  const resolveFonts = deferredFonts();
  const { list, target } = mountBreadcrumb();
  const instance = createBreadcrumb(list);

  instance.dispose();
  instance.dispose();
  resolveFonts();
  await Promise.resolve();

  expect(Tooltip.getInstance(target)).toBeUndefined();
  expect(document.querySelector(".fs-tooltip")).toBeNull();
  expect(Breadcrumb.getInstance(list)).toBeUndefined();
});

it("cancels fallback frame and ignores a stale callback after dispose", () => {
  Object.defineProperty(document, "fonts", { configurable: true, value: undefined });
  let callback;
  vi.stubGlobal("requestAnimationFrame", vi.fn((fn) => { callback = fn; return 41; }));
  const cancel = vi.fn();
  vi.stubGlobal("cancelAnimationFrame", cancel);
  const { list, target } = mountBreadcrumb();
  const instance = createBreadcrumb(list);

  instance.dispose();
  expect(cancel).toHaveBeenCalledWith(41);
  callback();
  expect(Tooltip.getInstance(target)).toBeUndefined();
});

it("owns and disposes only its generated tooltip while preserving existing description", async () => {
  const resolveFonts = deferredFonts();
  const { list, target } = mountBreadcrumb();
  const instance = createBreadcrumb(list);
  resolveFonts();
  await Promise.resolve();

  const tooltip = Tooltip.getInstance(target);
  expect(tooltip).toBeDefined();
  tooltip.show();
  instance.dispose();
  expect(Tooltip.getInstance(target)).toBeUndefined();
  expect(target.getAttribute("aria-describedby")).toBe("help");
  expect(document.querySelector(".fs-tooltip")).toBeNull();
});

it("does not dispose an application-owned tooltip or its replacement", async () => {
  const resolveFonts = deferredFonts();
  const { list, target } = mountBreadcrumb();
  target.setAttribute("data-title", "Tooltip da aplicação");
  const foreign = new Tooltip(target);
  const instance = createBreadcrumb(list);
  resolveFonts();
  await Promise.resolve();
  expect(Tooltip.getInstance(target)).toBe(foreign);

  foreign.dispose();
  const replacement = new Tooltip(target, { title: "Substituto da aplicação" });
  instance.dispose();
  expect(Tooltip.getInstance(target)).toBe(replacement);
  replacement.dispose();
});

it("remains safe when tooltip disposal reenters Breadcrumb.dispose", async () => {
  const resolveFonts = deferredFonts();
  const { list, target } = mountBreadcrumb();
  const instance = createBreadcrumb(list);
  resolveFonts();
  await Promise.resolve();
  const tooltip = Tooltip.getInstance(target);
  tooltip.show();
  target.addEventListener("fs:tooltip:hidden", () => instance.dispose(), { once: true });

  expect(() => instance.dispose()).not.toThrow();
  expect(Tooltip.getInstance(target)).toBeUndefined();
  expect(Breadcrumb.getInstance(list)).toBeUndefined();
});
