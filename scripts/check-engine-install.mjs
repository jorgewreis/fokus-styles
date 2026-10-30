// Exercise npm's real engine-strict rejection without downloading dependencies.
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
const expected = process.argv[2];
if (!['accept', 'reject'].includes(expected)) throw new Error('Usage: check-engine-install.mjs accept|reject');
const cwd = await mkdtemp(path.join(tmpdir(), 'fokus-engine-'));
try {
  await writeFile(path.join(cwd, 'package.json'), JSON.stringify({name:'fokus-engine-contract', version:'1.0.0', private:true, engines:pkg.engines}));
  const result = spawnSync('npm', ['install', '--package-lock-only', '--ignore-scripts', '--engine-strict', '--no-audit', '--no-fund'], {cwd, encoding:'utf8'});
  const output = (result.stdout || '') + (result.stderr || '');
  const passed = expected === 'accept' ? result.status === 0 : result.status !== 0 && output.includes('EBADENGINE');
  if (!passed) throw new Error(`Unexpected npm result for ${process.version}: ${result.error || output}`);
  console.log(`${process.version}: npm engine-strict ${expected} confirmed (${pkg.engines.node})`);
} finally { await rm(cwd, {recursive:true, force:true}); }
