# DataTable

Camada JS opcional sobre uma [Table](table.md) comum: ordenação por coluna,
filtro por texto e paginação client-side, tudo sobre a marcação `<table>`
semântica já existente — sem framework de dados, sem dependência externa.
Reusa `.fs-table` para a tabela, `.fs-pagination`/`.fs-page-link` para o
paginador (mesmas classes do [Pagination](pagination.md)) e
`.fs-empty-state` para a lista vazia.

## Visão geral

```html
<div class="fs-datatable" data-fs="datatable" data-fs-page-size="5">
  <div class="fs-datatable-toolbar">
    <input type="search" class="fs-form-control" data-fs-datatable-filter placeholder="Filtrar…">
  </div>
  <table class="fs-table fs-table-striped fs-table-hover">
    <thead>
      <tr>
        <th scope="col" data-fs-sort="name">Nome</th>
        <th scope="col" data-fs-sort="age">Idade</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Ana</td><td>35</td></tr>
      <tr><td>Bruno</td><td>19</td></tr>
    </tbody>
  </table>
  <div class="fs-empty-state" data-fs-datatable-empty hidden>
    <p class="fs-empty-state-title">Nenhum resultado encontrado.</p>
  </div>
</div>
```

Auto-init em `data-fs="datatable"`, colocado no `<div>` que envolve
toolbar/tabela/estados — não no `<table>` diretamente. O JS lê as linhas de
`<tbody>` uma vez na inicialização; se a tabela for repovoada por fora
(ex.: resposta de uma API), chame `instance.refresh()`.

## Anatomia

`.fs-datatable[data-fs="datatable"]` > opcionalmente `.fs-datatable-toolbar`
(com `input[data-fs-datatable-filter]`) + `table.fs-table` (com
`th[data-fs-sort]` no `<thead>`) + opcionalmente
`[data-fs-datatable-empty]`/`[data-fs-datatable-loading]`/`[data-fs-datatable-error]`
+ `nav[data-fs-datatable-pagination]` (criado automaticamente se ausente).

## Variações

- `data-fs-sort="chave"` num `<th>` o torna ordenável — o JS envolve o
  conteúdo existente num `<button class="fs-datatable-sort-btn">`
  automaticamente (não escreva o botão você mesmo).
- `data-fs-sort-type="number"`, `"currency"` ou `"date"` no `<th>` ativa
  comparação tipada; sem o atributo, a ordenação usa texto. Combine com
  `data-fs-sort-value` quando o valor exibido for formatado.
- `data-fs-sort-value` numa `<td>` define o valor usado pra ordenar aquela
  célula, se for diferente do texto exibido (ex.: data ISO por trás de um
  texto formatado, número por trás de um texto com símbolo).
- `data-fs-page-size="N"` no elemento raiz define quantas linhas por
  página (padrão: 10).
- `[data-fs-datatable-filter]` — um `<input>` (dentro do elemento raiz)
  que filtra por substring em qualquer célula da linha, case-insensitive.
- `[data-fs-datatable-empty]` — bloco (tipicamente `.fs-empty-state`)
  mostrado no lugar da tabela quando o filtro não encontra nenhuma linha.
- `[data-fs-datatable-loading]` / `[data-fs-datatable-error]` — blocos
  mostrados via `setLoading()`/`setError()` (ver API JS); nenhum dos dois é
  obrigatório.
- `[data-fs-datatable-pagination]` — se você quiser controlar onde o
  paginador aparece, forneça o elemento; senão o JS cria um `<nav>` e
  anexa ao final do elemento raiz.

## Estados

- **Vazio**: filtro sem correspondências — tabela ocultada,
  `[data-fs-datatable-empty]` exibido (se fornecido; sem ele, a tabela só
  fica com zero linhas visíveis).
- **Carregando**: acionado por `instance.setLoading(true)` — tabela e
  paginador ocultados, `[data-fs-datatable-loading]` exibido (tipicamente
  linhas `.fs-skeleton-text`).
- **Erro**: acionado por `instance.setError("mensagem")` — tabela e
  paginador ocultados, `[data-fs-datatable-error]` exibido, com o texto
  escrito em `[data-fs-datatable-error-message]` dentro dele (se existir).
- Paginação: o `<nav>` só é exibido quando há mais de uma página.

