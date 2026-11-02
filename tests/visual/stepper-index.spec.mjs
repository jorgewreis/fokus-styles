import { test, expect } from "@playwright/test";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const script = buildSync({
  stdin: {
    contents: 'import { Stepper } from "./packages/fokus-js/js/stepper.js"; window.stepper = new Stepper(document.querySelector(".fs-stepper"));',
    resolveDir: root,
  },
  bundle: true,
  write: false,
  format: "iife",
}).outputFiles[0].text;

test("invalid programmatic indices preserve the active Stepper and valid controls still work", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Stepper index</title><body><main>
    <div class="fs-stepper"><div class="fs-stepper-header" role="list">
      <div class="fs-step fs-step-active">Um</div><div class="fs-step">Dois</div>
    </div><div class="fs-stepper-content">
      <section class="fs-step-panel is-active">Conteúdo um</section><section class="fs-step-panel">Conteúdo dois</section>
    </div><div class="fs-stepper-actions"><button data-stepper="prev">Voltar</button><button data-stepper="next">Avançar</button></div></div>
  </main></body></html>`);
  await page.addStyleTag({ path: `${root}dist/css/fokus.css` });
  await page.addScriptTag({ content: script });

  const invalidResults = await page.evaluate(() => {
    const el = document.querySelector(".fs-stepper");
    const snapshot = el.innerHTML;
    const events = [];
    for (const name of ["beforechange", "changed", "completed"]) {
      el.addEventListener(`fs:stepper:${name}`, () => events.push(name));
    }
    const results = [NaN, Infinity, -Infinity, 0.5, "1", undefined].map((value) => window.stepper.goTo(value));
    return { results, snapshotUnchanged: el.innerHTML === snapshot, current: window.stepper.current, events };
  });
  expect(invalidResults).toEqual({ results: [false, false, false, false, false, false], snapshotUnchanged: true, current: 0, events: [] });

  await page.locator('[data-stepper="next"]').click();
  await expect(page.locator(".fs-step-active")).toHaveText("Dois");
  await expect(page.locator(".fs-step-panel.is-active")).toHaveText("Conteúdo dois");
});
