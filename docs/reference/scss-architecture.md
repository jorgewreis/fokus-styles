# Arquitetura SCSS do Fokus Styles

## Objetivo

A arquitetura SCSS do Fokus Styles organiza o framework em módulos pequenos, previsíveis e alinhados a uma abordagem híbrida: componentes prontos, utilitários reutilizáveis e tokens customizáveis por CSS Custom Properties.

O repositório é um monorepo (npm workspaces). O código-fonte SCSS vive em
`packages/*/scss/`; `scss/` (raiz do repo) contém apenas os pontos de entrada
de build (`scss/fokus.scss` e `scss/entries/`), que combinam os pacotes.

`scss/fokus.scss` é o ponto de entrada oficial do bundle completo:

```text
scss/fokus.scss
```

## Estrutura

```text
packages/
├── fokus-core/scss/
│   ├── settings/
│   ├── tools/
│   ├── tokens/
│   ├── base/
│   ├── layout/
│   └── themes/
├── fokus-components/scss/
│   ├── components/
│   └── forms/
├── fokus-utilities/scss/
│   └── utilities/
├── fokus-fonts/scss/
└── fokus-js/js/
scss/
├── fokus.scss      # bundle completo (dist/css/fokus.css)
└── entries/         # pontos de entrada auxiliares por distribuição
```

Cada pacote expõe seu próprio `scss/` como raiz de resolução (`scssLoadPaths`
em `scripts/build.mjs`), então `@use "settings"`/`@use "tokens"`/etc. resolve
sem caminhos relativos `../../` entre pacotes.

## Cascade layers (`@layer`)

Todo CSS emitido pelo framework é organizado em cascade layers, na ordem
declarada uma única vez em `packages/fokus-core/scss/tokens/_root.scss`:

```scss
@layer reset, tokens, base, layout, components, utilities, overrides;
```

- **reset** — normalização mínima (`base/_reset.scss`).
- **tokens** — CSS Custom Properties em `:root` e overrides de tema
  (`tokens/_root.scss`, `themes/_dark.scss`).
- **base** — estilos globais de elementos (`base/_typography.scss`).
- **layout** — grid/containers (`layout/`).
- **components** — todo componente pronto, incluindo `forms/`.
- **utilities** — classes utilitárias (`.fs-u-*`).
- **overrides** — reservada, sem regras do próprio framework; existe para que
  consumidores possam sobrescrever qualquer camada anterior sem precisar de
  `!important` ou seletores mais específicos.

Cada parcial que gera CSS envolve seu próprio conteúdo na camada
correspondente (ex.: `_buttons.scss` inteiro dentro de `@layer components { }`).
Parciais que só declaram variáveis/mixins Sass (`settings/`, `tools/`) **não**
são envolvidos em `@layer` — eles não emitem CSS.

Como a ordem de precedência vem da ordem das camadas (não da ordem de
`@use` no arquivo), um componente sempre perde para uma utility (`.fs-u-*`)
mesmo que o componente seja `@use`'d depois — é o comportamento desejado.

## Camadas de conteúdo

### settings

Define valores Sass usados em tempo de compilação: breakpoints, larguras de
containers, escala de espaçamento, cores primitivas, tipografia, raios de
borda. Esses arquivos não geram CSS diretamente e não entram em `@layer`.

### tools

Define mixins e funções Sass reutilizáveis (`media-breakpoint-up`,
`focus-ring`, `truncate`, `color-contrast`, etc.). Também não geram CSS.

### tokens

Gera CSS Custom Properties públicas em `:root` (camada `tokens`), permitindo
customização em CSS sem recompilar o framework. Nomes seguem o prefixo
`--fs-*`, em 3 camadas:

1. **Primitivo** (`settings/_colors.scss`, `settings/_spacing.scss`, etc.) —
   valores Sass em tempo de compilação (`$color-blue-500`, `$radius-md`), não
   emitidos diretamente como CSS.
2. **Semântico** (`tokens/_root.scss` para as cores/raio/sombra "cruas" —
   `--fs-color-primary`, `--fs-radius-md` — e `tokens/_semantic.scss` para
   aliases nomeados por papel — `--fs-color-bg-surface`,
   `--fs-color-text-primary`, `--fs-color-border-default`). Todo token
   semântico é um `var()` de um token primitivo; nunca redeclara um valor.
3. **Componente** (`--fs-btn-bg`, `--fs-btn-color`, `--fs-btn-border-color`
   em `_buttons.scss`) — cada componente declara suas próprias custom
   properties, com fallback para um token semântico/primitivo, e usa só essas
   nas propriedades CSS reais. Isso permite sobrescrever a aparência de uma
   instância específica (`.minha-classe { --fs-btn-bg: ...; }`) sem
   `!important`. `_buttons.scss` é a referência do padrão — componentes mais
   antigos ainda consomem tokens semânticos/primitivos diretamente e devem
   migrar para o próprio padrão à medida que forem alterados.

Primitivos de cor são gerados em OKLCH (`color.to-space(#hex, oklch)` a
partir do hex histórico — ver comentário em `settings/_colors.scss`), com
fallback sRGB automático: cada token de cor é declarado duas vezes em
`tokens/_root.scss`/`themes/_dark.scss` — incondicionalmente com
`rgb-fallback()` (gamut-mapeado), depois de novo dentro de
`@supports (color: oklch(0% 0 0))` com o valor OKLCH nativo. Navegadores sem
suporte a `oklch()` ignoram o bloco `@supports` inteiro e ficam só com o
fallback. `tint-color()`/`shade-color()`/`color.mix()` usados para derivar
tons (`--fs-alert-*-bg`, tema escuro) misturam com `$method: oklch` — rode
`npm run contrast` (ver `docs/reference/contrast-report.md`) depois de mudar
qualquer peso de mistura.

