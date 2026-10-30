import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import postcss from 'postcss';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
const readme = await fs.readFile(path.join(root, 'README.md'), 'utf8');
const guide = await fs.readFile(path.join(root, 'USAGE.md'), 'utf8');
const css = await fs.readFile(path.join(root, 'dist/css/fokus.css'), 'utf8');
const failures = [];
if (!readme.includes(`**Status:** \`${pkg.version}\``)) failures.push('README status differs from package version');
const selectors = new Set();
postcss.parse(css).walkRules(rule => {
  for (const match of rule.selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)) selectors.add(match[1]);
});
const examples = [...guide.matchAll(/```html\n([\s\S]*?)```/g)].map(match => match[1]);
if (!examples.length) failures.push('USAGE.md must contain HTML examples');
for (const html of examples) {
  for (const match of html.matchAll(/class="([^"]+)"/g)) {
    for (const name of match[1].split(/\s+/)) {
      if (!selectors.has(name)) failures.push(`Example class absent from compiled CSS: ${name}`);
    }
  }
}
// Inspect the real npm packing list, not only package.json's intended files.
const packed = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {cwd: root, encoding: 'utf8'}));
const names = new Set(packed[0].files.map(file => file.path));
for (const file of ['USAGE.md', 'README.md', 'package.json', 'dist/css/fokus.css', 'dist/js/fokus.js']) {
  if (!names.has(file)) failures.push(`Missing from npm package: ${file}`);
}
if (failures.length) {
  throw new Error(failures.join('\n'));
}
console.log(`Consumer contract validated: ${examples.length} HTML examples; npm guide included (${packed[0].entryCount} files).`);
