import { spawnSync } from "node:child_process";

export const VISUAL_BASELINE_DIRECTORY = "tests/visual/mockups.spec.mjs-snapshots/";

export function validateVisualBaselinePaths(paths) {
  if (!Array.isArray(paths) || paths.length === 0) {
    throw new Error("No visual baseline files were staged.");
  }

  const invalid = paths.filter((originalPath) => {
    if (typeof originalPath !== "string" || originalPath.length === 0) return true;
    const normalized = originalPath.replaceAll("\\", "/");
    return normalized.startsWith("/")
      || normalized.split("/").includes("..")
      || !normalized.startsWith(VISUAL_BASELINE_DIRECTORY)
      || !normalized.slice(VISUAL_BASELINE_DIRECTORY.length).endsWith(".png");
  });

  if (invalid.length > 0) {
    throw new Error(`Unexpected visual baseline paths: ${invalid.join(", ")}`);
  }
  return paths;
}

if (process.argv.includes("--staged")) {
  const result = spawnSync("git", ["diff", "--cached", "--name-only", "-z"], { encoding: "utf8" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || "Could not inspect staged changes.");
  const paths = result.stdout.split("\0").filter(Boolean);
  validateVisualBaselinePaths(paths);
  console.log(`Validated ${paths.length} staged visual baseline file(s).`);
}
