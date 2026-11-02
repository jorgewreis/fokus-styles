import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const examplesDir = path.join(rootDir, "mockup", "examples");

async function expectNoA11yViolations(page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const details = results.violations.map((violation) => `${violation.id}: ${violation.nodes.length}`).join(", ");
  expect(results.violations, details).toHaveLength(0);
}

test("open focus-trigger popover has no axe violations", async ({ page }) => {
  await page.goto(`file://${path.join(examplesDir, "popover.html")}?theme=light`);
  const trigger = page.locator('[data-fs-target="#pop-focus"]');
  await trigger.focus();
  await expect(page.locator("#pop-focus")).toBeVisible();
  await expectNoA11yViolations(page);
});

test("open datepicker has no axe violations", async ({ page }) => {
  await page.goto(`file://${path.join(examplesDir, "datepicker.html")}?theme=light`);
  await page.locator("#datepicker-claro").focus();
  await expect(page.locator("#datepicker-claro-panel")).toBeVisible();
  await expectNoA11yViolations(page);
});
