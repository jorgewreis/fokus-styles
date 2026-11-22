# Pagination

Navegação entre páginas de uma listagem. O pacote fornece estilos CSS e a API
JavaScript pública opcional `Pagination`; você pode usar só o CSS ou ligar o
componente ao estado da sua aplicação. Os ícones de
anterior/próxima/reticências usam o pacote
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
- `.fs-page-item.is-disabled .fs-page-link` — opacidade reduzida e
  `pointer-events: none`. CSS sozinho não bloqueia ativação por teclado ou
  script. Com a API JS, um controle marcado `aria-disabled="true"`, com
  `disabled` nativo ou dentro de `.is-disabled` não muda a página; links com
  `aria-disabled` continuam no fluxo de Tab. Para controles sem destino,
  prefira um `<button disabled>` ou um elemento não interativo. No item de
  reticências (sem controle), nada é focável.

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

- A API atualiza `aria-current="page"` no controle ativo. Ela não gerencia
  `aria-busy`: a aplicação deve marcar a região dos resultados como ocupada
  durante uma busca assíncrona e limpar o estado quando terminar.

## API JS

`Pagination` é uma API pública, exportada por `fokus-styles/js` e declarada
em `fokus-styles/js/fokus.d.ts`. O runtime inicializa automaticamente
elementos com `data-fs="pagination"`; também é possível criar a instância
manualmente. A API de JavaScript é opcional: os estilos CSS continuam
disponíveis sem ela.

### Marcação e inicialização

Use `data-fs-pages` no contêiner para informar o total e `data-fs-page` para
indicar a página inicial. Cada controle recebe `data-fs-page` com seu número.
Se `data-fs-pages` não for informado, o runtime usa a quantidade de controles
ou 1. O total mínimo é 1.

```html
<nav aria-label="Paginação">
  <ul class="fs-pagination" data-fs="pagination" data-fs-pages="3" data-fs-page="1">
    <li class="fs-page-item"><button class="fs-page-link" type="button" data-fs-page="1">1</button></li>
    <li class="fs-page-item"><button class="fs-page-link" type="button" data-fs-page="2">2</button></li>
    <li class="fs-page-item"><button class="fs-page-link" type="button" data-fs-page="3">3</button></li>
  </ul>
</nav>
<p id="page-status" aria-live="polite">Página 1 de 3</p>
<ul id="page-results" aria-busy="false"></ul>
```

### Evento e carregamento dos resultados

Ao ativar um controle, a instância atualiza `data-fs-page` no contêiner,
aplica `.is-active` no controle e no `.fs-page-item` correspondente, define
`aria-current="page"` no controle ativo e emite o evento bubbling
`fs:pagination:change` com `detail: { page, total }`. O evento só é emitido
quando a página muda.

O runtime não busca nem renderiza os resultados e não altera `aria-busy`.
Esse estado pertence à região atualizada pela aplicação. Exemplo executável
usando dados locais:

```js
import { Pagination } from "fokus-styles/js";

const nav = document.querySelector('[data-fs="pagination"]');
const status = document.querySelector("#page-status");
const results = document.querySelector("#page-results");
const pages = { 1: ["A", "B"], 2: ["C", "D"], 3: ["E"] };
const pagination = Pagination.getInstance(nav);

nav.addEventListener("fs:pagination:change", async ({ detail }) => {
  results.setAttribute("aria-busy", "true");
  status.textContent = `Página ${detail.page} de ${detail.total}`;
  await Promise.resolve();
  results.replaceChildren(...pages[detail.page].map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
  results.setAttribute("aria-busy", "false");
});

pagination.goTo(2);
```

`Pagination.getInstance(element)` retorna a instância existente;
`Pagination.getOrCreateInstance(element)` a recupera ou cria; `goTo(page)`
seleciona uma página entre 1 e o total; e `dispose()` remove o listener e o
registro da instância. A aplicação pode usar `goTo()` para conectar seus
próprios controles ao estado da paginação.

### Compatibilidade

A decisão mantém a exportação pública, a declaração de tipos e o auto-init já
existentes; não remove nem renomeia APIs. O único comportamento runtime
acrescentado nesta correção é ignorar cliques em controles desabilitados,
alinhando-os ao estado visual e acessível documentado.

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
