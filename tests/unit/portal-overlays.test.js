import { afterEach, describe, expect, it } from "vitest";
import { Modal } from "../../packages/fokus-js/js/modal.js";
import { CommandPalette } from "../../packages/fokus-js/js/command-palette.js";
import { Datepicker } from "../../packages/fokus-js/js/datepicker.js";
import { Combobox } from "../../packages/fokus-js/js/combobox.js";
import { Popover } from "../../packages/fokus-js/js/popover.js";
import { NestedMenu } from "../../packages/fokus-js/js/nested-menu.js";
import { Dropdown } from "../../packages/fokus-js/js/dropdown.js";
import { Tooltip } from "../../packages/fokus-js/js/tooltip.js";
import { applyThemeContext } from "../../packages/fokus-js/js/core/theme.js";

const created = [];
const track = (instance) => (created.push(instance), instance);
afterEach(() => {
  created.splice(0).reverse().forEach((instance) => instance.dispose());
  document.body.innerHTML = "";
});
function modal() {
  document.body.innerHTML = `<button id="open" data-fs-target="#modal">Open</button>
    <div id="modal"><div class="fs-modal-dialog"><button>First</button><section id="content"></section></div></div>`;
  return track(new Modal(document.querySelector("#open")));
}
const cases = [
  ["Datepicker", Datepicker, "input", "panelEl"],
  ["Combobox", Combobox, "input", "listboxEl"],
  ["Popover", Popover, "button", "popoverEl"],
  ["NestedMenu", NestedMenu, "button", "rootMenu"],
  ["Dropdown", Dropdown, "button", "menuEl"],
  ["Tooltip", Tooltip, "button", "tooltipEl"],
];
function popup(Component, tag) {
  const content = document.querySelector("#content");
  content.innerHTML = `<${tag} id="owner" title="Help" data-fs-target="#popup"></${tag}>
    <div id="popup" class="fs-dropdown-menu"><button class="fs-dropdown-item">Option</button></div><span id="next"></span>`;
  return track(new Component(content.querySelector("#owner")));
}
const escape = () => document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
describe("dialog-owned popup lifecycle", () => {
  for (const [name, Component, tag, element] of cases) {
    it(`${name}: remains accessible when initialized before opening Modal; Escape closes only popup`, () => {
      const dialog = modal();
      const instance = popup(Component, tag);
      dialog.show();
      instance.show();
      expect(dialog.dialogEl.contains(instance[element])).toBe(true);
      expect(instance[element].closest('[inert], [aria-hidden="true"]')).toBeNull();
      escape();
      expect(instance.isOpen).toBe(false);
      expect(dialog.isOpen).toBe(true);
      escape();
      expect(dialog.isOpen).toBe(false);
    });
    it(`${name}: initialized after Modal opens is not isolated`, () => {
      const dialog = modal();
      dialog.show();
      const instance = popup(Component, tag);
      instance.show();
      expect(instance[element].closest('[inert], [aria-hidden="true"]')).toBeNull();
    });
    if (name !== "Tooltip") it(`${name}: dispose restores popup safely when original sibling was removed`, () => {
      modal();
      const instance = popup(Component, tag);
      document.querySelector("#next").remove();
      const panel = instance[element];
      expect(() => instance.dispose()).not.toThrow();
      created.pop();
      expect(panel.parentElement.id).toBe("content");
    });
  }
  it("re-evaluates ownership when the trigger is moved after initialization", () => {
    const dialog = modal();
    const instance = popup(Combobox, "input");
    document.body.append(instance.inputEl);
    instance.show();
    expect(instance.listboxEl.parentElement).toBe(document.body);
    instance.hide();
    dialog.dialogEl.append(instance.inputEl);
    dialog.show();
    instance.show();
    expect(instance.listboxEl.parentElement).toBe(dialog.dialogEl);
    expect(instance.listboxEl.closest("[inert]")).toBeNull();
  });
  it("CommandPalette participates in Escape stack and preserves modal scroll lock", () => {
    const dialog = modal();
    dialog.dialogEl.insertAdjacentHTML("beforeend", '<button id="commands" data-fs-target="#commands-panel">Commands</button>');
    document.body.insertAdjacentHTML("beforeend", `<div id="commands-panel"><div class="fs-command-palette-dialog">
      <input class="fs-command-palette-input"><ul class="fs-command-palette-list"><li class="fs-dropdown-item">Action</li></ul>
    </div></div>`);
    const palette = track(new CommandPalette(document.querySelector("#commands")));
    dialog.show();
    palette.show();
    escape();
    expect(palette.isOpen).toBe(false);
    expect(dialog.isOpen).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement.id).toBe("commands");
    escape();
    expect(dialog.isOpen).toBe(false);
    expect(document.body.style.overflow).not.toBe("hidden");
  });
  it("inherits canonical ancestor theme, with nearest scope and canonical precedence", () => {
    document.body.innerHTML = '<div data-fs-theme="dark"><span id="source"></span></div><div id="target"></div>';
    const source = document.querySelector("#source");
    const target = document.querySelector("#target");
    applyThemeContext(target, source);
    expect(target.getAttribute("data-fs-theme")).toBe("dark");
    source.setAttribute("data-theme", "light");
    applyThemeContext(target, source);
    expect(target.getAttribute("data-theme")).toBe("light");
    expect(target.hasAttribute("data-fs-theme")).toBe(false);
    source.setAttribute("data-fs-theme", "auto");
    applyThemeContext(target, source);
    expect(target.getAttribute("data-fs-theme")).toBe("auto");
    expect(target.hasAttribute("data-theme")).toBe(false);
  });
});

it("positions a popup in its positioned dialog coordinate space", async () => {
  const { applyPosition } = await import("../../packages/fokus-js/js/core/positioning.js");
  const parent = document.createElement("div");
  const panel = document.createElement("div");
  parent.append(panel);
  document.body.append(parent);
  Object.defineProperty(panel, "offsetParent", { value: parent });
  parent.getBoundingClientRect = () => ({ top: 100, left: 200 });
  Object.defineProperty(parent, "clientTop", { value: 2 });
  Object.defineProperty(parent, "clientLeft", { value: 3 });
  parent.scrollTop = 20;
  parent.scrollLeft = 10;
  applyPosition(panel, { top: 150 + window.scrollY, left: 260 + window.scrollX });
  expect(panel.style.top).toBe("68px");
  expect(panel.style.left).toBe("67px");
});
it("programmatic parent dismissal cleans up owned popups and restores focus", () => {
  const dialog = modal();
  const instance = popup(Combobox, "input");
  dialog.show();
  instance.show();
  dialog.hide();
  expect(instance.isOpen).toBe(false);
  expect(document.activeElement.id).toBe("open");
  dialog.show();
  escape();
  expect(dialog.isOpen).toBe(false);
});

it("Datepicker clearing inside Modal remains empty across hide and reopen", () => {
  const dialog = modal();
  const picker = popup(Datepicker, "input");
  dialog.show();
  picker.inputEl.value = "30/10/2026";
  picker.inputEl.dispatchEvent(new Event("change", { bubbles: true }));
  picker.show();
  picker.inputEl.value = "";
  picker.inputEl.dispatchEvent(new Event("change", { bubbles: true }));
  expect(picker.value).toBeNull();
  expect(picker.selectedDate).toBeNull();
  dialog.hide();
  expect(picker.isOpen).toBe(false);
  dialog.show();
  picker.show();
  expect(picker.value).toBeNull();
  expect(picker.inputEl.value).toBe("");
  expect(picker.panelEl.closest('[inert], [aria-hidden="true"]')).toBeNull();
});
