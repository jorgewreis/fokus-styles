import { chmod, copyFile, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { publishBuiltPackage } from '../../scripts/publish-package.mjs';

const packageName = 'fokus-styles';
const version = '2.8.0';
const expectedTagEnv = { GITHUB_REF_TYPE: 'tag', GITHUB_REF_NAME: `v${version}` };
const fakeBytes = Buffer.from('offline candidate tarball bytes');
const integrity = `sha512-${createHash('sha512').update(fakeBytes).digest('base64')}`;
const realCliFakeBytes = Buffer.from('isolated real-CLI fake npm tarball');
const realCliIntegrity = `sha512-${createHash('sha512').update(realCliFakeBytes).digest('base64')}`;

let dirs = [];
async function fixture(manifest = { name: packageName, version }) {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'fokus-release-test-'));
  dirs.push(parent);
  const cwd = path.join(parent, 'project');
  const tempRoot = path.join(parent, 'runner-temp');
  await mkdir(cwd);
  await mkdir(tempRoot);
  await writeFile(path.join(cwd, 'package.json'), JSON.stringify(manifest));
  return { parent, cwd, tempRoot };
}

afterEach(async () => {
  await Promise.all(dirs.map((dir) => rm(dir, { recursive: true, force: true })));
  dirs = [];
});

function packedOutput(packageDir, overrides = {}) {
  const filename = `${packageName}-${version}.tgz`;
  return writeFile(path.join(packageDir, filename), fakeBytes).then(() => JSON.stringify([{
    name: packageName,
    version,
    filename,
    integrity,
    ...overrides,
  }]));
}

function noMatch() {
  return {
    status: 1,
    stdout: '',
    stderr: `npm error code E404\nnpm error 404 No match found for version ${version}\nnpm error 404 'fokus-styles@${version}' could not be found`,
    error: null,
  };
}

function existingMetadata(overrides = {}) {
  return {
    status: 0,
    stdout: JSON.stringify({ name: packageName, version, dist: { integrity, ...overrides } }),
    stderr: '',
    error: null,
  };
}

function successfulPack(stdout) {
  return { status: 0, stdout, stderr: '', error: null };
}

async function executeWith({ view = noMatch(), pack = {}, packOutput, onView, env = expectedTagEnv, manifest } = {}) {
  const { cwd, tempRoot } = await fixture(manifest);
  const calls = [];
  const runner = vi.fn(async (args, _cwd, _timeout) => {
    calls.push(args);
    if (args[0] === 'pack') {
      const destination = args[args.indexOf('--pack-destination') + 1];
      return successfulPack(packOutput ?? await packedOutput(destination, pack));
    }
    if (args[0] === 'view') {
      await onView?.(destinationFromCalls(calls));
      return view;
    }
    if (args[0] === 'publish') return { status: 0, stdout: '', stderr: '', error: null };
    throw new Error(`Unexpected npm command: ${args[0]}`);
  });
  const run = (args, cwdArg, timeout) => runner(args, cwdArg, timeout);
  const action = publishBuiltPackage({ cwd, env, run, tempRoot, log: vi.fn() });
  return { action, calls, cwd, runner };
}

function destinationFromCalls(calls) {
  const pack = calls.find((call) => call[0] === 'pack');
  return pack?.[pack.indexOf('--pack-destination') + 1];
}

