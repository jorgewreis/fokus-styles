import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import * as sass from "sass";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import * as esbuild from "esbuild";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const packagesDir = path.join(rootDir, "packages");
const scssDir = path.join(rootDir, "scss");
const entriesDir = path.join(scssDir, "entries");
const jsDir = path.join(packagesDir, "fokus-js", "js");
const distDir = path.join(rootDir, "dist");
const cssOutDir = path.join(distDir, "css");
const jsOutDir = path.join(distDir, "js");

// Cada pacote expõe seu próprio scss/ como raiz de resolução (import
// sem prefixo, ex.: `@use "settings"`), permitindo que entries e
// pacotes se refiram uns aos outros sem caminhos `../../`.
const scssLoadPaths = [
  path.join(packagesDir, "fokus-core", "scss"),
  path.join(packagesDir, "fokus-components", "scss"),
  path.join(packagesDir, "fokus-utilities", "scss"),
  path.join(packagesDir, "fokus-fonts", "scss"),
];

const cssEntries = [
  { entryPath: path.join(entriesDir, "core-entry.scss"), outName: "fokus-core" },
  { entryPath: path.join(entriesDir, "layout-entry.scss"), outName: "layout" },
  { entryPath: path.join(entriesDir, "forms-entry.scss"), outName: "forms" },
  { entryPath: path.join(entriesDir, "components-entry.scss"), outName: "components" },
  { entryPath: path.join(entriesDir, "utilities-entry.scss"), outName: "helpers" },
  { entryPath: path.join(entriesDir, "helpers-entry.scss"), outName: "fokus-helpers" },
  { entryPath: path.join(entriesDir, "utilities-entry.scss"), outName: "fokus-utilities" },
  { entryPath: path.join(entriesDir, "components-entry.scss"), outName: "fokus-components" },
  { entryPath: path.join(entriesDir, "dark-entry.scss"), outName: "fokus-dark" },
  { entryPath: path.join(entriesDir, "rtl-entry.scss"), outName: "fokus-rtl" },
  { entryPath: path.join(entriesDir, "fonts-entry.scss"), outName: "fonts" },
  { entryPath: path.join(scssDir, "fokus.scss"), outName: "fokus" },
];

async function buildCss({ entryPath, outName }) {
  const compiled = sass.compile(entryPath, {
    loadPaths: scssLoadPaths,
    sourceMap: true,
    sourceMapIncludeSources: true,
    style: "expanded",
  });

  const expanded = await postcss([autoprefixer]).process(compiled.css, {
    from: entryPath,
    to: path.join(cssOutDir, `${outName}.css`),
    map: { prev: compiled.sourceMap, inline: false },
  });

  await fs.writeFile(path.join(cssOutDir, `${outName}.css`), `${expanded.css}\n/*# sourceMappingURL=${outName}.css.map */\n`);
  await fs.writeFile(path.join(cssOutDir, `${outName}.css.map`), JSON.stringify(expanded.map));

  const minified = await postcss([autoprefixer, cssnano]).process(compiled.css, {
    from: entryPath,
    to: path.join(cssOutDir, `${outName}.min.css`),
    map: { prev: compiled.sourceMap, inline: false },
  });

  await fs.writeFile(path.join(cssOutDir, `${outName}.min.css`), `${minified.css}\n/*# sourceMappingURL=${outName}.min.css.map */\n`);
  await fs.writeFile(path.join(cssOutDir, `${outName}.min.css.map`), JSON.stringify(minified.map));
}

async function buildJs() {
  const entryPath = path.join(jsDir, "fokus.js");

  await esbuild.build({
    entryPoints: [entryPath],
    outfile: path.join(jsOutDir, "fokus.js"),
    bundle: true,
    format: "iife",
    globalName: "FokusStyles",
    sourcemap: true,
    target: ["es2018"],
  });

  await esbuild.build({
    entryPoints: [entryPath],
    outfile: path.join(jsOutDir, "fokus.min.js"),
    bundle: true,
    format: "iife",
    globalName: "FokusStyles",
    sourcemap: true,
    minify: true,
    target: ["es2018"],
  });
}

async function run() {
  await fs.mkdir(cssOutDir, { recursive: true });
  await fs.mkdir(jsOutDir, { recursive: true });

  await Promise.all(cssEntries.map(buildCss));
  await buildJs();

  console.log("Build concluído em dist/");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
