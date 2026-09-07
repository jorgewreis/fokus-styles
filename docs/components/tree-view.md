# Tree View

Lista hierárquica navegável (arquivos, categorias, organogramas), seguindo
o padrão [WAI-ARIA Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/).
Marcação nativa `<ul>`/`<li>` aninhada — o JS só adiciona os papéis ARIA,
o botão de expandir/colapsar e a navegação por teclado.

## Visão geral

```html
<ul class="fs-tree" data-fs="tree-view">
  <li>
    <span class="fs-tree-label">src</span>
    <ul>
      <li><span class="fs-tree-label">index.js</span></li>
      <li>
        <span class="fs-tree-label">components</span>
        <ul>
          <li><span class="fs-tree-label">Button.js</span></li>
        </ul>
      </li>
    </ul>
  </li>
  <li><span class="fs-tree-label">README.md</span></li>
</ul>
```

Cada `<li>` precisa de um `<span class="fs-tree-label">` como filho direto
(o texto do nó) — nós com filhos somam um `<ul>`/`<ol>` aninhado logo
depois do label. O JS injeta automaticamente o `.fs-tree-toggle` (a seta)
dentro do label de cada nó que tiver filhos; nós-folha não recebem seta.

## Anatomia

`ul.fs-tree[role="tree"]` > `li[role="treeitem"]` (recursivo) >
`span.fs-tree-label` (com `.fs-tree-toggle` auto-injetado se houver
filhos) + opcionalmente `ul[role="group"]` (o próximo nível).

## Variações

- `data-value` num `<li>` define o valor "de verdade" reportado em
  `fs:tree:selected` (`event.detail.value`); sem ele, o valor é o texto
  visível do nó.
- `aria-expanded="true"` pré-existente num `<li>` com filhos abre esse
  ramo já expandido na renderização inicial (por padrão, todo ramo nasce
  colapsado).

## Estados

- Colapsado (padrão) / expandido (`aria-expanded="true"` no `<li>`,
  `hidden` removido do `<ul>` filho) — alternado por clique na
  label/seta ou por teclado.
- Selecionado: `aria-selected="true"` (só no nó mais recente; os demais
  voltam a `"false"`) — clicar num nó com filhos expande/colapsa **e**
  seleciona ao mesmo tempo (como um explorador de arquivos).

## A11y

`role="tree"` na raiz, `role="treeitem"` em cada `<li>`, `role="group"` no
`<ul>`/`<ol>` aninhado, `aria-expanded` nos nós com filhos. Roving
`tabindex`: só o nó tabulável atual tem `tabindex="0"`; os demais (visíveis)
ficam em `"-1"` — nós dentro de um ramo colapsado não são alcançáveis por
Tab. `aria-selected` reflete a seleção atual.

Teclado (com foco num nó da árvore):
- `ArrowDown`/`ArrowUp`: move o foco pro próximo/anterior nó **visível**
  (não desce em ramos colapsados).
- `ArrowRight`: nó fechado → expande (foco não se move); nó já aberto →
  move o foco pro primeiro filho; folha → sem efeito.
- `ArrowLeft`: nó aberto → colapsa; nó fechado ou folha → move o foco pro
  nó pai.
- `Home`/`End`: primeiro/último nó visível da árvore inteira.
- `Enter`/`Espaço`: alterna expansão (se houver filhos) e seleciona o nó.

## API JS

Auto-init via `data-fs="tree-view"` na raiz (`<ul>`/`<ol>`).
`TreeView.getInstance(rootEl)`.

| Método | Descrição |
|---|---|
| `expand(item)` | Expande o `<li>` informado (sem efeito se já expandido ou sem filhos). |
| `collapse(item)` | Colapsa o `<li>` informado. |
| `toggle(item)` | Alterna expandido/colapsado. |
| `select(item)` | Marca `aria-selected="true"` no `<li>` informado (e `"false"` nos demais), dispara `fs:tree:selected`. |
| `dispose()` | Remove listeners e desregistra a instância. |

| Evento (na raiz) | Cancelável | Quando |
|---|---|---|
| `fs:tree:expanded` | Não | Após expandir um nó, com `event.detail.item`. |
| `fs:tree:collapsed` | Não | Após colapsar um nó, com `event.detail.item`. |
| `fs:tree:selected` | Não | Após selecionar um nó, com `event.detail.value`/`event.detail.item`. |

## Tokens

`--fs-color-text`, `--fs-color-subtle` (hover da label),
`--fs-color-primary` (nó selecionado, com `color-contrast()` pro texto),
`--fs-radius-sm`.

## Exemplo

```html
<ul class="fs-tree" data-fs="tree-view" aria-label="Arquivos do projeto">
  <li>
    <span class="fs-tree-label">src</span>
    <ul>
      <li><span class="fs-tree-label">index.js</span></li>
    </ul>
  </li>
</ul>
<script>
  document.querySelector(".fs-tree").addEventListener("fs:tree:selected", (e) => {
    console.log("selecionado:", e.detail.value);
  });
</script>
```

Mockup: [laboratório do componente](../../mockup/navigation-disclosure.html#tree-view).
