> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Conteúdo e estrutura — variantes locais adicionais

Base: `519afe3`, matriz de lacunas de 31/10/2026. Esta frente adiciona **12
exemplos** aos 90 existentes (102 no clone isolado), mantendo Card
`variants`, `states` e `tokens` sem duplicação. Catálogo `next`, parcial e não
publicado; nenhum runtime em `packages/` ou `scss/` foi alterado.

| Componente | Variantes/composições | Personalização |
| --- | --- | --- |
| Tile | sm/lg, ações abaixo, link estendido único com destino local | superfície, ícone, borda, texto e raios |
| ListGroup | links nativos, seleção estática `is-active` + `aria-current` | padding, superfície, hover, borda e raio |
| Code | inline, bloco longo rolável, HTML escapado | cores inline/bloco, padding e raios |
| Divider | hr semântico e linha rotulada visual | cores de borda e rótulo |
| Ratio | 1:1, 4:3, 16:9, 21:9 com imagem SVG embutida | 3:2 via `--fs-ratio: 66.6667%` |
| Responsive | stack-md-row, cluster wrap e mídia natural | `--fs-stack-gap` e `--fs-cluster-gap` |

As variantes de Code, Divider, ListGroup e Responsive são composições das
classes existentes, não novas APIs. Não há novos estados disabled/loading,
realce de sintaxe ou comportamento de seleção inventados. ListGroup não
atualiza `aria-current` automaticamente: o exemplo é uma fotografia de estado.
Tile usa `--fs-color-subtle` no ícone conforme SCSS (a documentação histórica
cita bg-subtle). Cores personalizadas ficam escopadas, intencionalmente fixas
nos dois temas. Imagens não dependem de rede; legendas Ratio ficam fora do
frame. Responsive demonstra o breakpoint literal 640px, não o token md.

## Evidência e reprodução

`evidence/content-variants/provenance.json` registra commit base e SHA-256 das
fontes/fixtures; `audit-input.json` preserva a matriz original e seu hash.

- `npm run build`
- `npm test -- tests/unit/catalog-content-variants.test.js`
- `npm run docs:generate && npm run docs:check`
- `npm run test:catalog`
- `CHROMIUM_EXECUTABLE=/usr/bin/chromium node scripts/catalog-content-variants-check.mjs`

O teste unitário verifica 12 registros, classes compiladas, links locais,
semântica pre/code, filho único de mídia e consumo real de todos os tokens
sobrescritos. O script browser cobre temas claro/escuro e larguras
375/639/640/1280, overflow, proporções, carregamento de imagens e breakpoint.

**Browser bloqueado, não aprovado:** Chromium abortou antes da primeira
página com SIGABRT/socket não permitido. A execução ampliada falhou na montagem
bwrap antes do comando. Logo não há alegação de validação visual, contraste,
zoom, RTL, teclado real ou conformidade WCAG; não foram criados snapshots
não inspecionados. Logs dos gates estão em `evidence/content-variants/`.

Gates já executados: build, lint, types:check, package:check (cache npm em
`/tmp`), docs:check e 4 testes de catálogo passaram; 119 testes unitários
focalizados passaram. O teste de contagem da base agora aceita expansões
aditivas (>=90), preservando a contagem histórica documentada nessa frente.

Suíte unitária completa após integração: **740/740 testes**, 58 arquivos, passaram.
