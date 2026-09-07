import { fileURLToPath } from "node:url";
import path from "node:path";
import * as sass from "sass";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const packagesDir = path.join(rootDir, "packages");
const reportEntry = path.join(rootDir, "scripts", "contrast-report.scss");

const scssLoadPaths = [
  path.join(packagesDir, "fokus-core", "scss"),
  path.join(packagesDir, "fokus-components", "scss"),
  path.join(packagesDir, "fokus-utilities", "scss"),
];

const strict = process.argv.includes("--strict");

const rows = [];
sass.compile(reportEntry, {
  loadPaths: scssLoadPaths,
  logger: {
    debug(message) {
      const [id, ratio, aa, aaa] = message.split("|");
      rows.push({ id, ratio: Number(ratio), aa, aaa });
    },
  },
});

const idWidth = Math.max(...rows.map((r) => r.id.length));
console.log("Relatório de contraste WCAG (docs/reference/contrast-report.md):\n");
console.log(
  ["Par".padEnd(idWidth), "Ratio".padStart(6), "AA", "AAA"].join("  "),
);

let failures = 0;
for (const row of rows) {
  if (row.aa === "FAIL") failures += 1;
  const marker = row.aa === "FAIL" ? "✗" : "✓";
  console.log(
    [
      row.id.padEnd(idWidth),
      row.ratio.toFixed(2).padStart(6),
      `${marker} ${row.aa}`.padEnd(7),
      row.aaa,
    ].join("  "),
  );
}

console.log(
  `\n${rows.length} pares checados, ${failures} abaixo do mínimo AA (4.5:1 texto / 3:1 UI/texto grande).`,
);

if (failures > 0 && strict) {
  console.error("\n--strict: falhas de contraste AA são um erro de build.");
  process.exitCode = 1;
}
