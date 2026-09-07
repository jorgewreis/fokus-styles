# Design tokens

Referência completa dos tokens do Fokus Styles. Escolha primeiro o token pelo
papel que ele desempenha; consulte [Theming](../guides/theming.md) para
customizá-lo em runtime ou via Sass.

## Cor — primitivo → semântico → componente

### Semânticos (uso geral)

| Token | Papel |
|---|---|
| `--fs-color-text` | Texto principal |
| `--fs-color-muted` | Texto secundário/discreto |
| `--fs-color-border` | Bordas padrão |
| `--fs-color-surface` | Fundo de superfície (card, modal, input) |
| `--fs-color-subtle` | Fundo levemente destacado (hover, header de card) |
| `--fs-color-white` / `--fs-color-black` | Acromáticos, sem variação por tema |

### Aliases por papel (`packages/fokus-core/scss/tokens/_semantic.scss`)

Mesmos valores dos acima, com nome por função — use estes quando o nome
comunica melhor a intenção no seu código:

| Token | Alias de |
|---|---|
| `--fs-color-bg-surface` | `--fs-color-surface` |
| `--fs-color-bg-subtle` | `--fs-color-subtle` |
| `--fs-color-surface-raised` | `--fs-color-surface` |
| `--fs-color-text-primary` | `--fs-color-text` |
| `--fs-color-text-muted` | `--fs-color-muted` |
| `--fs-color-border-default` | `--fs-color-border` |
| `--fs-color-action-primary` | `--fs-color-primary` |
| `--fs-color-action-danger` | `--fs-color-danger` |

### Gráficos (`packages/fokus-core/scss/tokens/_charts.scss`)

Agnósticos de biblioteca — ver [guia de gráficos](../guides/charts.md).

| Token | Alias de |
|---|---|
| `--fs-chart-series-1` | `--fs-color-primary` |
| `--fs-chart-series-2` | `--fs-color-success` |
| `--fs-chart-series-3` | `--fs-color-warning` |
| `--fs-chart-series-4` | `--fs-color-danger` |
| `--fs-chart-series-5` | `--fs-color-info` |
| `--fs-chart-series-6` | `--fs-color-secondary` |
| `--fs-chart-grid` | `--fs-color-border` |
| `--fs-chart-axis` | `--fs-color-muted` |
| `--fs-chart-tooltip-bg` | `--fs-tooltip-bg` |
| `--fs-chart-tooltip-text` | `--fs-tooltip-text` |

### Cores de tema

Seis papéis, cada um com 3 tokens derivados automaticamente do primitivo
(tint/shade em OKLCH):

`primary`, `secondary`, `success`, `warning`, `danger`, `info`

| Padrão de token | Exemplo (`primary`) | Uso |
|---|---|---|
| `--fs-color-{nome}` | `--fs-color-primary` | Cor sólida (fundo de botão, borda ativa) |
| `--fs-alert-{nome}-bg` | `--fs-alert-primary-bg` | Fundo tintado (alerta) |
| `--fs-alert-{nome}-text` | `--fs-alert-primary-text` | Texto sobre o fundo tintado |
| `--fs-feedback-{nome}-bg` | `--fs-feedback-primary-bg` | Fundo tintado mais sutil (badge suave, notificação) |

### Componente

Componentes expõem tokens próprios quando precisam de uma API de customização
local. Eles têm fallback para um token semântico e podem ser alterados sem
`!important`:

```css
.meu-botao-especial {
  --fs-btn-bg: var(--fs-color-action-primary);
}
```

Consulte a página do componente para a lista completa. Por exemplo,
`.fs-btn` documenta `--fs-btn-bg`, `--fs-btn-color` e
`--fs-btn-border-color`. Prefira nomes de intenção, como
`--fs-color-action-primary`, em vez de nomes baseados no valor da cor.

O Carousel expõe tokens locais para que controles, indicadores, transições e
legendas possam ser ajustados por instância: `--fs-carousel-radius`,
`--fs-carousel-transition-duration`, `--fs-carousel-transition-easing`,
`--fs-carousel-control-*`, `--fs-carousel-indicator-*` e
`--fs-carousel-caption-scrim`. Consulte a [página do Carousel](../components/carousel.md)
para os nomes completos e seus fallbacks.

### Check, Radio e Switch

Os controles nativos de seleção expõem tokens locais, sempre com fallback
para a escala semântica do framework:

| Família | Tokens |
|---|---|
| Checkbox | `--fs-check-size`, `--fs-check-border-width`, `--fs-check-radius`, `--fs-check-gap`, `--fs-check-mark-color` |
| Radio | `--fs-radio-size`, `--fs-radio-dot-size`, `--fs-radio-radius`, `--fs-radio-gap` |
| Switch | `--fs-switch-track-width`, `--fs-switch-track-height`, `--fs-switch-thumb-width`, `--fs-switch-thumb-height`, `--fs-switch-thumb-offset`, `--fs-switch-on-offset`, `--fs-switch-radius`, `--fs-switch-thumb-radius`, `--fs-switch-gap`, `--fs-switch-track-bg`, `--fs-switch-track-border`, `--fs-switch-track-checked-bg`, `--fs-switch-thumb-bg`, `--fs-switch-thumb-border`, `--fs-switch-thumb-shadow`, `--fs-switch-track-shadow`, `--fs-switch-hover-ring`, `--fs-switch-hover-shadow`, `--fs-switch-active-scale` |

Eles podem ser sobrescritos no wrapper do controle sem `!important`. As
variantes `sm` e `lg` alteram os valores desses tokens.

