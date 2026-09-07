# Fokus Styles — Definições do Projeto

> Este documento registra as decisões de arquitetura e produto. Para o nível
> de estabilidade de cada grupo de componentes e o plano de consolidação,
> consulte [`stability.md`](stability.md). A
> seção 21 (catálogo por componente) reflete o estado em que cada trecho
> foi escrito e não é atualizada retroativamente a cada componente novo;
> para o catálogo completo e sempre atual, use
> [`docs/README.md#componentes`](../README.md#componentes) e
> [`docs/components/`](../components/).

## 1. Visão Geral

Fokus Styles é um framework CSS open source, de uso recorrente nos projetos pessoais e profissionais do autor, com distribuição pública como produto para qualquer desenvolvedor que precise construir interfaces web com HTML, CSS e JavaScript de forma direta, consistente e reutilizável.

O projeto será publicado no GitHub sob o repositório `fokus-styles` e terá distribuição oficial via npm desde o início. A licença adotada é MIT, mantendo o framework permissivo, simples de reutilizar e adequado para uso pessoal, comercial e comunitário.

## 2. Objetivo Estratégico

O objetivo do Fokus Styles é oferecer uma base visual moderna, minimalista e produtiva para criação de páginas, sistemas e componentes de interface sem exigir dependências externas ou integração obrigatória com frameworks JavaScript.

O projeto deve priorizar três finalidades, nesta ordem:

1. Servir como biblioteca CSS confiável para projetos recorrentes.
2. Consolidar uma API pequena, coerente e sustentável para terceiros.
3. Ampliar o ecossistema somente quando houver necessidade real e documentação suficiente.

## 3. Público-Alvo

O público-alvo principal é o desenvolvedor que constrói páginas, sistemas
administrativos e aplicações web com HTML, CSS e JavaScript nativo, sem querer
adotar um framework de componentes obrigatório.

React, Vue e outras stacks são integrações secundárias. O núcleo deve continuar
completo e útil sem qualquer uma delas.

## 4. Posicionamento do Produto

O Fokus Styles é um framework CSS híbrido, com prioridade deliberada para um
núcleo pequeno de componentes prontos e utilitários previsíveis. Componentes
avançados devem ser tratados como extensões até que tenham uso, testes e
documentação suficientes para integrar o núcleo.

A identidade visual deve seguir uma linha minimalista e moderna, com foco em clareza, legibilidade, baixo ruído visual e adaptação a diferentes tipos de aplicação.

## 5. Filosofia de Design

A filosofia oficial do projeto é híbrida.

Isso significa que o framework deve combinar:

- Componentes prontos para uso, como botões, formulários, cards, menus, modais, alertas, tabelas e navegação.
- Classes utilitárias para espaçamento, alinhamento, display, visibilidade, grid, tipografia, cores e estados visuais.
- Padrões consistentes de nomenclatura para reduzir colisões, facilitar leitura do HTML e manter previsibilidade entre componentes.

Essa decisão é firme e deve orientar toda a arquitetura do projeto.

## 6. Stack Tecnológica

O projeto deve priorizar HTML, CSS e JavaScript nativo.

A stack definida é:

- CSS como base do framework.
- SCSS/Sass para organização modular, variáveis, mixins e funções.
- CSS Custom Properties para permitir customização em tempo de uso sem recompilação obrigatória.
- PostCSS para pós-processamento e compatibilidade entre navegadores.
- JavaScript nativo para componentes interativos.
- Empacotamento leve para distribuição em formatos compatíveis com uso moderno e inclusão direta em páginas HTML.

O Fokus Styles deve ter dependência externa zero em tempo de execução. Não deve depender de React, Vue, Angular, jQuery ou qualquer biblioteca JavaScript de terceiros para funcionar.

## 7. Arquitetura de Interface

O framework deve priorizar uso direto em HTML, CSS e JavaScript, sem exigir build complexo para o usuário final.

As classes e componentes devem ser pensados para:

- Uso direto em arquivos HTML.
- Integração simples com qualquer back-end ou front-end.
- Compatibilidade futura com projetos que usem React, Vue, Angular ou outras stacks, sem tornar essas stacks obrigatórias.

## 8. Sistema de Layout

O sistema de layout será baseado em Flexbox.

O grid deve seguir uma abordagem convencional de 12 colunas, com breakpoints
(`packages/fokus-core/scss/settings/_breakpoints.scss`) calibrados pelas larguras lógicas de tela
mais comuns do mercado atual, não por números arbitrários:

- `sm` (640px) — tablets pequenos/phablets
- `md` (768px) — tablet retrato
- `lg` (1024px) — tablet paisagem / iPad
- `xl` (1280px) — laptop comum
- `xxl` (1536px) — laptop/desktop com escala (Mac/Windows)
- `xxxl` (1920px) — monitor externo Full HD sem escala

O objetivo é reduzir a curva de aprendizado para quem já usou um framework CSS de componentes, mantendo liberdade para adaptar detalhes internos à identidade do Fokus Styles.

## 9. Escopo do Núcleo Essencial

A versão estável deve priorizar os recursos usados na maioria das interfaces
administrativas e institucionais:

O escopo inicial inclui:

- Layout e containers.
- Grid baseado em Flexbox.
- Utilitários de espaçamento, display, alinhamento, visibilidade e tipografia.
- Formulários e validação visual.
- Botões.
- Cards.
- Alertas.
- Badges.
- Tabelas.
- Navbar.
- Dropdown, modal, accordion, tabs e toast.
- Paginação e breadcrumbs.

Combobox, Datepicker, DataTable, Tree View, Command Palette, Carousel e
Upload avançado permanecem disponíveis como componentes avançados, mas não
devem expandir o núcleo sem uma decisão explícita.

## 10. Temas e Customização

O Fokus Styles deve oferecer suporte nativo a dark mode desde a primeira versão.

A paleta de cores oficial é a "Indigo autoral" (`primary #4F46E5`,
`success #1BC559`, `warning #F0B40E`, `danger #DC263E`, `info #8BA2C4`,
com escala neutra própria de 9 degraus), definida na seção 18.1. A
arquitetura já está preparada para temas claros e escuros por meio de CSS
Custom Properties.

A customização deve permitir que usuários alterem cores, espaçamentos, tipografia e estados visuais sem reescrever o framework inteiro.

## 11. Tipografia

A família tipográfica oficial é a Plus Jakarta Sans (heading e body),
definida na seção 18.2, escolhida por boa legibilidade, aparência moderna e
compatibilidade com interfaces web de uso geral. Os arquivos da fonte são
distribuídos self-hosted junto ao próprio pacote (sem dependência de
serviços externos como fonts.googleapis.com em tempo de execução), alinhado
à stack definida na seção 6.

## 12. Documentação

A documentação inicial será mantida em Markdown no GitHub.

O repositório continua sendo a fonte versionada da documentação. A próxima
etapa de produto é disponibilizar uma documentação visual pesquisável, com
exemplos executáveis e caminho de início rápido. Markdown continua sendo a
fonte normativa até que esse site exista.

Os documentos devem explicar:

- Instalação via npm.
- Uso direto via arquivo compilado.
- Estrutura de classes.
- Sistema de grid.
- Componentes disponíveis.
- Customização por variáveis.
- Modo escuro.
- Convenções de contribuição.

## 13. Distribuição

O Fokus Styles será publicado no npm desde o início.

A distribuição deve contemplar:

- Pacote npm oficial.
- Arquivos compilados em `dist`.
- Versão minificada para produção.
- CSS principal.
- JavaScript nativo para componentes interativos.
- Possibilidade de uso via CDN por meio de serviços como jsDelivr e unpkg após publicação no npm.

## 14. Licenciamento

O projeto será licenciado sob MIT.

Essa licença confirma a intenção de permitir uso amplo, modificação, cópia, redistribuição e uso comercial, preservando apenas os requisitos básicos de atribuição e inclusão do aviso de licença.

## 15. Estrutura do Repositório

A estrutura evoluiu de um único diretório `scss/`/`js/` (intenção original
desta seção) para um monorepo por pacote, separando cada camada da
arquitetura (ver [scss-architecture.md](scss-architecture.md)):

```text
fokus-styles/
├── assets/                  # fontes self-hosted
├── dist/                    # CSS/JS compilados (gitignored, gerado por `npm run build`)
├── docs/                    # documentação pública
├── mockup/                  # exemplo funcional por componente + templates prontos
├── packages/
│   ├── fokus-core/         # tokens, base, layout, temas
│   ├── fokus-components/   # componentes e formulários (SCSS)
│   ├── fokus-utilities/    # utilitários atômicos (SCSS)
│   ├── fokus-fonts/        # @font-face self-hosted
│   ├── fokus-js/           # API JavaScript de todos os componentes interativos
│   ├── fokus-icons/        # fonte interna de ícones (exportada por /icons)
│   ├── fokus-cli/          # fonte interna da CLI (bin `fokus`)
│   └── fokus-react/        # fonte interna do wrapper React (/react)
├── scripts/                 # build, migração, contraste, tamanho
├── scss/                    # ponto de entrada Sass que agrega os pacotes acima
├── tests/                   # unit (Vitest), a11y e visual (Playwright)
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── package.json
└── README.md
```

## 16. Boas Práticas de Engenharia

O projeto deve adotar práticas que transmitam seriedade técnica desde o início:

- Versionamento semântico.
- Histórico de mudanças em `CHANGELOG.md`.
- Orientações de contribuição em `CONTRIBUTING.md`.
- Scripts de build e minificação.
- Organização modular por componente.
- Convenção consistente de nomenclatura de classes.
- GitHub Actions para lint, build e validações básicas.
- Publicação controlada por release.

## 17. Decisões Firmes

As seguintes decisões estão definidas:

- Nome do produto: FokusStyles.
- Nome do projeto/repositório: `fokus-styles`.
- Modelo de design: híbrido.
- Referência: convenções amplamente adotadas em frameworks CSS de componentes.
- Stack prioritária: HTML, CSS e JavaScript nativo.
- Dependências externas em tempo de execução: zero.
- Sistema de layout: Flexbox.
- Breakpoints: valores convencionais amplamente adotados.
- Identidade visual: minimalista e moderna.
- Paleta de cores: "Indigo autoral", definida na seção 18.1.
- Tipografia: Plus Jakarta Sans, self-hosted, definida na seção 18.2.
- Dark mode: nativo desde a primeira versão.
- Documentação inicial: Markdown no GitHub.
- Distribuição: npm desde o início.
- Licença: MIT.
- Tom do projeto: técnico, estratégico e com posicionamento de produto.
- Convenção de nomenclatura de classes: definida na seção 19.
- API JavaScript dos componentes interativos: definida na seção 20.
- Catálogo e arquitetura dos componentes: detalhado na seção 21.
- Testes automatizados (funcionais e visuais): detalhados na seção 22.

## 18. Paleta de Cores e Tipografia

As duas pendências desta seção (antes "a definir posteriormente") foram decididas.

### 18.1 Paleta de cores oficial

Opção "Indigo autoral": paleta própria, escolhida por dar ao FokusStyles uma
identidade cromática distinta dos azuis e paletas genéricas mais comuns em
frameworks de UI (uma paleta de placeholder chegou a ser usada em
`packages/fokus-core/scss/settings/_colors.scss` durante o desenvolvimento inicial), reforçando o
posicionamento de identidade visual própria (seção 4).

- Cores de estado:
  - `primary`: `#4F46E5`
  - `success`: `#1BC559`
  - `warning`: `#F0B40E`
  - `danger`: `#DC263E`
  - `info`: `#8BA2C4`
- `info` passa a ser uma cor distinta de `primary`, corrigindo a duplicidade
  que existia antes desta implementação (`$color-primary` e `$color-info`
  com o mesmo valor).
- Escala neutra com 9 degraus cheios (100 a 900, sem lacunas), já
  implementada em `packages/fokus-core/scss/settings/_colors.scss`: `#F8FAFC`, `#F1F5F9`,
  `#E2E8F0`, `#CBD5E1`, `#94A3B8`, `#64748B`, `#475569`, `#334155`,
  `#1E293B`.
- Variantes de `primary`/`success`/`warning`/`danger`/`info` para o dark
  mode já implementadas em `packages/fokus-core/scss/themes/_dark.scss` (token
  `--fs-color-#{nome}`, recalculado via `color.mix()` com um peso por
  cor no mapa `$dark-color-weights`); `alert-*-bg`/`-text` continuam
  recalculados à parte para o tema escuro.

### 18.2 Família tipográfica final

Plus Jakarta Sans para heading e body (família única), mantendo Source Code
Pro no monoespaçado (`$font-family-mono`, sem alteração).

- Os arquivos da fonte (`.woff2`, licença OFL) já são self-hosted, distribuídos
  junto ao pacote em `assets/fonts/plus-jakarta-sans/` (incluindo o
  `OFL.txt` da fonte, requisito da licença), com `@font-face` declarado em
  `packages/fokus-core/scss/base/_typography.scss` no lugar do antigo `@import
  url("https://fonts.googleapis.com/...")` — cumprindo a meta de
  "dependência externa zero em tempo de execução" (seção 6) para a fonte
  principal. O monoespaçado (Source Code Pro) permanece via `@import` do
  Google Fonts, sem alteração, conforme decidido acima.

## 19. Convenção de Nomenclatura de Classes

- Prefixo `fs-` em toda classe de componente (`.fs-btn`, `.fs-card`,
  `.fs-container`), para não colidir com nomes de classe de outras
  bibliotecas/CSS de terceiros na mesma página.
- Variantes de cor/estilo por sufixo direto: `.fs-btn-primary`, `.fs-alert-danger`,
  `.fs-badge-success`, seguindo os nomes já usados em `$theme-colors`
  (`packages/fokus-core/scss/settings/_colors.scss`).
- Tamanhos por sufixo `-sm`/`-lg` consistente em todos os componentes que
  tiverem variação de tamanho (botões, badges, cards, inputs), generalizando
  o padrão já usado em `.fs-form-control-sm`/`.fs-form-control-lg`.
- Estados controlados por JavaScript usam classes `is-*` (`.is-open`,
  `.is-active`, `.is-disabled`), nunca atributos `data-state` customizados.
- Utilitários usam prefixo `fs-u-` + abreviações curtas (`.fs-u-d-flex`, `.fs-u-mt-3`,
  `.fs-u-gx-2`, `.fs-u-p-2`), como já implementado em
  `packages/fokus-utilities/scss/utilities/`.
- Responsividade em utilitários e grid segue sempre o formato fixo
  `{propriedade}-{breakpoint}-{valor}` (ex.: `.fs-col-md-6`, `.fs-u-d-md-none`,
  `.fs-u-mt-lg-3`).
- Tokens CSS (`--fs-*`), atributo de auto-init (`data-fs`/`data-fs-target`/
  `data-fs-dismiss`) e eventos customizados (`fs:*`) seguem o mesmo prefixo;
  o global JavaScript (`window.FokusStyles`) e o pacote npm (`fokus-styles`) não
  mudam.

## 20. API JavaScript dos Componentes Interativos

- Inicialização sempre automática via atributo HTML (ex.:
  `data-fs="modal" data-fs-target="#meuModal"`), sem exigir `new` manual
  para o uso básico — alinhado com "uso direto em HTML sem build" (seção 7).
- Toda instância criada automaticamente continua acessível para controle
  programático via método estático de recuperação (ex.:
  `FokusStyles.Modal.getInstance(el)`), permitindo chamar seus métodos sem
  precisar instanciar manualmente.
- Namespace global único: `window.FokusStyles`, com cada componente como
  propriedade (`FokusStyles.Modal`, `FokusStyles.Tooltip`, `FokusStyles.Dropdown`, etc.),
  em vez de globais separados.
- API de instância padronizada para todo componente interativo: `.show()`,
  `.hide()`, `.toggle()`, `.dispose()`.
- Comunicação com a aplicação via eventos DOM customizados (ex.:
  `fs:modal:shown`, `fs:tab:changed`), disparados com
  `CustomEvent` nativo — sem exigir callbacks de construtor.
- Acessibilidade (ARIA, foco, teclado) é requisito obrigatório da API desde
  a v0.1 para todo componente interativo, não um extra a ser adicionado
  depois.
- Além do bundle único (`dist/js/fokus.js`), haverá import granular por
  componente (ex.: `import { Modal } from "fokus-styles/js/modal"`), para uso
  com bundlers.

## 21. Componentes do Framework

Esta seção documenta, por grupo de componente, as classes CSS, tokens e
módulos JavaScript entregues pelo framework até o momento em que cada
trecho foi escrito (ver nota no topo do documento — componentes
adicionados depois têm sua própria página em
[`docs/components/`](../components/), não um adendo aqui). Todo
componente/grupo tem um mockup dedicado em `mockup/` (HTML puro consumindo
os arquivos gerados em `dist/css/`/`dist/js/`), usado tanto como exemplo de
uso quanto como fixture dos testes visuais (seção 22).

### Botões

Variantes sólidas e outline por cor de estado
(`.fs-btn-primary/success/warning/danger/info`, `.fs-btn-outline-*`), tamanhos
(`.fs-btn-sm`/`.fs-btn-lg`) e estados de hover/active/focus/disabled. A função
`color-contrast()` (`packages/fokus-core/scss/tools/_mixins.scss`) garante contraste WCAG AA em
cada variante — reaproveitada por cards, alertas, modal e navbar.

Mockup: `mockup/feedback-actions.html#button`.

### Badges e Alertas

Badges sólidos com tamanhos (`.fs-badge-sm`/`.fs-badge-lg`), reaproveitados por
cards, navbar e tabelas. Alertas com fundo tintado por estado (`.fs-alert-*`),
via tokens `--fs-alert-*-bg`/`-text` com suporte a dark mode, usando as
funções `tint-color()`/`shade-color()` (`packages/fokus-core/scss/tools/_mixins.scss`). Os dois
componentes compartilham o mesmo padrão de variante de cor de estado
(success/warning/danger/info), também usado por tabelas.

Mockup: `mockup/feedback-actions.html#badge`.

### Cards

Combina botões, badges e tipografia base num contêiner:
`.fs-card-header`/`.fs-card-body`/`.fs-card-footer`, `.fs-card-title`/`.fs-card-subtitle`/
`.fs-card-text`, tamanhos (`.fs-card-sm`/`.fs-card-lg`). O `.fs-card-header` suporta a
variante título + botão de fechar (`.fs-btn-close`, reaproveitável em
modal/toast). Utilitários de sombra (`.fs-u-shadow-sm`/`.fs-u-shadow`/`.fs-u-shadow-lg`,
`packages/fokus-utilities/scss/utilities/_shadow.scss`) dão elevação ao card. `.fs-card-clickable` +
`.fs-stretched-link` tornam o card inteiro clicável/focável sem aninhar
elementos interativos; `.fs-card-horizontal` muda o eixo para linha, ajustando
raio/borda do header/footer para a lateral.

Mockup: `mockup/content-data.html#card`.

### Tabelas e Navbar

Tabelas: `.fs-table-striped`/`.fs-table-hover`/`.fs-table-bordered`/
`.fs-table-borderless`/`.fs-table-sm`/`.fs-table-responsive` e variantes de cor de
estado, reaproveitando os tokens `--fs-alert-*` de Badges e Alertas.

Navbar (versão estática, sem dropdown/collapse próprio — a combinação com
Dropdown é feita compondo os dois componentes): `.fs-navbar-brand`/
`.fs-navbar-nav`/`.fs-nav-link`, com estados `.is-active`/`.is-disabled`, reaproveitando
botões e badges para o conteúdo interno.

Mockup: `mockup/content-data.html#table`.

### Paginação e Breadcrumbs

Paginação: `.fs-page-link` com estados `.is-active`/`.is-disabled`, reaproveitando
`color-contrast()` (mesma função dos botões) para garantir contraste.
Breadcrumbs: `.fs-breadcrumb-item` com separador via `::before` e estado
`.is-active`. Ambos são auxiliares de navegação, sem JavaScript.

Mockup: `mockup/navigation-disclosure.html#pagination`.

### Formulários Avançados

Estados de validação: `.fs-form-control.is-valid`/`.is-invalid` (borda e anel
de foco em `--fs-color-success`/`-danger`, reaproveitando as cores de
estado de alertas/badges), com `.fs-valid-feedback`/`.fs-invalid-feedback`
exibidos via seletor de irmão adjacente, sem JavaScript.

Upload de arquivo estilizado: `.fs-file-upload`/`.fs-file-input`/`.fs-file-label` —
o input nativo é ocultado por `clip-path` (mantendo foco e navegação por
teclado), com rótulo estilizado via `<label for>`, tamanhos
(`.fs-file-label-sm`/`-lg`) e estado desabilitado. Todo o grupo é 100% CSS, sem
dependência de JavaScript.

Mockup: `mockup/forms.html#input`.

### Infraestrutura JS Compartilhada

Módulos internos em `packages/fokus-js/js/core/` (ES modules, sem dependências externas)
usados por todos os componentes interativos, sem componente visual próprio:

- `positioning.js` — `computePosition()`/`applyPosition()`, com flip
  automático para o lado oposto e clamp dentro da viewport. Usado por
  Dropdown, Tooltip e, indiretamente via composição, Select customizado.
- `overlay.js` — `lockScroll()`/`unlockScroll()` com compensação de
  scrollbar e contagem de referências para overlays aninhados, além de
  `onClickOutside()`. Usado por Modal e Dropdown.
- `focus.js` — `createFocusTrap()` com ciclo Tab/Shift+Tab e
  `onEscapeKey()`. Usado por Modal e Dropdown.
- `transition.js` — `collapse()`/`expand()`, animando `height` via
  `transitionend` e respeitando `prefers-reduced-motion`. Usado por
  Accordion, Tabs e Toast.
- `register.js` — `autoInit()`/`createInstanceRegistry()`, padrão comum de
  inicialização automática (`data-fs="..."`) e registro de instância
  (`getInstance()`) usado por todo componente interativo.

Reexportado como `FokusStyles.core` pelo bundle único (`packages/fokus-js/js/fokus.js` →
`dist/js/fokus.js`) e também importável de forma granular
(`fokus-styles/js/core/positioning`, etc.), alinhado com a API JavaScript
definida na seção 20.

Mockup: `mockup/foundations.html#js-foundation` (harness de posicionamento, foco e
transição, sem componente visual final).

### Dropdown e Tooltip

`.fs-dropdown-toggle`/`.fs-dropdown-menu`/`.fs-dropdown-item`/`.fs-dropdown-divider`/
`.fs-dropdown-header` (`packages/fokus-components/scss/components/_dropdown.scss`). `.fs-tooltip`/
`.fs-tooltip-inner`/`.fs-tooltip-arrow` com 4 posicionamentos
(`packages/fokus-components/scss/components/_tooltips.scss`), usando os tokens
`--fs-tooltip-bg`/`-text` (invertidos no dark mode).

`packages/fokus-js/js/dropdown.js` e `packages/fokus-js/js/tooltip.js` seguem a API da seção 20: auto-init via
`data-fs="dropdown"`/`"tooltip"`, `FokusStyles.Dropdown`/`FokusStyles.Tooltip` com
`getInstance()`, `.show()`/`.hide()`/`.toggle()`/`.dispose()`, eventos
`fs:dropdown:shown`/`-hidden` e `fs:tooltip:shown`/`-hidden`.
Dropdown navega entre itens com ArrowUp/ArrowDown e fecha ao clicar em um
item, fora do menu ou com Escape (foco retorna ao toggle). Tooltip
mostra/esconde por hover/foco/blur e Escape, com `aria-describedby` ligando
o elemento de referência ao tooltip.

`computePosition()` (`packages/fokus-js/js/core/positioning.js`) suporta a opção `align`
(`"start"`/`"center"`/`"end"`) para o eixo cruzado, além do `placement`. O
Dropdown usa `data-align` no toggle (padrão `"start"`, alinhamento à esquerda)
com offset de 4px em relação ao toggle; `.fs-dropdown-menu` tem
`position: absolute` explícito no CSS base, evitando que o menu seja medido
como bloco normal antes do JS aplicar a posição (o que quebraria o cálculo
de alinhamento `start`/`end`).

Mockup: `mockup/overlays-commands.html#dropdown`.

### Modal e Select Customizado

Modal: `.fs-modal`/`.fs-modal-dialog`/`.fs-modal-content`/`.fs-modal-header`/
`.fs-modal-title`/`.fs-modal-body`/`.fs-modal-footer` (`packages/fokus-components/scss/components/_modal.scss`),
com tamanhos `.fs-modal-sm`/`.fs-modal-lg` no `.fs-modal-dialog`. `packages/fokus-js/js/modal.js`
(`FokusStyles.Modal`) reaproveita a infraestrutura JS compartilhada:
`lockScroll()` enquanto aberto, `createFocusTrap()` no `.fs-modal-dialog`,
`onEscapeKey()` e `onClickOutside()` para fechar (foco retorna ao gatilho);
dismiss via qualquer elemento com `data-fs-dismiss="modal"`;
`data-backdrop="static"` no `.fs-modal` desativa fechar por Escape/clique fora.

Select customizado: `packages/fokus-js/js/select.js` (`FokusStyles.Select`) gera a marcação
(`.fs-form-select` + `.fs-dropdown-menu`/`.fs-dropdown-item` por `<option>`) a partir
de um `<select>` nativo (`data-fs="select"`, oculto mas mantido em
sincronia para submissão de formulário) e **compõe uma instância de
Dropdown por cima** — reaproveitando 100% do posicionamento, navegação por
setas e fechamento do Dropdown, em vez de duplicar essa lógica. A seleção
atualiza o `<select>` nativo e dispara `change` nativo (compatibilidade com
listeners externos), além de `fs:select:changed`. ARIA usa
`role="listbox"`/`"option"`/`aria-selected` (semântica mais correta para
este caso, em vez de `"menu"`/`"menuitem"` herdado do Dropdown). Tamanhos
via `data-size="sm"/"lg"` no `<select>` (`.fs-form-select-sm`/`-lg`,
`packages/fokus-components/scss/forms/_forms.scss`).

Mockup: `mockup/overlays-commands.html#modal`.

### Accordion, Tabs e Toast

Os três reaproveitam a infraestrutura de transição/collapse
(`packages/fokus-js/js/core/transition.js`).

**Accordion** (`.fs-accordion`/`.fs-accordion-item`/`.fs-accordion-header`/
`.fs-accordion-button`/`.fs-accordion-collapse`/`.fs-accordion-body`,
`packages/fokus-components/scss/components/_accordion.scss`): `packages/fokus-js/js/accordion.js` usa `collapse()`/
`expand()` de `FokusStyles.core` para animar a altura de cada painel; só um
painel aberto por vez por padrão (`data-multiple="true"` permite vários
simultâneos).

**Tabs** (`.fs-tabs`/`.fs-tab-content`/`.fs-tab-pane`, `packages/fokus-components/scss/components/_tabs.scss`,
reaproveitando `.fs-nav-link` da Navbar com um indicador de sublinhado escopado
a `.fs-tabs`): `packages/fokus-js/js/tabs.js` alterna `.is-active` no link e no painel
correspondente, com navegação por ArrowLeft/ArrowRight/Home/End entre as
abas habilitadas (`role="tablist"`/`"tab"`/`"tabpanel"`, `aria-selected`,
`tabindex` roving), disparando `fs:tab:changed`.

**Toast** (`.fs-toast-container`/`.fs-toast`/`.fs-toast-header`/`.fs-toast-body`,
variantes de cor de estado via `.fs-toast-#{nome}`,
`packages/fokus-components/scss/components/_toasts.scss`): `packages/fokus-js/js/toast.js` usa `expand()`/`collapse()`
para mostrar/esconder, com timer de auto-dismiss configurável (`data-delay`,
`data-autohide="false"` para desativar) e dismiss via
`data-fs-dismiss="toast"`. Instâncias são criadas no auto-init mas só ficam
visíveis quando `.show()` é chamado (tipicamente após alguma ação), via
`FokusStyles.Toast.getInstance(el).show()`.

Mockup: `mockup/navigation-disclosure.html#accordion`.

### Spinner e Progress

Indicadores de carregamento e progresso, 100% CSS (sem JavaScript). Spinner
giratório `.fs-spinner` (anel com um lado transparente, animação contínua
`fokus-spin`), com tamanhos (`.fs-spinner-sm`/`.fs-spinner-lg`) e variantes de cor
de estado (`.spinner-#{nome}`) via os tokens `--fs-color-*`; a cor herda
de `currentColor`, permitindo colorir também com utilitários de texto.

Barra de progresso `.fs-progress`/`.fs-progress-bar`
(`packages/fokus-components/scss/components/_spinner.scss`): a largura do preenchimento é controlada por
`--fs-progress-value` (0–100) ou por `style="width"`, com transição suave.
Tamanhos (`.fs-progress-sm`/`.fs-progress-lg`), variantes de cor de estado
(`.fs-progress-bar-#{nome}`, reaproveitando `color-contrast()` como botões/badges)
e faixas diagonais opcionais (`.fs-progress-bar-striped`, animáveis com
`.fs-progress-bar-animated`). Toda animação respeita `prefers-reduced-motion`
(spinner desacelera, listras param). ARIA fica a cargo do consumidor
(`role="status"` no spinner, `role="progressbar"` + `aria-valuenow` na barra).

Mockup: `mockup/feedback-actions.html#progress`.

### Carousel

Carrossel de slides (`.fs-carousel`/`.fs-carousel-inner`/`.fs-carousel-item`,
`packages/fokus-components/scss/components/_carousel.scss`). O layout padrão é "slide": `.fs-carousel-inner`
é uma trilha flex e `packages/fokus-js/js/carousel.js` a desloca por `translateX(-index*100%)`;
o recorte (`overflow: hidden`) fica no `.fs-carousel` (elemento parado), não na
trilha, senão a área de recorte se moveria junto e cortaria os slides
seguintes. A variante `.fs-carousel-fade` empilha os slides e anima a opacidade.
Controles `.fs-carousel-control-prev`/`-next` (setas),
`.fs-carousel-indicators` (dots em pill quando ativos) e
`.fs-carousel-control-toggle[data-fs-carousel-toggle]` (pausa/reprodução)
são opcionais — o JS liga cada um ao slide correspondente. A legenda opt-in
`.fs-carousel-caption` usa scrim para conteúdo de produto sobre imagens. O
modificador `.fs-carousel-hover-controls` esconde os controles até o
hover/foco (`:focus-within`) do carrossel.

`packages/fokus-js/js/carousel.js` (`FokusStyles.Carousel`) segue a API da seção 20: auto-init via
`data-fs="carousel"`, `FokusStyles.Carousel.getInstance()`, métodos
`.next()`/`.prev()`/`.goTo(i)`/`.pause()`/`.play()`/`.dispose()`, evento
`fs:carousel:slid` (`detail: { from, to }`). Navegação por teclado
(ArrowLeft/Right, Home/End quando o carrossel tem foco), swipe por
pointer events (com pointer capture, feedback durante o arraste e preservação
da rolagem vertical) e autoplay opcional (`data-autoplay="true"`, intervalo
por `data-interval`, em ms). Autoplay pausa temporariamente no hover, foco,
arraste e aba oculta; `pause()` exige `play()` para retomá-lo. `role="group"`
+ `aria-roledescription="carousel"`, `aria-hidden` por slide, `aria-current`
nos indicadores e `aria-pressed` no toggle; `aria-live` fica `off` apenas
enquanto o autoplay roda e `polite` quando manual ou pausado. As transições
respeitam `prefers-reduced-motion`.

Mockup: `mockup/content-data.html#carousel`.

### Stepper

Stepper/Wizard (`.fs-stepper`/`.fs-stepper-header`/`.fs-step`, `packages/fokus-components/scss/components/_stepper.scss`).
Cada `.fs-step` tem um `.fs-step-indicator` (círculo com número, ou um "check" em SVG
quando concluído) e um `.fs-step-label`; a variante `.fs-stepper-vertical` empilha os
passos com `.fs-step-content` (label + `.fs-step-description`). Estados por passo:
padrão (pendente), `.fs-step-active`, `.fs-step-completed` e `.fs-step-error`. O conector
entre passos é desenhado via `::after` e fica na cor primária depois de um passo
concluído (indica progresso) — a regra usa `:not(:last-child)` para casar a
especificidade da regra base do conector. Opcionalmente há painéis de conteúdo
(`.fs-step-panel`, só o ativo visível) e ações de navegação (`.fs-stepper-actions` com
botões `[data-stepper="prev"]`/`[data-stepper="next"]`).

`packages/fokus-js/js/stepper.js` (`FokusStyles.Stepper`) segue a API da seção 20: auto-init via
`data-fs="stepper"`, `getInstance()`, métodos `.next()`/`.prev()`/`.goTo(i)`/
`.setError(i, bool)`/`.complete()`/`.dispose()`. Antes de cada troca dispara o
evento **cancelável** `fs:stepper:beforechange` (`detail: { from, to }`) —
prevenir com `preventDefault()` bloqueia o avanço (hook de validação por passo);
depois de trocar dispara `fs:stepper:changed`, e ao concluir o último passo,
`fs:stepper:completed`. Por padrão é linear (`data-linear`, padrão `true`):
o cabeçalho só navega para passos já concluídos; `data-linear="false"` libera
pular para qualquer passo. Acessibilidade: `aria-current="step"` no passo ativo,
passos clicáveis navegáveis por teclado (Enter/Espaço).

Mockup: `mockup/navigation-disclosure.html#stepper`.

### Offcanvas

Painel deslizante (`.fs-offcanvas`, `packages/fokus-components/scss/components/_offcanvas.scss`), com o
mesmo mecanismo de overlay do Modal (bloqueio de scroll, focus trap,
fechamento por Escape/clique fora), aplicado de forma independente (não
compõe `packages/fokus-js/js/modal.js` — segue o padrão já usado por Accordion/Tabs/Toast, cada
um reaproveitando os módulos de `packages/fokus-js/js/core/` por si). Modificadores de posição
obrigatórios `.fs-offcanvas-start`/`-end`/`-top`/`-bottom` definem o eixo de
tamanho (largura para start/end, altura para top/bottom) e a direção inicial
do `transform`; `.fs-offcanvas-header`/`-title`/`-body`/`-footer` seguem o mesmo
padrão do Modal (reaproveitando `.fs-btn-close`). O `.fs-offcanvas-backdrop` é criado
dinamicamente pelo JS (não fica fixo ao painel, como no Modal, porque o painel
não cobre a tela inteira).

`packages/fokus-js/js/offcanvas.js` (`FokusStyles.Offcanvas`) segue a API da seção 20: auto-init via
`data-fs="offcanvas"`, `data-fs-target` no gatilho, `getInstance()`,
`.show()`/`.hide()`/`.toggle()`/`.dispose()`, eventos
`fs:offcanvas:shown`/`-hidden`. `data-fs-dismiss="offcanvas"` fecha a partir
de qualquer elemento interno; `data-backdrop="static"` desativa Escape e
clique fora (dismiss continua funcionando); `data-backdrop="false"` remove o
elemento visual de backdrop mas mantém Escape e clique fora ativos (via
`onClickOutside` no próprio painel, ignorando cliques no gatilho). Uma
particularidade de implementação: como `visibility: hidden` mantém
`offsetParent` não nulo (diferente de `display: none`), o elemento só fica de
fato focável depois que o navegador processa a transição de visibilidade —
por isso a ativação do focus trap é adiada por um duplo
`requestAnimationFrame` (mesma técnica já usada por `collapse()`/`expand()`
em `packages/fokus-js/js/core/transition.js`).

Mockup: `mockup/overlays-commands.html#offcanvas`.

### Popover

Painel flutuante com conteúdo rico (`.fs-popover`/`.fs-popover-header`/`-body`/
`-footer`, `packages/fokus-components/scss/components/_popover.scss`), posicionado com a mesma técnica
do Tooltip (`.fs-popover-arrow`, quadrado rotacionado 45°) mas com aparência de
card de superfície (`--fs-color-surface`/`-border`, `--fs-shadow-md`)
em vez do chip escuro do tooltip, já que pode conter elementos interativos.
`role="dialog"` (não `"tooltip"`, que por spec ARIA não pode conter conteúdo
interativo) com `aria-modal="false"` — é um overlay leve, sem focus trap e sem
bloqueio de scroll (diferente de Modal/Offcanvas).

`packages/fokus-js/js/popover.js` (`FokusStyles.Popover`) é independente (não compõe `Tooltip` nem
`Dropdown`), reaproveitando apenas `positioning.js`
(`computePosition`/`applyPosition`, como Dropdown/Tooltip) e
`onClickOutside`/`onEscapeKey`. Segue a API da seção 20
(`data-fs="popover"`, `data-fs-target` no gatilho, `getInstance()`,
`.show()`/`.hide()`/`.toggle()`/`.dispose()`, eventos
`fs:popover:shown`/`-hidden`). `data-trigger` controla o disparo:
`"click"` (padrão, com `onClickOutside` ignorando o gatilho e Escape
devolvendo o foco), `"hover"` (mouseenter/mouseleave no gatilho **e** no
próprio popover, com um pequeno delay de saída para permitir mover o mouse
para dentro do conteúdo), `"focus"` (usa `focusout`/`relatedTarget` em vez de
`blur`, pela mesma razão do hover) ou `"manual"` (instância criada via
auto-init, sem nenhum listener automático — só API programática, no espírito
do Toast). `data-fs-dismiss="popover"` fecha a partir de qualquer elemento
interno; `data-placement`/`data-align` controlam o posicionamento.

Mockup: `mockup/overlays-commands.html#offcanvas`.

### Segmented Control

Grupo de botões com estado selecionado (`.fs-segmented-control`/`.fs-segmented-item`/
`.fs-segmented-label`, `packages/fokus-components/scss/components/_segmented-control.scss`), 100% CSS.
Modo exclusivo: `<input type="radio">` (mesmo `name` em todos os itens do
grupo). Modo inclusivo: `<input type="checkbox">`, cada item
seleciona/deseleciona de forma independente. O `<input>` fica visualmente
oculto (mesma técnica de `.fs-file-input`, `packages/fokus-components/scss/forms/_forms.scss`) e o
`<label>` irmão recebe o estilo — o item selecionado reaproveita
`color-contrast()` (mesma função de botões/badges/pagination) para garantir
contraste. Tamanhos `.fs-segmented-control-sm`/`-lg`.

Mockup: `mockup/forms.html#segmented-control`.

### Skeletons

Placeholder de carregamento (`.fs-skeleton`, `packages/fokus-components/scss/components/_skeleton.scss`),
100% CSS. Variantes `.fs-skeleton-text`/`-circle`/`-rect`; tamanho/forma
controlados por largura/altura inline ou pelo elemento host. Animação padrão
"pulse" (oscila a opacidade); variante `.fs-skeleton-wave` substitui por um
brilho que varre da esquerda pra direita via pseudo-elemento. Ambas
desativadas em `prefers-reduced-motion: reduce`.

Mockup: `mockup/feedback-actions.html#skeleton`.

### Timeline

Linha do tempo (`.fs-timeline`/`.fs-timeline-item`/`.fs-timeline-marker`/
`.fs-timeline-content`, `packages/fokus-components/scss/components/_timeline.scss`), 100% CSS, vertical por
padrão (`.fs-timeline-horizontal` inverte o eixo). Estados por item: padrão
(pendente), `.fs-timeline-active`, `.fs-timeline-completed` (marcador com "check",
mesmo ícone do Stepper) e `.fs-timeline-failed`, reaproveitando os tokens de cor
de estado (`--fs-color-primary/success/danger`). O conector entre
marcadores fica na cor de sucesso depois de um item concluído, mesma lógica
de progresso do Stepper (`packages/fokus-components/scss/components/_stepper.scss`).

Mockup: `mockup/content-data.html#timeline`.

### Collapse (standalone)

Extrai o padrão `collapse()`/`expand()` de `packages/fokus-js/js/core/transition.js` — já usado
internamente pelo Accordion — para uma seção expansível independente, sem
precisar de um accordion completo. `.fs-collapse` (`packages/fokus-components/scss/components/_collapse.scss`)
só define o `overflow: hidden` exigido pela animação de `height`. `packages/fokus-js/js/collapse.js`
(`FokusStyles.Collapse`) segue a API da seção 20: auto-init via
`data-fs="collapse"` no gatilho com `data-fs-target`, `getInstance()`,
`.show()`/`.hide()`/`.toggle()`/`.dispose()`, eventos
`fs:collapse:shown`/`-hidden`, `aria-expanded`/`aria-controls` geridos
automaticamente. Estado inicial aberto via `aria-expanded="true"` no gatilho.

Mockup: `mockup/navigation-disclosure.html#collapse`.

### Breadcrumb Avançado

Estende `.fs-breadcrumb`/`.fs-breadcrumb-item` (`packages/fokus-components/scss/components/_breadcrumbs.scss`)
com truncamento e colapso automático em telas pequenas, via `packages/fokus-js/js/breadcrumb.js`
(`FokusStyles.Breadcrumb`, auto-init com `data-fs="breadcrumb"` na lista,
`data-max-items` configurável). Cada label ganha `.fs-breadcrumb-item-truncate`
(reticências por CSS); labels que realmente transbordam (medido só depois de
`document.fonts.ready`, por causa da tipografia self-hosted da seção 18.2)
ganham um `Tooltip` (`packages/fokus-js/js/tooltip.js`) com o texto completo. Abaixo do
breakpoint `sm` (640px), se a lista tiver mais itens que `data-max-items`,
os níveis intermediários são substituídos por um único item `.fs-breadcrumb-more`
("…") que **compõe um `Dropdown`** (`packages/fokus-js/js/dropdown.js`, mesmo padrão de
composição do Select customizado) com os links ocultos — mantém
sempre o primeiro e o último nível visíveis.

Mockup: `mockup/navigation-disclosure.html#pagination`.

### Input Group

Funde `.fs-form-control` (ou `.fs-form-select`/`.fs-btn`) com "addons" de texto/ícone
de prefixo/sufixo (`.fs-input-group`/`.fs-input-group-text`,
`packages/fokus-components/scss/forms/_forms.scss`), 100% CSS. A altura do addon acompanha a do
controle via `align-items: stretch` (sem precisar fixar `height`); as bordas
adjacentes são fundidas (sem dupla borda) e só as pontas do grupo mantêm o
radius. Tamanhos `.fs-input-group-sm`/`-lg`.

Mockup: `mockup/forms.html#input-group`.

### Alert Dialog / Confirm

Variante do Modal (`packages/fokus-components/scss/components/_alert-dialog.scss`, estende
`.fs-modal`/`.fs-modal-dialog`/`.fs-modal-content`/`.fs-modal-footer` sem duplicar
layout) para confirmação, 100% programática — ao contrário dos demais
componentes (auto-init declarativo via `data-fs`), é montada na hora por
`FokusStyles.confirm(options)` (`packages/fokus-js/js/confirm.js`), sem precisar de marcação
pré-declarada na página. Internamente reaproveita `packages/fokus-js/js/modal.js` (foco,
teclado, overlay) com um gatilho sintético. Retorna uma `Promise<boolean>`:
`true` se o botão de confirmação for clicado, `false` se cancelado ou
fechado por Escape/clique fora. Opções: `title`, `message`, `confirmText`,
`cancelText`, `variant` (cor de estado do ícone circular e do botão de
confirmação, reaproveitando `color-contrast()`). O foco volta para o
elemento que estava focado antes da chamada (o botão que abriu o diálogo).

Mockup: `mockup/overlays-commands.html#alert-dialog`.

### Divider

Linha divisória (`packages/fokus-components/scss/components/_divider.scss`), 100% CSS.
`<hr class="divider">` para o traço simples; `<div class="divider">` (não
pode ser `<hr>`, que não aceita filhos) com `.fs-divider-label` para texto
centralizado, flanqueado por duas linhas via pseudo-elementos.

Mockup: `mockup/foundations.html#divider`.

### Empty State

Bloco padrão para listas/telas vazias (`.fs-empty-state`,
`packages/fokus-components/scss/components/_empty-state.scss`), 100% CSS: `.fs-empty-state-icon` (slot
vazio para o consumidor colocar seu próprio SVG/emoji/ilustração),
`.fs-empty-state-title`, `.fs-empty-state-text` e ação opcional reaproveitando os
botões existentes.

Mockup: `mockup/feedback-actions.html#empty-state`.

### Rating / Stars

Avaliação por estrelas (`.fs-rating`/`.fs-rating-star`, `packages/fokus-components/scss/components/_rating.scss`),
100% CSS — mesma técnica de input oculto + label irmão do Segmented Control
(seção anterior): um `<input type="radio">` por estrela, exclusivo dentro do
grupo. A marcação usa os pares input+label em ordem decrescente de valor
(5, 4, 3...) com `.fs-rating` em `row-reverse` — o truque clássico de CSS para
destacar "a estrela clicada e todas à esquerda dela" usando só o combinador
de irmãos gerais (`~`). Tamanhos `.fs-rating-sm`/`-lg`.

Mockup: `mockup/forms.html#rating`.

### Badge Dismissível / Tag

Tag removível (`.fs-tag`, `packages/fokus-components/scss/components/_tag.scss`), estendendo
`.fs-badge` e `.fs-btn-close` sem duplicar estilos — só ajusta o
tamanho do botão de fechar (14×14px) para caber num badge. Precisa de
JavaScript, mas de forma mínima:
`packages/fokus-js/js/tag.js` (`FokusStyles.Tag`) só ouve o clique em `[data-fs-dismiss="tag"]`.
Antes de remover o elemento do DOM, dispara o evento **cancelável**
`fs:tag:dismissed` (mesmo espírito de `fs:stepper:beforechange`) —
`preventDefault()` bloqueia a remoção.

Mockup: `mockup/feedback-actions.html#tag`.

### File Input Drag-and-Drop

Evolui o upload de arquivo (`.fs-file-upload`/`.fs-file-input`/`.fs-file-label`)
com arrastar-e-soltar. `packages/fokus-js/js/file-drop.js` (`FokusStyles.FileDrop`)
auto-inicia via `data-fs="file-drop"` no próprio `<label for="...">`
(o input associado é resolvido pelo atributo `for`, o mesmo vínculo que já
existe entre `.fs-file-input`/`.fs-file-label`); escuta `dragenter`/`dragover`/
`dragleave`/`drop`, aplicando `.is-dragover` como feedback visual, e ao
soltar sincroniza `input.files` com o arquivo solto, disparando `change`
nativo (mesmo padrão do Select customizado). Variante visual
`.fs-file-label-dropzone` para quando o alvo de soltar precisa ser maior que
o botão padrão.

Mockup: `mockup/forms.html#file-upload`.

### Hover Card

Não é um componente novo — composição do Popover (`packages/fokus-components/scss/components/_popover.scss`,
`packages/fokus-js/js/popover.js`) com `data-trigger="hover"` (já suportado) e
conteúdo mais rico (ex. avatar + bio). O único ajuste é visual: o
modificador `.fs-popover-hover-card` alarga o popover (320px) e alinha um
layout de linha (avatar ao lado do texto) no `.fs-popover-body`.

Mockup: `mockup/overlays-commands.html#hover-card`.

## 22. Testes Automatizados

- **Teste funcional de JavaScript:** Vitest com `jsdom` (`vitest.config.mjs`,
  `tests/unit/`), cobrindo estado, atributos ARIA e eventos disparados por
  cada componente interativo e pelos módulos de `packages/fokus-js/js/core/` (posicionamento,
  overlay, foco, transição). Executado via `npm test`.
- **Teste visual (regressão de CSS):** Playwright (`playwright.config.mjs`,
  `tests/visual/`), com screenshots de baseline por mockup e testes de
  interação (abrir/fechar dropdown, modal, accordion, tabs, toast — foco,
  Escape, clique fora, navegação por teclado). Executado via
  `npm run test:visual`; as baselines são geradas por plataforma (sufixo
  `-win32`/`-linux` no nome do arquivo), com as baselines Linux geradas em
  um container Docker (`mcr.microsoft.com/playwright`) para bater com o
  ambiente do CI (`ubuntu-latest`).
- Os laboratórios em `mockup/*.html` são as fixtures oficiais de regressão
  visual; as fontes em `mockup/examples/*.html` preservam a cobertura de
  acessibilidade e interações dos componentes
  visuais — cada componente/grupo implementado tem um mockup dedicado,
  mantido atualizado.
- Testes (funcionais e visuais) rodam automaticamente no GitHub Actions a
  cada push/PR (`.github/workflows/ci.yml`), além do lint e build.
