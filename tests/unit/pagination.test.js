import { afterEach, describe, expect, it } from "vitest";
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
});
