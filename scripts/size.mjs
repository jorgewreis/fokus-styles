import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import zlib from "node:zlib";
import { promisify } from "node:util";

const gzip = promisify(zlib.gzip);

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(rootDir, "dist");
const outFile = path.join(rootDir, "docs", "reference", "size-baseline.json");

// Arquivos minificados publicados que compõem as distribuições do pacote
// (ver `exports`/`files` em package.json). Servem de base para os budgets
// de tamanho (gate no CI).
const targets = [
  "css/layout.min.css",
  "css/forms.min.css",
  "css/components.min.css",
  "css/helpers.min.css",
  "css/fonts.min.css",
  "css/fokus.min.css",
  "js/fokus.min.js",
];

// Budgets gzip (bytes) — `layout` é a distribuição "core" (reset/base/grid/
// tokens). `forms`/`helpers`/`fonts` não têm teto próprio; ficam de fora do
// gate (só informativos abaixo).
//
// `js/fokus.min.js`: 24.25 KB — cobre o bundle JS completo (Combobox,
// Datepicker, DataTable, Command Palette, Tree View e o restante dos
// componentes interativos).
const budgets = {
  "css/layout.min.css": 12 * 1024,
  "css/components.min.css": 18 * 1024,
  "css/fokus.min.css": 32 * 1024,
  "js/fokus.min.js": 24.25 * 1024,
};

const check = process.argv.includes("--check");

async function measure(relPath) {
  const abs = path.join(distDir, relPath);
  const raw = await fs.readFile(abs);
  const gzipped = await gzip(raw, { level: 9 });
  return { path: relPath, bytes: raw.length, gzipBytes: gzipped.length };
}

function fmtKb(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

async function run() {
  const results = await Promise.all(targets.map(measure));

  console.log("Tamanho das distribuições (dist/, minificado):\n");
  console.log(
    [
      "Arquivo".padEnd(24),
      "Bruto".padStart(10),
      "Gzip".padStart(10),
      "Budget".padStart(10),
    ].join("  "),
  );

  let overBudget = 0;
  for (const r of results) {
    const budget = budgets[r.path];
    const status = budget === undefined ? "" : r.gzipBytes > budget ? "✗" : "✓";
    if (budget !== undefined && r.gzipBytes > budget) overBudget += 1;
    console.log(
      [
        r.path.padEnd(24),
        fmtKb(r.bytes).padStart(10),
        fmtKb(r.gzipBytes).padStart(10),
        (budget === undefined ? "-" : `${status} ${fmtKb(budget)}`).padStart(10),
      ].join("  "),
    );
  }

  console.log(
    `\n${overBudget} de ${Object.keys(budgets).length} distribuições com budget acima do limite.`,
  );

  if (overBudget > 0 && check) {
    console.error("\n--check: budget de tamanho estourado é um erro de build.");
    process.exitCode = 1;
  }

  const baseline = {
    measuredAt: new Date().toISOString(),
    unit: "bytes",
    files: Object.fromEntries(
      results.map((r) => [r.path, { bytes: r.bytes, gzipBytes: r.gzipBytes }]),
    ),
  };

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(`\nBaseline registrada em ${path.relative(rootDir, outFile)}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
