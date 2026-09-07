# Guia de migração — vindo de outro framework CSS

Este guia é para quem já usa **outro framework CSS de utilitários/componentes**
(ex.: um framework baseado em classes utilitárias tipo `flex`/`gap-4`, ou um
framework de componentes com prefixo `.btn`/`.card`/`.alert`) e quer migrar
pro Fokus Styles. Ele mapeia os padrões de nomenclatura mais comuns do
ecossistema pros equivalentes do FokusStyles — não é uma migração automatizada
(classes e comportamento não são 1:1 em todo canto), mas cobre os casos mais
frequentes.

> Procurando pela migração de uma versão **antiga do FokusStyles** (rename da
> API pública pra prefixo `fs-`) para a v1.0.0? Isso é
> [`migration-v1.md`](migration-v1.md), um guia diferente.

## Como o FokusStyles nomeia as coisas

Duas convenções fixas, sem exceção, ajudam a prever qualquer classe sem
decorar a lista inteira:

- **Componentes**: prefixo `fs-` (`.fs-btn`, `.fs-card`, `.fs-modal`).
- **Utilitários** (uma propriedade CSS por classe): prefixo `fs-u-` (`.fs-u-d-flex`,
  `.fs-u-mt-3`, `.fs-u-text-center`).

Responsividade é sempre um infixo de breakpoint antes do valor:
`.fs-u-d{-sm|-md|-lg|-xl|-xxl}-flex`, `.fs-u-mt-lg-4` — nunca um prefixo diferente
por breakpoint.

## Utilitários de layout (flexbox/grid/spacing)

Framework baseados em classes utilitárias atômicas costumam usar nomes
curtos sem prefixo (`flex`, `gap-4`, `p-2`) ou com prefixo de uma letra
(`d-flex`, `mt-3`, já familiar a quem vem de um framework de componentes com
utilitários auxiliares). O FokusStyles usa **nomes completos com prefixo `fs-u-`**,
priorizando previsibilidade sobre brevidade:

| Padrão comum no ecossistema | Fokus Styles | Observação |
|---|---|---|
| `flex` / `d-flex` | `.fs-u-d-flex` | Idem `.fs-u-d-block`, `.fs-u-d-none`, `.fs-u-d-inline-block`. |
| `items-center` / `align-items-center` | `.fs-u-align-items-center` | Também `-start`/`-end`. |
| `justify-between` / `justify-content-between` | `.fs-u-justify-content-between` | Também `-start`/`-center`/`-end`/`-around`. |
| `gap-4` / `gap-3` (escala 0–5) | `.fs-u-gap-4` | Escala de espaçamento própria — ver [tokens](../reference/design-tokens.md) pro mapa `$spacers`; não é 1:1 numérico com a escala de outros frameworks. |
| `m-4`, `mt-2`, `mx-auto` | `.fs-u-m-4`, `.fs-u-mt-2`, `.fs-u-mx-auto` | Mesmo padrão de abreviação (`m`/`mt`/`mr`/`mb`/`ml`/`mx`/`my`) já usado por frameworks de componentes com utilitários auxiliares — só troca o prefixo pra `fs-u-`. |
| `p-4`, `px-3`, `py-2` | `.fs-u-p-4`, `.fs-u-px-3`, `.fs-u-py-2` | Idem acima, para padding. |
| `text-center` | `.fs-u-text-center` | Também `-start`/`-end`. |
| `font-bold` / `fw-bold` | `.fs-u-fw-bold` | Também `-regular`/`-medium`/`-semibold`. |
| `text-lg` / `fs-5` | `.fs-u-fs-lg` | Escala nomeada (`xs`/`sm`/`md`/`lg`/`xl`/`h1`…`h6`), não numérica. |
| `hidden` / `d-none` | `.fs-u-d-none` | Oculta via `display: none` (remove do layout e da árvore de acessibilidade). |
| `invisible` | `.fs-u-invisible` | `visibility: hidden` — reserva o espaço no layout, ao contrário de `.fs-u-d-none`. |
| `container` | `.fs-container` | Componente de layout, não utilitário — ver seção seguinte. |
| `row` / `grid grid-cols-12` | `.fs-row` | Grid flexbox de 12 colunas, não CSS Grid. |
| `col`, `col-6`, `col-md-4` | `.fs-col`, `.fs-col-6`, `.fs-col-md-4` | Mesma lógica de frações de 12 colunas com infixo de breakpoint. |

Para stack/cluster/sidebar/sticky/container-queries (utilitários de layout
mais recentes, sem equivalente direto e estabelecido em frameworks mais
antigos), veja o guia dedicado
[`layout-advanced.md`](layout-advanced.md) — não há "de onde migrar" porque
são aditivos, não substituem nada que você já tinha.