describe('release publish gate (offline process boundary)', () => {
  it('connects the release workflow to the tested release path after all existing gates', async () => {
    const workflow = await readFile(path.join(process.cwd(), '.github/workflows/release.yml'), 'utf8');
    const publishStep = workflow.indexOf('run: node scripts/publish-package-cli.mjs');
    expect(publishStep).toBeGreaterThan(-1);
    for (const gate of ['npm run lint', 'npm run build', 'npm test', 'npm run types:check', 'npm run docs:check', 'npm run contrast:check', 'npm run size:check', 'npm run test:visual', 'npm run test:a11y']) {
      expect(workflow.indexOf(gate)).toBeGreaterThan(-1);
      expect(workflow.indexOf(gate)).toBeLessThan(publishStep);
    }
    expect(workflow).not.toContain('npm view');
    expect(workflow).not.toContain('npm publish');
  });

  it('publishes the single packed tarball only for a confirmed exact-version E404', async () => {
    const { action, calls } = await executeWith();
    const result = await action;
    expect(result.published).toBe(true);
    expect(calls.map((args) => args[0])).toEqual(['pack', 'view', 'publish']);
    expect(calls[0]).toContain('--ignore-scripts');
    expect(calls.filter((args) => args[0] === 'pack')).toHaveLength(1);
    expect(calls[2]).toContain('--ignore-scripts');
    expect(calls[2][1]).toMatch(/fokus-styles-2\.8\.0\.tgz$/);
    expect(calls[2]).toContain('--provenance');
  });

  it.each([
    ['DNS error', { status: 1, stdout: '', stderr: 'npm error code ENOTFOUND', error: null }],
    ['timeout', { status: null, stdout: '', stderr: '', error: 'ETIMEDOUT' }],
    ['401', { status: 1, stdout: '', stderr: 'npm error code E401', error: null }],
    ['403', { status: 1, stdout: '', stderr: 'npm error code E403', error: null }],
    ['arbitrary 404', { status: 1, stdout: '', stderr: `npm error code E404\nnpm error 404 Not Found ${packageName}@${version}`, error: null }],
  ])('fails closed on %s and never invokes publish', async (_label, view) => {
    const { action, calls } = await executeWith({ view });
    await expect(action).rejects.toThrow(/npm view failed closed/);
    expect(calls.some((args) => args[0] === 'publish')).toBe(false);
  });

  it.each([
    ['malformed JSON', '{bad', /invalid JSON/],
    ['unexpected JSON shape', '[]', /unexpected JSON/],
  ])('fails closed on %s and never invokes publish', async (_label, stdout, message) => {
    const { action, calls } = await executeWith({ view: { status: 0, stdout, stderr: '', error: null } });
    await expect(action).rejects.toThrow(message);
    expect(calls.some((args) => args[0] === 'publish')).toBe(false);
  });

  it.each([
    ['name', { name: 'other-package' }],
    ['version', { version: '9.9.9' }],
  ])('rejects existing metadata with a mismatched %s and never invokes publish', async (field, override) => {
    const body = { name: packageName, version, dist: { integrity } };
    const view = { status: 0, stdout: JSON.stringify({ ...body, ...override }), stderr: '', error: null };
    const { action, calls } = await executeWith({ view });
    await expect(action).rejects.toThrow(/identity mismatch/);
    expect(calls.some((args) => args[0] === 'publish')).toBe(false);
  });

  it('skips publish only when existing package integrity equals the candidate', async () => {
    const { action, calls } = await executeWith({ view: existingMetadata() });
    const result = await action;
    expect(result).toMatchObject({ published: false, reason: 'identical-version-already-published' });
    expect(calls.some((args) => args[0] === 'publish')).toBe(false);
  });

  it.each([
    ['different', 'sha512-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='],
    ['missing', undefined],
  ])('rejects %s existing integrity and never invokes publish', async (_label, remoteIntegrity) => {
    const view = existingMetadata({ integrity: remoteIntegrity });
    const { action, calls } = await executeWith({ view });
    await expect(action).rejects.toThrow(/integrity/);
    expect(calls.some((args) => args[0] === 'publish')).toBe(false);
  });

  it('detects tarball mutation after pack/registry check before any publish call', async () => {
    const { action, calls } = await executeWith({ onView: async (directory) => {
      await writeFile(path.join(directory, `${packageName}-${version}.tgz`), 'tampered after metadata check');
    } });
    await expect(action).rejects.toThrow(/tarball changed after registry check/);
    expect(calls.some((args) => args[0] === 'publish')).toBe(false);
  });

  it('rejects tarball mutation even when registry metadata would otherwise make the run idempotent', async () => {
    const { action, calls } = await executeWith({ view: existingMetadata(), onView: async (directory) => {
      await writeFile(path.join(directory, `${packageName}-${version}.tgz`), 'tampered after metadata check');
    } });
    await expect(action).rejects.toThrow(/tarball changed after registry check/);
    expect(calls.some((args) => args[0] === 'publish')).toBe(false);
  });

  it('rejects a tag that does not match package name/version before invoking npm', async () => {
    const { action, calls } = await executeWith({ env: { ...expectedTagEnv, GITHUB_REF_NAME: 'v9.9.9' } });
    await expect(action).rejects.toThrow(/tag identity mismatch/);
    expect(calls).toHaveLength(0);
  });

  it('rejects unexpected package names before invoking npm', async () => {
    const { action, calls } = await executeWith({ manifest: { name: 'other-package', version } });
    await expect(action).rejects.toThrow(/Unexpected package name/);
    expect(calls).toHaveLength(0);
  });

  it.each(['01.2.3', '2.8.0-beta.1', '2.8.0+build.1'])('rejects non-stable/noncanonical SemVer %s before invoking npm', async (badVersion) => {
    const { action, calls } = await executeWith({ manifest: { name: packageName, version: badVersion } });
    await expect(action).rejects.toThrow(/stable SemVer/);
    expect(calls).toHaveLength(0);
  });

  it('rejects packed manifest identity mismatch and never queries or publishes', async () => {
    const { action, calls } = await executeWith({ pack: { version: '9.9.9' } });
    await expect(action).rejects.toThrow(/pack identity mismatch/);
    expect(calls.map((args) => args[0])).toEqual(['pack']);
  });

  it('rejects unexpected pack JSON before querying or publishing', async () => {
    const { action, calls } = await executeWith({ packOutput: '{}' });
    await expect(action).rejects.toThrow(/invalid or unexpected JSON/);
    expect(calls.map((args) => args[0])).toEqual(['pack']);
  });

  it('does not treat an E404 for another version as proof that this version is absent', async () => {
    const view = {
      status: 1,
      stdout: '',
      stderr: `npm error code E404\nnpm error 404 No match found for version 2.8.1\nnpm error 404 'fokus-styles@2.8.1' could not be found`,
      error: null,
    };
    const { action, calls } = await executeWith({ view });
    await expect(action).rejects.toThrow(/npm view failed closed/);
    expect(calls.some((args) => args[0] === 'publish')).toBe(false);
  });

  it('uses an isolated fake npm process and records the blocked commands without invoking publish', async () => {
    const { parent, cwd, tempRoot } = await fixture();
    const simulator = path.join(parent, 'npm-simulator.mjs');
    const callsFile = path.join(parent, 'npm-arguments.jsonl');
    await writeFile(simulator, `
      import { appendFileSync, writeFileSync } from 'node:fs';
      import { createHash } from 'node:crypto';
      import path from 'node:path';
      const args = process.argv.slice(2);
      appendFileSync(process.env.FAKE_NPM_CALLS, JSON.stringify(args) + '\\n');
      if (args[0] === 'pack') {
        const destination = args[args.indexOf('--pack-destination') + 1];
        const bytes = Buffer.from('isolated fake npm tarball');
        const filename = 'fokus-styles-2.8.0.tgz';
        writeFileSync(path.join(destination, filename), bytes);
        const integrity = 'sha512-' + createHash('sha512').update(bytes).digest('base64');
        process.stdout.write(JSON.stringify([{ name: 'fokus-styles', version: '2.8.0', filename, integrity }]));
      } else if (args[0] === 'view') {
        process.stdout.write(process.env.FAKE_VIEW_STDOUT || '');
        process.stderr.write(process.env.FAKE_VIEW_STDERR || '');
        process.exitCode = Number(process.env.FAKE_VIEW_STATUS || 0);
      } else if (args[0] === 'publish') {
        process.stdout.write('FAKE_PUBLISH_ONLY');
      } else {
        process.stderr.write('unexpected fake npm command');
        process.exitCode = 2;
      }
    `);

    const fakeView = {
      status: 1,
      stdout: '',
      stderr: 'npm error code ENOTFOUND\nnpm error syscall getaddrinfo',
      error: null,
    };
    const run = (args, workingDirectory, timeout) => {
      const child = spawnSync(process.execPath, [simulator, ...args], {
        cwd: workingDirectory,
        encoding: 'utf8',
        timeout,
        windowsHide: true,
        env: {
          ...process.env,
          FAKE_NPM_CALLS: callsFile,
          FAKE_VIEW_STATUS: String(fakeView.status),
          FAKE_VIEW_STDOUT: fakeView.stdout,
          FAKE_VIEW_STDERR: fakeView.stderr,
        },
      });
      return { status: child.status, stdout: child.stdout ?? '', stderr: child.stderr ?? '', error: child.error?.message ?? null };
    };

    await expect(publishBuiltPackage({ cwd, env: expectedTagEnv, run, tempRoot, log: vi.fn() })).rejects.toThrow(/npm view failed closed/);
    const invocations = (await readFile(callsFile, 'utf8')).trim().split(/\r?\n/).map(JSON.parse);
    expect(invocations.map((args) => args[0])).toEqual(['pack', 'view']);
    expect(invocations[0]).toContain('--ignore-scripts');
    expect(invocations[1]).toContain(`${packageName}@${version}`);
    expect(invocations.some((args) => args[0] === 'publish')).toBe(false);
  });

  it('runs the real CLI entrypoint and stops before npm on a divergent tag', async () => {
    const { cwd, tempRoot } = await fixture();
    const cli = path.join(process.cwd(), 'scripts/publish-package-cli.mjs');
    const child = spawnSync(process.execPath, [cli], {
      cwd,
      encoding: 'utf8',
      windowsHide: true,
      env: { ...process.env, GITHUB_REF_TYPE: 'tag', GITHUB_REF_NAME: 'v2.8.1', RUNNER_TEMP: tempRoot },
    });
    expect(child.status).toBe(1);
    expect(child.stderr).toMatch(/tag identity mismatch/);
  });

  it('runs the real CLI through its production npm resolution and an isolated offline npm shim', async () => {
    const { parent, cwd, tempRoot } = await fixture();
    const cli = path.join(process.cwd(), 'scripts/publish-package-cli.mjs');
    let nodeExecutable = process.execPath;
    const childEnv = { ...process.env, GITHUB_REF_TYPE: 'tag', GITHUB_REF_NAME: `v${version}`, RUNNER_TEMP: tempRoot };

    if (process.platform === 'win32') {
      const isolatedNode = path.join(parent, 'isolated-node');
      nodeExecutable = path.join(isolatedNode, path.basename(process.execPath));
      await mkdir(path.join(isolatedNode, 'node_modules/npm/bin'), { recursive: true });
      await copyFile(process.execPath, nodeExecutable);
      await writeFile(path.join(isolatedNode, 'node_modules/npm/package.json'), JSON.stringify({ type: 'module' }));
      await writeFile(path.join(isolatedNode, 'node_modules/npm/bin/npm-cli.js'), fakeNpmCliSource);
    } else {
      const fakeBin = path.join(parent, 'fake-bin');
      await mkdir(fakeBin);
      const fakeNpm = path.join(fakeBin, 'npm');
      await writeFile(fakeNpm, `#!${process.execPath}\n${fakeNpmCliSource}`);
      await chmod(fakeNpm, 0o755);
      childEnv.PATH = `${fakeBin}${path.delimiter}${process.env.PATH ?? ''}`;
    }

    const scenarios = [
      {
        name: 'confirmed E404 publishes the packed tarball',
        viewStatus: '1',
        viewStderr: `npm error code E404\nnpm error 404 No match found for version ${version}\nnpm error 404 'fokus-styles@${version}' could not be found`,
        expected: ['pack', 'view', 'publish'],
      },
      {
        name: 'DNS failure blocks publish',
        viewStatus: '1',
        viewStderr: 'npm error code ENOTFOUND\nnpm error syscall getaddrinfo',
        expected: ['pack', 'view'],
      },
      {
        name: 'authorization failure blocks publish',
        viewStatus: '1',
        viewStderr: 'npm error code E403\nnpm error 403 Forbidden',
        expected: ['pack', 'view'],
      },
      {
        name: 'existing divergent integrity blocks publish',
        viewStatus: '0',
        viewStdout: JSON.stringify({ name: packageName, version, dist: { integrity: 'sha512-AAAA' } }),
        expected: ['pack', 'view'],
      },
      {
        name: 'existing matching integrity is idempotent and skips publish',
        viewStatus: '0',
        viewStdout: JSON.stringify({ name: packageName, version, dist: { integrity: realCliIntegrity } }),
        expected: ['pack', 'view'],
      },
    ];
    const evidenceRuns = [];

    for (const [index, scenario] of scenarios.entries()) {
      const callsFile = path.join(parent, `calls-${index}.jsonl`);
      const env = {
        ...childEnv,
        FAKE_NPM_CALLS: callsFile,
        FAKE_VIEW_STATUS: scenario.viewStatus,
        FAKE_VIEW_STDOUT: scenario.viewStdout ?? '',
        FAKE_VIEW_STDERR: scenario.viewStderr ?? '',
      };
      const child = spawnSync(nodeExecutable, [cli], {
        cwd,
        encoding: 'utf8',
        timeout: 30_000,
        windowsHide: true,
        env,
      });
      const invocationLines = await readFile(callsFile, 'utf8').catch(() => '');
      const invocations = invocationLines.trim() ? invocationLines.trim().split(/\r?\n/).map(JSON.parse) : [];
      const actualCommands = invocations.map(({ args }) => args[0]);
      evidenceRuns.push({
        scenario: scenario.name,
        exitCode: child.status,
        stdout: child.stdout ?? '',
        stderr: child.stderr ?? '',
        invocations,
      });

      if (scenario.expected.at(-1) === 'publish') {
        expect(child.status, scenario.name).toBe(0);
      } else if (scenario.name.includes('matching integrity')) {
        expect(child.status, scenario.name).toBe(0);
      } else {
        expect(child.status, scenario.name).toBe(1);
      }
      expect(actualCommands, scenario.name).toEqual(scenario.expected);
      expect(invocations[0]?.resolvedFakeNpm, scenario.name).toBe(true);
      if (scenario.expected.includes('publish')) {
        const packedTarball = invocations[0].tarballPath;
        expect(invocations.at(-1).args[1], scenario.name).toBe(packedTarball);
      }
      expect(invocations.some(({ args }) => args[0] === 'publish'), scenario.name)
        .toBe(scenario.expected.includes('publish'));
    }
    if (process.env.FOKUS_RELEASE_TEST_EVIDENCE_DIR) {
      await mkdir(process.env.FOKUS_RELEASE_TEST_EVIDENCE_DIR, { recursive: true });
      await writeFile(
        path.join(process.env.FOKUS_RELEASE_TEST_EVIDENCE_DIR, 'real-cli-process-scenarios.json'),
        `${JSON.stringify(evidenceRuns, null, 2)}\n`,
        { flag: 'wx' },
      );
    }
  }, 30_000);
});

