// Build first; pack exactly once. CI consumers and release use these same bytes.
import { mkdtemp, mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'release-package');
const scratch = await mkdtemp(path.join(tmpdir(), 'fokus-pack-'));
try {
  const [packed] = JSON.parse(execFileSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', scratch], {cwd: root, encoding: 'utf8'}));
  const source = path.join(scratch, packed.filename);
  const hash = createHash('sha256').update(await readFile(source)).digest('hex');
  await mkdir(output, {recursive: true});
  await copyFile(source, path.join(output, 'package.tgz'));
  await writeFile(path.join(output, 'SHA256SUMS'), `${hash}  package.tgz\n`);
  console.log(`Packed ${packed.name}@${packed.version}: ${hash}`);
} finally {
  await rm(scratch, {recursive: true, force: true});
}
