# Exemplos selecionados para o catálogo

`examples.json` reúne 32 exemplos mínimos, não o catálogo completo de 56
componentes. As fontes HTML são cópias literais do primeiro bloco HTML da
página de cada componente na base PR #41 (`218afe4`). Caminho, linha, SHA-256
e commit completo estão em `fixture-provenance.json`.

Os sete exemplos interativos têm inicialização ESM explícita em arquivos
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

## Validação anterior (21 exemplos)

Node 24.22.1: build, lint, types, docs e package check aprovados. Os 25
checks focados (21 contratos + quatro fluxos jsdom) passaram. A suíte
browser contém 78 casos listados nos três engines, mas **não foi executada
com sucesso neste ambiente**: o download do Chromium Playwright retornou
arquivo ZIP inválido e o Chromium do sistema não iniciou por restrição de
socket do sandbox. A tentativa autorizada de execução externa também falhou
na preparação do ambiente. A validação browser permanece pendente em CI ou
ambiente compatível; jsdom não comprova layout, foco real ou renderização.

## Ampliação de 31/10/2026 (32 exemplos)

Foram acrescentados Close Button, Code, File Upload nativo, Input Group,
List Group, Placeholder, Range nativo, Responsive, Dropdown, Tag e Stepper.
O manifesto preserva os limites de cada trecho; Input Group não tem nome
acessível na fonte e **não** é um exemplo aprovado de acessibilidade. Range
não inicializa o JS opcional de preenchimento da trilha; Close Button não
fecha o aviso e File Upload não envia arquivos.

Os 32 HTMLs foram comparados literalmente com o commit de origem e suas
linhas. Os onze novos registros incluem hashes das implementações SCSS/JS
consultadas; a suíte verifica esses hashes, as classes compiladas e os IDs.
Não foram alterados o runtime nem as 56 páginas de referência.

Validação local com Node 24.22.1:

- Build, lint, types, docs, package check e testes de catálogo aprovados.
  Package check usou cache npm gravável em `/tmp` após falha no cache padrão.
- 548 testes unitários passaram em 48 arquivos; destes, 39 verificam as
  fixtures (32 contratos e sete fluxos interativos).
- 126 casos browser estão **listados**, não aprovados: 42 por engine.
  Incluem cinco novos cenários de controles nativos, breakpoint/movimento
  reduzido e interação/teardown dos três componentes JS adicionados.
- Browser, visual e a11y foram tentados e bloqueados antes da execução útil
  pela ausência do engine Playwright. O Chromium do sistema abortou com
  `socket() failed: Operation not permitted`; a execução externa autorizada
  falhou na preparação do ambiente. Não há validação visual, axe ou browser
  bem-sucedida para esta ampliação. Os testes jsdom não a substituem.

Permanecem 24 componentes sem fixture selecionada, além de variantes e
combinações não cobertas dos 32 presentes. A cobertura continua parcial,
sem certificação de produção/WCAG e sem publicação.
