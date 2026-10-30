import { defineConfig, devices } from "@playwright/test";

// Keep Chromium screenshot baselines in playwright.config.mjs unchanged.
// This matrix exercises behavior and axe, not cross-engine pixel equivalence.
export default defineConfig({
  testDir: "tests",
  testMatch: ["browser/**/*.spec.mjs", "a11y/**/*.spec.mjs", "visual/**/*.spec.mjs"],
  testIgnore: ["visual/mockups.spec.mjs"],
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: { trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