## Componentes

Frameworks de componentes tradicionalmente usam classes curtas sem prefixo
(`.btn`, `.card`, `.alert`); frameworks só-utilitários normalmente não têm
esse conceito (você compõe o visual de um botão a partir de utilitários) —
o FokusStyles segue o primeiro modelo, com o prefixo `fs-` obrigatório em todos:

| Padrão comum (framework de componentes) | Fokus Styles |
|---|---|
| `.btn`, `.btn.btn-primary` | `.fs-btn`, `.fs-btn.fs-btn-primary` |
| `.btn-outline-primary` | `.fs-btn-outline-primary` |
| `.btn-sm`, `.btn-lg` | `.fs-btn-sm`, `.fs-btn-lg` |
| `.card`, `.card-header`, `.card-body`, `.card-footer` | `.fs-card`, `.fs-card-header`, `.fs-card-body`, `.fs-card-footer` |
| `.alert.alert-danger` | `.fs-alert.fs-alert-danger` |
| `.badge.bg-primary` / `.badge.badge-primary` | `.fs-badge.fs-badge-primary` |
| `.table.table-striped` | `.fs-table.fs-table-striped` |
| `.modal`, `.modal-dialog`, `.modal-body` | `.fs-modal`, `.fs-modal-dialog`, `.fs-modal-body` — ver [modal.md](../components/modal.md) pra diferenças de API JS |
| `.dropdown-menu`, `.dropdown-item` | `.fs-dropdown-menu`, `.fs-dropdown-item` |
| `.form-control` | `.fs-form-control` |

Se você está migrando de um framework só-utilitários (sem classes de
componente prontas), o ponto de partida é o oposto: em vez de recompor cada
botão/card a partir de utilitários, procure o componente FokusStyles equivalente
em [`docs/components/`](../components/) — geralmente é menos código, não
mais.

## O que **não** migra 1:1

- **API JavaScript**: nomes de método/evento são específicos do FokusStyles
  (`data-fs="modal"`, `FokusStyles.Modal.getInstance()`, eventos
  `fs:modal:shown`) — não há compatibilidade de API com nenhum outro
  framework. Veja a página de cada componente em
  [`docs/components/`](../components/) pra API completa.
- **Escala de espaçamento/tipografia**: os valores numéricos
  (`fs-u-gap-4`, `fs-u-fs-lg`) seguem a escala própria do FokusStyles
  (`$spacers`/`$font-size-*`), não a de nenhum outro framework — não
  assuma que `gap-4` de outro lugar é visualmente idêntico a `.fs-u-gap-4`
  aqui, mesmo com o nome parecido.
- **Grid**: `.fs-row`/`.fs-col-*` é flexbox de 12 colunas, não CSS Grid —
  se você vem de um framework CSS Grid nativo (`grid-cols-12`), o modelo
  mental de "colunas fluem e quebram linha" é diferente de "células fixas
  numa grade".
- **Tema/dark mode**: o FokusStyles usa `data-theme="dark"` num ancestral
  (não uma classe `.dark` no `<html>`) — ver [`dark-mode.md`](dark-mode.md).
- **Build/configuração**: não há arquivo de configuração JS central
  (customização é via variáveis Sass — `$primitives`, `$spacers` etc.) —
  ver [`scss-architecture.md`](../reference/scss-architecture.md).

## Checklist de migração

1. Troque classes de utilitário: adicione o prefixo `fs-u-` e expanda
   abreviações de uma letra pro nome completo mais próximo da tabela acima
   (`flex` → `fs-u-d-flex`, não existe atalho de uma letra no FokusStyles).
2. Troque classes de componente: adicione o prefixo `fs-` em todas
   (`.btn` → `.fs-btn`, incluindo variantes: `.btn-primary` → `.fs-btn-primary`).
3. Rode `npm run lint:scss` (se você também copiou SCSS customizado — o
   FokusStyles usa Stylelint com `stylelint-config-standard-scss`) e
   `npm run test:visual` (se tiver mockups próprios) pra pegar
   divergências visuais cedo.
4. Refaça a integração JS pelos `data-fs="*"`/`data-fs-target`/eventos
   `fs:*` — não existe camada de compatibilidade com a API de outro
   framework.
5. Revise a matriz de [suporte a navegadores](../reference/browser-support.md)
   se seu projeto anterior mirava um alvo diferente (ex.: IE11) — o FokusStyles
   não suporta IE11 e usa `@layer`/OKLCH nativamente.
