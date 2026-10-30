import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const mockupDir = path.join(rootDir, "mockup");
const mockups = readdirSync(mockupDir).filter((file) => file.endsWith(".html"));
const examplesDir = path.join(mockupDir, "examples");
const examples = readdirSync(examplesDir).filter((file) => file.endsWith(".html"));

for (const file of [...mockups, ...examples.map((file) => `examples/${file}`)]) {
  for (const theme of file.startsWith("examples/") || file === "kitchen-sink.html" ? ["light"] : ["light", "dark"]) {
  test(`${file} (${theme}) não tem violações de A11y (axe, WCAG 2.1 AA)`, async ({ page }) => {
    await page.goto(`file://${path.join(mockupDir, file)}?theme=${theme}`);
    // Theme initialization can start finite CSS color transitions. Audit the
    // settled UI, not an arbitrary 200ms sample of interpolated light/dark.
    // Continuous animations are deliberately NOT disabled or awaited.
    for (const frame of page.frames()) {
      await frame.evaluate(async () => {
        await document.fonts.ready;
        const finite = document.getAnimations().filter((animation) =>
          animation.effect?.getComputedTiming().endTime !== Infinity);
        await Promise.all(finite.map((animation) => animation.finished.catch(() => {})));
      });
    }

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const details = results.violations
      .map((v) => `${v.id} (${v.impact}): ${v.nodes.length} nó(s) — ${v.helpUrl}`)
      .join("\n");

    expect(results.violations, `Violações de A11y em ${file}:\n${details}`).toHaveLength(0);
  });
  }
}
