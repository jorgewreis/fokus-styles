import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));

async function mount(page, component, tag = "button") {
  await page.setContent(`<!doctype html><html lang="en"><head><title>Portal regression</title></head><body>
    <button id="open" data-fs-target="#modal">Open</button>
    <div id="modal" class="fs-modal"><div class="fs-modal-dialog"><div class="fs-modal-content">
      <h2>Dialog</h2><button id="first">First</button><div data-fs-theme="dark">
      <${tag} id="trigger" title="Help" data-fs-target="#popup">${tag === "button" ? "Popup" : ""}</${tag}>
      <div id="popup" class="${component === "Popover" ? "fs-popover" : "fs-dropdown-menu"}"><button class="fs-dropdown-item">Choice</button></div>
      </div></div></div></div></body></html>`);
  await page.addStyleTag({ path: path.join(root, "dist/css/fokus.css") });
  await page.addScriptTag({ path: path.join(root, "dist/js/fokus.js") });
  await page.evaluate(({ component }) => {
    window.dialog = new window.FokusStyles.Modal(document.querySelector("#open"));
    window.popup = new window.FokusStyles[component](document.querySelector("#trigger"));
  }, { component });
}
for (const [component, tag, key] of [
  ["Datepicker", "input", "panelEl"], ["Combobox", "input", "listboxEl"],
  ["Popover", "button", "popoverEl"], ["NestedMenu", "button", "rootMenu"],
  ["Tooltip", "button", "tooltipEl"],
]) {
  test(`${component}: visible and interactive inside Modal; Escape preserves parent`, async ({ page }) => {
    await mount(page, component, tag);
    await page.locator("#open").click();
    await page.locator("#trigger").focus();
    await page.evaluate(() => window.popup.show());
    const panel = page.locator(component === "Tooltip" ? ".fs-tooltip" : "#popup");
    await expect(panel).toBeVisible();
    expect(await page.evaluate((key) => !!window.popup[key].closest("[inert], [aria-hidden='true']"), key)).toBe(false);
    await expect(panel).toHaveAttribute("data-fs-theme", "dark");
    if (component !== "Tooltip") {
      const button = panel.locator("button:not([disabled])").first();
      await button.focus();
      await expect(button).toBeFocused();
    }
    await page.keyboard.press("Escape");
    await expect(panel).not.toHaveClass(/is-open/);
    await expect(page.locator("#modal")).toHaveClass(/is-open/);
    await page.keyboard.press("Escape");
    await expect(page.locator("#modal")).not.toHaveClass(/is-open/);
  });
}

test("CommandPalette Escape dismisses top overlay only", async ({ page }) => {
  await mount(page, "Popover");
  await page.evaluate(() => {
    window.popup.dispose();
    document.querySelector("#trigger").dataset.fsTarget = "#commands";
    document.body.insertAdjacentHTML("beforeend", `<section id="commands" class="fs-command-palette"><div class="fs-command-palette-dialog">
      <input class="fs-command-palette-input"><ul class="fs-command-palette-list"><li class="fs-dropdown-item">Action</li></ul>
    </div></section>`);
    window.commands = new window.FokusStyles.CommandPalette(document.querySelector("#trigger"));
  });
  await page.locator("#open").click();
  await page.locator("#trigger").click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#commands")).not.toHaveClass(/is-open/);
  await expect(page.locator("#modal")).toHaveClass(/is-open/);
  await expect(page.locator("#trigger")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#modal")).not.toHaveClass(/is-open/);
});

test("popup coordinates stay aligned inside a positioned right Offcanvas", async ({ page }) => {
  await mount(page, "Combobox", "input");
  await page.evaluate(() => {
    window.popup.dispose();
    window.dialog.dispose();
    const panel = document.querySelector("#modal");
    panel.className = "fs-offcanvas fs-offcanvas-end";
    window.dialog = new window.FokusStyles.Offcanvas(document.querySelector("#open"));
    window.popup = new window.FokusStyles.Combobox(document.querySelector("#trigger"));
  });
  await page.locator("#open").click();
  // Finish CSS transitions before asserting geometric placement.
  await page.evaluate(async () => {
    await Promise.all(document.getAnimations().filter(animation => animation instanceof CSSTransition).map(animation => animation.finished));
    window.popup.show();
  });
  const reference = await page.locator("#trigger").boundingBox();
  const popup = await page.locator("#popup").boundingBox();
  expect(Math.abs(popup.x - reference.x)).toBeLessThan(2);
  expect(Math.abs(popup.y - (reference.y + reference.height + 4))).toBeLessThan(2);
});