## A11y

`aria-sort` (`"none"`/`"ascending"`/`"descending"`) em cada `<th>`
ordenável, atualizado a cada clique — o botão interno recebe o clique/foco
(padrão recomendado pelo
[WAI-ARIA Table Sort](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/),
`aria-sort` no `th`, ativação num elemento focável dentro dele). Células de
dados usam roving `tabindex` (uma célula visível por vez com `tabindex="0"`,
as demais `-1"`) pra navegação em grade sem tornar cada célula uma parada
extra no Tab da página.

Teclado (com foco numa célula do corpo da tabela):
- `ArrowRight`/`ArrowLeft`/`ArrowUp`/`ArrowDown`: move o foco pra célula
  vizinha (não cruza limites da página visível).
- `Home`/`End`: primeira/última célula da linha atual.
- `Ctrl+Home`/`Ctrl+End`: primeira célula da tabela / última célula da
  última linha visível.

Teclado (com foco no botão de ordenação do cabeçalho): `Enter`/`Espaço`
ativam nativamente (é um `<button>`), ciclando
ascendente → descendente → nenhuma.

## API JS

Auto-init via `data-fs="datatable"` no elemento raiz.
`DataTable.getInstance(rootEl)`.

| Método | Descrição |
|---|---|
| `sort(key, direction)` | Ordena pela coluna com `data-fs-sort="key"`. `direction`: `"asc"` \| `"desc"` \| `"none"`. |
| `filter(query)` | Filtra por substring (aplica também no input, se houver um). |
| `goToPage(page)` | Navega pra página (1-indexado, com clamp nos limites). |
| `refresh()` | Relê as linhas de `<tbody>` do zero — use após repovoar a tabela por fora. |
| `setLoading(bool)` | Alterna o estado de carregamento. |
| `setError(mensagem \| null)` | Mostra (com mensagem) ou limpa (`null`) o estado de erro. |
| `dispose()` | Remove listeners e desregistra a instância. |

| Propriedade | Descrição |
|---|---|
| `sortKey` / `sortDirection` | Coluna e direção de ordenação atuais (`sortDirection`: `"asc"` \| `"desc"` \| `"none"`). |
| `filterQuery` | Texto de filtro atual. |
| `currentPage` / `pageCount` | Página atual e total de páginas (considerando o filtro). |
| `rowCount` | Quantidade de linhas que correspondem ao filtro atual. |
| `pageSize` | Linhas por página (lido de `data-fs-page-size`, ou 10). |

| Evento (no elemento raiz) | Cancelável | Quando |
|---|---|---|
| `fs:datatable:sorted` | Não | Após ordenar, com `detail.key`/`detail.direction`. |
| `fs:datatable:filtered` | Não | Após filtrar, com `detail.query`/`detail.matched`. |
| `fs:datatable:paged` | Não | Após trocar de página, com `detail.page`/`detail.pageCount`. |

## Tokens

Reusa os tokens de [Table](table.md) e [Pagination](pagination.md) — sem
tokens próprios de cor. `.fs-datatable-sort-btn` usa
`var(--fs-color-muted)`/`var(--fs-color-text)` pro indicador de direção
(↕/↑/↓).

## Exemplo

```html
<div class="fs-datatable" data-fs="datatable" data-fs-page-size="3">
  <div class="fs-datatable-toolbar">
    <input type="search" class="fs-form-control" data-fs-datatable-filter placeholder="Filtrar por nome ou status…">
  </div>
  <table class="fs-table fs-table-striped">
    <thead>
      <tr>
        <th scope="col" data-fs-sort="name">Nome</th>
        <th scope="col" data-fs-sort="status">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Ana</td><td>Ativo</td></tr>
      <tr><td>Bruno</td><td>Inativo</td></tr>
    </tbody>
  </table>
  <div class="fs-empty-state" data-fs-datatable-empty hidden>
    <p class="fs-empty-state-title">Nenhum resultado encontrado.</p>
  </div>
</div>
<script>
  document.querySelector(".fs-datatable").addEventListener("fs:datatable:sorted", (e) => {
    console.log("ordenado por", e.detail.key, e.detail.direction);
  });
</script>
```

Mockup: [laboratório do componente](../../mockup/content-data.html#datatable).
