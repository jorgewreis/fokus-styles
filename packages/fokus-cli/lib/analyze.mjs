import fs from "node:fs/promises";
import zlib from "node:zlib";
import { promisify } from "node:util";

const gzip = promisify(zlib.gzip);

function fmtKb(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

// Versão genérica (sem budgets fixos) de scripts/size.mjs — mede qualquer
// arquivo CSS/JS que o consumidor aponte, não só as distribuições internas
// do monorepo.
export async function analyzeFiles(filePaths) {
  const results = [];

  for (const filePath of filePaths) {
    const raw = await fs.readFile(filePath);
    const gzipped = await gzip(raw, { level: 9 });
    results.push({ path: filePath, bytes: raw.length, gzipBytes: gzipped.length });
  }

  return results;
}

export function formatReport(results) {
  const lines = [
    ["Arquivo".padEnd(32), "Bruto".padStart(10), "Gzip".padStart(10)].join("  "),
  ];

  for (const r of results) {
    lines.push([r.path.padEnd(32), fmtKb(r.bytes).padStart(10), fmtKb(r.gzipBytes).padStart(10)].join("  "));
  }

  return lines.join("\n");
}
