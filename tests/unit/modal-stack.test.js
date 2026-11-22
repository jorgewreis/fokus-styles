import { confirm } from "../../packages/fokus-js/js/confirm.js";
import { afterEach, describe, expect, it } from "vitest";
import { Dropdown } from "../../packages/fokus-js/js/dropdown.js";
import { Modal } from "../../packages/fokus-js/js/modal.js";

const instances = [];
function modal(id, parent = document.body, options) {
  const wrapper = document.createElement("section");
  wrapper.innerHTML = `<button data-fs-target="#${id}">Open</button>
    <div class="fs-modal" id="${id}"><div class="fs-modal-dialog"><button>First</button><button>Last</button></div></div>`;
  parent.append(wrapper);
  const instance = new Modal(wrapper.firstElementChild, options);
  instances.push(instance);
  return instance;
}
function escape() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
}
afterEach(() => {
  instances.splice(0).reverse().forEach((instance) => instance.dispose());
  document.body.replaceChildren();
});

describe("Modal isolation and stack regressions", () => {
  it("isolates all ancestor siblings and restores existing attributes after repeated open/close", () => {
    const background = document.createElement("main");
    background.setAttribute("aria-hidden", "false");
    const alreadyInert = document.createElement("aside");
    alreadyInert.setAttribute("inert", "");
    alreadyInert.setAttribute("aria-hidden", "true");
    document.body.append(background, alreadyInert);
    const a = modal("a");
    for (let i = 0; i < 2; i++) {
      a.show();
      expect(background.inert).toBe(true);
      expect(background.getAttribute("aria-hidden")).toBe("true");
      expect(a.modalEl.closest("[inert]")).toBeNull();
      a.hide();
      expect(background.hasAttribute("inert")).toBe(false);
      expect(background.getAttribute("aria-hidden")).toBe("false");
      expect(alreadyInert.hasAttribute("inert")).toBe(true);
      expect(alreadyInert.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it.each([false, true])("Escape closes only the top, regardless of construction order (%s)", (reverse) => {
    let a, b;
    if (reverse) { b = modal("b"); a = modal("a"); }
    else { a = modal("a"); b = modal("b"); }
    a.show();
    b.show();
    expect(b.modalEl.closest("[inert]")).toBeNull();
    escape();
    expect(b.isOpen).toBe(false);
    expect(a.isOpen).toBe(true);
    expect(a.modalEl.closest("[inert]")).toBeNull();
    expect(a.dialogEl.contains(document.activeElement)).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    escape();
    expect(a.isOpen).toBe(false);
    expect(document.activeElement).toBe(a.triggerEl);
    expect(document.body.style.overflow).toBe("");
  });

  it("does not close a lower modal while the top is static", () => {
    const a = modal("a");
    const b = modal("b", document.body, { backdrop: "static" });
    a.show(); b.show(); escape();
    expect(a.isOpen).toBe(true);
    expect(b.isOpen).toBe(true);
  });

  it("closing the lower overlay out of order preserves the top and final aria state", () => {
    const a = modal("a");
    const b = modal("b");
    a.show(); b.show();
    const focused = document.activeElement;
    a.dispose();
    expect(b.isOpen).toBe(true);
    expect(document.activeElement).toBe(focused);
    expect(b.modalEl.closest("[inert]")).toBeNull();
    b.hide();
    expect(a.modalEl.getAttribute("aria-hidden")).toBe("true");
    expect(b.modalEl.getAttribute("aria-hidden")).toBe("true");
    expect(document.querySelector("[inert]")).toBeNull();
  });

  it("nested dialogs return focus to the inner invoker without trapping it in the parent", () => {
    const a = modal("a");
    const b = modal("b", a.dialogEl);
    a.show();
    b.triggerEl.focus();
    b.show();
    expect(b.modalEl.closest("[inert]")).toBeNull();
    escape();
    expect(a.isOpen).toBe(true);
    expect(document.activeElement).toBe(b.triggerEl);
  });

  it("outside clicks dismiss only the top even when it was constructed first", () => {
    const b = modal("b");
    const a = modal("a");
    a.show(); b.show();
    b.modalEl.click();
    expect(b.isOpen).toBe(false);
    expect(a.isOpen).toBe(true);
  });

  it("empty dialogs receive fallback focus and restore tabindex on dispose", () => {
    const a = modal("a");
    a.dialogEl.replaceChildren();
    a.show();
    expect(document.activeElement).toBe(a.dialogEl);
    expect(a.dialogEl.getAttribute("tabindex")).toBe("-1");
    a.dispose();
    expect(a.dialogEl.hasAttribute("tabindex")).toBe(false);
    expect(document.activeElement).toBe(a.triggerEl);
  });

  it("wraps Tab in the active dialog", () => {
    const a = modal("a");
    a.show();
    expect(document.activeElement).toBe(a.dialogEl.firstElementChild);
    a.dialogEl.lastElementChild.focus();
    document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(a.dialogEl.firstElementChild);
  });
});

describe("Dropdown inside modal", () => {
  it("portals within the active dialog, remains focusable, and consumes its own Escape", () => {
    const a = modal("with-menu");
    a.dialogEl.innerHTML = '<div><button data-fs-target="#menu">Menu</button><div id="menu"><a href="#" class="fs-dropdown-item">Item</a></div></div>';
    const trigger = a.dialogEl.querySelector("button");
    const originalParent = trigger.parentElement;
    const dropdown = new Dropdown(trigger);
    try {
      a.show();
      dropdown.show();
      expect(dropdown.menuEl.parentElement).toBe(a.dialogEl);
      expect(dropdown.menuEl.closest("[inert]")).toBeNull();
      expect(document.activeElement).toBe(dropdown.menuEl.firstElementChild);
      document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
      expect(dropdown.isOpen).toBe(false);
      expect(a.isOpen).toBe(true);
      expect(document.activeElement).toBe(trigger);
      dropdown.dispose();
      expect(dropdown.menuEl.parentElement).toBe(originalParent);
    } finally {
      dropdown.dispose();
    }
  });
});


describe("Confirm security and modal integration", () => {
  it.each(["confirm", "cancel", "escape"])("keeps the parent modal active after %s and rejects injected variants", async (action) => {
    const parent = modal("parent-confirm");
    parent.show();
    const invoker = parent.dialogEl.firstElementChild;
    invoker.focus();
    const result = confirm({ variant: 'danger"><img src=x onerror="alert(1)">' });
    const dialog = document.querySelector(".fs-alert-dialog");
    expect(dialog.querySelector("img, [onerror]")).toBeNull();
    expect(dialog.querySelector('[data-action="confirm"]').className).toBe("fs-btn fs-btn-danger");
    expect(dialog.closest("[inert]")).toBeNull();
    expect(parent.modalEl.closest("[inert]")).not.toBeNull();
    if (action === "escape") escape();
    else dialog.querySelector(`[data-action="${action}"]`).click();
    expect(await result).toBe(action === "confirm");
    expect(parent.isOpen).toBe(true);
    expect(parent.modalEl.closest("[inert]")).toBeNull();
    expect(document.activeElement).toBe(invoker);
    expect(document.body.style.overflow).toBe("hidden");
    parent.hide();
    expect(document.body.style.overflow).toBe("");
    expect(document.querySelector("[inert]")).toBeNull();
  });
});