### base

Estilos globais mínimos de elementos (`body`, tipografia base). Camada
`base` — deve permanecer pequena para evitar efeitos colaterais.

### layout

Base estrutural do framework: containers, rows, colunas, grid baseado em
Flexbox. Camada `layout`.

O gutter do grid (`.fs-row`/`.fs-col-*`) é implementado via padding + margin
negativo controlados pelas CSS Custom Properties `--fs-gutter-x`/`--fs-gutter-y`
(não via `gap` do flexbox), porque `gap` não é descontado da largura em
porcentagem das colunas numeradas (`.fs-col-6`, `.fs-col-md-4`), o que causaria
estouro de linha. As classes `.fs-u-g-*`/`.fs-u-gx-*`/`.fs-u-gy-*` (em `utilities/_spacing.scss`)
controlam essas variáveis e só têm efeito dentro de uma `.fs-row`. Para `gap`
literal em qualquer container flex/grid fora do sistema de colunas, use
`.fs-u-gap-*`/`.fs-u-gap-x-*`/`.fs-u-gap-y-*`.

### forms

Agrupa estilos de formulários (linhas/colunas, labels, textos auxiliares,
inputs, tamanhos de campo, estados de foco/desabilitado/leitura). Empacotado
com `fokus-components`, camada `components`.

### components

Agrupa componentes prontos — um parcial `_nome.scss` por componente em
`packages/fokus-components/scss/components/`, registrado em `_index.scss`.
Camada `components`. Lista completa: ver o diretório do pacote (a lista muda
com frequência conforme novos componentes entram).

### utilities

Classes utilitárias reutilizáveis (`.fs-u-*`): display, flex, spacing,
shadow, typography, visibility. Camada `utilities` — sempre a última camada
com regras do próprio framework, garantindo que uma utility sempre vença um
componente. Utilitários devem ser previsíveis, pequenos e combináveis.

### themes

Variações globais de tema. O primeiro tema obrigatório é o dark mode via:

```html
<html data-theme="dark">
```

Camada `tokens` (só redefine `--fs-*`; não define novas regras de layout).

## Convenções

- Usar arquivos parciais com prefixo `_`.
- Usar `@use` e `@forward`, evitando `@import` para módulos internos.
- `@use`/`@forward` sempre no topo do arquivo, antes de qualquer `@layer`.
- Manter `scss/fokus.scss` como único ponto de entrada público para o bundle completo.
- Classes de componente: `.fs-*`; utilitários: `.fs-u-*`; estados controlados por
  JS: `.is-*`; tokens CSS: `--fs-*`; atributos de auto-init: `data-fs`/
  `data-fs-target`/`data-fs-dismiss`; eventos DOM customizados: `fs:*`.
- Evitar estilos globais agressivos.
- Preferir CSS Custom Properties para valores que usuários podem sobrescrever.
- Centralizar valores de interação em tokens (`--fs-focus-*`, `--fs-transition-*`
  e `--fs-ease-*`) em vez de repetir durações ou anéis de foco.
- Todo componente interativo deve declarar foco visível, estado desabilitado e
  comportamento compatível com `prefers-reduced-motion`.
- Controles e superfícies devem declarar um `background-color` explícito por
  meio de token semântico; `transparent` fica reservado a trilhas, backdrops
  ou variantes cuja transparência faça parte da API visual.
- Preferir variáveis Sass para valores usados em geração de classes.

## Pipeline de Build

O build (`npm run build`, `scripts/build.mjs`) compila SCSS para CSS via Dart
Sass, aplica PostCSS com Autoprefixer (alvo em `.browserslistrc` — ver
`docs/reference/browser-support.md`) e gera versões minificadas com source
maps em `dist/css/`.

Para preservar a distribuição em arquivos separados (`layout.css`, `forms.css`,
`components.css`, `helpers.css`), existem pontos de entrada auxiliares em
`scss/entries/`, cada um combinando `tokens` + `base` + `themes` com o módulo
correspondente, garantindo que qualquer um dos arquivos possa ser usado de
forma isolada (com variáveis, reset e dark mode funcionando). Esses arquivos
são exclusivos do processo de build e não substituem `scss/fokus.scss` como
entrada pública para quem deseja o bundle completo.

`scss/fokus.scss` também é compilado diretamente para `dist/css/fokus.css`
(+ `.min.css`), como opção de import único para quem não precisa da distribuição
granular. É esse bundle que o campo `style` do `package.json` aponta por padrão.

Os nomes em `scss/entries/` usam o sufixo `-entry` (ex: `layout-entry.scss`)
para evitar colisão com os módulos de mesmo nome (`@use "layout"` dentro de
`scss/layout.scss` causaria um loop de importação).

Cada entry independente declara a ordem de `@layer` no início do seu CSS
compilado (herdada de `tokens/_root.scss`, sempre o primeiro `@use`), então
qualquer arquivo de `dist/css/` funciona isolado, com a cascata correta,
mesmo carregado sozinho numa página.

## Regra de Evolução

Novos componentes devem seguir este fluxo:

1. Criar `packages/fokus-components/scss/components/_nome-do-componente.scss`,
   com o conteúdo CSS envolvido em `@layer components { }` (`@use` fica fora,
   antes da camada).
2. Adicionar o arquivo em `packages/fokus-components/scss/components/_index.scss`.
3. Documentar a API de classes em Markdown.
4. Adicionar exemplo em `mockup/` quando fizer sentido.