## Tipografia

| Token | Valor | Uso |
|---|---|---|
| `--fs-font-sans` | Plus Jakarta Sans, sans-serif | Corpo, UI |
| `--fs-font-mono` | Source Code Pro, monospace | Código |
| `--fs-font-size-md` | 0.8125rem (13px) | Corpo — único tamanho de texto exposto como token; `xs`/`sm`/`lg`/`xl` são variáveis Sass (`$font-size-*`), não CSS Custom Properties, por serem só usadas em geração de classe |
| `--fs-font-size-h1`…`h6` | 1.75rem → 0.875rem | Headings |
| `--fs-font-weight-semibold` | 600 | Peso dos headings |
| `--fs-line-height-base` | 1.5 | Corpo |
| `--fs-line-height-heading` | 1.25 | Headings |

## Formato

| Token | Valor |
|---|---|
| `--fs-radius-sm` | 4px |
| `--fs-radius-md` | 6px |
| `--fs-radius-lg` | 8px |

Circular só é usado em dois lugares deliberadamente (radio, spinner) — o
resto do framework é quadrado/arredondado por decisão de design, não por
limitação técnica.

## Espaçamento, elevação e controles

Os valores mais usados também ficam disponíveis em runtime para que
componentes e extensões mantenham a mesma escala visual:

| Token | Papel |
|---|---|
| `--fs-space-0` … `--fs-space-5` | Escala de espaçamento baseada em `$spacers` |
| `--fs-z-dropdown` … `--fs-z-tooltip` | Camadas padronizadas para overlays |
| `--fs-control-height` / `--fs-control-height-sm` / `--fs-control-height-lg` | Alturas dos controles de formulário |
| `--fs-control-padding-x` / `--fs-control-padding-x-sm` / `--fs-control-padding-x-lg` | Padding horizontal dos controles |
| `--fs-border-width` | Espessura padrão de bordas |
| `--fs-disabled-opacity` | Opacidade visual de controles desabilitados |
| `--fs-color-on-primary` … `--fs-color-on-info` | Cor de conteúdo sobre cada cor de tema |

## Interação e movimento

| Token | Papel |
|---|---|
| `--fs-color-focus` | Cor semântica do foco de teclado |
| `--fs-focus-width` / `--fs-focus-offset` | Geometria do anel de foco |
| `--fs-focus-ring-alpha` | Intensidade do halo de foco |
| `--fs-transition-fast` / `--fs-transition-normal` | Durações de transição |
| `--fs-ease-standard` | Curva de movimento padrão |

O framework respeita `prefers-reduced-motion: reduce`, reduzindo transições e
animações CSS ao mínimo sem remover estados ou interações.

Use `--fs-color-on-{nome}` em texto e ícones sobre fundos de tema. Isso
permite que uma marca altere o contraste sem duplicar regras de componente.

## Sombra

| Token |
|---|
| `--fs-shadow-sm` |
| `--fs-shadow-md` |
| `--fs-shadow-lg` |

## Grid

| Token | Valor |
|---|
| `--fs-gutter-x` | 1.5rem |
| `--fs-gutter-y` | 0px |

Controlados em runtime pelas classes `.fs-u-g-*`/`.fs-u-gx-*`/`.fs-u-gy-*` — ver
[`docs/reference/scss-architecture.md`](scss-architecture.md#layout).

## Layout avançado (Stack/Cluster/Sidebar/sticky/container queries)

| Token | Valor padrão |
|---|---|
| `--fs-stack-gap` | `1rem` (`.fs-stack-gap-{0..5}` sobrescreve) |
| `--fs-cluster-gap` | `0.5rem` (`.fs-cluster-gap-{0..5}` sobrescreve) |
| `--fs-sidebar-gap` | `1rem` (`.fs-sidebar-gap-{0..5}` sobrescreve) |
| `--fs-sidebar-width` | `16rem` (`.fs-sidebar-width-{sm..xxxl}` sobrescreve) |
| `--fs-sticky-top` / `--fs-sticky-bottom` | `0` |
| `--fs-cq-sm` / `--fs-cq-md` / `--fs-cq-lg` | `320px` / `480px` / `640px` — só informativos, ver [Layout avançado](../guides/layout-advanced.md#container-queries-container) |

Ver [Layout avançado](../guides/layout-advanced.md) para a documentação
completa de uso.

## Só-Sass (sem CSS Custom Property)

Não têm equivalente em token CSS porque alimentam geração de classe em
tempo de build (nome de classe fixo, não pode reagir a uma variável em
runtime):

| Variável Sass | Uso |
|---|---|
| `$spacers` | Escala de espaçamento (`.fs-u-m*`/`.fs-u-p*`/`.fs-u-g*`) |
| `$breakpoints` | Grid e utilitários responsivos (`.fs-u-*-{breakpoint}`) |
| `$container-max-widths` / `$column-max-widths` | Containers e colunas com largura máxima |
| `$font-size-xs`/`-sm`/`-lg`/`-xl` | Escala de tamanho de texto (utilitários `.fs-u-fs-*` e tamanhos `-sm`/`-lg` de componente) |
| `$font-weight-regular`/`-medium`/`-bold` | Peso de texto (`.fs-u-fw-*`) |
| `$theme-colors` / `$theme-bg-colors` | Mapas usados pelos `@each` que geram as variantes de cor de cada componente |

Customizáveis só via `@use ... with (...)` na compilação — ver
[Theming](../guides/theming.md#customizando-via-sass).
