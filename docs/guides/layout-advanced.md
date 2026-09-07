# Layout avançado

Três primitivas de layout CSS-only (Stack, Cluster, Sidebar), utilitários de
posição sticky e utilitários de container query (`@container`) — para
composições que os utilitários de grid/flex existentes (`.fs-row`/`.fs-col-*`,
`.fs-u-d-flex`) não cobrem bem sozinhos. Exemplo funcional completo em
[`mockup/foundations.html#layout`](../../mockup/foundations.html#layout).

## Stack

Empilha os filhos diretos verticalmente com espaçamento consistente via
`gap` (não `margin` — evita o problema de "o último filho não deve ter
margin-bottom"):

```html
<div class="fs-stack">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

O espaçamento padrão vem do token `--fs-stack-gap` (`$spacers[3]`, `1rem`).
Ajuste com uma classe `.fs-stack-gap-{0..5}` (mesma escala de
`$spacers` usada nos utilitários `.fs-u-m*`/`.fs-u-p*`) ou redefinindo o token
direto no elemento:

```html
<div class="fs-stack fs-stack-gap-1">…</div>
```

## Cluster

Agrupa itens horizontalmente com quebra de linha automática e espaçamento
consistente nos dois eixos — para grupos de tags, botões ou badges que
precisam "fluir" sem estourar o container:

```html
<div class="fs-cluster">
  <span class="fs-tag">Frontend</span>
  <span class="fs-tag">CSS</span>
  <span class="fs-tag">Acessibilidade</span>
</div>
```

Gap ajustável do mesmo jeito que o Stack: `.fs-cluster-gap-{0..5}` ou
`--fs-cluster-gap`.

## Sidebar

Um lado com largura fixa (a "aside") e o outro preenchendo o espaço
restante — quebra para empilhado quando o container fica estreito demais,
sem media query (a técnica é puramente flexbox: `.fs-sidebar-content` tem
`flex-basis: 0` e `min-width: 50%`, forçando a quebra quando não cabe ao
lado da aside na largura disponível):

```html
<div class="fs-sidebar">
  <aside class="fs-sidebar-aside">Menu lateral</aside>
  <div class="fs-sidebar-content">Conteúdo principal</div>
</div>
```

- Largura da aside: `--fs-sidebar-width` (padrão `16rem`), ou uma classe
  `.fs-sidebar-width-{sm,md,lg,xl,xxl,xxxl}` (reusa a escala de
  `$column-max-widths`, de 120px a 720px).
- `.fs-sidebar-reverse` inverte a ordem visual (aside à direita).
- Gap: `.fs-sidebar-gap-{0..5}` ou `--fs-sidebar-gap`.

## Sticky

`.fs-u-sticky-top`/`.fs-u-sticky-bottom` (`position: sticky`) com offset
configurável via `--fs-sticky-top`/`--fs-sticky-bottom` (padrão `0`) e
`z-index: 1020` (mesma faixa numérica dos demais componentes de overlay —
acima de conteúdo normal e do Dropdown, abaixo de Modal/Offcanvas):

```html
<div style="overflow-y: auto; max-height: 300px;">
  <div class="fs-u-sticky-top">Cabeçalho fixo</div>
  <p>Conteúdo rolável…</p>
</div>
```

Um contêiner com scroll próprio (como no exemplo acima) precisa ser
focável por teclado (`tabindex="0"`) se o conteúdo for maior que a área
visível — sem isso, quem navega só por teclado não consegue rolar o
conteúdo (regra `scrollable-region-focusable` do gate `axe` no CI).

## Container queries (`@container`)

Reagem à largura do **container** mais próximo, não da viewport — útil
para um componente que se comporta de forma diferente dependendo de onde é
colocado (uma sidebar estreita vs. uma área de conteúdo larga), independente
do tamanho da tela. Ative com `.fs-u-cq` no elemento pai:

```html
<div class="fs-u-cq">
  <div class="fs-u-cq-md-d-flex fs-u-gap-2">
    <div>A</div>
    <div>B</div>
  </div>
</div>
```

- `.fs-u-cq` define `container-type: inline-size` — só aplique num elemento
  cuja largura você quer usar como referência (não precisa ser o `:root`).
- Utilitários disponíveis: `.fs-u-cq-{sm,md,lg}-d-{none,block,inline-block,flex}`,
  seguindo os limiares `--fs-cq-sm` (320px), `--fs-cq-md` (480px),
  `--fs-cq-lg` (640px) — uma escala própria, mais compacta que a de
  viewport (`$breakpoints`), porque containers costumam ser bem menores
  que a tela inteira.
- Os tokens `--fs-cq-*` em `:root` são só **informativos** (documentam os
  valores usados) — a condição de um `@container` exige um valor literal
  em tempo de build, não aceita `var()`; mudar o token em runtime não
  recalibra as regras já compiladas.
- Complementam, não substituem, os utilitários de viewport existentes
  (`.fs-u-d-flex` etc.) — para a maioria dos casos, media query por viewport
  continua sendo a ferramenta certa.
