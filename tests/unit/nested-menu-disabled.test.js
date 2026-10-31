import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { NestedMenu } from "../../packages/fokus-js/js/nested-menu.js";

let menu;
afterEach(() => { menu?.dispose(); document.body.innerHTML = ""; });
function mount(attribute = "") {
  document.body.innerHTML = `<button id="toggle">Menu</button><div class="fs-dropdown-menu">
    <button class="fs-dropdown-item" id="first">First</button>
    <div class="fs-dropdown-submenu">
      <button class="fs-dropdown-item fs-dropdown-item-submenu" id="parent" ${attribute}><span>Parent</span></button>
      <div class="fs-dropdown-menu"><button class="fs-dropdown-item" disabled>Blocked</button><button class="fs-dropdown-item" id="child">Child</button></div>
    </div>
    <a class="fs-dropdown-item" id="last" href="#allowed">Last</a>
  </div><a class="fs-dropdown-item is-disabled" id="outside" href="#outside">Outside</a>`;
  menu = new NestedMenu(document.querySelector("#toggle"));
  menu.show();
  return document.querySelector("#parent");
}
function key(el, key) {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}
describe("NestedMenu disabled activation", () => {
  it.each(["disabled", 'aria-disabled="true"', 'class'])("skips %s items in both arrow directions", attr => {
    const parent = mount(attr === "class" ? "" : attr);
    if (attr === "class") parent.classList.add("is-disabled");
    const first = document.querySelector("#first"), last = document.querySelector("#last");
    key(first, "ArrowDown"); expect(document.activeElement).toBe(last);
    key(last, "ArrowUp"); expect(document.activeElement).toBe(first);
    key(first, "ArrowUp"); expect(document.activeElement).toBe(last);
    key(last, "ArrowDown"); expect(document.activeElement).toBe(first);
  });

  it.each(["disabled", 'aria-disabled="true"', "class"])("suppresses %s activation before target handlers and preserves open state", attr => {
    const parent = mount(attr === "class" ? "" : attr);
    if (attr === "class") parent.classList.add("is-disabled");
    const handler = vi.fn();
    for (const type of ["click", "auxclick", "keydown"]) parent.addEventListener(type, handler);
    for (const type of ["click", "auxclick"]) {
      const event = new MouseEvent(type, { bubbles: true, cancelable: true });
      parent.firstChild.dispatchEvent(event); expect(event.defaultPrevented).toBe(true);
    }
    expect(key(parent, "Enter").defaultPrevented).toBe(true);
    expect(key(parent, " ").defaultPrevented).toBe(true);
    expect(handler).not.toHaveBeenCalled();
    expect(menu.isOpen).toBe(true);
    expect(parent.getAttribute("aria-expanded")).toBe("false");
    parent.focus(); key(parent, "ArrowRight");
    expect(parent.getAttribute("aria-expanded")).toBe("false");
    menu._openSubmenu(parent, true);
    expect(parent.getAttribute("aria-expanded")).toBe("false");
  });

  it("does not close a disabled parent directly but hide cleans all submenus", () => {
    const parent = mount();
    parent.focus(); key(parent, "ArrowRight");
    expect(document.activeElement.id).toBe("child");
    parent.setAttribute("aria-disabled", "true");
    menu._closeSubmenu(parent);
    expect(parent.getAttribute("aria-expanded")).toBe("true");
    menu.hide();
    expect(parent.getAttribute("aria-expanded")).toBe("false");
    expect(menu.rootMenu.querySelector(".fs-dropdown-menu.is-open")).toBeNull();
  });

  it("preserves enabled target handler order, leaf defaults and close, without inheriting container ARIA", () => {
    mount();
    menu.rootMenu.setAttribute("aria-disabled", "true");
    const last = document.querySelector("#last"), observations = [];
    last.addEventListener("click", event => observations.push([menu.isOpen, event.defaultPrevented]));
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    last.dispatchEvent(event);
    expect(observations).toEqual([[true, false]]);
    expect(event.defaultPrevented).toBe(false);
    expect(menu.isOpen).toBe(false);
  });

  it("keeps disabled guard local and removes it on dispose", () => {
    const parent = mount('aria-disabled="true"');
    const outside = document.querySelector("#outside");
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    outside.dispatchEvent(event); expect(event.defaultPrevented).toBe(false);
    menu.dispose();
    const handler = vi.fn(); parent.addEventListener("click", handler);
    const after = new MouseEvent("click", { bubbles: true, cancelable: true });
    parent.dispatchEvent(after);
    expect(after.defaultPrevented).toBe(false);
    expect(handler).toHaveBeenCalledOnce();
  });

  it("does not intercept Tab and preserves Escape teardown", () => {
    const parent = mount('aria-disabled="true"');
    parent.focus();
    expect(key(parent, "Tab").defaultPrevented).toBe(false);
    key(parent, "Escape");
    expect(menu.isOpen).toBe(false);
    expect(document.activeElement.id).toBe("toggle");
  });
});

it("compiled hover selector requires an enabled adjacent parent while is-open stays independent", () => {
  const css = readFileSync("dist/css/fokus.css", "utf8");
  expect(css).toContain('.fs-dropdown-submenu:hover > .fs-dropdown-item:not(.is-disabled, :disabled, [aria-disabled=true]) + .fs-dropdown-menu,');
  expect(css).not.toContain(".fs-dropdown-submenu:hover > .fs-dropdown-menu,");
  expect(css).toContain(".fs-dropdown-submenu > .fs-dropdown-menu.is-open");
});
