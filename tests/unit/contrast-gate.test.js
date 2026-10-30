import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import * as sass from 'sass';

const loadPaths = ['packages/fokus-core/scss', 'packages/fokus-components/scss'];
const source = readFileSync('scripts/contrast-report.scss', 'utf8');
function report(input = source) {
  const rows = [];
  sass.compileString(input, { loadPaths, logger: { debug: (row) => rows.push(row.split('|')) } });
  return rows;
}
function compile(module) {
  return sass.compileString(`@use "${module}";`, { loadPaths }).css;
}
function ratio(fg, bg) {
  const rows = [];
  sass.compileString(`@use "tools" as *; @debug contrast-ratio(${fg}, ${bg});`, {
    loadPaths, logger: { debug: (r) => rows.push(Number(r)) },
  });
  return rows[0];
}

describe('normal text contrast gate', () => {
  it('requires AA for every normal-text pair, including primary interaction states', () => {
    const rows = report();
    expect(rows).toHaveLength(57);
    expect(rows.filter(([, , status]) => status !== 'AA')).toEqual([]);
    expect(rows.filter(([id]) => /hover|active/.test(id))).toHaveLength(16);
    const output = execFileSync(process.execPath, ['scripts/contrast.mjs', '--strict'], { encoding: 'utf8' });
    expect(output).toContain('57 pares checados, 0');
  });

  it('rejects the former dark secondary 3.96:1, not merely ratios below 3', () => {
    const row = report(source.replace('secondary: 98%', 'secondary: 90%'))
      .find(([id]) => id.startsWith('dark: btn-secondary'));
    expect(row[1]).toBe('3.96');
    expect(row[2]).toBe('FAIL');
  });

  it('rejects the former brightness filters in real primary states', () => {
    const old = report(source.replaceAll('states.$primary-hover-brightness', '1.2')
      .replaceAll('states.$primary-active-brightness', '1.4'));
    expect(old.find(([id]) => id === 'dark: btn-primary text(light)/bg(dark) active')[2]).toBe('FAIL');
    expect(old.find(([id]) => id === 'light: btn-primary text/bg hover')[2]).toBe('FAIL');
  });

  it('checks the emitted dark token too, so duplicated report weights cannot hide regressions', () => {
    const css = compile('themes/dark');
    const bg = css.match(/--fs-color-secondary:\s*([^;]+);/)[1];
    expect(ratio('white', bg)).toBeGreaterThanOrEqual(4.5);
    const actual = ratio('white', bg).toFixed(2);
    expect(report().find(([id]) => id.startsWith('dark: btn-secondary'))[1]).toBe(actual);
  });

  it('uses the shared state constants in the emitted button CSS', () => {
    const css = compile('components/buttons');
    expect(css).toMatch(/\.fs-btn-primary:hover\s*\{\s*filter: brightness\(0\.98\)/);
    expect(css).toMatch(/\.fs-btn-primary:active\s*\{\s*filter: brightness\(0\.95\)/);
  });
});
