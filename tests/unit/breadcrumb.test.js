import { describe, it, expect, afterEach, vi } from "vitest";
import { Breadcrumb } from "../../packages/fokus-js/js/breadcrumb.js";

function mockCollapseQuery(matches) {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
}

function buildBreadcrumb({ maxItems, itemCount = 5 } = {}) {
  const list = document.createElement("ol");
  list.className = "fs-breadcrumb";
  if (maxItems) list.setAttribute("data-max-items", String(maxItems));

  for (let i = 1; i <= itemCount; i += 1) {
    const li = document.createElement("li");
    li.className = "fs-breadcrumb-item";
    if (i === itemCount) {
      li.classList.add("is-active");
      li.textContent = `Nível ${i}`;
    } else {
      li.innerHTML = `<a href="#nivel-${i}">Nível ${i}</a>`;
    }
    list.appendChild(li);
  }

  document.body.appendChild(list);
  return { list, breadcrumb: new Breadcrumb(list) };
}

describe("Breadcrumb", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("getInstance() retorna a instância criada", () => {
    mockCollapseQuery(false);
    const { list, breadcrumb } = buildBreadcrumb();
    expect(Breadcrumb.getInstance(list)).toBe(breadcrumb);
  });

  it("aplica a classe de truncamento em todos os links (e no item ativo sem link)", () => {
    mockCollapseQuery(false);
    const { list } = buildBreadcrumb();
    const truncatable = list.querySelectorAll(".fs-breadcrumb-item-truncate");
    expect(truncatable).toHaveLength(5);
  });

  it("fora do breakpoint mobile, nunca colapsa mesmo com muitos itens", () => {
    mockCollapseQuery(false);
    const { list } = buildBreadcrumb({ maxItems: 3 });

    expect(list.querySelector(".fs-breadcrumb-more")).toBeNull();
    list.querySelectorAll(".fs-breadcrumb-item").forEach((item) => {
      expect(item.style.display).not.toBe("none");
    });
  });

  it("no breakpoint mobile, com mais itens que data-max-items, colapsa os intermediários", () => {
    mockCollapseQuery(true);
    const { list, breadcrumb } = buildBreadcrumb({ maxItems: 3 });

    expect(breadcrumb.isCollapsed).toBe(true);
    expect(list.querySelector(".fs-breadcrumb-more")).not.toBeNull();

    const items = list.querySelectorAll(".fs-breadcrumb-item");
    expect(items[0].style.display).not.toBe("none"); // primeiro
    expect(items[items.length - 1].style.display).not.toBe("none"); // último
  });

  it("no breakpoint mobile, com poucos itens (<= data-max-items), não colapsa", () => {
    mockCollapseQuery(true);
    const { list } = buildBreadcrumb({ maxItems: 5, itemCount: 4 });

    expect(list.querySelector(".fs-breadcrumb-more")).toBeNull();
  });

  it("o dropdown do item '…' lista os níveis ocultos com o texto original", () => {
    mockCollapseQuery(true);
    buildBreadcrumb({ maxItems: 3 });

    const menu = document.querySelector(".fs-dropdown-menu");
    const labels = Array.from(menu.querySelectorAll(".fs-dropdown-item")).map((el) => el.textContent);
    expect(labels).toEqual(["Nível 2", "Nível 3", "Nível 4"]);
  });

  it("dispose() restaura os itens ocultos e remove o registro da instância", () => {
    mockCollapseQuery(true);
    const { list, breadcrumb } = buildBreadcrumb({ maxItems: 3 });

    breadcrumb.dispose();

    expect(list.querySelector(".fs-breadcrumb-more")).toBeNull();
    expect(Breadcrumb.getInstance(list)).toBeUndefined();
    list.querySelectorAll(".fs-breadcrumb-item").forEach((item) => {
      expect(item.style.display).not.toBe("none");
    });
  });
});
