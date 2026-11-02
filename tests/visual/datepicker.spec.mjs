import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const exampleUrl = `file://${path.join(rootDir, "mockup", "examples", "datepicker.html")}`;

test("disabled date cannot be activated by Enter or Space, while keyboard navigation remains available", async ({ page }) => {
  await page.goto(`${exampleUrl}?theme=light`);
  const input = page.locator("#datepicker-claro");
  const panel = page.locator("#datepicker-claro-panel");
  await input.focus();
  await expect(panel).toBeVisible();

  const disabledDay = panel.locator('.fs-datepicker-day[data-year="2026"][data-month="6"][data-day="10"]');
  await disabledDay.evaluate((element) => {
    element.disabled = true;
  });

  for (const key of ["Enter", " "]) {
    await disabledDay.dispatchEvent("keydown", { key, bubbles: true });
    await expect(input).toHaveValue("15/07/2026");
    await expect(panel).toBeVisible();
  }

  await panel.evaluate((element) => {
    const fieldset = document.createElement("fieldset");
    fieldset.disabled = true;
    element.parentNode.insertBefore(fieldset, element);
    fieldset.appendChild(element);
  });
  await disabledDay.dispatchEvent("keydown", { key: "Enter", bubbles: true });
  await expect(input).toHaveValue("15/07/2026");
  await expect(panel).toBeVisible();

  await panel.evaluate((element) => {
    const fieldset = element.parentElement;
    element.remove();
    fieldset.remove();
    document.body.appendChild(element);
  });
  await disabledDay.evaluate((element) => {
    element.disabled = true;
  });

  await disabledDay.dispatchEvent("keydown", { key: "ArrowRight", bubbles: true });
  await expect(panel.locator('.fs-datepicker-day[data-year="2026"][data-month="6"][data-day="11"]')).toBeFocused();
  await panel.locator('.fs-datepicker-day[data-year="2026"][data-month="6"][data-day="11"]').dispatchEvent("keydown", {
    key: "PageDown",
    bubbles: true,
  });
  await expect(panel.locator(".fs-datepicker-title")).toHaveText(/agosto(?: de)? 2026/i);
});
