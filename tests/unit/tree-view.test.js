import { describe, it, expect, afterEach, vi } from "vitest";
import { TreeView } from "../../packages/fokus-js/js/tree-view.js";

function buildTree() {
  const root = document.createElement("ul");
  root.innerHTML = `
    <li>
      <span class="fs-tree-label">src</span>
      <ul>
        <li><span class="fs-tree-label">index.js</span></li>
        <li>
          <span class="fs-tree-label">components</span>
          <ul>
            <li><span class="fs-tree-label">Button.js</span></li>
          </ul>
        </li>
      </ul>
    </li>
    <li><span class="fs-tree-label">README.md</span></li>
  `;
  document.body.appendChild(root);

  return { root, tree: new TreeView(root) };
}

describe("TreeView", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("define role=tree na raiz e role=treeitem em cada <li>", () => {
    const { root } = buildTree();

    expect(root.getAttribute("role")).toBe("tree");
    expect(root.querySelectorAll('[role="treeitem"]')).toHaveLength(5);
  });

  it("nós com filhos recebem role=group no <ul> aninhado e aria-expanded=false por padrão", () => {
    const { root } = buildTree();
    const src = root.querySelector('[role="treeitem"]');

    expect(src.getAttribute("aria-expanded")).toBe("false");
    const group = src.querySelector("ul");
    expect(group.getAttribute("role")).toBe("group");
    expect(group.hidden).toBe(true);
  });

  it("injeta .fs-tree-toggle só em nós com filhos", () => {
    const { root } = buildTree();
    const src = root.querySelector('[role="treeitem"]');
    const readme = root.querySelectorAll('[role="treeitem"]')[4];

    expect(src.querySelector(".fs-tree-toggle")).not.toBeNull();
    expect(readme.querySelector(".fs-tree-toggle")).toBeNull();
  });

  it("getInstance() retorna a instância criada", () => {
    const { root, tree } = buildTree();
    expect(TreeView.getInstance(root)).toBe(tree);
  });

  it("roving tabindex: só o primeiro treeitem visível começa com tabindex=0", () => {
    const { root } = buildTree();
    const items = root.querySelectorAll('[role="treeitem"]');

    // items[1]/items[2] (index.js/components) estão dentro do grupo colapsado
    // de "src" — não são alcançáveis por Tab, então nem recebem tabindex.
    expect(items[0].getAttribute("tabindex")).toBe("0");
    expect(items[4].getAttribute("tabindex")).toBe("-1");
  });

  it("expand()/collapse() alternam aria-expanded e a visibilidade do grupo, disparando eventos", () => {
    const { root, tree } = buildTree();
    const src = root.querySelector('[role="treeitem"]');
    const group = src.querySelector("ul");
    const expandedHandler = vi.fn();
    const collapsedHandler = vi.fn();
    root.addEventListener("fs:tree:expanded", expandedHandler);
    root.addEventListener("fs:tree:collapsed", collapsedHandler);

    tree.expand(src);
    expect(src.getAttribute("aria-expanded")).toBe("true");
    expect(group.hidden).toBe(false);
    expect(expandedHandler).toHaveBeenCalledTimes(1);

    tree.collapse(src);
    expect(src.getAttribute("aria-expanded")).toBe("false");
    expect(group.hidden).toBe(true);
    expect(collapsedHandler).toHaveBeenCalledTimes(1);
  });

  it("clicar num nó com filhos expande e seleciona; clicar de novo colapsa", () => {
    const { root } = buildTree();
    const src = root.querySelector('[role="treeitem"]');

    src.querySelector(".fs-tree-label").click();
    expect(src.getAttribute("aria-expanded")).toBe("true");
    expect(src.getAttribute("aria-selected")).toBe("true");

    src.querySelector(".fs-tree-label").click();
    expect(src.getAttribute("aria-expanded")).toBe("false");
  });

  it("select() marca aria-selected só no item selecionado e dispara fs:tree:selected", () => {
    const { root, tree } = buildTree();
    const items = root.querySelectorAll('[role="treeitem"]');
    const handler = vi.fn();
    root.addEventListener("fs:tree:selected", handler);

    tree.select(items[4]);
    expect(items[4].getAttribute("aria-selected")).toBe("true");
    expect(handler.mock.calls[0][0].detail.value).toBe("README.md");

    tree.select(items[0]);
    expect(items[0].getAttribute("aria-selected")).toBe("true");
    expect(items[4].getAttribute("aria-selected")).toBe("false");
  });

  it("ArrowDown/ArrowUp movem o foco só entre treeitems visíveis (filhos colapsados ficam fora)", () => {
    const { root } = buildTree();
    const items = root.querySelectorAll('[role="treeitem"]');

    items[0].focus();
    items[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    // src está colapsado: o próximo visível é README.md, não index.js.
    expect(document.activeElement).toBe(items[4]);

    items[4].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect(document.activeElement).toBe(items[0]);
  });

  it("ArrowRight expande um nó fechado (sem mover foco); pressionado de novo move pro primeiro filho", () => {
    const { root } = buildTree();
    const src = root.querySelectorAll('[role="treeitem"]')[0];
    const indexJs = root.querySelectorAll('[role="treeitem"]')[1];
    src.focus();

    src.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(src.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(src);

    src.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(document.activeElement).toBe(indexJs);
  });

  it("ArrowLeft num nó expandido colapsa; num nó fechado/folha move o foco pro pai", () => {
    const { root } = buildTree();
    const src = root.querySelectorAll('[role="treeitem"]')[0];
    const indexJs = root.querySelectorAll('[role="treeitem"]')[1];
    src.focus();
    src.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

    indexJs.focus();
    indexJs.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(document.activeElement).toBe(src);

    src.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(src.getAttribute("aria-expanded")).toBe("false");
  });

  it("Home/End movem o foco pro primeiro/último treeitem visível", () => {
    const { root } = buildTree();
    const items = root.querySelectorAll('[role="treeitem"]');

    items[4].focus();
    items[4].dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    expect(document.activeElement).toBe(items[0]);

    items[0].dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    expect(document.activeElement).toBe(items[4]);
  });

  it("Enter/Espaço num nó com filhos alterna expansão e seleciona", () => {
    const { root } = buildTree();
    const src = root.querySelectorAll('[role="treeitem"]')[0];
    src.focus();

    src.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(src.getAttribute("aria-expanded")).toBe("true");
    expect(src.getAttribute("aria-selected")).toBe("true");
  });

  it("dispose() remove o registro da instância", () => {
    const { root, tree } = buildTree();
    tree.dispose();

    expect(TreeView.getInstance(root)).toBeUndefined();
  });
});
