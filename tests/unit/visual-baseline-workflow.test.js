import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import yaml from "js-yaml";

const workflow = yaml.load(readFileSync(path.resolve(".github/workflows/update-visual-baselines.yml"), "utf8"));

describe("visual baseline update workflow security", () => {
  it("only runs manually and rejects dispatches outside main", () => {
    expect(Object.keys(workflow.on)).toEqual(["workflow_dispatch"]);
    const validation = workflow.jobs.validate_dispatch.steps[0].run;
    expect(validation).toContain('"refs/heads/main"');
    expect(workflow.jobs.update.needs).toBe("validate_dispatch");
  });

  it("uses SHA-pinned Actions and least-privilege job permissions", () => {
    const actionSteps = Object.values(workflow.jobs)
      .flatMap((job) => job.steps ?? [])
      .filter((step) => step.uses);
    expect(actionSteps.length).toBeGreaterThan(0);
    for (const step of actionSteps) {
      expect(step.uses).toMatch(/^[^@]+@[a-f0-9]{40}$/);
    }

    expect(workflow.permissions).toEqual({ contents: "read" });
    expect(workflow.jobs.update.permissions).toEqual({ contents: "read" });
    expect(workflow.jobs.open_pull_request.permissions).toEqual({ contents: "write", "pull-requests": "write" });
  });

  it("validates the snapshot allowlist and opens a review PR instead of updating main", () => {
    const updateRun = workflow.jobs.update.steps.find((step) => step.name === "Validate and export snapshot patch").run;
    expect(updateRun).toContain("git add -- tests/visual/mockups.spec.mjs-snapshots/");
    expect(updateRun).toContain("validate-visual-baseline-paths.mjs --staged");

    const publishCommands = workflow.jobs.open_pull_request.steps.map((step) => step.run ?? "").join("\n");
    expect(publishCommands).toContain('git push --set-upstream origin "$branch"');
    expect(publishCommands).toContain("gh pr create");
    expect(publishCommands).toContain("--base main");
    expect(publishCommands).not.toMatch(/git push(?:\s+[^\n]*)?\s+main/);
  });
});
