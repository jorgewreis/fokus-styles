import { readFileSync } from "node:fs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Offcanvas } from "../../packages/fokus-js/js/offcanvas.js";
import { Popover } from "../../packages/fokus-js/js/popover.js";
import { Tooltip } from "../../packages/fokus-js/js/tooltip.js";
import { Toast } from "../../packages/fokus-js/js/toast.js";
import { Navbar } from "../../packages/fokus-js/js/navbar.js";
import { NestedMenu } from "../../packages/fokus-js/js/nested-menu.js";
const instances = [];
function mount(id, Constructor) {
  document.body.innerHTML = readFileSync(`docs/catalog/fixtures/${id}/basic.html`, "utf8");
  const element = document.querySelector(`[data-fs="${id}"]`);
  const instance = new Constructor(element); instances.push(instance);
  return { element, instance };
}
function key(element, key) { element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true })); }
beforeEach(() => { vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true }); });
afterEach(() => { for (const i of instances.splice(0)) i.dispose(); document.body.innerHTML = ""; vi.useRealTimers(); vi.restoreAllMocks(); });

it("offcanvas fixture repeats Escape/dismiss and disposes during pending focus activation", async () => {
  const { element, instance } = mount("offcanvas", Offcanvas);
  const dialog = document.querySelector("#meuPainel");
  for (let n = 0; n < 2; n++) {
    element.click(); expect(instance.isOpen).toBe(true);
    expect(dialog.getAttribute("aria-hidden")).toBe("false");
    key(document, "Escape"); expect(instance.isOpen).toBe(false);
    expect(document.activeElement).toBe(element);
  }
  element.click(); dialog.querySelector("button").focus(); dialog.querySelector("button").click(); expect(instance.isOpen).toBe(false);
  element.click(); instance.dispose();
  expect(document.querySelector(".fs-offcanvas-backdrop")).toBeNull();
  expect(Offcanvas.getInstance(element)).toBeUndefined();
  await new Promise(resolve => setTimeout(resolve, 50));
  element.click(); expect(instance.isOpen).toBe(false);
  const next = new Offcanvas(element); instances.push(next); element.click(); expect(next.isOpen).toBe(true);
});

it("popover fixture has named dialog, explicit close, Escape and teardown/reinit", () => {
  const { element, instance } = mount("popover", Popover);
  const dialog = document.querySelector("#meu-popover");
  expect(document.getElementById(dialog.getAttribute("aria-labelledby")).textContent).toBe("Título");
  for (let n = 0; n < 2; n++) {
    element.click(); expect(instance.isOpen).toBe(true);
    dialog.querySelector("button").focus(); dialog.querySelector("button").click(); expect(instance.isOpen).toBe(false);
    expect(document.activeElement).toBe(element);
  }
  element.click(); key(document, "Escape"); expect(instance.isOpen).toBe(false);
  element.click(); instance.dispose(); expect(Popover.getInstance(element)).toBeUndefined();
  element.click(); expect(instance.isOpen).toBe(false);
  const next = new Popover(element); instances.push(next); element.click(); expect(next.isOpen).toBe(true);
});

it("tooltip fixture preserves description text through focus/Escape and reinitialization", () => {
  const { element, instance } = mount("tooltip", Tooltip);
  for (let n = 0; n < 2; n++) {
    element.dispatchEvent(new Event("focus")); expect(instance.isOpen).toBe(true);
    expect(document.getElementById(element.getAttribute("aria-describedby")).textContent).toBe("Copiar para a área de transferência");
    key(document, "Escape"); expect(instance.isOpen).toBe(false);
  }
  instance.dispose(); expect(element.hasAttribute("aria-describedby")).toBe(false);
  expect(document.querySelector('[role="tooltip"]')).toBeNull();
  element.dispatchEvent(new Event("focus")); expect(document.querySelector('[role="tooltip"]')).toBeNull();
  const next = new Tooltip(element); instances.push(next); next.show();
  expect(next.title).toBe("Copiar para a área de transferência");
});

it("toast fixture pauses autohide, resumes, dismisses and cancels timers on dispose", async () => {
  vi.useFakeTimers();
  const { element, instance } = mount("toast", Toast);
  instance.show(); await vi.advanceTimersByTimeAsync(1000);
  element.dispatchEvent(new Event("focusin"));
  await vi.advanceTimersByTimeAsync(5000); expect(instance.isOpen).toBe(true);
  element.dispatchEvent(new Event("focusout"));
  await vi.advanceTimersByTimeAsync(3000); expect(instance.isOpen).toBe(false);
  instance.show(); element.querySelector("button").click(); expect(instance.isOpen).toBe(false);
  instance.show(); instance.dispose();
  expect(Toast.getInstance(element)).toBeUndefined();
  expect(instance._hideTimer === null || vi.getTimerCount() === 0).toBe(true);
  const next = new Toast(element); instances.push(next); next.show(); expect(next.isOpen).toBe(true);
});

it("navbar fixture has resolvable links, repeats Escape and disposes listeners", () => {
  const { element, instance } = mount("navbar", Navbar);
  for (const a of element.querySelectorAll('a[href^="#"]')) expect(document.querySelector(a.getAttribute("href"))).not.toBeNull();
  const trigger = element.querySelector("button"); const panel = document.querySelector("#menuPrincipal");
  for (let n = 0; n < 2; n++) {
    trigger.click(); expect(panel.hidden).toBe(false);
    key(panel, "Escape"); expect(panel.hidden).toBe(true); expect(document.activeElement).toBe(trigger);
  }
  instance.dispose(); trigger.click(); expect(panel.hidden).toBe(true);
  const next = new Navbar(element); instances.push(next); trigger.click(); expect(next.isOpen()).toBe(true);
});

it("nested-menu fixture navigates levels, returns focus and tears down while open", () => {
  const { element, instance } = mount("nested-menu", NestedMenu);
  const submenuParent = document.querySelector(".fs-dropdown-item-submenu");
  const submenu = submenuParent.nextElementSibling;
  expect(document.querySelectorAll('[role="menuitem"]')).toHaveLength(5);
  for (let n = 0; n < 2; n++) {
    element.click(); submenuParent.focus(); key(submenuParent, "ArrowRight");
    expect(submenu.classList.contains("is-open")).toBe(true);
    expect(document.activeElement.textContent).toBe("PDF");
    key(document.activeElement, "ArrowLeft"); expect(document.activeElement).toBe(submenuParent);
    expect(submenu.classList.contains("is-open")).toBe(false);
    key(submenuParent, "Escape"); expect(instance.isOpen).toBe(false); expect(document.activeElement).toBe(element);
  }
  element.click(); instance.dispose(); expect(NestedMenu.getInstance(element)).toBeUndefined();
  element.click(); expect(instance.isOpen).toBe(false);
  const next = new NestedMenu(element); instances.push(next); element.click(); expect(next.isOpen).toBe(true);
});
