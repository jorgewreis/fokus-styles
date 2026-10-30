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
    // The main document applies the requested theme during startup. Wait for
    // its running color transitions; offscreen iframe animations may be
    // rendering-throttled and must not block this synchronization. Axe still
    // audits the complete page, including its frames and animated examples.
    await page.evaluate(async () => {
      const transitions = document.getAnimations().filter((animation) =>
        animation instanceof CSSTransition && animation.playState === "running");
      await Promise.all(transitions.map((animation) => animation.finished.catch(() => {})));
    });

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
