import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateConsumerDocs } from '../../scripts/lib/consumer-docs-contract.mjs';
const read = name => readFileSync(name, 'utf8');
const input = { guide: read('USAGE.md'), stability: read('docs/reference/stability.md'), pkg: JSON.parse(read('package.json')) };
describe('distributed consumer documentation', () => {
  it('keeps maturity and dependency statements consistent with this package', () => {
    expect(validateConsumerDocs(input)).toEqual([]);
    expect(input.pkg.files).toContain('docs/reference/stability.md');
  });
  it('rejects a silently promoted experimental component', () => {
    expect(validateConsumerDocs({ ...input, guide: input.guide.replace('DataTable,', '') })).not.toEqual([]);
  });
  it('rejects missing maturity information and local policy links', () => {
    expect(validateConsumerDocs({ ...input, guide: '' })).not.toEqual([]);
  });
  it('requires newly installed dependencies to be disclosed', () => {
    expect(validateConsumerDocs({ ...input, pkg: { dependencies: { ...input.pkg.dependencies, 'new-tool': '*' } } })).toContain('Undocumented npm dependency: new-tool');
  });
  it('rejects dropping the browser/npm distinction', () => {
    expect(validateConsumerDocs({ ...input, guide: input.guide.replace('não significa instalação npm sem dependências', '') })).not.toEqual([]);
  });
});
