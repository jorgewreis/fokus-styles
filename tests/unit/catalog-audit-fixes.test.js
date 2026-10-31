import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { DataTable } from "../../packages/fokus-js/js/datatable.js";
import { Datepicker } from "../../packages/fokus-js/js/datepicker.js";
import { Select } from "../../packages/fokus-js/js/select.js";
import { NotificationCenter } from "../../packages/fokus-js/js/notification-center.js";
import { Toast } from "../../packages/fokus-js/js/toast.js";

const read = (component, id, ext) => readFileSync(`docs/catalog/fixtures/${component}/${id}.${ext}`, "utf8");
function run(component, id, bindings) {
  const source = read(component, id, "js").replace(/^import[^\n]+\n/, "");
  new Function(...Object.keys(bindings), source)(...Object.values(bindings));
}
const dispose = () => window.dispatchEvent(new Event("pagehide"));
afterEach(() => { dispose(); document.body.innerHTML = ""; vi.restoreAllMocks(); });

for (const [component, Constructor, forbidden] of [
  ["datepicker", Datepicker, "gridEl"],
  ["select", Select, "toggleEl"],
  ["notification-center", NotificationCenter, "toastContainer"],
]) {
  it(`${component} basic uses public DOM and cleans up/reinitializes without undocumented instance fields`, () => {
    document.body.innerHTML = read(component, "basic", "html");
    const root = document.querySelector(`[data-fs="${component}"]`);
    for (let cycle = 0; cycle < 2; cycle++) {
      const instance = new Constructor(root);
      // Exercise the real runtime; restrict only the fixture's view of the instance.
      const publicView = new Proxy(instance, {
        get(target, key) {
          if (key === forbidden) throw new Error(`Undocumented field: ${key}`);
          const value = Reflect.get(target, key, target);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
      const bindings = { [Constructor.name]: { getInstance: () => publicView }, Toast };
      run(component, "basic", bindings);
      let toasts = [];
      if (component === "datepicker") {
        instance.show();
        expect(instance.panelEl.querySelector('[role="grid"]').getAttribute("aria-label")).toBe("Data de entrega");
      }
      if (component === "select") {
        const button = root.nextElementSibling.querySelector("button");
        expect(button.getAttribute("aria-labelledby")).toBe(`catalog-country-label ${button.id}`);
        button.click();
        expect(instance.isOpen).toBe(true);
      }
      if (component === "notification-center") {
        document.getElementById("demo-notification").click();
        toasts = [...document.querySelectorAll("#demo-toast-container .fs-toast")];
        expect(toasts).toHaveLength(1);
        expect(Toast.getInstance(toasts[0])).toBeDefined();
      }
      dispose();
      expect(Constructor.getInstance(root)).toBeUndefined();
      if (component === "notification-center") {
        expect(document.querySelectorAll("#demo-toast-container .fs-toast")).toHaveLength(0);
        for (const toast of toasts) expect(Toast.getInstance(toast)).toBeUndefined();
        document.getElementById("demo-notification").click();
        expect(document.querySelectorAll("#demo-toast-container .fs-toast")).toHaveLength(0);
      }
    }
  });
}

it("DataTable states executes actual initializer and removes all local callbacks across repeated reinit", () => {
  document.body.innerHTML = read("datatable", "states", "html");
  const root = document.querySelector("[data-fs=datatable]");
  for (let cycle = 0; cycle < 3; cycle++) {
    run("datatable", "states", { DataTable });
    const instance = DataTable.getInstance(root);
    const loading = vi.spyOn(instance, "setLoading");
    const error = vi.spyOn(instance, "setError");
    document.querySelector("#load").click();
    expect(loading).toHaveBeenCalledExactlyOnceWith(true);
    expect(root.querySelector("table").getAttribute("aria-busy")).toBe("true");
    document.querySelector("#error").click();
    expect(error).toHaveBeenCalledExactlyOnceWith("Falha demonstrativa. Tente recuperar.");
    document.querySelector("#recover").click();
    expect(loading).toHaveBeenLastCalledWith(false);
    expect(error).toHaveBeenLastCalledWith(null);
    expect(root.querySelector("table").hidden).toBe(false);
    dispose();
    expect(DataTable.getInstance(root)).toBeUndefined();
    loading.mockClear(); error.mockClear();
    for (const id of ["load", "error", "recover"]) document.getElementById(id).click();
    expect(loading).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  }
});

it("catalog retains the documented 90-example baseline after additive expansions", () => {
  const examples = JSON.parse(readFileSync("docs/catalog/examples.json", "utf8"));
  expect(Object.values(examples).reduce((total, entries) => total + entries.length, 0)).toBeGreaterThanOrEqual(90);
  expect(readFileSync("docs/catalog/VISUAL-VARIANTS.md", "utf8")).toContain("**90 exemplos**");
});
