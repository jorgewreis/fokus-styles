# Pagination

Navegação entre páginas de uma listagem — sem JavaScript próprio; qual
página está ativa/desabilitada é responsabilidade da sua aplicação (você
adiciona/remove `.is-active`/`.is-disabled` conforme o estado atual). Os
ícones de anterior/próxima/reticências usam o pacote
[`fokus-styles/icons`](../guides/icons.md) (Lucide) — veja lá se quiser trocar
por outro conjunto.

## Visão geral

```html
<ul class="fs-pagination">
  <li class="fs-page-item is-disabled">
    <a href="#" class="fs-page-link" aria-label="Anterior">
      <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
    </a>
  </li>
  <li class="fs-page-item"><a href="#" class="fs-page-link">1</a></li>
  <li class="fs-page-item is-active"><a href="#" class="fs-page-link">2</a></li>
  <li class="fs-page-item"><a href="#" class="fs-page-link">3</a></li>
  <li class="fs-page-item">
    <a href="#" class="fs-page-link" aria-label="Próxima">
      <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </a>
  </li>
</ul>
```

## Anatomia

`<ul class="fs-pagination">` > `<li class="fs-page-item">` >
`<a class="fs-page-link">` — marcação de lista nativa, `<ul>`/`<li>`. Nos
itens de anterior/próxima só com ícone (sem texto visível), o `<a>` precisa
de `aria-label` (`"Anterior"`/`"Próxima"`) já que o SVG é `aria-hidden`.

## Variações

- **Bordered**: `.fs-pagination-bordered` — itens colados (sem gap), borda
  fundida entre eles (técnica de margin negativo do
  [Input Group](input-group.md)), cantos arredondados só nas pontas.
- **Tamanho**: `.fs-pagination-sm`, `.fs-pagination-lg`; sem sufixo =
  padrão (32px).
- **Prev/next descritivo**: `.fs-page-link-text` no item de anterior/
  próxima, pra ícone + texto (`"Anterior"`/`"Próxima"`) em vez de só o
  ícone — só ajusta o `gap`/padding, o `.fs-page-link` já acomoda largura
  variável. Com texto visível, dispensa o `aria-label` (o link já tem
  nome acessível pelo próprio texto).
- **Reticências** (intervalo de páginas omitido, ex. `1 2 3 … 8 9 10`):
  `.fs-page-item.is-disabled` com um `<span>` (não `<a>` — não é uma ação)
  contendo o ícone `ellipsis`, `aria-hidden="true"` no item inteiro
  (não comunica nada de acionável a leitores de tela).

```html
<ul class="fs-pagination fs-pagination-bordered fs-pagination-sm">
  <li class="fs-page-item"><a href="#" class="fs-page-link">1</a></li>
  <li class="fs-page-item is-active"><a href="#" class="fs-page-link">2</a></li>
</ul>

<ul class="fs-pagination">
  <li class="fs-page-item">
    <a href="#" class="fs-page-link fs-page-link-text">
      <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      Anterior
    </a>
  </li>
  <li class="fs-page-item">
    <a href="#" class="fs-page-link fs-page-link-text">
      Próxima
      <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </a>
  </li>
</ul>

<ul class="fs-pagination">
  <li class="fs-page-item"><a href="#" class="fs-page-link">1</a></li>
  <li class="fs-page-item"><a href="#" class="fs-page-link">2</a></li>
  <li class="fs-page-item"><a href="#" class="fs-page-link">3</a></li>
  <li class="fs-page-item is-disabled" aria-hidden="true">
    <span class="fs-page-link">
      <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
    </span>
  </li>
  <li class="fs-page-item"><a href="#" class="fs-page-link">8</a></li>
  <li class="fs-page-item"><a href="#" class="fs-page-link">9</a></li>
  <li class="fs-page-item"><a href="#" class="fs-page-link">10</a></li>
</ul>
```

## Estados

- `.fs-page-item.is-active .fs-page-link` — fundo/borda na cor primária.
- `.fs-page-item.is-disabled .fs-page-link` — opacidade reduzida,
  `pointer-events: none` (não clicável, não focável por mouse; ainda é
  focável por teclado como um link comum — considere `aria-disabled="true"`
  e remover do fluxo de tab se precisar bloquear totalmente). No item de
  reticências (sem `<a>`), isso não se aplica — ele nunca é focável.

## A11y

Envolva a paginação em `.fs-pagination-scroll` quando houver muitos itens. Use `nav`
nomeado, `aria-current="page"` e desabilite controles sem destino real.

- Envolva a lista num `<nav aria-label="Paginação">` — o elemento `<nav>`
  não é gerado pelo framework, adicione no seu HTML.
- Marque a página atual com `aria-current="page"` no link ativo, além de
  `.is-active` (a classe é só visual).
- Ícone sozinho (sem texto) precisa de `aria-label` no `<a>` pai; ícone +
  texto visível não precisa (o texto já nomeia o link) — só marque o SVG
  como `aria-hidden="true"` nos dois casos, pra não duplicar o nome
  acessível.

## API JS

Nenhuma — 100% CSS. Ativar/desativar itens é feito pela sua aplicação.

## Tokens

Usa `--fs-color-border`, `--fs-color-surface`, `--fs-color-subtle`
(hover), `--fs-color-primary` (ativo), `--fs-color-muted` (desabilitado),
`--fs-radius-sm`.

## Exemplo

```html
<nav aria-label="Paginação">
  <ul class="fs-pagination fs-pagination-bordered">
    <li class="fs-page-item is-disabled">
      <a href="#" class="fs-page-link" aria-label="Anterior">
        <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </a>
    </li>
    <li class="fs-page-item"><a href="#" class="fs-page-link">1</a></li>
    <li class="fs-page-item is-active"><a href="#" class="fs-page-link" aria-current="page">2</a></li>
    <li class="fs-page-item"><a href="#" class="fs-page-link">3</a></li>
    <li class="fs-page-item">
      <a href="#" class="fs-page-link" aria-label="Próxima">
        <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </a>
    </li>
  </ul>
</nav>
```

Mockup: [laboratório do componente](../../mockup/navigation-disclosure.html#pagination).

Para variações inspiradas em diferentes contextos, use `.fs-pagination-centered`,
`.fs-pagination-right`, `.fs-pagination-rounded` e `.fs-pagination-list`. Os
modificadores `.fs-pagination-sm`, `.fs-pagination-lg` e
`.fs-pagination-bordered` continuam combináveis.
