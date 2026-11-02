import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const exampleUrl = `file://${path.join(rootDir, "mockup", "examples", "popover.html")}`;

for (const theme of ["light", "dark"]) {
  test(`popover demonstra slots, foco e responsividade (${theme})`, async ({ page }) => {
    await page.goto(`${exampleUrl}?theme=${theme}`);
    const trigger = page.locator('[data-fs-target="#pop-actions"]');
    await trigger.click();
    await expect(page.locator("#pop-actions")).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#pop-actions .fs-popover-arrow")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#pop-actions")).toBeHidden();
    await expect(trigger).toBeFocused();

    await page.locator('[data-fs-target="#pop-focus"]').focus();
    await expect(page.locator("#pop-focus")).toBeVisible();
    await page.locator("#pop-focus [data-fs-dismiss='popover']").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#pop-focus")).toBeHidden();

    await page.click("#manual-trigger");
    await expect(page.locator("#pop-manual")).toBeVisible();
    await expect(page.locator("#pop-manual")).toHaveAttribute("data-placement", "left");

    await page.click("#toggle-direction");
    await expect(page.locator(".demo-page")).toHaveAttribute("dir", "rtl");
    await page.setViewportSize({ width: 320, height: 800 });
    expect(await page.locator("body").evaluate((body) => body.scrollWidth > body.clientWidth)).toBe(false);
  });
}

test("focus-trigger Escape does not reopen the popover while restoring focus", async ({ page }) => {
  await page.goto(`${exampleUrl}?theme=light`);
  const trigger = page.locator('[data-fs-target="#pop-focus"]');
  const panel = page.locator("#pop-focus");

  await trigger.focus();
  await expect(panel).toBeVisible();
  await panel.locator('[data-fs-dismiss="popover"]').focus();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.evaluate((element) => element.blur());
  await trigger.focus();
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();

  await trigger.evaluate((element) => element.blur());
  await trigger.focus();
  await expect(panel).toBeVisible();
});

test("dismiss clears focus suppression if the trigger cannot receive focus", async ({ page }) => {
  await page.goto(`${exampleUrl}?theme=light`);
  const trigger = page.locator('[data-fs-target="#pop-focus"]');
  const panel = page.locator("#pop-focus");
  const dismiss = panel.locator('[data-fs-dismiss="popover"]');

  await trigger.focus();
  await dismiss.focus();
  await trigger.evaluate((element) => {
    element.disabled = true;
  });
  await dismiss.press("Enter");
  await expect(panel).toBeHidden();

  await trigger.evaluate((element) => {
    element.disabled = false;
  });
  await trigger.focus();
  await expect(panel).toBeVisible();
});
