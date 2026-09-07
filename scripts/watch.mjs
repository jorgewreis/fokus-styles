import { fileURLToPath } from "node:url";
import path from "node:path";
import chokidar from "chokidar";
import { spawn } from "node:child_process";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const buildScript = path.join(rootDir, "scripts", "build.mjs");

let building = false;
let pending = false;

function build() {
  if (building) {
    pending = true;
    return;
  }

  building = true;
  const child = spawn(process.execPath, [buildScript], { stdio: "inherit" });

  child.on("exit", () => {
    building = false;
    if (pending) {
      pending = false;
      build();
    }
  });
}

const watcher = chokidar.watch(["scss/**/*.scss", "packages/*/scss/**/*.scss", "packages/fokus-js/js/**/*.js"], {
  cwd: rootDir,
  ignoreInitial: true,
});

watcher.on("all", (event, file) => {
  console.log(`[watch] ${event}: ${file}`);
  build();
});

console.log("Observando scss/, packages/*/scss e packages/fokus-js/js para rebuild automático...");
build();
