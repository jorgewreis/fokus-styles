# Utility API e configuração Sass

O Fokus Styles oferece presets públicos em `fokus-styles/core`, `fokus-styles/components`,
`fokus-styles/utilities` e `fokus-styles/themes`. O arquivo `fokus-styles/config` expõe o
mapa `$fs-config` para entradas Sass customizadas.

O mixin `fs-fluid-type()` usa `clamp()` para escalar valores entre dois limites sem exigir
JavaScript. Classes utilitárias novas seguem o namespace `fs-u-*` e as classes existentes
continuam válidas dentro da linha 2.x.

## Organização dos utilitários

Os utilitários são atômicos: cada classe altera uma responsabilidade visual e pode ser
combinada com componentes ou com outras classes `fs-u-*`. A nomenclatura segue o formato
`fs-u-{propriedade}-{valor}`. Quando a regra depende de um breakpoint, o formato é
`fs-u-{propriedade}-{breakpoint}-{valor}`.

### Display responsivo

Os valores `none`, `block`, `inline`, `inline-block`, `flex` e `grid` estão disponíveis
em todos os breakpoints (`xs`, `sm`, `md`, `lg`, `xl`, `xxl` e `xxxl`):

```html
<div class="fs-u-d-none fs-u-d-md-grid fs-u-d-xl-flex">
  Conteúdo em grid a partir de md e em flex a partir de xl.
</div>
```

### Grid utilities

Para composições pequenas, use Grid diretamente sem criar CSS específico:

```html
<div class="fs-u-grid fs-u-grid-cols-1 fs-u-grid-cols-md-2 fs-u-grid-cols-xl-4 fs-u-gap-3">
  <article class="fs-u-col-span-md-2">Destaque</article>
  <article>Item</article>
  <article>Item</article>
</div>
```

`fs-u-grid-cols-{1..12}` define o número de colunas, e `fs-u-col-span-{1..12}`
define quantas colunas um item ocupa. As variantes responsivas usam o mesmo intervalo,
por exemplo `fs-u-grid-cols-lg-3` e `fs-u-col-span-xl-2`. Preserve a ordem semântica do
HTML; Grid deve organizar a apresentação, não substituir landmarks ou reordenar conteúdo
de forma que prejudique leitura e teclado.

## Categorias disponíveis

| Categoria | Exemplos | Observação |
|---|---|---|
| Layout | `fs-u-box-border`, `fs-u-overflow-auto`, `fs-u-overscroll-contain` | Use `overflow` com cuidado em conteúdo focável. |
| Columns | `fs-u-columns-2`, `fs-u-column-span-all` | Para texto editorial; não substitui Grid. |
| Flexbox | `fs-u-flex-md-row`, `fs-u-flex-direction-md-column`, `fs-u-justify-content-between`, `fs-u-justify-items-center`, `fs-u-grow-1` | A ordem visual não deve contradizer a ordem do DOM. Os aliases longos facilitam leitura em equipes grandes. |
| Grid | `fs-u-grid-cols-lg-3`, `fs-u-col-span-2`, `fs-u-grid-flow-dense` | Preserve a ordem semântica dos itens. |
| Spacing | `fs-u-mb-3`, `fs-u-px-md-4`, `fs-u-gap-lg-2` | A escala vem de `$spacers`. |
| Sizing | `fs-u-w-full`, `fs-u-max-w-screen`, `fs-u-size-100` | Valores livres devem usar tokens ou CSS vars. |
| Typography | `fs-u-fs-lg`, `fs-u-leading-relaxed`, `fs-u-text-balance` | Texto legível deve prevalecer sobre densidade. |
| Borders/effects | `fs-u-border-1`, `fs-u-rounded-md`, `fs-u-opacity-75` | Use cores semânticas e não dependa apenas de cor. |
| Filters | `fs-u-blur-sm`, `fs-u-grayscale`, `fs-u-backdrop-blur-md` | São opt-in e possuem fallback progressivo. |
| Motion | `fs-u-transition-colors`, `fs-u-duration-fast`, `fs-u-animate-spin` | Respeita `prefers-reduced-motion`. |
| Transforms | `fs-u-rotate-90`, `fs-u-scale-105`, `fs-u-origin-center` | Não use para comunicar estado sem texto/ARIA equivalente. |
| Interatividade | `fs-u-cursor-pointer`, `fs-u-select-none`, `fs-u-touch-manipulation` | Não transforma um elemento em controle semântico. |
| Acessibilidade | `fs-u-focus-ring`, `fs-u-visually-hidden`, `fs-skip-link` | Consulte o guia de acessibilidade antes de ocultar conteúdo. |

## Configuração Sass

As escalas públicas ficam em `packages/fokus-core/scss/settings/_utilities.scss` e usam
`!default`. Um projeto pode estender ou substituir os mapas antes de importar o entry-point:

