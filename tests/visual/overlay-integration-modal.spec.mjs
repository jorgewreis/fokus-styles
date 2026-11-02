import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));

async function mount(page) {
  await page.setContent(`<!doctype html><html lang="en"><head><title>Modal regression</title></head><body>
    <main id="app">
      <button id="open" class="fs-btn" data-fs-target="#outer">Open</button>
      <a id="background" href="#outside">Background</a>
      <section id="outer" class="fs-modal"><div class="fs-modal-dialog">
        <h2 class="fs-modal-title">Parent dialog</h2>
        <button id="child-open" class="fs-btn" data-fs-target="#child">Child</button>
        <button id="menu-toggle" class="fs-dropdown-toggle" data-fs-target="#menu">Actions</button>
        <div id="menu" class="fs-dropdown-menu">
          <button class="fs-dropdown-item">First</button>
          <button class="fs-dropdown-item">Second</button>
        </div>
        <button id="close" class="fs-btn" data-fs-dismiss="modal">Close</button>
      </div></section>
      <section id="child" class="fs-modal"><div class="fs-modal-dialog">
        <h2 class="fs-modal-title">Child dialog</h2>
        <button id="child-close" class="fs-btn" data-fs-dismiss="modal">Close child</button>
      </div></section>
    </main>
    <aside id="already-hidden" aria-hidden="true" inert>Unrelated hidden region</aside>
    </body></html>`);
  await page.addStyleTag({ path: path.join(root, "dist/css/fokus.css") });
  await page.addScriptTag({ path: path.join(root, "dist/js/fokus.js") });
  await page.evaluate(() => {
    window.FokusStyles.Modal.getOrCreateInstance(document.querySelector("#open"));
    window.FokusStyles.Modal.getOrCreateInstance(document.querySelector("#child-open"));
    window.FokusStyles.Dropdown.getOrCreateInstance(document.querySelector("#menu-toggle"));
  });
}

for (const theme of ["light", "dark"]) {
  test.describe(theme, () => {
    test.beforeEach(async ({ page }) => {
      await mount(page);
      await page.locator("html").evaluate((el, value) => el.dataset.theme = value, theme);
    });

    test("nested DOM modal traps Tab and restores pre-existing inert state after repeated dismissals", async ({ page }) => {
      for (let attempt = 0; attempt < 2; attempt++) {
        await page.locator("#open").click();
        await expect(page.locator("#child-open")).toBeFocused();
        await expect(page.locator("#background")).toHaveAttribute("inert", "");
        await expect(page.locator("#app")).not.toHaveAttribute("inert", "");
        await page.keyboard.press("Shift+Tab");
        await expect(page.locator("#close")).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(page.locator("#child-open")).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(page.locator("#open")).toBeFocused();
        await expect(page.locator("#outer")).not.toHaveClass(/is-open/);
        await expect(page.locator("#background")).not.toHaveAttribute("inert", "");
        await expect(page.locator("#already-hidden")).toHaveAttribute("aria-hidden", "true");
        await expect(page.locator("#already-hidden")).toHaveAttribute("inert", "");
      }
    });

    test("Escape closes only top dialog and restores parent focus then original trigger", async ({ page }) => {
      await page.locator("#open").click();
      await page.locator("#child-open").click();
      await expect(page.locator("#child-close")).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(page.locator("#child")).not.toHaveClass(/is-open/);
      await expect(page.locator("#outer")).toHaveClass(/is-open/);
      await expect(page.locator("#child-open")).toBeFocused();
      await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
      await page.keyboard.press("Escape");
      await expect(page.locator("#open")).toBeFocused();
      await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    });

    test("dropdown stays inside dialog isolation and consumes its own Escape", async ({ page }) => {
      await page.locator("#open").click();
      await page.locator("#menu-toggle").click();
      const items = page.locator("#menu .fs-dropdown-item");
      await expect(items.first()).toBeFocused();
      expect(await page.locator("#menu").evaluate(el => !!el.closest(".fs-modal-dialog"))).toBe(true);
      expect(await page.locator("#menu").evaluate(el => !!el.closest("[inert]"))).toBe(false);
      await page.keyboard.press("ArrowDown");
      await expect(items.nth(1)).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(page.locator("#menu")).not.toHaveClass(/is-open/);
      await expect(page.locator("#outer")).toHaveClass(/is-open/);
      await expect(page.locator("#menu-toggle")).toBeFocused();
      await page.locator("#close").click();
      await expect(page.locator("#open")).toBeFocused();
    });
  });
}
