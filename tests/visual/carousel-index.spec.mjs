import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const script = buildSync({
  stdin: {
    contents: 'import { Carousel } from "./packages/fokus-js/js/carousel.js"; window.Carousel = Carousel;',
    resolveDir: root,
  },
  bundle: true,
  write: false,
  format: "iife",
}).outputFiles[0].text;

test("invalid Carousel indices preserve the accessible slide and later keyboard navigation", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="pt-BR"><title>Carousel indices</title><body>
    <main><h1>Destaques</h1><div class="fs-carousel" aria-label="Destaques">
      <div class="fs-carousel-inner">
        <div class="fs-carousel-item is-active">Primeiro slide</div>
        <div class="fs-carousel-item">Segundo slide</div>
        <div class="fs-carousel-item">Terceiro slide</div>
      </div>
    </div></main></body></html>`);
  await page.addStyleTag({ path: `${root}dist/css/fokus.css` });
  await page.addScriptTag({ content: script });

  const result = await page.evaluate(() => {
    const el = document.querySelector(".fs-carousel");
    const instance = new window.Carousel(el);
    instance.goTo(1);
    let events = 0;
    el.addEventListener("fs:shown", () => events++);
    el.addEventListener("fs:carousel:slid", () => events++);
    for (const value of [NaN, Infinity, -Infinity, 0.5, -1.5, "", "2", null, undefined, true]) {
      instance.goTo(value);
      window.Carousel.goTo(el, value);
    }
    return { events, index: instance.index };
  });
  expect(result).toEqual({ events: 0, index: 1 });

  const carousel = page.getByRole("group", { name: "Destaques" });
  await expect(carousel.locator(".is-active")).toHaveText("Segundo slide");
  await expect(carousel.locator('[aria-hidden="false"]:not([inert])')).toHaveCount(1);
  await carousel.focus();
  await page.keyboard.press("ArrowRight");
  await expect(carousel.locator(".is-active")).toHaveText("Terceiro slide");
  await page.keyboard.press("ArrowRight");
  await expect(carousel.locator(".is-active")).toHaveText("Primeiro slide");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()).violations).toEqual([]);
});
