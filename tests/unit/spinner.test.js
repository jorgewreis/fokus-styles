import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let Spinner;

beforeEach(async () => {
  vi.resetModules();
  document.body.innerHTML = '<div id="spinner-host"><div data-fs="spinner"></div></div>';
  ({ Spinner } = await import("../../packages/fokus-js/js/fokus.js"));
  document.dispatchEvent(new Event("DOMContentLoaded"));
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Spinner public JavaScript API", () => {
  it("is exported and auto-initializes the documented data-fs selector idempotently", () => {
    const element = document.querySelector('[data-fs="spinner"]');
    const instance = Spinner.getInstance(element);

    expect(instance).toBeDefined();
    expect(Spinner.getOrCreateInstance(element)).toBe(instance);
    expect(instance.loading).toBe(false);
    expect(element.getAttribute("aria-busy")).toBe("false");
  });

  it("sets explicit aria-busy values and emits bubbling start/stop events", () => {
    const element = document.querySelector('[data-fs="spinner"]');
    const events = [];
    element.parentElement.addEventListener("fs:loading:start", (event) => events.push(event.type));
    element.parentElement.addEventListener("fs:loading:stop", (event) => events.push(event.type));
    const spinner = Spinner.getInstance(element);

    spinner.start();
    expect(element.getAttribute("aria-busy")).toBe("true");
    expect(element.hasAttribute("data-fs-loading")).toBe(true);
    spinner.stop();
    expect(element.getAttribute("aria-busy")).toBe("false");
    expect(element.hasAttribute("data-fs-loading")).toBe(false);
    expect(events).toEqual(["fs:loading:start", "fs:loading:stop"]);
  });

  it("toggles state and makes repeated or stale dispose calls safe", () => {
    const element = document.querySelector('[data-fs="spinner"]');
    const original = Spinner.getInstance(element);
    original.toggle();
    expect(original.loading).toBe(true);
    original.dispose();

    const replacement = Spinner.getOrCreateInstance(element);
    original.dispose();
    expect(Spinner.getInstance(element)).toBe(replacement);
    replacement.toggle();
    expect(replacement.loading).toBe(false);
    replacement.dispose();
    replacement.dispose();
    expect(Spinner.getInstance(element)).toBeUndefined();
  });

  it("rejects a non-element root with a defined error", () => {
    expect(() => new Spinner(null)).toThrowError(
      new TypeError("FokusStyles.Spinner: elemento raiz inválido."),
    );
  });
});
