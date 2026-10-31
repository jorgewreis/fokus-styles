import { afterEach, describe, expect, it, vi } from "vitest";
import { TreeView } from "../../packages/fokus-js/js/tree-view.js";

let tree;
afterEach(() => { tree?.dispose(); document.body.innerHTML = ""; });
function setup(disabled, open = false) {
  document.body.innerHTML = `<ul id="tree">
    <li id="before"><span class="fs-tree-label">Before</span></li>
    <li id="blocked" ${disabled} aria-expanded="${open}"><a href="#blocked-target" class="fs-tree-label">Blocked</a>
      <ul><li id="child"><span class="fs-tree-label">Child</span></li></ul>
    </li><li id="after"><span class="fs-tree-label">After</span></li></ul>`;
  const root = document.querySelector("#tree");
  tree = new TreeView(root);
  return { root, blocked: root.querySelector("#blocked"), child: root.querySelector("#child") };
}
function key(item, name) {
  return item.dispatchEvent(new KeyboardEvent("keydown", { key: name, bubbles: true, cancelable: true }));
}

describe.each(['aria-disabled="true"', 'class="is-disabled"'])("TreeView %s", (disabled) => {
  it("blocks click, auxclick, Enter and Space before target handlers and defaults", () => {
    const { root, blocked } = setup(disabled);
    const target = blocked.querySelector("a");
    const handler = vi.fn();
    const selected = vi.fn();
    root.addEventListener("fs:tree:selected", selected);
    for (const type of ["click", "auxclick", "keydown"]) target.addEventListener(type, handler);
    for (const type of ["click", "auxclick"]) {
      expect(target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }))).toBe(false);
    }
    expect(key(target, "Enter")).toBe(false);
    expect(key(target, " ")).toBe(false);
    expect(handler).not.toHaveBeenCalled();
    expect(selected).not.toHaveBeenCalled();
    expect(blocked.getAttribute("aria-expanded")).toBe("false");
    expect(blocked.hasAttribute("aria-selected")).toBe(false);
  });

  it.each([false, true])("direct APIs preserve disabled node state (open=%s)", (open) => {
    const { root, blocked } = setup(disabled, open);
    tree.select(root.querySelector("#before"));
    const snapshot = root.innerHTML;
    const event = vi.fn();
    for (const name of ["selected", "expanded", "collapsed"]) root.addEventListener(`fs:tree:${name}`, event);
    for (const method of ["select", "expand", "collapse", "toggle"]) tree[method](blocked);
    expect(root.innerHTML).toBe(snapshot);
    expect(event).not.toHaveBeenCalled();
  });

  it("keeps disabled nodes in arrow traversal without expanding closed branches", () => {
    const { root, blocked } = setup(disabled);
    root.querySelector("#before").focus();
    key(document.activeElement, "ArrowDown");
    expect(document.activeElement).toBe(blocked);
    expect(blocked.tabIndex).toBe(0);
    key(blocked, "ArrowRight");
    expect(blocked.getAttribute("aria-expanded")).toBe("false");
    key(blocked, "ArrowDown");
    expect(document.activeElement.id).toBe("after");
    key(document.activeElement, "ArrowUp");
    expect(document.activeElement).toBe(blocked);
  });

  it("leaves enabled descendants of an already-open disabled node usable", () => {
    const { blocked, child } = setup(disabled, true);
    blocked.focus();
    key(blocked, "ArrowLeft");
    expect(blocked.getAttribute("aria-expanded")).toBe("true");
    key(blocked, "ArrowRight");
    expect(document.activeElement).toBe(child);
    expect(child.hasAttribute("aria-disabled")).toBe(false);
    expect(child.classList.contains("is-disabled")).toBe(false);
    key(child, "Enter");
    expect(child.getAttribute("aria-selected")).toBe("true");
    child.querySelector("span").click();
    expect(document.activeElement).toBe(child);
  });

  it("removes capture guard on dispose", () => {
    const { blocked } = setup(disabled);
    const target = blocked.querySelector("a");
    const handler = vi.fn();
    target.addEventListener("keydown", handler);
    tree.dispose();
    expect(key(target, "Enter")).toBe(true);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

it("does not mutate foreign or non-treeitem elements via direct APIs", () => {
  const { root } = setup("");
  const external = document.createElement("li");
  external.setAttribute("role", "treeitem");
  external.innerHTML = '<span>External</span><ul><li>Child</li></ul>';
  document.body.append(external);
  const snapshot = document.body.innerHTML;
  const event = vi.fn();
  root.addEventListener("fs:tree:selected", event);
  for (const item of [external, root, root.querySelector("span"), null]) {
    for (const method of ["select", "expand", "collapse", "toggle"]) tree[method](item);
  }
  expect(document.body.innerHTML).toBe(snapshot);
  expect(event).not.toHaveBeenCalled();
});
