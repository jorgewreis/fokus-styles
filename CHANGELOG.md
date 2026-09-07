# Changelog

## [2.6.0] - 2026-09-07

- refina visualmente Checkbox, Radio e Switch com tokens próprios, propriedades lógicas e área de interação consistente;
- adiciona estados hover, active, valid, invalid, forced colors e reduced motion aos controles nativos;
- aprimora o Switch com trilho neutro, thumb elevado, halo de hover e feedback active;
- documenta grupos com `fieldset/legend`, `aria-describedby`, RTL e tokens de componente.

## [2.5.0] - 2026-09-07

- expande a Utility API com display, flex, gap, tipografia, estados e variantes responsivas configuráveis;
- padroniza APIs estáticas de Dropdown, Tabs e Carousel e eventos comuns `fs:shown`/`fs:hidden`;
- adiciona pausa de Toast por foco/hover, layouts Stack/Cluster e regras responsivas para telas estreitas;
- reforça composição RTL, forced colors, redução de movimento e layouts responsivos sem alterar a API `fs-*` existente.

## [2.4.0] - 2026-09-07

- adiciona preset `fokus-rtl.css` e export `fokus-styles/rtl.css`;
- amplia tokens para `prefers-contrast: more` e regras de `forced-colors: active`;
- documenta RTL, alto contraste, foco e preferências de movimento/cor do sistema.

## [2.3.0] - 2026-09-07

- adiciona registro compartilhado de overlays, evitando múltiplos Modal/Offcanvas concorrentes;
- amplia o contrato TypeScript do núcleo de overlay;
- mantém o gerenciamento de foco, `inert`, scroll lock e eventos `fs:*` coordenados entre componentes.

## [2.2.0] - 2026-09-07

- adiciona Utility API Sass configurável para cores, espaçamento, sizing e variantes responsivas;
- adiciona tokens de configuração para presets e inclusão seletiva de famílias de utilitários;
- adiciona `Spinner`, `Pagination` dinâmica e fallback de Scrollspy sem `IntersectionObserver`;
- adiciona suporte a `inert`/`aria-hidden` no focus trap e estilos do spinner com redução de movimento.

## Unreleased

- refina o Carousel com tokens locais, controles compactos, indicadores em
  pill, legendas opt-in, arraste aprimorado e autoplay pausável/retomável;
- consolida tokens públicos de foco, transição, densidade, alturas e padding dos controles;
- adiciona suporte CSS global a `prefers-reduced-motion`;
- reorganiza o índice da documentação e adiciona `npm run docs:check` ao fluxo local e ao CI;
- atualiza a baseline de tamanho e os snapshots visuais afetados pelo refinamento dos componentes.
- define fundos semânticos explícitos para superfícies, controles, navegação,
  accordions, calendários, dropdowns e ordenação de tabelas.
- consolida os mockups em seis laboratórios documentados, com âncoras estáveis,
  preview funcional, código sincronizado, temas e cobertura de regressão visual;
  preserva as fontes executáveis em `mockup/examples/` para testes de interação
  e acessibilidade.

- atualiza as baselines visuais Linux dos mockups após o refinamento dos componentes;\n- consolidates visual tokens for spacing, control heights, overlay layers and
  contrast-aware content colors;
- refines focus-visible states, responsive form controls and overlay widths;
- improves dropdown, tooltip, popover and datepicker positioning on resize and
  scroll, while restoring DOM/style state on disposal;
- strengthens modal/offcanvas/accordion/tabs semantics and adds manual tab
  activation;
