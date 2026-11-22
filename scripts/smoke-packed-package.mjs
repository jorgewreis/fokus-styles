import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs/promises';

const consumer = path.resolve(process.argv[2] ?? '');
assert.ok(process.argv[2], 'pass the isolated consumer directory');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requireFromScript = createRequire(import.meta.url);
const relativeToTemp = path.relative(path.resolve(process.env.RUNNER_TEMP ?? ''), consumer);
assert.ok(process.env.RUNNER_TEMP, 'RUNNER_TEMP must be set');
assert.ok(relativeToTemp && !relativeToTemp.startsWith('..') && !path.isAbsolute(relativeToTemp), 'consumer must be inside RUNNER_TEMP');
assert.equal(path.resolve((await fs.realpath(consumer))), consumer, 'consumer must be a real directory, not a redirected path');
assert.equal(path.dirname(await fs.realpath(path.join(consumer, 'package.json'))), consumer, 'consumer manifest must be inside the isolated directory');
const requireFromConsumer = createRequire(path.join(consumer, 'package.json'));
const requireFromProject = createRequire(path.join(root, 'package.json'));
const packageJsonPath = requireFromConsumer.resolve('fokus-styles/package.json');
const installedRoot = path.dirname(packageJsonPath);
const pkg = requireFromScript(packageJsonPath);
assert.equal(pkg.name, 'fokus-styles');
for (const specifier of ['fokus-styles', 'fokus-styles/scss', 'fokus-styles/layout.css', 'fokus-styles/components.css', 'fokus-styles/js', 'fokus-styles/cli']) {
  assert.ok(requireFromConsumer.resolve(specifier), `resolve ${specifier}`);
}
for (const specifier of ['fokus-styles', 'fokus-styles/layout.css', 'fokus-styles/components.css']) {
  assert.ok((await fs.stat(requireFromConsumer.resolve(specifier))).size > 0, `nonempty CSS entry ${specifier}`);
}
for (const subpath of ['./js', './react']) {
  const types = pkg.exports?.[subpath]?.types;
  assert.ok(types, `types export exists for ${subpath}`);
  await fs.access(path.join(installedRoot, types));
}

const jsEntry = requireFromConsumer.resolve('fokus-styles/js');
const api = await import(pathToFileUrl(jsEntry));
for (const name of ['Popover', 'Modal', 'Dropdown']) assert.ok(name in api, `JS export ${name}`);

const sass = requireFromProject('sass');
const scssResult = sass.compile(requireFromConsumer.resolve('fokus-styles/scss'), { quietDeps: true, logger: sass.Logger.silent });
assert.ok(scssResult.css.length > 0, 'installed SCSS entry compiles');

const cli = path.join(installedRoot, pkg.bin?.fokus ?? '');
assert.ok(pkg.bin?.fokus, 'fokus CLI bin is declared');
await fs.access(cli);
const cliResult = spawnSync(process.execPath, [cli, '--help'], { cwd: consumer, encoding: 'utf8' });
assert.equal(cliResult.status, 0, cliResult.stderr || cliResult.stdout);
assert.match(cliResult.stdout, /fokus/i);

const fixture = path.join(consumer, 'consumer-types.mts');
await fs.writeFile(fixture, 'import type { Popover, Modal, Dropdown } from "fokus-styles/js";\ndeclare const values: [Popover, Modal, Dropdown];\nvoid values;\n');
const tsc = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');
const typesResult = spawnSync(process.execPath, [tsc, '--noEmit', '--strict', '--skipLibCheck', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', fixture], { cwd: consumer, encoding: 'utf8' });
assert.equal(typesResult.status, 0, typesResult.stderr || typesResult.stdout);

console.log(JSON.stringify({ consumer, package: pkg.name, version: pkg.version, css: 'nonempty entry files read', scss: `compiled ${scssResult.css.length} output characters`, js: 'imported and required exports checked', cli: '--help passed', types: 'consumer fixture compiled', react: 'declaration path checked only; optional React peer/runtime not installed or tested' }, null, 2));

function pathToFileUrl(file) { return pathToFileURL(file); }
