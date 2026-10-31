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
  integral do nó, incluindo seus descendentes.
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

## Valores, indisponibilidade e ciclo de vida

Forneça `data-value` explícito nos ramos. Sem ele, o evento usa o textContent
integral do li, incluindo o texto dos descendentes, mesmo colapsados; não somente
a label do pai.

`aria-disabled="true"` e `.is-disabled` no próprio nó impedem seleção,
expansão e colapso, tanto por ativação quanto pelas APIs `select`, `expand`,
`collapse` e `toggle`. Essas APIs também ignoram itens externos à árvore.
Cliques (inclusive auxiliares), Enter e Space são cancelados na captura da raiz,
antes dos handlers do alvo. Listeners de captura externos/anteriores e chamadas
à lógica de negócio não são interceptados. É uma guarda de interface, não
autorização de acesso. Links habilitados mantêm seu comportamento/default.

Nós indisponíveis continuam descobríveis pelo foco e pelas setas, Home e End.
A indisponibilidade é local ao item: não é propagada por classe/ARIA aos filhos.
Se um ramo indisponível já estiver aberto, seus descendentes habilitados
continuam navegáveis e ativáveis; ArrowRight pode focar o filho, mas não abre
um ramo indisponível fechado. ArrowLeft não fecha um ramo indisponível aberto.
Alterar disabled não desfaz seleção/expansão anteriores automaticamente. Essa
política local explícita preserva a navegação existente; não representa uma
implementação completa de herança de estado ARIA.

A estrutura é preparada na construção; não existe API refresh ou carregamento
remoto. `dispose()` remove listeners/registro, mas conserva os papéis, atributos
e setas já adicionados ao DOM. Alterações estruturais exigem recomposição pela
aplicação e conferência de foco/ARIA.

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