- adds typed DataTable sorting and busy-state feedback;
- hardens date parsing, transition fallback and scroll-lock restoration.

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere a [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

## [1.0.0] - 2026-07-08

> As versões `0.3.1`–`0.6.0` foram tags de checkpoint cortadas em sequência
> rápida durante o mesmo arco contínuo de desenvolvimento rumo à v1.0.0
> (sem changelog próprio por versão) — todo o trabalho acumulado desde a
> `0.3.0` está consolidado nesta entrada única, que corresponde ao corte
> da primeira versão estável do framework.

### Added

- **Templates prontos e página comparativa**: 4 templates
  completos e prontos pra copiar em `mockup/templates/` (`dashboard.html`,
  `auth.html`, `landing.html`, `admin.html`), montados só com componentes/
  utilitários já publicados (`dist/css`/`dist/js`), com tema escuro
  funcional (mesmo mecanismo de `docs/guides/dark-mode.md`) — referenciados
  em `docs/README.md#templates-prontos`. Nova página
  [`docs/comparison.md`](docs/comparison.md) ("Clarus vs Bootstrap vs
  Tailwind CSS"): tabelas de filosofia, tamanho de bundle, dependências e
  tema escuro nativo, com dados públicos e reproduzíveis (arquivos
  oficiais publicados de cada framework, medidos localmente com o mesmo
  método do gate de CI — `gzip` nível 9) em vez de números estimados;
  benchmarks de performance ao vivo marcados explicitamente como
  "pendente de metodologia" em vez de omitidos silenciosamente.

### Fixed

- `.fs-empty-state[hidden]` não escondia o elemento: `.fs-empty-state`
  define `display: flex` em `@layer components`, e author styles sempre
  vencem a regra `[hidden] { display: none }` do user-agent stylesheet,
  mesmo dentro de `@layer` — sem uma regra author explícita pro atributo
  `hidden`, ele não tinha efeito nenhum. Descoberto ao construir o
  template `dashboard.html` (sub-fase 5.13): `DataTable`
  (`packages/clarus-js/js/datatable.js`) alterna esse atributo em
  `this.emptyEl`/`this.errorEl`, então o estado vazio/erro ficava sempre
  visível por baixo da tabela com dados — inclusive no mockup oficial
  (`mockup/datatable.html`, baseline visual atualizada). Corrigido com
  `.fs-empty-state[hidden] { display: none; }` em
  `packages/clarus-components/scss/components/_empty-state.scss`, mesmo
  padrão já usado em `.fs-notification-badge[hidden]`/
  `.fs-notification-empty[hidden]`.

### Changed

- Dogfooding do `clarus-icons`: emoji usados como placeholder de ícone em
  mockups/docs (Empty State, Tile, Notification Center, DataTable)
  trocados por SVGs reais do pacote — nenhum lugar oficial do projeto usa
  emoji como ícone hoje. [Rating](docs/components/rating.md) também
  trocou o glifo `★` pelo ícone `star` (contorno vazio por padrão,
  preenchido via `fill: currentcolor` quando selecionado/hover — imita o
  visual sólido do glifo antigo sem perder o estado "vazio"); cada
  `<label>` ganhou `aria-label` (`"5 estrelas"` etc.), obrigatório agora
  que o ícone é `aria-hidden`. Pagination ganhou ícones
  (`chevron-left`/`chevron-right` no lugar de `«`/`»`, `ellipsis` pra
  intervalo de páginas omitido — variação nova, documentada), e o pager
  gerado por `DataTable` (`packages/clarus-js/js/datatable.js`) trocou
  `‹`/`›` pelos mesmos chevrons (SVG embutido como string — `clarus-js`
  não pode depender do pacote opcional `clarus-icons` em runtime).
  `.fs-btn`/`.fs-badge`/`.fs-alert`/`.fs-breadcrumb-item a` ganharam `gap`
  próprio pra espaçar ícone+texto corretamente (antes só funcionava por
  acidente, via colapso de espaço em branco do HTML); ajustado
  `.fs-dropdown-toggle::after` (removido `margin-left` redundante, já que
  agora conta como item flex do `.fs-btn` e herda o `gap`). Pagination
  ganhou `aria-label`/`aria-hidden` explícitos nos itens só-ícone.

### Added

- **DX e supply-chain**: `.d.ts`
  hand-escritos para toda a API JS pública (`packages/clarus-js/js/*.d.ts`,
  um por módulo + `clarus.d.ts` agregador + `global.d.ts` pro uso via
  `<script>`), validados por `npm run types:check` (`tsc --noEmit`) contra
  um exemplo de uso real (`tests/types/clarus.test-d.ts`) — gate novo no
  CI. Corrigido bug real descoberto ao validar o subpath export
  (`clarus-css/js/modal.js`, o formato documentado em `usage.md`): o
  padrão `"./js/*"` do `exports` do `package.json` duplicava a extensão
  `.js` (`modal.js.js`), quebrando qualquer import direto de um módulo —
  nunca fora exercitado por um import real antes desta sub-fase.
  `npm publish --provenance` no novo `.github/workflows/release.yml`
  (dispara em tags `v*.*.*`, publica `clarus-css`+`clarus-icons`).
  `.github/FUNDING.yml` e `.github/dependabot.yml` (npm + github-actions,
  semanal). Utilitários de impressão (`.u-print-hide`/`.u-print-only`/
  `.u-print-block`/`-inline`/`-inline-block`,
  `packages/clarus-utilities/scss/utilities/_print.scss`), documentados em
  `docs/guides/print.md`. Página kitchen sink
  (`mockup/kitchen-sink.html`) com um exemplo compacto de cada componente,
  dois temas — smoke test visual rápido, referenciada em `docs/README.md`.

- **Presets de tema, `clarus-cli`, tokens de gráficos, forms extras e wrapper React**:
  - Dois novos presets de marca em
    `packages/clarus-core/scss/themes/_brands.scss`: `corporate`
    (azul-marinho sóbrio) e `vibrant` (laranja energético) — mesma técnica
    OKLCH do preset `violet` existente. O primitivo do "vibrant" é claro o
    bastante pra o texto branco padrão de `.fs-btn-primary`/
    `.fs-badge-primary` cair abaixo de 4.5:1 (pego pelo gate `test:a11y`);
    corrigido com um override em `@layer overrides` (a camada de maior
    prioridade — cascade layers ignoram especificidade, então um seletor
    mais específico dentro de `@layer tokens` perderia mesmo assim). Ao
    investigar o fix, descoberto que `.fs-badge-primary` fixava `color`
    diretamente (ao contrário de `.fs-btn-primary`, que já seguia a
    convenção de só sobrescrever uma custom property) — alinhado
    (`--fs-badge-color`/`--fs-badge-bg`, mesmo padrão de `.fs-btn`).
  - Pacote `clarus-cli` (`packages/clarus-cli/`): comandos `build`
    (compila um entry `.scss` de um projeto consumidor com o mesmo
    pipeline sass→autoprefixer→cssnano do build interno), `theme` (gera um
    preset `data-fs-brand` em CSS puro via `color-mix()`, sem dependência de
    Sass, decidindo automaticamente `--fs-btn-color`/`--fs-badge-color`
    pelo contraste com a cor informada) e `analyze` (tamanho bruto/gzip de
    qualquer arquivo, versão genérica de `scripts/size.mjs`).
  - Tokens de gráficos agnósticos de biblioteca (`--fs-chart-series-1..6`,
    `--fs-chart-grid`, `--fs-chart-axis`, `--fs-chart-tooltip-bg/text`,
    `packages/clarus-core/scss/tokens/_charts.scss`) — aliases da camada
    semântica existente, sem wrapper de nenhuma lib específica. Documentado
    em `docs/guides/charts.md`, mockup `mockup/charts.html`.
  - Range/Slider (`.fs-form-range`,
    `packages/clarus-components/scss/forms/_range.scss`): trilha/thumb
    estilizados via pseudo-elementos vendor-prefixados; teclado e ARIA já
    vêm do `<input type="range">` nativo. JS opcional
    (`packages/clarus-js/js/range.js`, `data-fs="range"`) só pinta a
    trilha preenchida (`--fs-range-percent`, necessário porque só o
    Firefox suporta `::-moz-range-progress`) e espelha o valor num
    `<output>` associado. Documentado em `docs/components/range.md`,
    mockup `mockup/range.html`.
  - Upload avançado (`packages/clarus-js/js/file-upload-advanced.js`,
    `data-fs="file-upload-advanced"`): evolução do File Upload simples —
    múltiplos arquivos, preview (thumbnail de imagem via
    `URL.createObjectURL`, nome, tamanho), progresso individual
    (`setProgress`/`setError`, reusa `.fs-progress`) e remoção por item.
    Agnóstico de backend (não faz upload de verdade, só expõe a API pro
    consumidor plugar o próprio XHR/fetch). Documentado em
    `docs/components/file-upload-advanced.md`, mockup
    `mockup/file-upload-advanced.html`.
  - Pacote `clarus-react` (`packages/clarus-react/`): wrapper React fino
    (`ModalTrigger`/`ModalPanel`, `DropdownTrigger`/`DropdownMenu`,
    `TabList`) — cada componente só instancia a classe vanilla
    correspondente (`clarus-css/js/*`) sobre o elemento renderizado pelo
    React e desfaz no unmount, sem reimplementar comportamento. Cobertura
    parcial e deliberada (só React, só 3 componentes cobrindo os dois
    formatos de contrato do `clarus-js`) — serve de molde pros demais.
  - Placeholder estrutural de showcase de produção (`docs/showcase.md`) —
    sem casos fictícios nem métricas inventadas, aguardando projetos reais.
  - `.github/workflows/ci.yml` ganhou o gate `npm run types:check`.

- **Pacote `clarus-icons`**: 1994 ícones SVG do conjunto [Lucide](https://lucide.dev) (ISC),
  gerados em build-time a partir do devDependency `lucide-static`
  (`scripts/build-icons.mjs`, `npm run build:icons`) — o pacote publicado
  não tem nenhuma dependência de runtime. Dois formatos de consumo: SVG
  puro (`clarus-icons/svg/<nome>.svg`) e módulos ES tree-shakeable
  (`clarus-icons/icons/<nome>.js`, mais um barrel `clarus-icons` com nomes
  em camelCase). Nova classe utilitária `.fs-icon` (com `-xs`/`-sm`/`-lg`/`-xl`)
  em `packages/clarus-utilities/scss/utilities/_icon.scss`, sempre
  disponível no `clarus-css` independente do pacote de ícones estar
  instalado. Documentado em `docs/guides/icons.md`, mockup
  `mockup/icons.html`, 5 testes unitários cobrindo a geração (limpeza do
  SVG, `stroke="currentColor"`, colisões de nome no barrel). Licenças
  (`LICENSE` MIT do Clarus + `LICENSE-LUCIDE.txt` ISC/Feather) distribuídas
  junto do pacote.

- **Matriz de compatibilidade e guia de migração externa**:
  `docs/reference/browser-support.md` ganhou uma **matriz de
  compatibilidade explícita por feature** (`@layer`, `color-mix()`/OKLCH,
  `@container`, `:focus-visible`, `prefers-reduced-motion`) — navegador
  mínimo com suporte nativo × comportamento de fallback documentado por
  recurso, em vez de só o alvo geral do `.browserslistrc`. Novo guia
  `docs/guides/migration-external.md`: tabela de equivalência de
  classes/componentes pra quem migra de outro framework CSS pro Clarus
  (utilitários, componentes, o que não migra 1:1, checklist). Corrigida
  também uma lacuna no índice (`docs/README.md`): DataTable, Command
  Palette e Tree View (sub-fases 5.5/5.6) não estavam listados.

- **Command Palette e Tree View**:
  `packages/clarus-js/js/command-palette.js`, diálogo de busca/comandos
  disparado por botão ou por atalho global (`data-fs-shortcut="mod+k"`),
  combinando o overlay/focus trap do Modal com o filtro/navegação por
  teclado do Combobox — reusa `.fs-dropdown-item` pros itens da lista.
  `packages/clarus-js/js/tree-view.js`, lista hierárquica seguindo o
  padrão [WAI-ARIA Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/):
  marcação `<ul>`/`<li>` nativa aninhada, botão de expandir/colapsar
  auto-injetado, roving `tabindex`, navegação completa por teclado
  (`ArrowRight`/`ArrowLeft` cruzam níveis, `Home`/`End`,
  `Enter`/`Espaço`). 27 testes unitários somados entre os dois, mockups
  (`mockup/command-palette.html`, `mockup/tree-view.html`), a11y e visual
  regression verdes. Documentados em `docs/components/command-palette.md`
  e `docs/components/tree-view.md`. Budget de tamanho do JS: 17.25 KB
  gzip de um teto de 24 KB.

- **DataTable v1**:
  `packages/clarus-js/js/datatable.js`, camada JS opcional sobre uma
  [Table](docs/components/table.md) comum — ordenação por coluna
  (`data-fs-sort`, ciclo asc → desc → nenhuma, `aria-sort` seguindo o
  padrão [WAI-ARIA Table Sort](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/)),
  filtro por texto (`[data-fs-datatable-filter]`, substring
  case-insensitive em qualquer célula) e paginação client-side
  (`data-fs-page-size`, reusa `.fs-pagination`/`.fs-page-link`). Estados de
  vazio/carregando/erro reusam `.fs-empty-state`/`.fs-skeleton`
  (`setLoading()`/`setError()`). Roving `tabindex` nas células do corpo com
  navegação completa por setas/`Home`/`End`/`Ctrl+Home`/`Ctrl+End`. 18
  testes unitários, mockup (`mockup/datatable.html`), a11y e visual
  regression verdes. Documentado em `docs/components/datatable.md` (com
  `docs/components/table.md` atualizado pra referenciá-lo).

### Changed

- Budget de tamanho do JS (`scripts/size.mjs`, gate `npm run size:check`)
  recalibrado de 14 KB pra **24 KB gzip** (`js/clarus.min.js`). O teto de
  14 KB foi fixado antes da decisão de incluir Combobox, Datepicker,
  DataTable, Command Palette e Tree View no bundle — com Combobox+Datepicker
  já em 13.82 KB, não sobrevivia ao resto do escopo aprovado.

### Added

- **Datepicker/Timepicker**: duas
  abordagens. **CSS-only**:
  `<input type="date">`/`<input type="time">` herdam `.fs-form-control`
  normalmente; corrige o indicador nativo (ícone calendário/relógio) no
  tema escuro, invisível por padrão sobre `--fs-color-surface` escuro.
  **Datepicker customizado (JS)**, `packages/clarus-js/js/datepicker.js`:
  calendário completo seguindo o padrão
  [WAI-ARIA Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
  adaptado a popup não-modal — `role="combobox"`/`aria-haspopup="grid"` no
  input, `role="grid"`/`"row"`/`"gridcell"` na grade, roving `tabindex`
  (dias são focáveis de verdade, ao contrário do Combobox). Teclado
  completo: `ArrowRight`/`ArrowLeft`/`ArrowUp`/`ArrowDown` (cruzam
  semana/mês), `Home`/`End`, `PageUp`/`PageDown` (mês),
  `Shift+PageUp`/`Shift+PageDown` (ano), `Enter`/`Space` seleciona,
  `Escape` fecha sem alterar o valor. Reusa `js/core/positioning.js`.
  17 testes unitários (incluídos dois bugs reais pegos e corrigidos
  durante o desenvolvimento: `aria-expanded` não é permitido no role
  implícito `textbox`, exigindo `role="combobox"`; e as setas do teclado
  não tinham efeito nenhum com foco no input, porque o handler de teclado
  do grid só reagia com foco já num dia — corrigido com um handler
  dedicado no input que abre/move o foco pro grid em `ArrowDown`/`ArrowUp`).
  Mockup em `mockup/datepicker.html`, documentado em
  [`docs/components/datepicker.md`](docs/components/datepicker.md).

- **Combobox/Autocomplete**: `<input>` de
  texto com listbox de sugestões que filtra por substring conforme o
  usuário digita, seguindo o padrão
  [WAI-ARIA Combobox (List Autocomplete)](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
  — `role="combobox"`/`aria-autocomplete`/`aria-controls`/`aria-expanded`
  no input, `role="listbox"`/`role="option"`/`aria-selected` na lista,
  destaque de navegação via `aria-activedescendant` (foco nunca sai do
  input). Teclado completo (`ArrowUp`/`ArrowDown` com wrap,
  `Home`/`End`, `Enter` seleciona, `Escape` fecha sem alterar o valor).
  Reusa `js/core/positioning.js` e as classes `.fs-dropdown-menu`/
  `.fs-dropdown-item` do Dropdown/Select para a listbox flutuante — só
  `packages/clarus-components/scss/components/_combobox.scss` (wrapper +
  `max-height` com scroll) é novo em CSS. Item opcional `data-fs-empty`
  para mensagem de "sem resultados", com visibilidade alternada
  automaticamente. Testes unitários (13 casos), mockup em
  `mockup/combobox.html`, documentado em
  [`docs/components/combobox.md`](docs/components/combobox.md).

- **Theming multi-brand**: suporte a
  `data-fs-brand="x"` sobre a camada de tokens semânticos existente,
  sobrescrevendo só a cor de ação primária (`--fs-color-primary` e os
  tokens derivados de alert/feedback) — `secondary`/`success`/`warning`/
  `danger`/`info` continuam universais entre marcas. Combina corretamente
  com `data-theme="dark"` (mesma técnica de mistura OKLCH de
  `themes/_dark.scss`). Um brand de exemplo (`violet`) em
  `packages/clarus-core/scss/themes/_brands.scss` prova a troca em runtime
  sem recompilar, com par de contraste auditado em `npm run contrast` e
  demo em `mockup/theming.html`. Documentado em
  [`docs/guides/theming.md`](docs/guides/theming.md#multi-brand), incluindo
  a limitação conhecida de `color-contrast()` (texto de preenchimento
  sólido calculado em build a partir do primary padrão, não por marca).

- **Layout avançado**: três novas
  primitivas de layout CSS-only, `.fs-stack` (empilhamento vertical com
  `gap`), `.fs-cluster` (grupo horizontal com quebra automática) e
  `.fs-sidebar` (aside de largura fixa + conteúdo flexível, com variante
  `.fs-sidebar-reverse`) — todas com modificador de gap
  (`.fs-{stack,cluster,sidebar}-gap-{0..5}`), em
  `packages/clarus-core/scss/layout/`. Utilitários `.u-sticky-top`/
  `.u-sticky-bottom` (posição fixa ao rolar, com offset configurável).
  Utilitários de container query (`.u-cq` + `.u-cq-{sm,md,lg}-d-*`),
  reagindo à largura do container mais próximo em vez da viewport, com
  tokens de referência `--fs-cq-sm/md/lg` (320/480/640px). Documentado em
  [`docs/guides/layout-advanced.md`](docs/guides/layout-advanced.md), com
  exemplo em `mockup/layout.html`.

- **Qualidade, A11y e performance como gate de CI**:
  - Gate `npm run test:a11y` (axe-core via Playwright, regras WCAG 2.1
    A/AA) sobre todo mockup em `mockup/*.html`, rodando no CI a cada PR.
    Descobriu e corrigiu violações reais de contraste em texto sobre
    fundo (link/nav ativo, botão `outline-*`, feedback de formulário,
    step/timeline de erro) que usavam a cor de token "crua" — agora usam
    `--fs-alert-{nome}-text` (já calibrado ≥4.5:1 nos dois temas) — e uma
    violação de nome acessível ausente em `role="progressbar"`
    (`aria-label` adicionado nos exemplos, guia atualizado em
    [`docs/components/progress.md`](docs/components/progress.md)).
  - [Matriz de acessibilidade](docs/reference/accessibility-matrix.md)
    publicada em `docs/reference/`: teclado, ARIA e gestão de foco por
    componente, com link pra seção "A11y" de cada página.
  - Budgets de tamanho como blocker no CI: `npm run size:check` falha o
    build se `layout` (core), `components`, `clarus` (full) ou o JS
    ultrapassarem os tetos definidos (12/18/32/14 KB gzip). Relatório
    de tamanho gzip desta release (`npm run size`):

    | Distribuição | Bruto | Gzip | Budget |
    | --- | --- | --- | --- |
    | `css/layout.min.css` | 13.39 KB | 3.10 KB | 12 KB |
    | `css/forms.min.css` | 18.24 KB | 4.26 KB | — |
    | `css/components.min.css` | 48.41 KB | 9.19 KB | 18 KB |
    | `css/helpers.min.css` | 41.59 KB | 7.24 KB | — |
    | `css/fonts.min.css` | 1.47 KB | 0.40 KB | — |
    | `css/clarus.min.css` | 97.08 KB | 15.58 KB | 32 KB |
    | `js/clarus.min.js` | 51.17 KB | 11.19 KB | 14 KB |

  - `npm run contrast:check` (mesma auditoria de `npm run contrast`, mas
    falha o build abaixo de AA) também vira gate do CI.

### Changed

- **Documentação profissional**: `guide.md` (76KB, um
  arquivo só, desatualizado em relação ao rename da API) é substituído
  por `docs/`, estruturada por categoria: `getting-started/` (instalação,
  uso), `guides/` (theming, dark mode, acessibilidade, migração),
  `components/` (38 arquivos, um por componente/controle, template padrão:
  visão geral → anatomia → variações → estados → A11y → API JS → tokens →
  exemplo — todo conteúdo verificado contra o SCSS/JS atual, não copiado do
  guia antigo), `reference/` (design tokens, arquitetura SCSS, suporte a
  navegadores, relatório de contraste, definições) e `contributing/`.
  Documentos internos de planejamento (planos provisórios, gap-analysis,
  guia de comandos) mantidos fora da documentação pública; removidos do
  repositório após o corte da v1.0.0, papel encerrado.
  `definitions.md`/`scss-architecture.md` movidos para `docs/reference/`.
  `package.json > files` publica a nova `docs/` pública (exceto `internal/`).
  Referências cruzadas (README raiz, CONTRIBUTING, templates de PR)
  atualizadas para os novos caminhos.

- **BREAKING** — Refundação técnica rumo à v1.0.0:
  - Rename mecânico de toda a API pública com prefixo `fs-`, para não colidir
    com classes de outras bibliotecas/CSS de terceiros na mesma página: toda
    classe de componente ganha o prefixo `fs-` (`.btn` → `.fs-btn`,
    `.dropdown-menu` → `.fs-dropdown-menu` etc.), utilitários passam a usar
    `u-` (`.d-flex` → `.u-d-flex`, `.mt-3` → `.u-mt-3`), e os estados
    controlados por JavaScript usam `.is-*` (`.show` → `.is-open`, `.active`
    → `.is-active`, `.disabled` → `.is-disabled`; `.is-valid`/`.is-invalid`
    já seguiam a convenção). Tokens CSS (`--clarus-*` → `--fs-*`), o atributo
    de auto-init (`data-fsarus` → `data-fs`) e os atributos de alvo/dispensa
    (`data-target`/`data-dismiss` → `data-fs-target`/`data-fs-dismiss`)
    seguem o mesmo prefixo, assim como os eventos DOM customizados
    (`clarus:*` → `fs:*`). O global JavaScript (`window.Clarus`) e o nome do
    pacote npm (`clarus-css`) **não mudam**. Afeta todo HTML que consome o
    framework — quem atualizar precisa migrar as classes/atributos/eventos
    citados acima.
  - Reestruturação do repositório em monorepo (npm workspaces):
    `scss/`/`js/` viram `packages/{clarus-core,clarus-components,
    clarus-utilities,clarus-js,clarus-fonts}/`. Não afeta o consumo do
    pacote publicado (`dist/`, `clarus-css/scss`, `clarus-css/js/*`
    continuam nos mesmos caminhos), só a organização interna do
    repositório-fonte.
  - Todo o CSS emitido agora está organizado em cascade layers, na ordem
    `reset, tokens, base, layout, components, utilities, overrides`
    (declarada uma vez em `packages/clarus-core/scss/tokens/_root.scss`,
    propagada a cada bundle de `dist/css/`). Efeito prático: uma classe
    utilitária (`.u-*`) sempre vence uma classe de componente, mesmo com
    especificidade igual, independente da ordem de import — ver
    `docs/reference/scss-architecture.md`. A camada `overrides` fica reservada, sem
    regras do framework, para customização do consumidor sem `!important`.
  - Cores primitivas migradas para OKLCH (`packages/clarus-core/scss/settings/_colors.scss`),
    calibradas para reproduzir os mesmos matizes hex de antes (round-trip
    hex→oklch→hex), com fallback automático em sRGB via
    `@supports (color: oklch(0% 0 0))` para navegadores sem suporte —
    identidade visual inalterada, sem browsers não suportados. Piso de
    navegador atualizado para moderno com fallback progressivo (Safari/iOS
    16.4+; ver `docs/reference/browser-support.md`).
  - Nova camada semântica de tokens (`packages/clarus-core/scss/tokens/_semantic.scss`:
    `--fs-color-bg-surface`, `--fs-color-text-primary`,
    `--fs-color-border-default` etc., todos alias `var()` dos tokens
    primitivos) e primeiro componente migrado para tokens próprios
    (`.fs-btn` ganha `--fs-btn-bg`/`--fs-btn-color`/`--fs-btn-border-color`,
    sobrescrevíveis por instância sem `!important`) — ver
    `docs/reference/scss-architecture.md` para o padrão a seguir em outros componentes.
  - Nova escala tipográfica compacta (`--fs-font-size-*`): corpo ~13px, piso
    ~11px reservado a texto de apoio; headings (`h1`–`h6`) ganham tamanho e
    peso próprios pela primeira vez (antes usavam o padrão do navegador).
    Utilitários `.u-fs-*`/`.u-fw-*` expandidos (`xl`, `h1`–`h6`,
    `semibold`/`bold`).
  - Governança: `CODE_OF_CONDUCT.md`, templates de issue/PR
    (`.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md`), política
    de depreciação (2 minors) em `CONTRIBUTING.md`, guia de migração
    (`docs/guides/migration-v1.md`) com codemod (`scripts/migrate-v1.mjs`),
    script de baseline de tamanho gzip (`npm run size`) e relatório de
    contraste WCAG (`npm run contrast`).

### Added

- **Componentes e refinamentos Cirrus**, já na convenção `fs-`/`@layer`/tokens:
  - Checkbox/radio/switch 100% CSS (`packages/clarus-components/scss/forms/_check-radio-switch.scss`):
    `.fs-check`/`.fs-radio`/`.fs-switch`, técnica de input oculto + label
    irmã (mesma do Segmented Control/Rating). Estados checked/disabled/
    indeterminate/`:focus-visible`, validação `is-valid`/`is-invalid`,
    tamanhos sm/md/lg. Switch com knob retangular arredondado (não circular).
  - Tile (`_tile.scss`): `.fs-tile` > `.fs-tile-icon` / `.fs-tile-body`
    (`-title`/`-subtitle`) / `.fs-tile-actions` (à direita por padrão,
    `.fs-tile-actions-bottom` pra embaixo). Variante `.fs-tile-clickable`
    reusa `.fs-stretched-link` do Card. Tamanhos sm/lg.
  - Pagination (`_pagination.scss`): `.fs-pagination-bordered` (itens
    colados, borda fundida), tamanhos sm/lg, `.fs-page-link-text` para
    prev/next descritivo (texto em vez de só «/»).
  - Tabs (`_tabs.scss`): estilos `.fs-tabs-pill` e `.fs-tabs-depth` (além do
    padrão em linha), alinhamento `.fs-tabs-center`/`-right`/`-fill`,
    tamanhos sm/lg — tudo modificador de `.fs-tabs`, reaproveita `.fs-nav-link`
    e a navegação por teclado existente (`js/tabs.js`) sem mudar o HTML.
  - Tags (`_tag.scss`): escala própria `.fs-tag-xs`…`-xl`, agrupamento
    (`.fs-tag-group`), feedback tátil (`:active`) no botão de dispensa.
  - Mockups novos: `mockup/check-radio-switch.html`, `mockup/tile.html`;
    exemplos adicionados a `mockup/pagination-breadcrumbs.html`,
    `mockup/accordion-tabs-toast.html`, `mockup/tag.html`.

- **Notification Center e Nested Menu**:
  - Notification Center (`scss/components/_notification-center.scss`,
    `js/notification-center.js`): orquestra múltiplas instâncias de
    `Clarus.Toast` e mantém um histórico. `push({title, body, variant})` empilha
    um toast e registra a notificação; painel de histórico (posicionado como o
    Dropdown, fecha com Escape/clique fora) com dispensa por item, "limpar tudo"
    e contador de não-lidas no gatilho — abrir marca tudo como lido.
    Persistência opcional em `localStorage` (`data-storage="local"` +
    `data-storage-key`); padrão em memória. `Clarus.NotificationCenter` com
    `push()`/`remove()`/`clear()`/`getAll()`/`open()`/`close()`/`toggle()`/
    `dispose()` e eventos `clarus:notification:pushed`/`-opened`/`-closed`/
    `-cleared`. Mockup `mockup/notification-center.html`. Testes em
    `tests/unit/notification-center.test.js`.
  - Menu aninhado / Nested Menu (`scss/components/_nested-menu.scss`,
    `js/nested-menu.js`): Dropdown com submenus recursivos, reaproveitando
    `.dropdown-menu`/`.dropdown-item`. Abertura por hover é 100% CSS;
    posicionamento em cascata (`left: 100%`, com flip para a esquerda perto da
    borda) e navegação por teclado por nível (↓/↑ no nível, → abre, ←/Esc
    fecham, Enter/Espaço alternam). `Clarus.NestedMenu` com API padrão
    (`getInstance()`/`show()`/`hide()`/`toggle()`/`dispose()`) e eventos
    `clarus:nested-menu:shown`/`-hidden`. Mockup `mockup/nested-menu.html`.
    Testes em `tests/unit/nested-menu.test.js`.
- **File Input Drag-and-Drop e Hover Card**:
  - File Input Drag-and-Drop (`js/file-drop.js`): evolui
    `.file-upload`/`.file-input`/`.file-label` com
    `dragenter`/`dragover`/`dragleave`/`drop`, sincronizando o arquivo
    solto com o `<input type="file">` nativo (dispara `change` nativo).
    Estado visual `.is-dragover` e variante `.file-label-dropzone`. Mockup
    `mockup/file-drop.html`. Testes unitários em
    `tests/unit/file-drop.test.js`.
  - Hover Card (`.popover-hover-card` em `scss/components/_popover.scss`):
    composição do Popover já existente com `data-trigger="hover"`, sem
    JavaScript novo — só um ajuste visual (largura + layout de avatar ao
    lado do texto). Mockup `mockup/hover-card.html`.
- **Badge dismissível / Tag** (`scss/components/_tag.scss`, `js/tag.js`).
  `.tag` estende `.badge` e `.btn-close`, só ajustando o
  tamanho do botão de fechar (14×14px) para caber num badge. Precisa de
  JavaScript, de forma mínima:
  `Clarus.Tag` só ouve o clique em `[data-dismiss="tag"]` e dispara o
  evento cancelável `clarus:tag:dismissed` antes de remover o elemento do
  DOM (`preventDefault()` bloqueia a remoção). Mockup `mockup/tag.html`.
  Testes unitários em `tests/unit/tag.test.js`.
- **Quick wins 100% CSS**:
  - Divider (`scss/components/_divider.scss`): `<hr class="divider">` para
    o traço simples; `<div class="divider">` com `.divider-label` para
    texto centralizado, via `::before`/`::after`. Mockup
    `mockup/divider.html`.
  - Empty State (`scss/components/_empty-state.scss`): `.empty-state` com
    `.empty-state-icon` (slot vazio), `.empty-state-title`,
    `.empty-state-text` e ação opcional reaproveitando os botões
    existentes. Mockup `mockup/empty-state.html`.
  - Rating / Stars (`scss/components/_rating.scss`): `.rating`/
    `.rating-star`, mesma técnica de input oculto + label irmão do
    Segmented Control (`<input type="radio">` por estrela, `row-reverse` +
    combinador de irmãos gerais). Tamanhos `.rating-sm`/`-lg`. Mockup
    `mockup/rating.html`.
- **Input Group e Alert Dialog**:
  - Input Group (`scss/forms/_forms.scss`): `.input-group`/`.input-group-text`,
    100% CSS. Funde `.form-control`/`.form-select`/`.btn` com addons de
    prefixo/sufixo, bordas adjacentes sem duplicação e altura do addon
    acompanhando o controle via `align-items: stretch`. Tamanhos
    `.input-group-sm`/`-lg`. Mockup `mockup/input-group.html`.
  - Alert Dialog / Confirm (`scss/components/_alert-dialog.scss`,
    `js/confirm.js`): variante do Modal para confirmação, montada
    dinamicamente (sem HTML pré-declarado) por `Clarus.confirm(options)`,
    reaproveitando `js/modal.js` (foco/teclado/overlay). Retorna uma
    `Promise<boolean>` (`true` ao confirmar, `false` ao cancelar/Escape/
    clique fora), com o foco voltando ao elemento que chamou. Opções
    `title`/`message`/`confirmText`/`cancelText`/`variant`. Mockup
    `mockup/alert-dialog.html`.
  - Testes unitários (Vitest) para `confirm()` (`tests/unit/confirm.test.js`).
- **Segmented Control, Skeletons, Timeline, Collapse standalone e Breadcrumb avançado**:
  - Componente Segmented Control (`scss/components/_segmented-control.scss`):
    `.segmented-control`/`.segmented-item`/`.segmented-label`, 100% CSS.
    Modo exclusivo (`<input type="radio">`) ou inclusivo (`<input
    type="checkbox">`), input oculto pela mesma técnica de `.file-input`
    (`scss/forms/_forms.scss`), reaproveitando `color-contrast()` no item
    selecionado. Tamanhos `.segmented-control-sm`/`-lg`. Mockup
    `mockup/segmented-control.html`.
  - Componente Skeletons (`scss/components/_skeleton.scss`): `.skeleton` base
    e variantes `.skeleton-text`/`-circle`/`-rect`, 100% CSS. Animação
    "pulse" por padrão; `.skeleton-wave` varre um brilho via
    pseudo-elemento. Ambas desativadas em `prefers-reduced-motion: reduce`.
    Mockup `mockup/skeletons.html`.
  - Componente Timeline (`scss/components/_timeline.scss`): `.timeline`/
    `.timeline-item`/`.timeline-marker`, 100% CSS, vertical por padrão
    (`.timeline-horizontal` inverte o eixo). Estados padrão (pendente)/
    `.timeline-active`/`.timeline-completed`/`.timeline-failed`
    reaproveitando os tokens de cor de estado; conector de progresso na
    mesma lógica do Stepper. Mockup `mockup/timeline.html`.
  - Collapse standalone (`scss/components/_collapse.scss`, `js/collapse.js`):
    extrai `collapse()`/`expand()` de `js/core/transition.js` (já usado pelo
    Accordion) para uma seção expansível independente. `Clarus.Collapse`
    segue a API da seção 20 (`data-fsarus="collapse"`, `data-target`,
    `getInstance()`, `.show()`/`.hide()`/`.toggle()`/`.dispose()`, eventos
    `clarus:collapse:shown`/`-hidden`). Mockup `mockup/collapse.html`.
  - Breadcrumb avançado (`scss/components/_breadcrumbs.scss`,
    `js/breadcrumb.js`): truncamento por CSS com tooltip (`js/tooltip.js`)
    só quando o texto transborda (medido após `document.fonts.ready`); abaixo
    do breakpoint `sm` (640px), colapsa os níveis intermediários num item
    "…" que compõe um `Dropdown` (`js/dropdown.js`), mantendo sempre o
    primeiro e o último nível visíveis. `data-max-items` configurável.
    Mockup `mockup/pagination-breadcrumbs.html` (exemplo avançado).
- Testes unitários (Vitest) para Collapse e Breadcrumb
  (`tests/unit/collapse.test.js`, `tests/unit/breadcrumb.test.js`).

### Changed

- Cores `primary` e `danger` escurecidas no preenchimento sólido para o texto
  branco ter contraste adequado (WCAG ≥ 4.5:1): `--clarus-color-primary` passa
  de blue-500 (#2972fa) para blue-600 (#1a61e6) e `--clarus-color-danger` de
  red-500 (#fb4143) para red-700 (#cc3335) em `scss/settings/_colors.scss`.
  Antes o `color-contrast()` caía para texto preto nesses fundos (pouca
  legibilidade, sobretudo no vermelho). O peso de clareamento do `primary` no
  dark mode (`scss/themes/_dark.scss`) sobe de 86% para 95%, porque o texto do
  preenchimento passou de preto para branco (clarear reduz o contraste com o
  branco). Afeta botões, badges, alerts e bordas que usam essas cores.
- Fontes self-hosted (Plus Jakarta Sans e Source Code Pro) movidas para um
  arquivo à parte, opcional: novo bundle `dist/css/fonts.css` (a partir de
  `scss/base/_fonts.scss` + `scss/entries/fonts-entry.scss`), exportado como
  `clarus-css/fonts.css`; `scss/base/_typography.scss` mantém só as pilhas de
  `font-family`. Quem quiser as fontes importa `fonts.css` antes do CSS
  principal; sem ele, a tipografia cai no `sans-serif`/`monospace` do sistema.
  Também elimina a duplicação dos `@font-face`, antes repetidos em `clarus.css`,
  `components.css`, `forms.css`, `layout.css` e `helpers.css`.
- Alert Dialog / Confirm (`js/confirm.js`, `scss/components/_alert-dialog.scss`):
  removido o ícone informativo do corpo do diálogo — fica só título e mensagem.
- Paleta de cores evoluída para escalas completas 100-900 por matiz
  (yellow/green/blue/gray/red/purple) com papéis semânticos por cor de
  estado (`color`/`-hover`/`-active`/`-disabled`/`bg`/`bg-2`/`text`/`text-2`/
  `border`) em `scss/settings/_colors.scss`, incluindo uma nova cor
  `secondary`; `scss/tokens/_root.scss` e `scss/themes/_dark.scss`
  (variantes de dark mode por peso de tint) acompanham a nova estrutura.
- Fonte monoespaçada Source Code Pro passa a ser self-hosted
  (`assets/fonts/source-code-pro/`, licença OFL), removendo o último
  `@import` externo de Google Fonts em `scss/base/_typography.scss` —
  completa a meta de dependência externa zero em tempo de execução (seção 6
  de `docs/definitions.md`) também para a fonte mono, no mesmo padrão já
  usado pela Plus Jakarta Sans.

- Componente Stepper/Wizard (`scss/components/_stepper.scss`, `js/stepper.js`):
  `.stepper`/`.stepper-header`/`.step` com `.step-indicator` (número, ou "check"
  em SVG quando concluído) e `.step-label`; estados `.step-active`/
  `.step-completed`/`.step-error`; conector de progresso na cor primária após um
  passo concluído; variante `.stepper-vertical` (com `.step-content` +
  `.step-description`); painéis opcionais `.step-panel` e ações `.stepper-actions`
  com `[data-stepper="prev"]`/`[data-stepper="next"]`. `Clarus.Stepper` com
  `.next()`/`.prev()`/`.goTo()`/`.setError()`/`.complete()`/`.dispose()`; evento
  **cancelável** `clarus:stepper:beforechange` (hook de validação por passo),
  `clarus:stepper:changed` e `clarus:stepper:completed`. Linear por padrão
  (`data-linear`), `aria-current="step"` e navegação por teclado. Mockup
  `mockup/stepper.html`.
- Breakpoint adicional `xxxl` (1920px, `scss/settings/_breakpoints.scss`),
  para monitores externos Full HD sem escala — gera automaticamente
  `.col-xxxl-*`, `.container-xxxl` e todos os utilitários responsivos
  `-xxxl` (spacing, gap, flex, display) via os mesmos loops que já geram os
  demais breakpoints.
- Componente Offcanvas (`scss/components/_offcanvas.scss`, `js/offcanvas.js`):
  painel deslizante com posições `.offcanvas-start`/`-end`/`-top`/`-bottom`,
  mesmo mecanismo de overlay do Modal (bloqueio de scroll, focus trap,
  Escape/clique fora), aplicado de forma independente (sem compor
  `js/modal.js`). Backdrop criado dinamicamente pelo JS;
  `data-backdrop="static"` desativa Escape/clique fora, `data-backdrop="false"`
  remove o backdrop visual mantendo Escape/clique fora ativos. `Clarus.Offcanvas`
  com `getInstance()`/`.show()`/`.hide()`/`.toggle()`/`.dispose()`, eventos
  `clarus:offcanvas:shown`/`-hidden`, `data-dismiss="offcanvas"`. Mockup
  `mockup/offcanvas-popover.html`.
- Componente Popover (`scss/components/_popover.scss`, `js/popover.js`):
  painel flutuante com conteúdo rico (`.popover-header`/`-body`/`-footer`),
  posicionado via `computePosition()`/`applyPosition()` (como Dropdown/Tooltip),
  `role="dialog"` + `aria-modal="false"` (não é modal — sem focus trap, sem
  bloqueio de scroll). `data-trigger` controla o disparo: `"click"` (padrão),
  `"hover"` (com tolerância para mover o mouse ao conteúdo), `"focus"` (via
  `focusout`/`relatedTarget`) ou `"manual"` (sem listeners automáticos).
  `Clarus.Popover` com `getInstance()`/`.show()`/`.hide()`/`.toggle()`/
  `.dispose()`, eventos `clarus:popover:shown`/`-hidden`, `data-dismiss="popover"`.
  Mockup `mockup/offcanvas-popover.html`.

### Changed

- Escala de breakpoints (`scss/settings/_breakpoints.scss`) recalibrada para
  as larguras lógicas de tela mais comuns do mercado atual:
  `sm` 576px→640px (tablets pequenos/phablets), `lg` 992px→1024px (tablet
  paisagem/iPad), `xl` 1200px→1280px (laptop comum), `xxl` 1400px→1536px
  (laptop/desktop com escala, ex.: Mac/Windows a 125%). `md` (768px)
  permanece igual. `$container-max-widths` ajustado na mesma proporção
  (600/720/960/1200/1440px). Os nomes de classe não mudam
  (`.col-md-6`, `.d-lg-none`, etc. continuam os mesmos) — só os valores em
  px por trás de cada breakpoint, o que pode alterar sutilmente o layout
  visual de projetos existentes nos pontos de corte afetados.

### Fixed

- Erro do bundlephobia ao analisar o pacote ("Found an asset without the
  `.bundle` suffix ... `.woff2`"): o `main` (`dist/css/clarus.css`) referenciava
  as `url(...woff2)` dos `@font-face`, que o webpack do bundlephobia não resolve
  sem loader. Com os `@font-face` isolados em `fonts.css` (ver Changed), os
  bundles principais não têm mais referências a woff2.
- Badge (`scss/components/_badges.scss`): texto centralizado verticalmente — o
  padding assimétrico `2px 8px 0`, que empurrava o texto para baixo, virou
  `0 8px`, deixando a centralização por conta do flex.
- Tag (`scss/components/_tag.scss`): o "x" do botão de fechar herda a cor de
  texto do badge (contraste automático por variante) em vez de um cinza fixo,
  corrigindo a baixa visibilidade sobre badges coloridos.
- Timeline horizontal (`scss/components/_timeline.scss`): o conector alinha com
  o centro do marcador — o `margin-top: 3px` do marcador (necessário só no modo
  vertical) é zerado no horizontal, onde deixava a linha acima do centro do
  círculo.

## [0.3.0] - 2026-07-04

### Added

- Componente Spinner e Progress (`scss/components/_spinner.scss`, 100% CSS):
  spinner giratório `.spinner` (animação `clarus-spin`) com tamanhos
  (`.spinner-sm`/`.spinner-lg`) e variantes de cor de estado
  (`.spinner-#{nome}`); barra de progresso `.progress`/`.progress-bar` com
  largura por `--clarus-progress-value` (0–100), tamanhos
  (`.progress-sm`/`.progress-lg`), variantes de cor
  (`.progress-bar-#{nome}`, via `color-contrast()`) e faixas opcionais
  (`.progress-bar-striped`/`.progress-bar-animated`). Toda animação respeita
  `prefers-reduced-motion`. Mockup `mockup/spinner-progress.html`. Primeiro
  item da Etapa 1 do roadmap de paridade.
- Componente Carousel (`scss/components/_carousel.scss`, `js/carousel.js`):
  carrossel de slides com layout "slide" (trilha flex deslocada por
  `translateX`) e variante `.carousel-fade` (opacidade); setas
  (`.carousel-control-prev`/`-next`) e indicadores (`.carousel-indicators`)
  opcionais, com modificador opcional `.carousel-hover-controls` (setas só no
  hover/foco). `Clarus.Carousel` com `.next()`/`.prev()`/`.goTo()`/`.pause()`/
  `.dispose()`, evento `clarus:carousel:slid`, navegação por teclado
  (setas/Home/End), swipe por pointer events e autoplay opcional
  (`data-autoplay`/`data-interval`, válido para slide e fade) que pausa no
  hover/foco. ARIA completo (`role="group"`, `aria-roledescription`,
  `aria-current` nos indicadores) e respeito a `prefers-reduced-motion`. O
  recorte fica no `.carousel` (elemento parado) e não na trilha, para não
  cortar os slides seguintes ao deslocar. Mockup `mockup/carousel.html`.
  Segundo item (Etapa 2) do roadmap de paridade.
- Testes de regressão visual com Playwright integrados ao CI, com baselines por
  plataforma (`-win32`/`-linux`, estas geradas em container Docker para bater
  com o ambiente do CI).

## [0.2.0] - 2026-07-04

### Added

- Suíte de testes automatizados: testes funcionais de JavaScript com Vitest +
  jsdom (`tests/unit/`, cobrindo estado, ARIA e eventos de cada componente
  interativo e dos módulos de `js/core/`) e testes visuais com Playwright
  (`tests/visual/`, screenshots de baseline por mockup e testes de interação).
  Ambos rodam automaticamente no GitHub Actions a cada push/PR, além do lint e
  do build.

## [0.1.2] - 2026-07-04

### Added

- Componente Botões (`scss/components/_buttons.scss`): variantes sólidas e
  outline por cor de estado (`.btn-primary/success/warning/danger/info`,
  `.btn-outline-*`), tamanhos (`.btn-sm`/`.btn-lg`) e estados de
  hover/active/focus/disabled.
- Função `color-contrast()` (`scss/tools/_mixins.scss`), que escolhe texto
  branco ou preto por cor de fundo com base no contraste WCAG (mínimo 4.5:1).
- Componente Badges (`scss/components/_badges.scss`): variantes sólidas por
  cor de estado (`.badge-primary/success/warning/danger/info`) e tamanhos
  (`.badge-sm`/`.badge-lg`).
- Componente Alertas (`scss/components/_alerts.scss`): variantes tintadas
  por cor de estado (`.alert-primary/success/warning/danger/info`), com
  tokens `--clarus-alert-*-bg`/`-text` (`scss/tokens/_root.scss`,
  sobrescritos no dark mode em `scss/themes/_dark.scss`).
- Funções `tint-color()`/`shade-color()` (`scss/tools/_mixins.scss`), para
  gerar variações claras/escuras de uma cor base.
- Componente Cards (`scss/components/_cards.scss`): `.card-header`,
  `.card-body`, `.card-footer`, `.card-title`, `.card-subtitle`,
  `.card-text` e tamanhos (`.card-sm`/`.card-lg`).
- Utilitários de sombra (`.shadow-sm`/`.shadow`/`.shadow-lg`) em
  `scss/utilities/_shadow.scss`, com tokens `--clarus-shadow-*`
  (`scss/tokens/_root.scss`) e override para dark mode.
- Componente `.btn-close` (`scss/components/_buttons.scss`), reaproveitável
  em cards, e futuramente em modal/toast.
- `.card-header` agora suporta título + botão de fechar alinhados nas
  pontas (layout flex com `justify-content: space-between`).
- `.card-clickable` + `.stretched-link`: torna o card inteiro clicável e
  focável via um único link, sem aninhar elementos interativos.
- `.card-horizontal`: inverte o eixo do card para linha, com raio e borda
  do header/footer ajustados para a lateral.
- Componente Tabelas (`scss/components/_tables.scss`): `.table-striped`,
  `.table-hover`, `.table-bordered`, `.table-borderless`, `.table-sm`,
  `.table-responsive` e variantes de cor de estado
  (`.table-primary/success/warning/danger/info`), reaproveitando os
  tokens `--clarus-alert-*-bg`/`-text` da Fase 2.
- Componente Navbar (`scss/components/_navbar.scss`): `.navbar-brand`,
  `.navbar-nav`, `.nav-link` (com estados `.active`/`.disabled`), versão
  estática (sem dropdown/collapse).
- Componente Paginação (`scss/components/_pagination.scss`): `.page-link`,
  estados `.active`/`.disabled`, reaproveitando `color-contrast()` da
  Fase 1.
- Componente Breadcrumbs (`scss/components/_breadcrumbs.scss`):
  `.breadcrumb-item`, separador via `::before`, estado `.active`.
- Infraestrutura JS compartilhada (`js/core/`), pré-requisito dos
  componentes interativos das próximas fases, sem dependências externas:
  `positioning.js` (`computePosition()`/`applyPosition()`, com flip
  automático e clamp na viewport); `overlay.js` (`lockScroll()`/
  `unlockScroll()` com compensação de scrollbar e contagem de referências,
  `onClickOutside()`); `focus.js` (`createFocusTrap()` com ciclo
  Tab/Shift+Tab, `onEscapeKey()`); `transition.js` (`collapse()`/
  `expand()` animando `height`, respeitando `prefers-reduced-motion`).
  Reexportado como `Clarus.core` pelo bundle único e importável de forma
  granular (`clarus-css/js/core/*`).
- Componente Dropdown (`scss/components/_dropdown.scss`, `js/dropdown.js`):
  `.dropdown-toggle`/`.dropdown-menu`/`.dropdown-item`/`.dropdown-divider`/
  `.dropdown-header`; posicionamento via `Clarus.core` com flip automático e
  alinhamento configurável (`data-align="start"`/`"center"`/`"end"`, padrão
  `"start"`), navegação por ArrowUp/ArrowDown, fecha com clique fora/em um
  item/Escape (foco retorna ao toggle). Primeiro componente a seguir a API
  JS da seção 20: auto-init via `data-fsarus="dropdown"`, `Clarus.Dropdown`
  com `getInstance()`/`.show()`/`.hide()`/`.toggle()`/`.dispose()`, eventos
  `clarus:dropdown:shown`/`-hidden`.
- `computePosition()` (`js/core/positioning.js`) ganhou a opção `align`
  para o eixo cruzado (usada pelo Dropdown acima), além do `placement`
  já existente.
- Componente Tooltip (`scss/components/_tooltips.scss`, `js/tooltip.js`):
  `.tooltip`/`.tooltip-inner`/`.tooltip-arrow` com 4 posicionamentos
  (top/bottom/left/right) e novos tokens `--clarus-tooltip-bg`/`-text`
  (invertidos no dark mode); show/hide por hover/foco/blur e Escape,
  `aria-describedby` ligando referência e tooltip; mesma API JS do
  Dropdown (`Clarus.Tooltip`, `data-fsarus="tooltip"`, eventos
  `clarus:tooltip:shown`/`-hidden`).
- `js/core/register.js` (`autoInit()`/`createInstanceRegistry()`):
  generaliza o padrão de auto-inicialização via `data-fsarus` e registro de
  instância (`getInstance()`) para os próximos componentes interativos.
- Componente Modal (`scss/components/_modal.scss`, `js/modal.js`):
  `.modal`/`.modal-dialog`/`.modal-content`/`.modal-header`/`.modal-title`/
  `.modal-body`/`.modal-footer`, tamanhos `.modal-sm`/`.modal-lg`. Reaproveita
  a infraestrutura da Fase 7: `lockScroll()` enquanto aberto,
  `createFocusTrap()`, fecha com Escape/clique fora (foco volta ao
  gatilho) ou `data-dismiss="modal"`; `data-backdrop="static"` desativa
  fechar por Escape/clique fora. Segue a mesma API JS de Dropdown/Tooltip
  (`Clarus.Modal`, `data-fsarus="modal"`, eventos
  `clarus:modal:shown`/`-hidden`).
- Select customizado (`js/select.js`, `Clarus.Select`): gera a marcação
  (`.form-select` + `.dropdown-menu`/`.dropdown-item` por `<option>`) a
  partir de um `<select>` nativo (`data-fsarus="select"`, oculto mas
  sincronizado para submissão de formulário) e compõe uma instância de
  `Dropdown` por cima, reaproveitando posicionamento/navegação/fechamento
  da Fase 8 em vez de duplicar essa lógica; dispara `change` nativo e
  `clarus:select:changed` ao selecionar. Novo `.form-select`/
  `.form-select-sm`/`-lg` em `scss/forms/_forms.scss`.
- Componente Accordion (`scss/components/_accordion.scss`, `js/accordion.js`):
  `.accordion`/`.accordion-item`/`.accordion-header`/`.accordion-button`/
  `.accordion-collapse`/`.accordion-body`. Reaproveita `collapse()`/
  `expand()` de `Clarus.core` (Fase 7) para animar a altura de cada painel;
  só um painel aberto por vez por padrão (`data-multiple="true"` permite
  vários); segue a API JS da seção 20 (`Clarus.Accordion`,
  `data-fsarus="accordion"`, eventos `clarus:accordion:shown`/`-hidden`).
- Componente Tabs (`scss/components/_tabs.scss`, `js/tabs.js`):
  `.tabs`/`.tab-content`/`.tab-pane`, reaproveitando `.nav-link` (Navbar,
  Fase 4) com indicador de sublinhado escopado a `.tabs`. Navegação por
  ArrowLeft/ArrowRight/Home/End (`role="tablist"`/`"tab"`/`"tabpanel"`,
  `aria-selected`, `tabindex` roving), disparando `clarus:tab:changed`
  (`Clarus.Tabs`, `data-fsarus="tabs"`).
- Componente Toast (`scss/components/_toasts.scss`, `js/toast.js`):
  `.toast-container`/`.toast`/`.toast-header`/`.toast-body`, variantes de
  cor de estado (`.toast-#{nome}`, reaproveitando os tokens
  `--clarus-alert-*-bg`/`-text` da Fase 2). Reaproveita `expand()`/
  `collapse()` de `Clarus.core` para mostrar/esconder, com timer de
  auto-dismiss configurável (`data-delay`, `data-autohide="false"` para
  desativar) e dismiss via `data-dismiss="toast"`; segue a API JS da seção
  20 (`Clarus.Toast`, `data-fsarus="toast"`, eventos
  `clarus:toast:shown`/`-hidden`).
- Formulários avançados (`scss/forms/_forms.scss`): estados de validação
  `.form-control.is-valid`/`.is-invalid` (borda e anel de foco em
  `--clarus-color-success`/`-danger`) com `.valid-feedback`/
  `.invalid-feedback` (exibidos via seletor de irmão adjacente, sem
  JavaScript); upload de arquivo estilizado `.file-upload`/`.file-input`/
  `.file-label` (input nativo ocultado via `clip-path`, mantendo foco e
  navegação por teclado), com tamanhos (`.file-label-sm`/`-lg`) e estado
  desabilitado.
- Paleta de cores oficial "Indigo autoral" (`docs/definitions.md`, seção
  18.1) em `scss/settings/_colors.scss`: `primary #4F46E5`, `success
  #1BC559`, `warning #F0B40E`, `danger #DC263E`, `info #8BA2C4`; escala
  neutra completada para 9 degraus cheios (`$color-gray-100` a
  `$color-gray-900`).
- Variantes de `primary`/`success`/`warning`/`danger`/`info` para o dark
  mode (`scss/themes/_dark.scss`, token `--clarus-color-#{nome}`, via
  `color.mix()` com peso por cor em `$dark-color-weights`).
- Tipografia principal Plus Jakarta Sans self-hosted (`docs/definitions.md`,
  seção 18.2): arquivos `.woff2` (licença OFL) em
  `assets/fonts/plus-jakarta-sans/`, com `@font-face` em
  `scss/base/_typography.scss` no lugar do `@import` do Google Fonts,
  cumprindo a meta de dependência externa zero em tempo de execução para a
  fonte principal (Source Code Pro, no monoespaçado, mantida via Google
  Fonts).

### Fixed

- Duplicidade entre `$color-primary` e `$color-info` (mesmo valor de azul)
  em `scss/settings/_colors.scss`, corrigida pela nova paleta "Indigo
  autoral".
- `.dropdown-menu` sem `position: absolute` no CSS base (só era aplicado
  via JS no `show()`): a medição de largura acontecia com o menu ainda como
  bloco normal (ocupando a largura inteira do `body`), quebrando o cálculo
  de alinhamento `start`/`end`. Corrigido em
  `scss/components/_dropdown.scss`.
- Texto solto (`<h2>`/`<p>` sem cor própria) invisível no painel escuro de
  vários mockups (`badges-alerts.html`, `buttons.html`, `forms-advanced.html`,
  `dropdown-tooltip.html`): `[data-theme="dark"].theme-panel` só definia
  `background-color`, nunca `color` — o texto herdava o valor já resolvido
  de `color` do `body` (calculado no tema claro), que não é reavaliado só
  por redefinir a custom property num elemento descendente.
- Tooltip/Dropdown não invertiam para o tema escuro quando o elemento de
  referência estava dentro de um wrapper com `data-theme="dark"` (em vez de
  no `<html>`): como `js/tooltip.js`/`js/dropdown.js` reanexam o elemento
  flutuante a `document.body`, ele saía do escopo do wrapper e sempre usava
  os tokens do tema claro. Agora ambos copiam o `data-theme` do ancestral
  mais próximo do elemento de referência/toggle para o elemento flutuante a
  cada `show()`.
- `.btn-close` (`scss/components/_buttons.scss`): o "×" (glifo `\00d7`)
  centralizado por flexbox não ficava opticamente centrado no botão, por
  depender da métrica vertical do glifo na fonte. Substituído por duas
  barras via `::before`/`::after`, giradas ±45° e centralizadas por
  `transform: translate(-50%, -50%)` a partir do centro absoluto do
  botão — centralização exata, independente de fonte.

## [0.1.1] - 2026-07-01

### Added

- Definições iniciais do projeto (`docs/definitions.md`) e arquitetura SCSS
  (`docs/scss-architecture.md`).
- Estrutura modular `scss/` (settings, tools, tokens, base, layout, forms,
  components, utilities, themes).
- Sistema de layout: containers, grid de 12 colunas baseado em Flexbox
  (`.row`/`.col-*`) e utilitários responsivos por breakpoint.
- Pipeline de build: Sass + PostCSS (Autoprefixer) + esbuild, gerando `dist/css`
  (`layout`, `forms`, `components`, `helpers`, `clarus`) e `dist/js/clarus.js`,
  cada um em versão expandida e minificada com source maps.
- Lint de SCSS via stylelint.
- CI no GitHub Actions (lint + build).
- Utilitários de tipografia (`text-*`, `fw-*`, `fs-*`, `font-*`) em
  `scss/utilities/_typography.scss`.
- Estado `:read-only` em `.form-control`.

[Unreleased]: https://github.com/jorgewreis/clarus-css/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/jorgewreis/clarus-css/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/jorgewreis/clarus-css/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/jorgewreis/clarus-css/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/jorgewreis/clarus-css/releases/tag/v0.1.1
