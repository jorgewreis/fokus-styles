import { afterEach, describe, expect, it, vi } from "vitest";
import { Collapse } from "../../packages/fokus-js/js/collapse.js";
import { Accordion } from "../../packages/fokus-js/js/accordion.js";
import { Select } from "../../packages/fokus-js/js/select.js";
import { Datepicker } from "../../packages/fokus-js/js/datepicker.js";
import { DataTable } from "../../packages/fokus-js/js/datatable.js";
import { Toast } from "../../packages/fokus-js/js/toast.js";
import { Spinner } from "../../packages/fokus-js/js/spinner.js";

const instances = [];
const track = (instance) => { instances.push(instance); return instance; };
afterEach(() => {
  instances.splice(0).forEach((instance) => instance.dispose());
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});
const $ = (selector) => document.querySelector(selector);

describe("interrupted component state", () => {
  it.each([true, false])("Collapse respects the last request (reduced motion %s)", async (reduced) => {
    vi.useFakeTimers();
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: reduced });
    document.body.innerHTML = '<button data-fs-target="#panel"></button><div id="panel"></div>';
    const component = track(new Collapse($("button")));
    const shown = vi.fn(), hidden = vi.fn();
    $("button").addEventListener("fs:collapse:shown", shown);
    $("button").addEventListener("fs:collapse:hidden", hidden);
    component.show(); component.hide(); component.show();
    await vi.runAllTimersAsync();
    expect(component.isOpen).toBe(true);
    expect($("#panel").style.display).not.toBe("none");
    expect($("#panel").style.height).toBe("");
    expect(shown).toHaveBeenCalledTimes(1);
    expect(hidden).not.toHaveBeenCalled();
    component.hide();
    await vi.runAllTimersAsync();
    expect($("#panel").style.display).toBe("none");
    expect(hidden).toHaveBeenCalledTimes(1);
  });
  it("Accordion cannot be hidden by an obsolete close callback", async () => {
    vi.useFakeTimers();
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false });
    document.body.innerHTML = '<div id="a"><div class="fs-accordion-item"><button class="fs-accordion-button"></button><div class="fs-accordion-collapse"></div></div></div>';
    track(new Accordion($("#a")));
    const shown = vi.fn(), hidden = vi.fn();
    $("button").addEventListener("fs:accordion:shown", shown);
    $("button").addEventListener("fs:accordion:hidden", hidden);
    $("button").click(); $("button").click(); $("button").click();
    await vi.runAllTimersAsync();
    expect($("button").getAttribute("aria-expanded")).toBe("true");
    expect($(".fs-accordion-collapse").hidden).toBe(false);
    expect($(".fs-accordion-collapse").style.display).not.toBe("none");
    expect(shown).toHaveBeenCalledTimes(1);
    expect(hidden).not.toHaveBeenCalled();
  });
  it("dispose cancels pending transition events", async () => {
    vi.useFakeTimers();
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false });
    document.body.innerHTML = '<button data-fs-target="#panel"></button><div id="panel"></div>';
    const component = new Collapse($("button"));
    const shown = vi.fn();
    $("button").addEventListener("fs:collapse:shown", shown);
    component.show(); component.dispose();
    await vi.runAllTimersAsync();
    expect(shown).not.toHaveBeenCalled();
    expect($("#panel").style.height).toBe("");
  });
});
describe("native form state", () => {
  it.each([false, true])("Select follows reset and respects cancellation (%s)", async (cancel) => {
    document.body.innerHTML = '<form><select><option>A</option><option>B</option></select></form>';
    const component = track(new Select($("select")));
    component.menuEl.children[1].click();
    if (cancel) $("form").addEventListener("reset", (event) => event.preventDefault());
    $("form").reset();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(component.toggleEl.textContent).toBe(cancel ? "B" : "A");
    expect(component.menuEl.children[cancel ? 1 : 0].getAttribute("aria-selected")).toBe("true");
  });
  it("Select disposal cancels pending reset synchronization", () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<form><select><option>A</option><option>B</option></select></form>';
    const component = new Select($("select"));
    const sync = vi.spyOn(component, "_syncFromNativeSelect");
    $("form").reset();
    component.dispose();
    vi.runAllTimers();
    expect(sync).not.toHaveBeenCalled();
  });
  it("clearing Datepicker removes its old selected value", () => {
    document.body.innerHTML = '<input value="30/10/2026" data-fs-target="#dp"><div id="dp"></div>';
    const component = track(new Datepicker($("input")));
    $("input").value = "";
    $("input").dispatchEvent(new Event("change"));
    expect(component.value).toBeNull();
    expect(component.selectedDate).toBeNull();
    $("input").value = "01/11/2026";
    $("input").dispatchEvent(new Event("change"));
    expect(component.value).toBe("2026-11-01");
  });
});
describe("DataTable and loading", () => {
  it.each([
    ["number", ["2", "1.5", "-0.25"], ["-0.25", "1.5", "2"]],
    ["currency", ["R$ 2.000,50", "R$ 15,00", "R$ -2,50"], ["R$ -2,50", "R$ 15,00", "R$ 2.000,50"]],
  ])("sorts %s without discarding decimals", (type, values, ordered) => {
    document.body.innerHTML = '<div id="dt"><table class="fs-table"><thead><tr><th data-fs-sort="n" data-fs-sort-type="'+type+'">N</th></tr></thead><tbody>'+values.map((value) => "<tr><td>"+value+"</td></tr>").join("")+"</tbody></table></div>";
    const component = track(new DataTable($("#dt")));
    component.sort("n");
    expect([...$("tbody").children].map((row) => row.textContent)).toEqual(ordered);
  });
  it("restores headers and row order before reinitializing", () => {
    document.body.innerHTML = '<div id="dt"><table class="fs-table"><thead><tr><th data-fs-sort="n"><span>N</span></th></tr></thead><tbody><tr><td>2</td></tr><tr><td>1</td></tr></tbody></table></div>';
    const span = $("th span");
    const component = new DataTable($("#dt"));
    component.sort("n"); component.dispose();
    expect($("th").firstChild).toBe(span);
    expect([...$("tbody").children].map((row) => row.textContent)).toEqual(["2", "1"]);
    const second = track(new DataTable($("#dt")));
    expect($("button button")).toBeNull();
    second.sort("n");
    expect([...$("tbody").children].map((row) => row.textContent)).toEqual(["1", "2"]);
  });
  it("Spinner exposes valid ARIA booleans", () => {
    document.body.innerHTML = '<div id="s"></div>';
    const component = track(new Spinner($("#s")));
    component.start();
    expect($("#s").getAttribute("aria-busy")).toBe("true");
    component.stop();
    expect($("#s").getAttribute("aria-busy")).toBe("false");
  });
});

it("Toast reopens after pause and still auto-hides", async () => {
  vi.useFakeTimers();
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false });
  document.body.innerHTML = '<div id="toast" data-delay="1000"></div>';
  const component = track(new Toast($("#toast")));
  component.show();
  $("#toast").dispatchEvent(new Event("mouseenter"));
  component.hide(); component.show();
  await vi.advanceTimersByTimeAsync(500);
  expect(component.isOpen).toBe(true);
  expect($("#toast").style.display).not.toBe("none");
  expect($("#toast").classList.contains("is-paused")).toBe(false);
  await vi.advanceTimersByTimeAsync(1000);
  expect(component.isOpen).toBe(false);
  expect($("#toast").style.display).toBe("none");
});
