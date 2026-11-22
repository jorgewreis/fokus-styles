import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    // Keep browser storage owned by jsdom, not Node 26 native Web Storage.
    execArgv: ["--no-experimental-webstorage"],
    include: ["tests/unit/**/*.test.js"],
    setupFiles: ["tests/setup.js"],
  },
});
