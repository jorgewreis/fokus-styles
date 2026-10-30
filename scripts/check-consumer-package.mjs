import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import postcss from 'postcss';
import { JSDOM } from 'jsdom';
import { validateConsumerDocs } from './lib/consumer-docs-contract.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const tarball = process.argv[2] ? path.resolve(process.argv[2]) : null;
const read = async name => tarball
  ? execFileSync('tar', ['-xOf', tarball, `package/${name}`], {encoding: 'utf8', maxBuffer: 20 * 1024 * 1024})
  : fs.readFile(path.join(root, name), 'utf8');
const pkg = JSON.parse(await read('package.json'));
const readme = await read('README.md');
const guide = await read('USAGE.md');
const css = await read('dist/css/fokus.css');
const stability = await read('docs/reference/stability.md');
const failures = validateConsumerDocs({ guide, stability, pkg });
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
// Controlled recipe-composition experiment against the same distribution bytes.
// This verifies DOM behavior, not visual quality or independent AI adherence.
const dom = new JSDOM(`<!doctype html><html lang="pt-BR"><body><main>${examples.join('\n')}</main></body></html>`, {
  runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://consumer.example.test/'
});
try {
  const { window } = dom;
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  window.eval(await read('dist/js/fokus.js'));
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  const document = window.document;
  if (document.querySelector('style, [style]')) failures.push('Consumption recipes must compose official classes without custom CSS');
  for (const label of document.querySelectorAll('label[for]')) {
    if (!document.getElementById(label.htmlFor)) failures.push(`Unresolved recipe label: ${label.htmlFor}`);
  }
  const trigger = document.querySelector('[data-fs="modal"]');
  const modal = trigger && document.querySelector(trigger.getAttribute('data-fs-target'));
  const dismiss = modal?.querySelector('[data-fs-dismiss="modal"]');
  if (!trigger || !modal || !dismiss) failures.push('Missing executable modal recipe');
  else {
    // Repeat to catch recipes that only work on the first interaction.
    for (let round = 0; round < 2; round++) {
      trigger.click();
      if (modal.getAttribute('aria-hidden') !== 'false') failures.push('Packed IIFE did not open recipe modal');
      dismiss.click();
      if (modal.getAttribute('aria-hidden') !== 'true') failures.push('Packed IIFE did not dismiss recipe modal');
    }
  }
} finally {
  dom.window.close();
}
// Inspect the real npm packing list, not only package.json's intended files.
const packed = tarball ? null : JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {cwd: root, encoding: 'utf8'}));
const names = new Set(tarball
  ? execFileSync('tar', ['-tzf', tarball], {encoding: 'utf8'}).trim().split('\n').map(name => name.replace(/^package\//, ''))
  : packed[0].files.map(file => file.path));
for (const file of ['USAGE.md', 'docs/reference/stability.md', 'README.md', 'package.json', 'dist/css/fokus.css', 'dist/js/fokus.js']) {
  if (!names.has(file)) failures.push(`Missing from npm package: ${file}`);
}
if (failures.length) {
  throw new Error(failures.join('\n'));
}
console.log(`Consumer contract validated: ${examples.length} HTML examples; maturity policy included; DOM recipes verified (not visual/AI certification); ${names.size} packed files.`);
