import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Gera packages/fokus-icons/ a partir do `lucide-static` (devDependency,
// só usado em build-time — o pacote publicado não tem dependência de
// runtime nenhuma, mesma filosofia do resto do FokusStyles). Ver
// docs/guides/icons.md pro contexto da decisão.

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sourceDir = path.join(rootDir, "node_modules", "lucide-static", "icons");
const pkgDir = path.join(rootDir, "packages", "fokus-icons");
const svgOutDir = path.join(pkgDir, "svg");
const jsOutDir = path.join(pkgDir, "icons");

// Palavras reservadas do JS: nomes de ícone que colidiriam como binding de
// import (`import { delete } from "..."`) ganham o sufixo `Icon` só no
// barrel `index.js` — o módulo individual (`icons/delete.js`) não é afetado,
// porque `export default` não cria um binding nomeado.
const RESERVED_WORDS = new Set([
  "break", "case", "catch", "class", "const", "continue", "debugger", "default",
  "delete", "do", "else", "export", "extends", "false", "finally", "for",
  "function", "if", "import", "in", "instanceof", "new", "null", "return",
  "super", "switch", "this", "throw", "true", "try", "typeof", "var", "void",
  "while", "with", "yield", "let", "static", "enum", "await", "implements",
  "package", "protected", "interface", "private", "public",
]);

function toCamelCase(name) {
  return name.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

function toExportName(name) {
  const camel = toCamelCase(name);
  return RESERVED_WORDS.has(camel) ? `${camel}Icon` : camel;
}

function cleanSvg(raw) {
  return raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\sclass="lucide[^"]*"/, ' class="fs-icon"')
    .replace(/\s+/g, " ")
    .replace(/> </g, "><")
    .replace(/\s+\/>/g, "/>")
    .replace(/\s+>/g, ">")
    .trim();
}

async function run() {
  await fs.rm(svgOutDir, { recursive: true, force: true });
  await fs.rm(jsOutDir, { recursive: true, force: true });
  await fs.mkdir(svgOutDir, { recursive: true });
  await fs.mkdir(jsOutDir, { recursive: true });

  const files = (await fs.readdir(sourceDir)).filter((file) => file.endsWith(".svg")).sort();
  const names = [];

  for (const file of files) {
    const name = file.replace(/\.svg$/, "");
    const raw = await fs.readFile(path.join(sourceDir, file), "utf8");
    const svg = cleanSvg(raw);

    await fs.writeFile(path.join(svgOutDir, file), `${svg}\n`);
    await fs.writeFile(path.join(jsOutDir, `${name}.js`), `export default ${JSON.stringify(svg)};\n`);
    names.push(name);
  }

  // Alguns nomes colidem no camelCase (ex.: "arrow-down-0-1" e "arrow-down-01"
  // viram ambos "arrowDown01") — o módulo individual (`icons/<nome>.js`)
  // sempre existe pra ambos; só a entrada duplicada no barrel é pulada (fica
  // acessível só pelo caminho direto), pra não quebrar o `export` do resto.
  const usedExportNames = new Set();
  const indexLines = [];
  let skipped = 0;

  for (const name of names) {
    const exportName = toExportName(name);
    if (usedExportNames.has(exportName)) {
      skipped += 1;
      continue;
    }
    usedExportNames.add(exportName);
    indexLines.push(`export { default as ${exportName} } from "./icons/${name}.js";`);
  }

  await fs.writeFile(path.join(pkgDir, "index.js"), `${indexLines.join("\n")}\n`);

  const { version } = JSON.parse(await fs.readFile(path.join(rootDir, "node_modules", "lucide-static", "package.json"), "utf8"));
  console.log(`Gerados ${names.length} ícones (lucide-static@${version}) em packages/fokus-icons/{svg,icons}/ + index.js`);
  if (skipped > 0) {
    console.log(`${skipped} nome(s) colidiram no camelCase e ficaram fora do barrel (acessíveis só via "fokus-styles/icons/<nome>.js").`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
