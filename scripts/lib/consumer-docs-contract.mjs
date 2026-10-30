// Kept dependency-free so both unit tests and the real tarball gate use this contract.
export function validateConsumerDocs({ guide, stability, pkg }) {
  const failures = [];
  const summary = text => text.match(/<!-- maturity-summary:start -->([\s\S]*?)<!-- maturity-summary:end -->/)?.[1];
  if (!summary(guide) || summary(guide) !== summary(stability)) {
    failures.push('USAGE maturity summary must match the distributed stability policy');
  }
  for (const tier of ['Núcleo essencial', 'Extensões de interface', 'Avançados / experimentais sob observação', 'Ecossistema opcional']) {
    if (!summary(guide)?.includes(`| ${tier} |`)) failures.push(`Missing maturity tier: ${tier}`);
  }
  if (!guide.includes('(docs/reference/stability.md)')) failures.push('Missing local stability policy link');
  for (const dependency of Object.keys(pkg.dependencies ?? {})) {
    if (!guide.includes(`\`${dependency}\``)) failures.push(`Undocumented npm dependency: ${dependency}`);
  }
  if (!guide.includes('não significa instalação npm sem dependências')) failures.push('Missing npm/browser dependency distinction');
  return failures;
}
