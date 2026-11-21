import { defineConfig, devices } from "@playwright/test";

const desktop = devices["Desktop Chrome"];
const crossBrowserTests = ["**/a11y/**/*.spec.mjs", "**/visual/interactions.spec.mjs"];

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: process.env.CI
    ? [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]]
    : "list",
  use: {
    ...desktop,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  snapshotPathTemplate: "{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{platform}{ext}",
  projects: [
    {
      name: "chromium",
      outputDir: "test-results/chromium",
      use: { ...desktop, browserName: "chromium" },
    },
    {
      name: "firefox",
      outputDir: "test-results/firefox",
      testMatch: crossBrowserTests,
      use: { ...desktop, browserName: "firefox" },
    },
    {
      name: "webkit",
      outputDir: "test-results/webkit",
      testMatch: crossBrowserTests,
      use: { ...desktop, browserName: "webkit" },
    },
  ],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
});
