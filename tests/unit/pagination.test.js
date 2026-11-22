import { afterEach, describe, expect, it, vi } from "vitest";
import { Pagination } from "../../packages/fokus-js/js/fokus.js";

function mount() {
  document.body.innerHTML = `
    <nav aria-label="Paginação">
      <ul class="fs-pagination" data-fs="pagination" data-fs-pages="4" data-fs-page="1">
        <li class="fs-page-item"><button class="fs-page-link" data-fs-page="1">1</button></li>
        <li class="fs-page-item"><button class="fs-page-link" data-fs-page="2">2</button></li>
        <li class="fs-page-item"><a class="fs-page-link" href="#page-3" aria-disabled="true" data-fs-page="3">3</a></li>
        <li class="fs-page-item is-disabled"><a class="fs-page-link" href="#page-4" data-fs-page="4">4</a></li>
      </ul>
    </nav>
    <ul id="results" aria-busy="false"></ul>
  `;
  const element = document.querySelector('[data-fs="pagination"]');
  return { element, pagination: Pagination.getOrCreateInstance(element) };
}

afterEach(() => {
  const element = document.querySelector('[data-fs="pagination"]');
  Pagination.getInstance(element)?.dispose();
  document.body.innerHTML = "";
});

describe("Pagination public JavaScript API", () => {
  it("is exported by the public barrel and initializes its current state accessibly", () => {
    const { element, pagination } = mount();

    expect(Pagination.getInstance(element)).toBe(pagination);
    expect(element.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    expect(element.querySelector('[data-fs-page="1"]').getAttribute("aria-current")).toBe("page");
    expect(element.querySelector(".fs-page-item").classList.contains("is-active")).toBe(true);
  });

  it("auto-initializes data-fs=pagination when the public barrel is loaded", async () => {
    vi.resetModules();
    document.body.innerHTML = '<nav><ul data-fs="pagination" data-fs-pages="2"><li><button data-fs-page="1">1</button></li></ul></nav>';
    const { Pagination: FreshPagination } = await import("../../packages/fokus-js/js/fokus.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));
    const element = document.querySelector('[data-fs="pagination"]');

    expect(FreshPagination.getInstance(element)).toBeDefined();
    FreshPagination.getInstance(element).dispose();
  });

  it("normalizes invalid page metadata and keeps empty markup in a safe page-one state", () => {
    document.body.innerHTML = `
      <nav><ul data-fs="pagination" data-fs-pages="not-a-number" data-fs-page="-2"></ul></nav>
    `;
    const element = document.querySelector('[data-fs="pagination"]');
    const pagination = Pagination.getOrCreateInstance(element);

    expect(pagination.total).toBe(1);
    expect(pagination.current).toBe(1);
    expect(element.getAttribute("data-fs-page")).toBe("1");
    expect(element.querySelectorAll("[data-fs-page]")).toHaveLength(0);
    pagination.dispose();
  });

  it("bounds fractional and out-of-range page requests without emitting for no-op values", () => {
    const { element, pagination } = mount();
    const changes = [];
    element.addEventListener("fs:pagination:change", (event) => changes.push(event.detail));

    pagination.goTo(2.8);
    pagination.goTo(99);
    pagination.goTo(4);
    pagination.goTo("invalid");

    expect(pagination.current).toBe(4);
    expect(changes).toEqual([
      { page: 2, total: 4 },
      { page: 4, total: 4 },
    ]);
  });

  it("ignores disabled controls and emits a bubbling change event for an enabled page", () => {
    const { element, pagination } = mount();
    const changes = [];
    element.addEventListener("fs:pagination:change", (event) => changes.push(event));

    const ariaDisabled = element.querySelector('[data-fs-page="3"]');
    ariaDisabled.click();
    expect(ariaDisabled.getAttribute("aria-disabled")).toBe("true");
    expect(pagination.current).toBe(1);

    element.querySelector('[data-fs-page="4"]').click();
    expect(pagination.current).toBe(1);

    element.querySelector('[data-fs-page="2"]').click();
    expect(pagination.current).toBe(2);
    expect(element.getAttribute("data-fs-page")).toBe("2");
    expect(element.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    expect(element.querySelector('[data-fs-page="2"]').getAttribute("aria-current")).toBe("page");
    expect(element.querySelectorAll(".fs-page-item.is-active")).toHaveLength(1);
    expect(changes).toHaveLength(1);
    expect(changes[0].detail).toEqual({ page: 2, total: 4 });
    expect(changes[0].bubbles).toBe(true);
  });

  it.each(["true", "false"])("leaves the consumer-owned aria-busy=%s state unchanged", (busy) => {
    const { element } = mount();
    const results = document.querySelector("#results");
    results.setAttribute("aria-busy", busy);

    element.querySelector('[data-fs-page="2"]').click();

    expect(results.getAttribute("aria-busy")).toBe(busy);
  });

  it("dispose removes the click listener and instance registration", () => {
    const { element, pagination } = mount();
    pagination.dispose();

    expect(Pagination.getInstance(element)).toBeUndefined();
    element.querySelector('[data-fs-page="2"]').click();
    expect(element.getAttribute("data-fs-page")).toBe("1");
  });

  it("rejects a non-element root and does not let a stale instance delete its replacement", () => {
    expect(() => new Pagination(null)).toThrowError(
      new TypeError("FokusStyles.Pagination: elemento raiz inválido."),
    );

    const { element, pagination } = mount();
    pagination.dispose();
    const replacement = Pagination.getOrCreateInstance(element);
    pagination.dispose();

    expect(Pagination.getInstance(element)).toBe(replacement);
    replacement.dispose();
  });
});
