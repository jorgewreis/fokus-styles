> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Exemplos selecionados para o catálogo

`examples.json` reúne **67 exemplos: 56 básicos e 11 variações interativas**. Isso cobre
presença de exemplos, **não todas as variantes, estados ou combinações**.
O catálogo continua `complete: false`, candidato `next` não publicado,
sem certificação de produção ou WCAG.

## Procedência e adaptações

As 56 páginas de referência permanecem intactas. Cada fixture identifica
caminho, linha e commit de origem (`218afe4`) em `fixture-provenance.json`.
São 32 extrações literais e 24 adaptações rastreadas. As adaptações preservam
`sourceCode` e `sourceSha256` do bloco original, `sha256` do HTML final e
`transformations`. Quando estas são pares `{from,to}`, o teste reconstrói
exatamente o HTML final; descrições textuais registram adaptações revisadas.
Os registros novos também incluem hashes das implementações consultadas.
Todos os 56 blocos de origem foram confrontados com o commit declarado.

As adaptações completam fragmentos (Rating com cinco opções), nomeiam
controles/diálogos, oferecem destinos locais e substituem imagens ausentes
por iniciais, SVG ou data SVG autossuficientes. Input Group agora tem label
visível e descrição da moeda; não conserva a deficiência de nome acessível
registrada no checkpoint anterior de 32 exemplos. Não houve alteração de
runtime, SCSS ou páginas originais dos componentes.

## Execução e limites

24 exemplos incluem inicialização ESM explícita e limpeza em `pagehide`,
incluindo a factory assíncrona de confirmação. Use CSS e JS do mesmo
checkout; não se afirma compatibilidade com npm 2.7.0 publicado. Monte os
exemplos em contextos isolados: eles preservam IDs da documentação.

Cada entrada declara seus próprios limites. Exemplos de ações não excluem,
exportam ou enviam dados; navegação por âncoras não substitui roteador;
Range nativo não inicializa o JS opcional de preenchimento; Datepicker JS
não ganha restrições min/max inexistentes no runtime. File Upload Advanced
lista arquivos locais, não realiza upload. A CSP atual da prévia não inclui
`blob:` em imagens e pode bloquear suas miniaturas; a integração precisa
ser validada. Nenhuma destas limitações foi ocultada por uma promessa de
completude.

## Verificação desta ampliação (31/10/2026)

Node 24.22.1; comandos após `npm run build`:

- `npm test` — suíte geral e contratos das fixtures.
- `npm run test:catalog` — geração/HTTP/sandbox do catálogo.
- `npm run lint`, `npm run types:check`, `npm run docs:check`,
  `npm run package:check` — gates de manutenção.
- `npm run test:browsers -- tests/browser/catalog` — comportamento e axe
  selecionados nos três engines; não substitui auditoria manual.

Os contratos verificam HTML final, fonte original, hashes, classes
compiladas, IDs e referências ARIA. Há testes de teclado, cancelamento,
interrupção, exclusividade, teardown/reinicialização e 24 testes executando
os inicializadores realmente empacotados, cada um em jsdom isolado.
Esses testes **não** comprovam layout, foco físico ou renderização.

Build/lint/types/docs/package e quatro testes de catálogo passaram.
O relatório durável do checkpoint registra os totais finais de unitários
e de casos browser listados, com logs dos comandos.

A execução browser foi tentada novamente e bloqueou antes de qualquer
asserção útil: engine Playwright ausente. Na etapa anterior, Chromium do
sistema abortou por `socket() EPERM`, e a execução externa autorizada falhou
na preparação do ambiente. Visual e axe continuam sem execução bem-sucedida;
não foram geradas nem promovidas imagens de referência. Rodar em CI ou em
ambiente compatível permanece obrigatório antes de alegar validação browser.

## Histórico dos checkpoints

- 21 exemplos: reconstrução inicial, procedência literal.
- 32 exemplos: onze adições; 548 unitários passaram, 126 browser listados.
- 56 exemplos: 24 adições e correção de nome acessível no Input Group.
  Presença por componente atingida; cobertura de comportamento/variantes,
  acessibilidade manual e revisão visual permanecem parciais.


## Variações interativas (checkpoint posterior às 56 fixtures)

Veja [INTERACTIVE-OPTIONS.md](INTERACTIVE-OPTIONS.md): 11 exemplos adicionais,
22 testes DOM e 33 casos browser preparados. Os registros de procedência
`componente/id` preservam o bloco documental original e transformação exata;
registros sem sufixo continuam descrevendo exclusivamente a fixture básica.
Nenhuma alegação anterior de browser foi promovida a aprovação.
