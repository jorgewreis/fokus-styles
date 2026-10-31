# Exemplos selecionados para o catálogo

`examples.json` reúne 12 exemplos mínimos, não o catálogo completo de 56
componentes. As fontes HTML são cópias literais do primeiro bloco HTML da
página de cada componente na base PR #41 (`218afe4`). Caminho, linha, SHA-256
e commit completo estão em `fixture-provenance.json`.

Os quatro exemplos interativos têm inicialização ESM explícita em arquivos
`.js`. Use o CSS e JS do mesmo checkout/candidato: o manifesto não afirma
compatibilidade com o npm 2.7.0 publicado. Os exemplos devem ser montados em
contextos isolados, pois preservam os IDs originais da documentação.

O teste unitário verifica literalidade, hash, IDs/referências e presença das
classes no CSS compilado. O teste browser verifica controles nativos e
abertura/fechamento, troca, teardown e reinicialização dos exemplos
interativos. Esses testes não são uma auditoria exaustiva de variantes,
responsividade, contraste, leitores de tela ou equivalência visual.

Depois de `npm run build`:

- `npm test -- tests/unit/catalog-fixtures.test.js`
- `npm run test:browsers -- tests/browser/catalog-fixtures.spec.mjs`

Não houve mudança no runtime nem nas páginas fonte dos componentes.

## Validação desta reconstrução

Node 24.22.1: build, lint, types, docs e package check aprovados. Os 16
checks focados (12 contratos + quatro fluxos jsdom) passaram. A suíte
browser contém 51 casos listados nos três engines, mas **não foi executada
com sucesso neste ambiente**: o download do Chromium Playwright retornou
arquivo ZIP inválido e o Chromium do sistema não iniciou por restrição de
socket do sandbox. A tentativa autorizada de execução externa também falhou
na preparação do ambiente. A validação browser permanece pendente em CI ou
ambiente compatível; jsdom não comprova layout, foco real ou renderização.
