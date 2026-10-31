import { readFileSync } from "node:fs";
import { afterEach, expect, it } from "vitest";
import { Combobox } from "../../packages/fokus-js/js/combobox.js";
import { CommandPalette } from "../../packages/fokus-js/js/command-palette.js";
import { DataTable } from "../../packages/fokus-js/js/datatable.js";
import { Datepicker } from "../../packages/fokus-js/js/datepicker.js";
import { Select } from "../../packages/fokus-js/js/select.js";
import { TreeView } from "../../packages/fokus-js/js/tree-view.js";
const constructors = { combobox: Combobox, "command-palette": CommandPalette, datatable: DataTable, datepicker: Datepicker, select: Select, "tree-view": TreeView };
const instances = [];
function mount(id) {
  document.body.innerHTML = readFileSync(`docs/catalog/fixtures/${id}/basic.html`, "utf8");
  const element = document.querySelector(`[data-fs="${id}"]`);
  const instance = new constructors[id](element); instances.push(instance);
  return { element, instance };
}
function key(el, key) { el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })); }
afterEach(() => { for (const instance of instances.splice(0)) instance.dispose(); document.body.innerHTML = ""; });

it("catalog Combobox filters, announces empty, selects and survives teardown/reinit", () => {
  const { element, instance } = mount("combobox");
  element.value = "zzz"; element.dispatchEvent(new Event("input", { bubbles: true }));
  expect(document.querySelector("[data-fs-empty]").hidden).toBe(false);
  element.value = "tail"; element.dispatchEvent(new Event("input", { bubbles: true }));
  key(element, "Home"); key(element, "Enter");
  expect(instance.value).toBe("tailwind"); expect(element.value).toBe("Tailwind CSS");
  for (let i = 0; i < 2; i++) { key(element, "ArrowDown"); expect(instance.isOpen).toBe(true); key(element, "Escape"); expect(instance.isOpen).toBe(false); }
  instance.dispose(); key(element, "ArrowDown"); expect(instance.isOpen).toBe(false);
  const replacement = new Combobox(element); instances.push(replacement); key(element, "ArrowDown"); expect(replacement.isOpen).toBe(true);
});

it("catalog CommandPalette filters/selects and repeated Escape restores focus without stale listeners", () => {
  const { element, instance } = mount("command-palette");
  let selection; element.addEventListener("fs:command-palette:selected", event => { selection = event.detail; });
  element.click();
  expect(instance.inputEl).toBe(document.activeElement);
  instance.inputEl.value = "Novo"; instance.inputEl.dispatchEvent(new Event("input", { bubbles: true }));
  key(instance.inputEl, "Home"); key(instance.inputEl, "Enter");
  expect(instance.isOpen).toBe(false);
  expect(selection?.value).toBe("new-file");
  for (let i = 0; i < 2; i++) { element.click(); key(instance.inputEl, "Escape"); expect(instance.isOpen).toBe(false); expect(document.activeElement).toBe(element); }
  instance.dispose(); element.click(); expect(instance.isOpen).toBe(false);
  const replacement = new CommandPalette(element); instances.push(replacement); element.click(); expect(replacement.isOpen).toBe(true);
});

it("catalog DataTable sorts, filters/clears empty state and restores rows on teardown", () => {
  const { element, instance } = mount("datatable");
  element.querySelector('[data-fs-sort-key="age"]').click();
  expect(element.querySelector("tbody tr td").textContent).toBe("Bruno");
  const input = element.querySelector("input"); input.value = "zzz"; input.dispatchEvent(new Event("input"));
  expect(instance.rowCount).toBe(0); expect(element.querySelector("[data-fs-datatable-empty]").hidden).toBe(false);
  input.value = "Ana"; input.dispatchEvent(new Event("input")); expect(instance.rowCount).toBe(1);
  instance.dispose(); expect(element.querySelectorAll("tbody tr[hidden]")).toHaveLength(0);
  expect(element.querySelectorAll("th button")).toHaveLength(0);
  const replacement = new DataTable(element); instances.push(replacement);
  expect(element.querySelectorAll("th button")).toHaveLength(2);
  replacement.filter(""); expect(replacement.rowCount).toBe(2);
});

