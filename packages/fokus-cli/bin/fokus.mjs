#!/usr/bin/env node
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { buildCss } from "../lib/build.mjs";
import { generateThemeCss } from "../lib/theme.mjs";
import { analyzeFiles, formatReport } from "../lib/analyze.mjs";

const HELP = `fokus — CLI do Fokus Styles

Uso:
  fokus build <entry.scss> -o <saida.css> [--minify]
  fokus theme <nome> --primary <#hex> [-o <saida.css>]
  fokus analyze <arquivo...>

Comandos:
  build     Compila um entry-point .scss (sass -> autoprefixer -> cssnano
            opcional), o mesmo pipeline usado internamente pelo FokusStyles.
  theme     Gera um preset de marca (data-fs-brand) em CSS puro (color-mix()),
            pronto pra incluir depois do CSS do FokusStyles.
  analyze   Mostra o tamanho bruto e gzip de um ou mais arquivos CSS/JS.

Exemplos:
  fokus build src/app.scss -o dist/app.css --minify
  fokus theme acme --primary "#2563eb" -o dist/brand-acme.css
  fokus analyze dist/app.css dist/app.js
`;

function parseFlags(args) {
  const positional = [];
  const flags = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "-o" || arg === "--out") {
      flags.out = args[i + 1];
      i += 1;
    } else if (arg === "--minify") {
      flags.minify = true;
    } else if (arg === "--primary") {
      flags.primary = args[i + 1];
      i += 1;
    } else {
      positional.push(arg);
    }
  }

  return { positional, flags };
}

async function runBuild(args) {
  const { positional, flags } = parseFlags(args);
  const [entry] = positional;

  if (!entry || !flags.out) {
    console.error("Uso: fokus build <entry.scss> -o <saida.css> [--minify]");
    process.exitCode = 1;
    return;
  }

  const { outPath } = await buildCss({ entry, out: flags.out, minify: Boolean(flags.minify) });
  console.log(`CSS compilado em ${outPath}`);
}

async function runTheme(args) {
  const { positional, flags } = parseFlags(args);
  const [name] = positional;

  if (!name || !flags.primary) {
    console.error('Uso: fokus theme <nome> --primary "#hex" [-o <saida.css>]');
    process.exitCode = 1;
    return;
  }

  const css = generateThemeCss({ name, primary: flags.primary });

  if (flags.out) {
    const outPath = path.resolve(flags.out);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, css);
    console.log(`Preset de marca "${name}" gerado em ${outPath}`);
  } else {
    process.stdout.write(css);
  }
}

async function runAnalyze(args) {
  const { positional } = parseFlags(args);

  if (positional.length === 0) {
    console.error("Uso: fokus analyze <arquivo...>");
    process.exitCode = 1;
    return;
  }

  const results = await analyzeFiles(positional);
  console.log(formatReport(results));
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);

  if (!command || command === "--help" || command === "-h") {
    console.log(HELP);
    return;
  }

  if (command === "--version" || command === "-v") {
    const pkgPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "package.json");
    const pkg = JSON.parse(await fs.readFile(pkgPath, "utf8"));
    console.log(pkg.version);
    return;
  }

  switch (command) {
    case "build":
      await runBuild(rest);
      break;
    case "theme":
      await runTheme(rest);
      break;
    case "analyze":
      await runAnalyze(rest);
      break;
    default:
      console.error(`Comando desconhecido: ${command}\n`);
      console.log(HELP);
      process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exitCode = 1;
});
