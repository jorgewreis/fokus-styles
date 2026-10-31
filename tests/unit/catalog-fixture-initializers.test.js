import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { JSDOM, VirtualConsole } from "jsdom";
import { expect, it } from "vitest";
const examples = JSON.parse(readFileSync("docs/catalog/examples.json", "utf8"));
for (const [id, entries] of Object.entries(examples)) {
  for (const entry of entries.filter(entry => entry.js)) {
    it(`${id}: actual bundled initializer mounts, cleans up and mounts again in isolation`, () => {
      const errors = [];
      const virtualConsole = new VirtualConsole();
      virtualConsole.on("jsdomError", error => errors.push(error.message));
      const dom = new JSDOM(`<!doctype html><html lang="pt-BR"><title>${id}</title><body>${readFileSync(entry.html, "utf8")}</body></html>`, {
        runScripts: "outside-only", pretendToBeVisual: true, url: "https://catalog.test/", virtualConsole,
      });
      const { window } = dom;
      window.matchMedia = query => ({ matches: query.includes("reduced-motion"), media: query, addEventListener() {}, removeEventListener() {} });
      window.Element.prototype.scrollIntoView = () => {};
      window.URL.createObjectURL = () => "blob:fixture";
      window.URL.revokeObjectURL = () => {};
      Object.defineProperty(window.document, "readyState", { value: "complete" });
      const js = execFileSync(process.execPath, ["--input-type=module", "-e",
        'import { buildSync } from "esbuild"; process.stdout.write(buildSync({ entryPoints: [process.argv[1]], bundle: true, write: false, format: "iife" }).outputFiles[0].text);', entry.js,
      ], { encoding: "utf8" });
      try {
        for (let iteration = 0; iteration < 2; iteration++) {
          window.eval(js);
          if (id === "select" && entry.id === "basic") {
            const button = window.document.querySelector("button.fs-form-select");
            expect(button.getAttribute("aria-labelledby")).toContain("catalog-country-label");
          }
          if (id === "datepicker" && entry.id === "basic") expect(window.document.querySelector('[role="grid"]').getAttribute("aria-label")).toBe("Data de entrega");
          window.dispatchEvent(new window.Event("pagehide"));
        }
        expect(errors).toEqual([]);
      } finally { window.close(); }
    });
  }
}