const fakeNpmCliSource = `
import { appendFileSync, existsSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
const args = process.argv.slice(2);
const callsFile = process.env.FAKE_NPM_CALLS;
if (!callsFile) throw new Error('FAKE_NPM_CALLS is required; refusing to invoke an unspecified npm');
const entry = { args, resolvedFakeNpm: import.meta.url.includes('npm-cli.js') || process.argv[1].includes('fake-bin') };
if (args[0] === 'pack') {
  const destination = args[args.indexOf('--pack-destination') + 1];
  const bytes = Buffer.from('isolated real-CLI fake npm tarball');
  const filename = 'fokus-styles-2.8.0.tgz';
  const tarballPath = path.join(destination, filename);
  writeFileSync(tarballPath, bytes, { flag: 'wx' });
  entry.tarballPath = tarballPath;
  const packIntegrity = 'sha512-' + createHash('sha512').update(bytes).digest('base64');
  process.stdout.write(JSON.stringify([{ name: 'fokus-styles', version: '2.8.0', filename, integrity: packIntegrity }]));
} else if (args[0] === 'view') {
  process.stdout.write(process.env.FAKE_VIEW_STDOUT || '');
  process.stderr.write(process.env.FAKE_VIEW_STDERR || '');
  process.exitCode = Number(process.env.FAKE_VIEW_STATUS || 0);
} else if (args[0] === 'publish') {
  process.stdout.write('FAKE_PUBLISH_ONLY');
} else {
  process.stderr.write('unexpected command in fake npm shim');
  process.exitCode = 2;
}
appendFileSync(callsFile, JSON.stringify(entry) + '\\n');
`;
