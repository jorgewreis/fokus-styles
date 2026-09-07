# Card

Contêiner de conteúdo genérico — a peça que mais combina outros
componentes (botões, badges, tipografia) dentro de si.

## Visão geral

```html
<div class="fs-card">
  <div class="fs-card-header">
    <h3 class="fs-card-title">Título do card</h3>
    <button type="button" class="fs-btn-close" aria-label="Fechar"></button>
  </div>
  <div class="fs-card-body">
    <p class="fs-card-text">Corpo de texto do card.</p>
    <button type="button" class="fs-btn fs-btn-primary">Ação</button>
  </div>
  <div class="fs-card-footer">
    <span class="fs-badge fs-badge-success">Ativo</span>
  </div>
</div>
```

## Anatomia

`.fs-card` > até três seções empilhadas, todas opcionais: `.fs-card-header`
(fundo sutil, borda inferior — quando tem `.fs-card-title` + botão, o
layout já vem com `justify-content: space-between`), `.fs-card-body`,
`.fs-card-footer` (fundo sutil, borda superior).

Dentro de `.fs-card-body`: `.fs-card-title` (destaque), `.fs-card-subtitle`
(secundário, cor muted), `.fs-card-text` (parágrafo de corpo — o último de
um card não tem margem inferior).

## Variações

- **Horizontal**: `.fs-card-horizontal` — eixo principal de coluna pra
  linha ("imagem à esquerda, texto à direita"); raios de header/footer se
  ajustam pra lateral em vez de topo/base.
- **Tamanho**: `.fs-card-sm` (5px de padding interno), `.fs-card-lg`
  (15px); sem sufixo = 10px (padrão) — não muda a largura do card, só a
  densidade.
- **Clicável**: `.fs-card-clickable` + `.fs-stretched-link` — ver abaixo.

```html
<div class="fs-card fs-card-horizontal">
  <div class="fs-card-header">Lateral</div>
  <div class="fs-card-body">Conteúdo ao lado.</div>
</div>
```

### `.fs-card-clickable`

Torna o card inteiro clicável/focável sem aninhar um `<a>` ao redor de todo
o conteúdo (o que quebraria a semântica havendo outros elementos
interativos dentro). Coloque `.fs-stretched-link` no link que deve capturar
o clique — ele se expande via `::after` pra cobrir o card inteiro:

```html
<div class="fs-card fs-card-clickable">
  <div class="fs-card-body">
    <h4 class="fs-card-title">
      <a href="/detalhes" class="fs-stretched-link">Ver detalhes</a>
    </h4>
    <p class="fs-card-text">O card inteiro é clicável, não só o link.</p>
  </div>
</div>
```

## Estados

`.fs-card-clickable:hover`/`:focus-within` — borda muda pra cor primária +
sombra (`:focus-within` em vez de `:focus` pra destacar tanto no hover
quanto ao navegar por teclado até o link interno).

## A11y

- `.fs-stretched-link` deve estar num elemento nativamente focável (`<a
  href="...">`), nunca num `<div>` — é o link real que recebe o foco/clique
  do teclado, o `::after` só expande a área clicável do mouse.
- Se o card tiver múltiplos links/botões, só o `.fs-stretched-link`
  expande; os demais continuam clicáveis normalmente por cima dele
  (`z-index` do `::after` é `1`, mas elementos com `position: relative` e
  `z-index` maior no conteúdo ficam acima).

## API JS

Nenhuma — 100% CSS.

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-color-subtle`
(header/footer), `--fs-radius-lg`, `--fs-shadow-sm` (hover clicável),
`--fs-color-primary` (borda hover clicável).

## Exemplo

```html
<div class="fs-card fs-card-clickable" style="max-width: 320px;">
  <div class="fs-card-body">
    <h4 class="fs-card-title"><a href="#" class="fs-stretched-link">Relatório Q3</a></h4>
    <p class="fs-card-subtitle">Atualizado há 2 dias</p>
    <p class="fs-card-text">Resumo financeiro do terceiro trimestre.</p>
  </div>
  <div class="fs-card-footer">
    <span class="fs-badge fs-badge-success">Publicado</span>
  </div>
</div>
```

Mockup: [laboratório do componente](../../mockup/content-data.html#card).
