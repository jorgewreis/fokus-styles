import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { lstat, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const registry = 'https://registry.npmjs.org/';
const expectedPackageName = 'fokus-styles';

function npmCommand(args, cwd, timeout) {
  let command = 'npm';
  let commandArgs = args;

  if (process.platform === 'win32') {
    const localCli = path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
    if (existsSync(localCli)) {
      command = process.execPath;
      commandArgs = [localCli, ...args];
    }
  }

  const result = spawnSync(command, commandArgs, {
    cwd,
    encoding: 'utf8',
    timeout,
    maxBuffer: 16 * 1024 * 1024,
    windowsHide: true,
  });
  return {
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error?.message ?? null,
  };
}

function sha512Integrity(bytes) {
  return `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function requireSuccess(result, action) {
  if (result.error || result.status !== 0) {
    throw new Error(`${action} failed${result.error ? `: ${result.error}` : ` (exit ${result.status})`}`);
  }
}

function isExactMissingVersion(result, name, version) {
  if (result.error || result.status !== 1 || typeof result.stdout !== 'string' || typeof result.stderr !== 'string') return false;
  const output = result.stderr;
  const codes = [...output.matchAll(/^npm (?:error|ERR!) code (\S+)$/gim)].map((match) => match[1]);
  const missingVersionLine = new RegExp(`^npm (?:error|ERR!) 404 No match found for version ${escapeRegExp(version)}$`, 'im').test(output);
  const exactPackageId = `'${name}@${version}'`;
  if (codes.length !== 1 || codes[0] !== 'E404' || !missingVersionLine || !output.includes(exactPackageId)) return false;

  // npm --json emits errors on stdout in npm 10/11. Both channels must
  // independently identify this exact missing version, never a generic 404.
  if (!result.stdout.trim()) return true; // Legacy stderr-only npm output.
  let body;
  try { body = JSON.parse(result.stdout); } catch { return false; }
  if (!body || Array.isArray(body) || typeof body !== 'object' || Object.keys(body).length !== 1) return false;
  const error = body.error;
  if (!error || Array.isArray(error) || typeof error !== 'object') return false;
  if (Object.keys(error).some((key) => !['code', 'summary', 'detail'].includes(key))) return false;
  return error.code === 'E404'
    && error.summary === `No match found for version ${version}`
    && typeof error.detail === 'string'
    && [
      `${exactPackageId} is not in this registry.`,
      `The requested resource ${exactPackageId} could not be found or you do not have permission to access it.`,
    ].includes(error.detail.split('\n')[0]);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseMetadata(result, name, version) {
  requireSuccess(result, 'npm view');
  let metadata;
  try {
    metadata = JSON.parse(result.stdout);
  } catch {
    throw new Error('npm view returned invalid JSON; refusing to publish');
  }
  if (!metadata || Array.isArray(metadata) || typeof metadata !== 'object') {
    throw new Error('npm view returned unexpected JSON; refusing to publish');
  }
  if (metadata.name !== name || metadata.version !== version) {
    throw new Error(`npm view identity mismatch: expected ${name}@${version}; refusing to publish`);
  }
  if (typeof metadata.dist?.integrity !== 'string' || !/^sha512-[A-Za-z0-9+/]+={0,2}$/.test(metadata.dist.integrity)) {
    throw new Error('npm view omitted a valid SHA-512 dist.integrity; refusing to publish');
  }
  return metadata;
}

function validateReleaseIdentity(manifest, env) {
  if (manifest.name !== expectedPackageName) {
    throw new Error(`Unexpected package name ${String(manifest.name)}; expected ${expectedPackageName}`);
  }
  if (typeof manifest.version !== 'string' || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(manifest.version)) {
    throw new Error('package.json must use a stable SemVer version without leading zeroes, prerelease, or build metadata');
  }
  if (env.GITHUB_REF_TYPE !== 'tag' || env.GITHUB_REF_NAME !== `v${manifest.version}`) {
    throw new Error(`Git tag identity mismatch: expected v${manifest.version}`);
  }
}

async function inspectTarball(directory, packed, name, version) {
  if (!packed || Array.isArray(packed) || typeof packed !== 'object' || packed.name !== name || packed.version !== version) {
    throw new Error(`npm pack identity mismatch: expected ${name}@${version}`);
  }
  if (typeof packed.filename !== 'string' || path.basename(packed.filename) !== packed.filename || !packed.filename.endsWith('.tgz')) {
    throw new Error('npm pack returned an invalid tarball filename');
  }
  const tarballPath = path.join(directory, packed.filename);
  const fileInfo = await lstat(tarballPath);
  if (!fileInfo.isFile()) throw new Error('npm pack output is not a regular file');
  const bytes = await readFile(tarballPath);
  const integrity = sha512Integrity(bytes);
  if (typeof packed.integrity !== 'string' || packed.integrity !== integrity) {
    throw new Error('npm pack integrity does not match the tarball bytes');
  }
  return { tarballPath, bytes, integrity, sha256: sha256(bytes), size: bytes.length };
}

/** Full release decision path. Tests inject only the npm process boundary. */
export async function publishBuiltPackage({
  cwd = process.cwd(),
  env = process.env,
  run = npmCommand,
  tempRoot = env.RUNNER_TEMP || os.tmpdir(),
  log = (line) => console.log(line),
}) {
  const manifest = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8'));
  validateReleaseIdentity(manifest, env);

  const packageDir = await mkdtemp(path.join(tempRoot, 'fokus-release-'));
  const packedResult = await run(
    ['pack', '--json', '--ignore-scripts', '--pack-destination', packageDir], cwd, 120_000,
  );
  requireSuccess(packedResult, 'npm pack');

  let packed;
  try {
    const parsed = JSON.parse(packedResult.stdout);
    if (!Array.isArray(parsed) || parsed.length !== 1) throw new Error('expected one package tarball');
    [packed] = parsed;
  } catch {
    throw new Error('npm pack returned invalid or unexpected JSON; refusing to publish');
  }

  const artifact = await inspectTarball(packageDir, packed, manifest.name, manifest.version);
  const releaseManifest = {
    schemaVersion: 1,
    name: manifest.name,
    version: manifest.version,
    gitTag: env.GITHUB_REF_NAME,
    filename: path.basename(artifact.tarballPath),
    size: artifact.size,
    sha256: artifact.sha256,
    integrity: artifact.integrity,
  };
  const manifestPath = path.join(packageDir, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(releaseManifest, null, 2)}\n`, { flag: 'wx' });
  log(JSON.stringify({ event: 'release-package-created', ...releaseManifest, manifestPath }));

  const view = await run(
    ['view', `${manifest.name}@${manifest.version}`, '--json', `--registry=${registry}`], cwd, 30_000,
  );
  const currentBytes = await readFile(artifact.tarballPath);
  if (sha512Integrity(currentBytes) !== artifact.integrity || sha256(currentBytes) !== artifact.sha256) {
    throw new Error('Candidate tarball changed after registry check; refusing to publish');
  }

  if (!isExactMissingVersion(view, manifest.name, manifest.version)) {
    if (view.error || view.status !== 0) {
      throw new Error(`npm view failed closed${view.error ? `: ${view.error}` : ` (exit ${view.status})`}`);
    }
    const existing = parseMetadata(view, manifest.name, manifest.version);
    if (existing.dist.integrity !== artifact.integrity) {
      throw new Error('Published version integrity differs from candidate tarball; refusing to publish');
    }
    log(`Verified existing ${manifest.name}@${manifest.version} matches candidate integrity; publish skipped.`);
    return { published: false, reason: 'identical-version-already-published', releaseManifest, manifestPath };
  }

  const published = await run([
    'publish', artifact.tarballPath, '--ignore-scripts', '--provenance', '--access', 'public', `--registry=${registry}`,
  ], cwd, 120_000);
  requireSuccess(published, 'npm publish tarball');
  log(`Published ${manifest.name}@${manifest.version} from SHA-256 ${artifact.sha256}`);
  return { published: true, releaseManifest, manifestPath };
}