```scss
@use "fokus-styles/scss/settings/utilities" with (
  $fs-config: (
    preset: full,
    utilities: all,
    sizing: all,
    responsive: true
  )
);
@use "fokus-styles";
```

O framework não interpreta classes arbitrárias nem gera CSS em runtime. Para um valor que não
pertença à escala, prefira uma Custom Property no componente:

```css
.dashboard-shell {
  --dashboard-max-width: 74rem;
}
```

```html
<main class="fs-u-max-w-full" style="max-width: var(--dashboard-max-width)">
  Conteúdo dimensionado pela aplicação.
</main>
```

## API declarativa Sass

O mapa `$fs-utilities` é a superfície de extensão para utilitários estáticos. Ele segue a
mesma ideia de geração por mapas da [Utility API do Bootstrap](https://getbootstrap.com/docs/5.3/utilities/api/),
mas mantém o namespace `fs-u-*` e os limites de tamanho do Fokus Styles:

```scss
@use "fokus-styles/config" with (
  $fs-utilities: (
    "object-fit": (
      property: object-fit,
      class: object,
      values: (cover: cover, contain: contain),
      category: layout,
      important: true
    )
  )
);
```

As definições aceitam `property`, `class`, `values`, `category`, `responsive` e `important`.
Os valores devem pertencer a uma escala Sass; o framework não transforma entrada de usuário
em seletor e não oferece JIT. Os módulos históricos continuam gerando aliases que não podem
ser removidos sem uma migração explícita.

## Helpers e composição

Helpers expressam uma intenção recorrente e não apenas uma propriedade isolada:

```html
<img class="fs-u-aspect-video fs-u-object-cover" src="capa.webp" alt="Descrição da capa">
<div class="fs-u-bg-primary-subtle fs-u-text-primary-emphasis fs-u-p-3">
  Mensagem semântica
</div>
```

`fs-u-object-*`, `fs-u-aspect-*`, `fs-u-safe-area-*` e `fs-u-color-scheme-*` são opt-in.
Eles não substituem `alt`, labels, landmarks, ARIA ou a semântica do elemento. Para cards
clicáveis, prefira um link real com `fs-stretched-link`; para foco, utilize
`fs-u-focus-ring` ou o foco nativo do controle.

## Configuração de bundle

As categorias podem ser reduzidas pelo mapa `$fs-config`:

```scss
@use "fokus-styles/config" with (
  $fs-config: (
    preset: full,
    utilities: all,
    helpers: (helpers),
    effects: none,
    motion: (motion),
    responsive: true,
    print: true,
    rtl: true,
    dark-mode: true,
    reduced-motion: true,
    important-utilities: true
  )
);
```

`!important` é padrão nos utilitários atômicos para manter previsibilidade de composição.
Componentes continuam na camada própria e não devem depender de uma classe utilitária para
seu comportamento estrutural.

## Formulários e validação

Use labels visíveis, associe o texto auxiliar por `aria-describedby` e indique erros com
`aria-invalid` e uma mensagem textual persistente. Não use uma tooltip como única mensagem
de validação e não comunique erro somente pela cor. A validação nativa ou de servidor deve
continuar sendo a fonte de verdade; as classes `.is-valid`, `.is-invalid`,
`.fs-valid-feedback` e `.fs-invalid-feedback` são a camada visual/documental.

## Estratégia de layout

- `.fs-row`/`.fs-col-*` são adequados para o grid Flexbox de páginas e componentes.
- `fs-u-grid-*` é indicado para composição local, spans e layouts bidimensionais.
- `fs-u-columns-*` é destinado a texto editorial, não a cards ou formulários.
- Stack, Cluster e Sidebar expressam padrões de fluxo e assimetria sem CSS local.
- `fs-row-cols-*` é útil para auto-layout responsivo sem repetir classes em cada filho.

Em todos os casos, preserve a ordem semântica do DOM e teste zoom, conteúdo longo, RTL e
teclado. A documentação de [suporte de navegadores](../reference/browser-support.md) registra
os fallbacks para recursos modernos.

## Estados e acessibilidade

Utilitários de estado são deliberadamente explícitos: `.fs-u-focus-ring` fornece um anel
visível para `:focus-visible`, `.fs-u-disabled` comunica aparência e bloqueio de interação,
e `.fs-u-visually-hidden` remove conteúdo visual sem removê-lo da leitura assistiva. Nenhum
utilitário injeta ARIA, altera o papel semântico ou substitui teclado e foco gerenciados por
um componente JavaScript.

Para movimento, sempre ofereça estado final compreensível, pause/stop quando houver conteúdo
em movimento contínuo e valide a página com `prefers-reduced-motion: reduce`. Em forced colors,
o foco usa `Highlight` e o conteúdo não deve depender de gradiente, sombra ou filtro para ser
percebido.
