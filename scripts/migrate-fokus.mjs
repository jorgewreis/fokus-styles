#!/usr/bin/env node
// Codemod da migração Clarus 1.x → Fokus Styles 2.0. Reescreve, em arquivos
// HTML/JS consumidores, os identificadores públicos que mudaram no rebranding.
// Não faz parte do build do framework.
//
// Uso:
//   node migrate-fokus.mjs <arquivo-ou-pasta> [...mais] [--dry-run]
//
// Sem --dry-run, sobrescreve os arquivos in-place — rode com o working tree
// limpo (git) para poder revisar o diff depois.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const dryRun = process.argv.includes("--dry-run");
const targets = process.argv.slice(2).filter((a) => !a.startsWith("--"));

if (targets.length === 0) {
  console.error(
    "Uso: node migrate-fokus.mjs <arquivo-ou-pasta> [...mais] [--dry-run]",
  );
  process.exitCode = 1;
  process.exit();
}

const extensions = new Set([".html", ".htm", ".js", ".mjs", ".cjs", ".jsx", ".tsx"]);

function collectFiles(target, out) {
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    if (path.basename(target) === "node_modules") return;
    for (const entry of fs.readdirSync(target)) {
      collectFiles(path.join(target, entry), out);
    }
  } else if (extensions.has(path.extname(target))) {
    out.push(target);
  }
}

function replaceClassAttr(html) {
  return html.replace(/class=(["'])([^"']*)\1/g, (full, quote, value) => {
    const tokens = value.split(/(\s+)/).map((tok) => {
      if (/^\s+$/.test(tok) || tok === "") return tok;
      if (tok.startsWith("cl-")) return `fs-${tok.slice(3)}`;
      if (tok.startsWith("u-")) return `fs-u-${tok.slice(2)}`;
      return tok;
    });

    return `class=${quote}${tokens.join("")}${quote}`;
  });
}

function replaceAttrsAndEvents(text) {
  return text
    .replace(/data-cl/g, "data-fs")
    .replace(/data-brand/g, "data-fs-brand")
    .replace(/--cl-/g, "--fs-")
    .replace(/(['"`])cl:/g, "$1fs:")
    .replace(/\bClarus\b/g, "FokusStyles")
    .replace(/clarus-css/g, "fokus-styles")
    .replace(/clarus-icons/g, "fokus-styles/icons")
    .replace(/clarus-react/g, "fokus-styles/react")
    .replace(/clarus-cli/g, "fokus-styles");
}

function migrate(text) {
  return replaceAttrsAndEvents(replaceClassAttr(text));
}

const files = [];
for (const target of targets) collectFiles(target, files);

let changed = 0;
for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const updated = migrate(original);

  if (updated === original) continue;
  changed += 1;

  if (dryRun) {
    console.log(`[dry-run] mudaria: ${file}`);
  } else {
    fs.writeFileSync(file, updated);
    console.log(`migrado: ${file}`);
  }
}

console.log(
  `\n${files.length} arquivo(s) verificado(s), ${changed} ${dryRun ? "seriam alterados" : "alterados"}.`,
);
console.log(
  "\nAviso: a substituição de classes é por correspondência exata de token " +
    "(`cl-` → `fs-` e `u-` → `fs-u-`). Se você tem uma classe própria com " +
    "esses prefixos, revise o diff antes de commitar.",
);
