# Table

Tabelas seguem a marcação HTML nativa — classes modificadoras no próprio
`<table>` ligam/desligam comportamentos visuais.

## Visão geral

```html
<table class="fs-table fs-table-striped fs-table-hover">
  <thead>
    <tr><th>Nome</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr><td>Ana</td><td>Ativo</td></tr>
    <tr><td>Bruno</td><td>Inativo</td></tr>
  </tbody>
</table>
```

## Anatomia

`<table class="fs-table">` com `<thead>`/`<tbody>` nativos — nenhuma
marcação extra obrigatória. `<thead th>` já vem em uppercase, cor muted,
peso médio.

## Variações

- `.fs-table-striped` — linhas ímpares do corpo com fundo diferente (zebra).
- `.fs-table-hover` — destaca a linha sob o cursor.
- `.fs-table-bordered` — bordas em todas as células.
- `.fs-table-borderless` — remove todas as bordas internas.
- `.fs-table-sm` — reduz o padding das células.
- `.fs-table-{primary|secondary|success|warning|danger|info}` — tinge
  fundo/texto da tabela inteira com uma cor de estado (mesmos tokens dos
  alerts).
- `.fs-table-responsive` — aplique num `<div>` **envolvendo** a
  `<table>` (não na tabela em si), para rolagem horizontal em telas
  estreitas:

```html
<div class="fs-table-responsive">
  <table class="fs-table">...</table>
</div>
```

Combináveis entre si (ex.: `fs-table-striped fs-table-bordered fs-table-sm`).

## Estados

Nenhum — tabela é conteúdo estático. Se precisar de ordenação/filtro/
paginação client-side, veja o [DataTable](datatable.md), a camada JS
opcional que reusa `.fs-table`.

## A11y

- Use `<th scope="col">`/`<th scope="row">` conforme o cabeçalho for de
  coluna ou linha — não é aplicado automaticamente.
- Para tabelas grandes/complexas, considere `<caption>` descrevendo o
  conteúdo.

## API JS

Nenhuma — 100% CSS. Para ordenação/filtro/paginação, use o
[DataTable](datatable.md).

## Tokens

`--fs-color-border`, `--fs-color-text`, `--fs-color-muted` (cabeçalho),
`--fs-color-subtle` (striped/hover), `--fs-alert-{nome}-bg`/`-text`
(variante de cor de estado).

## Exemplo

```html
<div class="fs-table-responsive">
  <table class="fs-table fs-table-striped fs-table-bordered fs-table-sm">
    <thead>
      <tr><th scope="col">Nome</th><th scope="col">E-mail</th><th scope="col">Status</th></tr>
    </thead>
    <tbody>
      <tr><td>Ana</td><td>ana@exemplo.com</td><td>Ativo</td></tr>
    </tbody>
  </table>
</div>
```

Mockup: [laboratório do componente](../../mockup/content-data.html#table).
