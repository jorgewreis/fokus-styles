import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const docsDir = path.join(root, "docs");
const componentsDir = path.join(docsDir, "components");
const scssDir = path.join(root, "packages", "fokus-components", "scss", "components");
const requiredSections = ["## Visão geral", "## Estados", "## A11y"];
const aliases = new Map([
  ["alerts", "alert"], ["badges", "badge"], ["breadcrumbs", "breadcrumb"],
  ["buttons", "button"], ["cards", "card"], ["tables", "table"],
  ["toasts", "toast"], ["tooltips", "tooltip"],
  ["spinner", "progress"],
]);

const failures = [];
const componentDocs = new Set((await fs.readdir(componentsDir)).filter((file) => file.endsWith(".md")));

for (const file of await fs.readdir(scssDir)) {
  if (!file.startsWith("_") || file === "_index.scss") continue;
  const name = file.slice(1, -5);
  const docName = aliases.get(name) ?? name;
  if (!componentDocs.has(`${docName}.md`)) failures.push(`componente SCSS sem documentação: ${name}`);
}

for (const file of componentDocs) {
  const content = await fs.readFile(path.join(componentsDir, file), "utf8");
  if (!content.match(/^# .+/m)) failures.push(`documento sem título: docs/components/${file}`);
  for (const section of requiredSections) {
    if (!content.includes(section)) failures.push(`documento sem seção "${section}": docs/components/${file}`);
  }
}

const markdownFiles = [];
async function collect(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(full);
    else if (entry.name.endsWith(".md")) markdownFiles.push(full);
  }
}
await collect(docsDir);

for (const file of markdownFiles) {
  const content = await fs.readFile(file, "utf8");
  const links = [...content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
  for (const link of links) {
    if (/^(?:https?:\/\/|mailto:|#)/.test(link)) continue;
    const target = path.resolve(path.dirname(file), link.split("#")[0]);
    try {
      await fs.access(target);
      const fragment = link.split("#")[1];
      if (fragment && path.extname(target) === ".html") {
        const html = await fs.readFile(target, "utf8");
        const staticId = new RegExp(`id=["']${fragment}["']`);
        const catalogId = new RegExp(`"id"\\s*:\\s*"${fragment}"`);
        if (!staticId.test(html) && !catalogId.test(html)) failures.push(`âncora HTML inexistente em ${path.relative(root, file)}: ${link}`);
      }
    } catch { failures.push(`link quebrado em ${path.relative(root, file)}: ${link}`); }
  }
}

if (failures.length) {
  console.error(`Documentação inconsistente (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Documentação validada: ${componentDocs.size} componentes e ${markdownFiles.length} arquivos Markdown.`);
}
