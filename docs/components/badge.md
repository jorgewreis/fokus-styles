# Badge

Rótulo pequeno de destaque — contagem, status — usado sozinho ou embutido
em cards, navbar, tabelas. Para a variante removível, ver
[Tag](tag.md).

## Visão geral

```html
<span class="fs-badge">Padrão</span>
<span class="fs-badge fs-badge-primary">Primary</span>
```

## Anatomia

Um único elemento, `.fs-badge` — sem marcação interna obrigatória.

## Variações

- **Cor**: `.fs-badge-{primary|secondary|success|warning|danger|info}` —
  fundo sólido, texto com contraste calculado automaticamente. Sem
  modificador, usa cores neutras (`--fs-color-subtle`/`--fs-color-text`).
- **Peso visual**: `.fs-badge-soft-{nome}` cria fundo translúcido com borda
  sutil, recomendado para status recorrentes em tabelas e cards;
  `.fs-badge-outline-{nome}` mantém apenas contorno e texto, útil para
  metadados e filtros. As variantes sólidas permanecem para destaque alto.
- **Tamanho**: `.fs-badge-sm` (18px), `.fs-badge-lg` (26px); sem sufixo =
  22px (padrão).
- **Acabamento**: usa `--fs-radius-sm` (4px) por padrão, mantendo cantos
  levemente arredondados sem transformar o badge em uma pílula.
- **Densidade**: `--fs-badge-padding-inline`,
  `--fs-badge-padding-block-start` e `--fs-badge-padding-block-end` permitem
  ajustar o espaço interno localmente sem substituir o componente inteiro.
- **Padrões**: `.fs-badge-dot` adiciona um indicador circular antes do texto;
  `.fs-badge-count` estabiliza contagens com algarismos tabulares e
  `.fs-badge-count-circle` cria um indicador circular para contagens curtas,
  preferencialmente de um único dígito.
- **Split**: `.fs-badge-split` reúne um rótulo e um valor em segmentos
  conectados. Use `.fs-badge-split-{nome}` para colorir o valor; os elementos
  internos obrigatórios são `.fs-badge-split-label` e
  `.fs-badge-split-value`.

```html
<span class="fs-badge fs-badge-success fs-badge-sm">Ativo</span>
<span class="fs-badge fs-badge-danger fs-badge-lg">Crítico</span>
<span class="fs-badge fs-badge-soft-success fs-badge-dot">Disponível</span>
<span class="fs-badge fs-badge-outline-primary">Beta</span>
<span class="fs-badge-split fs-badge-split-primary">
  <span class="fs-badge-split-label">New</span>
  <span class="fs-badge-split-value">0.7.1</span>
</span>
```

## Estados

Nenhum — elemento estático, sem interação.

## A11y

Badge é decorativo/informativo, não interativo — se o conteúdo for
significativo pra quem usa leitor de tela (ex.: contador de notificações
não lidas), garanta que o texto ao redor já comunique o contexto (não
dependa só da cor).

## API JS

Nenhuma — 100% CSS.

## Tokens

Usa os tokens de cor de tema (`--fs-color-{nome}`, ver
[`docs/reference/design-tokens.md`](../reference/design-tokens.md)) e expõe
`--fs-badge-color`, `--fs-badge-bg`, `--fs-badge-border`,
`--fs-badge-height` e `--fs-badge-radius` (`var(--fs-radius-sm)` por padrão)
para personalização localizada. A densidade também pode ser ajustada com
`--fs-badge-padding-inline`, `--fs-badge-padding-block-start` e
`--fs-badge-padding-block-end`. Split também expõe
`--fs-badge-split-{label|value}-{bg|color}`, `--fs-badge-split-height` e
`--fs-badge-split-radius` (`var(--fs-radius-sm)` por padrão), aplicado ao
contêiner externo que conecta o rótulo e o valor.

## Exemplo

```html
<span class="fs-badge">12</span>
<span class="fs-badge fs-badge-primary">Novo</span>
<span class="fs-badge fs-badge-warning fs-badge-sm">Pendente</span>
<span class="fs-badge fs-badge-soft-success fs-badge-dot">Online</span>
<span class="fs-badge fs-badge-count fs-badge-danger">12</span>
<span class="fs-badge fs-badge-count fs-badge-count-circle fs-badge-danger" aria-label="1 notificação não lida">1</span>
```

## Composição e contraste

Mantenha o badge próximo do título, status ou contagem que ele qualifica e
não use a cor como única indicação de estado. Para filtros ou ações, use um
botão ou Tag, não um badge estático. Em temas e marcas customizadas, valide
as variantes `soft` e `outline` com `npm run contrast:check` e confirme que o
texto continua legível nos temas claro e escuro.

Mockup: [laboratório do componente](../../mockup/feedback-actions.html#badge).
