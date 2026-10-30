import { describe, it, expect } from 'vitest';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, chmodSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import path from 'node:path';
const root = process.cwd();
const read = name => readFileSync(path.join(root, name), 'utf8');
const ci = read('.github/workflows/ci.yml');
const release = read('.github/workflows/release.yml');

describe('release pipeline contract', () => {
  it('reuses every CI gate, including the engine and browser matrix', () => {
    expect(ci).toContain('  workflow_call:');
    expect(release).toContain('uses: ./.github/workflows/ci.yml');
    expect(release).toContain('needs: validate');
    expect(release).not.toMatch(/if:.*always\(/);
    for (const script of ['lint', 'build', 'types:check', 'docs:check', 'contrast:check', 'size:check', 'test:visual', 'test:a11y', 'test:browsers']) {
      expect(ci).toContain(`npm run ${script}`);
    }
    for (const node of ['18', '20', '22', '24.10.0', '24.11.0', '24', '25', '26']) expect(ci).toContain(`node: '${node}'`);
    expect(ci).toContain('node scripts/check-engine-install.mjs ${{ matrix.expected }}');
  });
  it('packs once, validates and transfers the same archive', () => {
    expect(ci.match(/npm run package:prepare/g)).toHaveLength(1);
    expect(ci).toContain('npm run package:check -- release-package/package.tgz');
    expect(ci).toContain('npm run test:consumers -- release-package/package.tgz');
    expect(ci.indexOf('name: Upload validated package')).toBeGreaterThan(ci.indexOf('npm run test:consumers'));
    expect(ci).toContain('name: validated-package\n          overwrite: true');
    expect(release).toContain('name: validated-package');
    expect(release).toContain('sha256sum --check SHA256SUMS');
    expect(release).toContain('tar -xOf package.tgz package/package.json');
    expect(release).toContain('test "$TAG_VERSION" = "$PKG_VERSION"');
    expect(release).toContain('npm publish ./package.tgz --ignore-scripts --provenance --access public');
    expect(release).toContain("v.split('+')[0].includes('-') ? 'beta' : 'latest'");
    expect(release).toContain('--tag "$DIST_TAG"');
    expect(release).not.toMatch(/run: npm (?:ci|run build|pack)/);
    expect(release).not.toContain('actions/checkout');
    expect(release).toContain('test "$REMOTE_INTEGRITY" = "$LOCAL_INTEGRITY"');
  });
  it('maps prereleases away from latest using the actual workflow expression', () => {
    const expression = release.match(/console\.log\((v\.split[^\n]+)\)"\)/)[1];
    const tag = new Function('v', 'return ' + expression);
    for (const v of ['3.0.0-beta.1', '3.0.0-alpha.1', '3.0.0-rc.1']) expect(tag(v)).toBe('beta');
    for (const v of ['3.0.0', '3.0.1', '4.0.0', '3.0.0+build-123']) expect(tag(v)).toBe('latest');
  });
  it('keeps manual directory publication from bypassing package and consumer gates', () => {
    const { scripts } = JSON.parse(read('package.json'));
    for (const gate of ['lint', 'build', 'types:check', 'docs:check', 'package:check', 'test:consumers', 'contrast:check', 'size:check']) {
      expect(scripts.prepublishOnly).toContain(`npm run ${gate}`);
    }
  });
});

describe('package validation reads the supplied archive, not the checkout', () => {
  function fixture(css) {
    const dir = mkdtempSync(path.join(tmpdir(), 'fokus-archive-test-'));
    const pkg = path.join(dir, 'package');
    mkdirSync(path.join(pkg, 'dist/css'), {recursive:true});
    mkdirSync(path.join(pkg, 'dist/js'), {recursive:true});
    writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({name:'fokus-styles', version:'0.0.0-fixture'}));
    writeFileSync(path.join(pkg, 'README.md'), '**Status:** `0.0.0-fixture`');
    mkdirSync(path.join(pkg, 'docs/reference'), {recursive:true});
    const stability = read('docs/reference/stability.md');
    writeFileSync(path.join(pkg, 'docs/reference/stability.md'), stability);
    const summary = stability.match(/<!-- maturity-summary:start -->[\s\S]*?<!-- maturity-summary:end -->/)[0];
    writeFileSync(path.join(pkg, 'USAGE.md'), `${summary}
[policy](docs/reference/stability.md)
não significa instalação npm sem dependências
\`\`\`html
<div class="archive-only">Hello</div>
<button data-fs="modal" data-fs-target="#fixture-modal">Open</button>
<div id="fixture-modal"><button data-fs-dismiss="modal">Close</button></div>
\`\`\``);
    writeFileSync(path.join(pkg, 'dist/css/fokus.css'), css);
    // Minimal archived fixture, deliberately independent of checkout runtime bytes.
    writeFileSync(path.join(pkg, 'dist/js/fokus.js'), `
      const target = document.querySelector('#fixture-modal');
      document.querySelector('[data-fs="modal"]').onclick = () => target.setAttribute('aria-hidden', 'false');
      document.querySelector('[data-fs-dismiss="modal"]').onclick = () => target.setAttribute('aria-hidden', 'true');
    `);
    const tarball = path.join(dir, 'fixture.tgz');
    execFileSync('tar', ['-czf', tarball, '-C', dir, 'package']);
    return {dir, tarball};
  }
  it.each([
    ['.archive-only { display:block; }', true],
    ['.different { display:block; }', false],
  ])('validates archived examples against archived CSS (%s)', (css, passes) => {
    const {dir, tarball} = fixture(css);
    try {
      const result = spawnSync(process.execPath, ['scripts/check-consumer-package.mjs', tarball], {cwd: root, encoding:'utf8'});
      expect(result.status === 0).toBe(passes);
      if (!passes) expect(result.stderr).toContain('Example class absent from compiled CSS: archive-only');
    } finally { rmSync(dir, {recursive:true, force:true}); }
  });
  it('rejects a missing tarball rather than silently repacking the checkout', () => {
    const result = spawnSync(process.execPath, ['scripts/check-consumer-package.mjs', '/no-such-archive.tgz'], {cwd:root, encoding:'utf8'});
    expect(result.status).not.toBe(0);
  });
});


describe('publication shell with simulated registry (no network or publishing)', () => {
  const script = release.split('      - name: Publish validated fokus-styles tarball')[1]
    .split('        run: |\n')[1].split('        env:')[0]
    .split('\n').map(line => line.replace(/^          /, '')).join('\n');
  it.each([
    ['absent', '3.0.0-beta.1', true, 'beta'],
    ['absent', '3.0.0', true, 'latest'],
    ['existing', '3.0.0-beta.1', true, ''],
    ['mismatch', '3.0.0-beta.1', false, ''],
    ['auth', '3.0.0-beta.1', false, ''],
    ['network', '3.0.0-beta.1', false, ''],
  ])('%s registry / %s', (scenario, version, passes, tag) => {
    const dir = mkdtempSync(path.join(tmpdir(), 'fokus-publish-mock-'));
    try {
      const bytes = Buffer.from('safe simulated tarball');
      writeFileSync(path.join(dir, 'package.tgz'), bytes);
      writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({name:'fokus-styles',version}));
      writeFileSync(path.join(dir, 'SHA256SUMS'), createHash('sha256').update(bytes).digest('hex')+'  package.tgz\n');
      const integrity = 'sha512-'+createHash('sha512').update(bytes).digest('base64');
      writeFileSync(path.join(dir, 'npm'), `#!/bin/sh
if [ "$1" = publish ]; then printf '%s\\n' "$*" > publish-called; exit 0; fi
if [ "$3" = dist.integrity ]; then
  if [ "$SCENARIO" = mismatch ]; then echo wrong; else echo "$INTEGRITY"; fi
  exit 0
fi
case "$SCENARIO" in
 existing|mismatch) echo '"3.0.0-beta.1"'; exit 0;;
 absent) echo 'npm error code E404' >&2; echo '{"error":{"code":"E404"}}'; exit 1;;
 auth) echo '{"error":{"code":"E401"}}'; exit 1;;
 network) echo 'network unavailable'; exit 1;;
esac
`);
      chmodSync(path.join(dir, 'npm'), 0o755);
      const result = spawnSync('bash', ['-e', '-o', 'pipefail', '-c', script], {cwd:dir,encoding:'utf8',env:{...process.env,PATH:dir+':'+process.env.PATH,SCENARIO:scenario,INTEGRITY:integrity}});
      expect(result.status === 0, result.stderr).toBe(passes);
      if(tag) expect(readFileSync(path.join(dir,'publish-called'),'utf8')).toContain('--tag '+tag);
      else expect(() => readFileSync(path.join(dir,'publish-called'))).toThrow();
    } finally { rmSync(dir,{recursive:true,force:true}); }
  });
  it('serializes release jobs for the package without cancelling validation', () => {
    expect(release).toContain('group: release-fokus-styles');
    expect(release).toContain('cancel-in-progress: false');
  });
});