it("catalog Datepicker deterministic keyboard selection, Escape and teardown/reinit", () => {
  const { element, instance } = mount("datepicker");
  key(element, "ArrowDown"); expect(instance.isOpen).toBe(true);
  key(document.activeElement, "ArrowRight"); key(document.activeElement, "Enter");
  expect(instance.value).toBe("2026-07-21"); expect(element.value).toBe("21/07/2026"); expect(instance.isOpen).toBe(false);
  for (let i = 0; i < 2; i++) { key(element, "ArrowDown"); key(document.activeElement, "Escape"); expect(instance.isOpen).toBe(false); expect(document.activeElement).toBe(element); }
  instance.dispose(); key(element, "ArrowDown"); expect(instance.isOpen).toBe(false);
  const replacement = new Datepicker(element); instances.push(replacement); key(element, "ArrowDown"); expect(replacement.isOpen).toBe(true);
});

it("catalog Select skips disabled choice, syncs native change and restores original on teardown", () => {
  const { element, instance } = mount("select");
  instance.show(); instance.menuEl.children[2].click(); expect(element.value).toBe("br");
  instance.menuEl.children[1].click(); expect(element.value).toBe("pt"); expect(instance.toggleEl.textContent).toBe("Portugal");
  element.value = "br"; element.dispatchEvent(new Event("change")); expect(instance.toggleEl.textContent).toBe("Brasil");
  instance.dispose(); expect(element.style.display).toBe(""); expect(document.querySelector(".fs-form-select-dropdown")).toBeNull();
  const replacement = new Select(element); instances.push(replacement); replacement.show(); expect(replacement.isOpen).toBe(true);
});

it("catalog TreeView expands, navigates/selects, collapses and reinitializes without duplicate toggles", () => {
  const { element, instance } = mount("tree-view");
  const parent = element.querySelector("li"); parent.focus(); key(parent, "ArrowRight"); expect(parent.getAttribute("aria-expanded")).toBe("true");
  key(parent, "ArrowRight"); const leaf = document.activeElement; expect(leaf.textContent).toBe("index.js");
  key(leaf, "Enter"); expect(leaf.getAttribute("aria-selected")).toBe("true");
  key(leaf, "ArrowLeft"); expect(document.activeElement).toBe(parent);
  key(parent, "ArrowLeft"); expect(parent.getAttribute("aria-expanded")).toBe("false");
  instance.dispose(); key(parent, "ArrowRight"); expect(parent.getAttribute("aria-expanded")).toBe("false");
  const count = element.querySelectorAll(".fs-tree-toggle").length;
  const replacement = new TreeView(element); instances.push(replacement); key(parent, "ArrowRight"); expect(parent.getAttribute("aria-expanded")).toBe("true");
  expect(element.querySelectorAll(".fs-tree-toggle")).toHaveLength(count);
});

for (const [id, Constructor] of Object.entries(constructors)) {
  it(`${id} exact fixture initializer names controls and disposes on pagehide`, () => {
    document.body.innerHTML = readFileSync(`docs/catalog/fixtures/${id}/basic.html`, "utf8");
    const source = readFileSync(`docs/catalog/fixtures/${id}/basic.js`, "utf8");
    // Substitute only the ESM binding; execute the real initializer body.
    const name = source.match(/^import \{ (\w+) \} from "fokus-styles\/js";/)[1];
    new Function(name, source.replace(/^import[^\n]+\n/, ""))(Constructor);
    const element = document.querySelector(`[data-fs="${id}"]`);
    const instance = Constructor.getInstance(element);
    expect(instance).toBeDefined();
    if (id === "select") expect(instance.toggleEl.getAttribute("aria-labelledby")).toBe(`catalog-country-label ${instance.toggleEl.id}`);
    if (id === "datepicker") expect(instance.gridEl.getAttribute("aria-label")).toBe("Data de entrega");
    window.dispatchEvent(new Event("pagehide"));
    expect(Constructor.getInstance(element)).toBeUndefined();
  });
}
