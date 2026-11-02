import { afterEach, describe, expect, it } from "vitest";
import { act, createElement as h, createRef, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ModalTrigger, ModalPanel, DropdownTrigger, DropdownMenu } from "../../packages/fokus-react/src/index.js";
import { Modal } from "../../packages/fokus-js/js/modal.js";
import { Dropdown } from "../../packages/fokus-js/js/dropdown.js";

let root, host;
afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
  root = null;
});

describe.each([
  ["Modal", ModalTrigger, ModalPanel, Modal],
  ["Dropdown", DropdownTrigger, DropdownMenu, Dropdown],
])("%s target lifecycle", (_name, Trigger, Panel, Vanilla) => {
  it.each([false, true])("recreates a stale target, cleans the old open state (%s), and unmounts in StrictMode", (open) => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    const ref = createRef();
    const render = (target) => act(() => root.render(h(StrictMode, null,
      h(Trigger, { target, ref }, "Open"),
      h(Panel, { id: "a" }, h("button", null, "A")),
      h(Panel, { id: "b" }, h("button", null, "B")),
    )));
    render("#a");
    const trigger = host.querySelector("button");
    const first = Vanilla.getInstance(trigger);
    if (open) act(() => ref.current.show());
    render("#b");
    expect(Vanilla.getInstance(trigger)).not.toBe(first);
    expect(first.isOpen).toBe(false);
    expect(host.querySelector("#a").classList.contains("is-open")).toBe(false);
    act(() => ref.current.show());
    expect(document.querySelector("#b").classList.contains("is-open")).toBe(true);
    act(() => root.unmount());
    root = null;
    expect(Vanilla.getInstance(trigger)).toBeUndefined();
    expect(document.body.style.overflow).not.toBe("hidden");
    expect(document.querySelector("[inert]")).toBeNull();
  });
});
