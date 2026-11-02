> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Formulários — exemplos adicionais (31/10/2026)

Candidato local **não publicado**, baseado no commit `68bc915`. Cinco novos
exemplos `states`, sem mudança em runtime, SCSS ou contratos TypeScript.
A matriz `/workspace/shared/catalog-gap-audit-20261031/matrix.json` orientou a
priorização; ausência estática de classe gerada não é defeito de cobertura.

## Cobertura delimitada

| Componente | Demonstração | Fonte do contrato |
|---|---|---|
| Combobox | `placement` explícito sobre `data-placement`, menu sm, indisponível, vazio, Home/End e evento | `combobox.js/.d.ts` |
| Datepicker | `placement`, input lg, 31/01 → 28/02 via PageDown, evento ISO; date/time nativos separados | `datepicker.js/.d.ts` |
| Select | `data-size=sm/lg`, disabled inicial, opção indisponível, reset nativo | `select.js/.d.ts` |
| FileUploadAdvanced | handles do evento added, 50/100%, erro/recuperação, remoção, getFiles e limpeza | `file-upload-advanced.js/.d.ts` |
| Range | RangeSlider, output, min negativo, step 25, sm/lg/xl, disabled | `range.js/.d.ts`, `forms/_range.scss` |

## Acessibilidade e limites

- Combobox recebe `aria-disabled` explícito nos itens indisponíveis; texto
  digitado não é seleção confirmada. Não promete busca remota/multiple.
- Datepicker nomeia o grid consultando `panelEl`, propriedade pública tipada;
  `gridEl` não consta nos tipos. Não há min/max/locale tipados. Controles
  nativos date/time não são inicializados como calendário customizado.
- Select nomeia o botão gerado e sinaliza opções indisponíveis localmente.
  Isso não é correção do runtime nem extensão de contrato. Somente sm/lg
  são lidos pelo JS; não simulamos xs/xl, multiple ou optgroup.
- Upload é simulação sem rede. `getFiles()` é a lista autoritativa do
  componente; remoção não altera FileList nativo. `dispose()` revoga URLs,
  mas a fixture remove o markup residual e limpa input/listeners próprios.
- Range usa teclado nativo e JS somente para output/preenchimento. Não
  declara cobertura vertical, toque, leitor de tela ou equivalência visual
  entre motores. Alteração programática de value exige evento input.
- Análises axe e testes de teclado browser estão escritos, mas dependem de
  execução em ambiente com navegadores. Não é certificação WCAG.

## Proveniência

Novos exemplos têm entradas `component/states` em `fixture-provenance.json`,
modo `authored-runtime`, hash do HTML e hashes JS/d.ts verificados. Não são
rotulados como extrações literais da documentação histórica. O teste mantém
as verificações históricas dos exemplos basic e verifica hashes/classes/IDs,
associações ARIA, limites e teardown dos exemplos novos.

## Verificação local

- Build, lint SCSS, types:check, docs:check e package:check: passaram.
- Suite completa Vitest: **54 arquivos / 646 testes passaram**, com
  `npm_config_cache=/tmp/form-npm-cache npm test -- --maxWorkers=2 --testTimeout=30000`.
- Seleção direcionada: 102 testes passaram; após ajuste da consulta do menu
  portaled, os 5 comportamentos e 68 verificações de markup passaram novamente.
- `test:catalog`: 4 testes passaram (inclui HTTP allowlist/CSP).
- Playwright: 30 casos planejados (10 x Chromium/Firefox/WebKit) **não
  executaram seus corpos**: binários não instalados. Sem declaração de
  aprovação de axe, visual ou teclado real. Não se tentou instalar/escalar.
- Primeira suite encontrou o gate de proveniência de exemplo único e nomes
  hardcoded; os testes foram generalizados. Timeouts de 5 s em contraste e
  empacotamento sumiram com 2 workers/30 s. Cache npm padrão não gravável foi
  substituído por diretório em /tmp. Nenhuma falha foi ocultada por skip.

Os testes browser estão em `tests/browser/catalog-form-states.spec.mjs`;
comportamento JSDOM em `tests/unit/catalog-form-states.test.js`.
