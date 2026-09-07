# Combobox / Autocomplete

Um `<input>` de texto com uma listbox de sugestões que filtra conforme o
usuário digita — diferente do [Select](select.md) (que troca a aparência
de um `<select>` inteiro), o Combobox é sempre texto livre com sugestões,
seguindo o padrão [WAI-ARIA Combobox (List Autocomplete)](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).
Reusa `packages/fokus-js/js/core/positioning.js` (mesmo posicionamento do [Dropdown](dropdown.md))
e a classe `.fs-dropdown-menu`/`.fs-dropdown-item` para a listbox flutuante.

## Visão geral

```html
<div class="fs-combobox">
  <input type="text" class="fs-form-control" data-fs="combobox" data-fs-target="#lista-frameworks" placeholder="Buscar framework…">
</div>
<ul class="fs-dropdown-menu fs-combobox-listbox" id="lista-frameworks">
  <li class="fs-dropdown-item" data-value="bootstrap">Bootstrap</li>
  <li class="fs-dropdown-item" data-value="tailwind">Tailwind CSS</li>
  <li class="fs-dropdown-item is-disabled" data-fs-empty hidden>Nenhum resultado encontrado.</li>
</ul>
```

O JS reanexa a listbox a `document.body` (igual ao Dropdown/Select — evita
recorte por `overflow: hidden` de um ancestral) e a posiciona relativa ao
input. O item com `data-fs-empty` é opcional, mas recomendado: o
componente alterna a visibilidade dele automaticamente quando nenhuma
opção corresponde à busca — o texto dele é escrito por você (o framework
não injeta texto/idioma).

## Anatomia

`.fs-combobox` (wrapper posicionador) > `input[role="combobox"]` +
`.fs-dropdown-menu.fs-combobox-listbox[role="listbox"]` > um ou mais
`.fs-dropdown-item[role="option"]`.

## Variações

- `data-value` em cada `.fs-dropdown-item` define o valor "de verdade"
  (`instance.value`); sem ele, o valor é o texto visível do item.
- Item desabilitado: `.fs-dropdown-item.is-disabled` — ignorado por
  teclado, mouse e pelo filtro de "opções selecionáveis".
- Item de "sem resultados": `.fs-dropdown-item.is-disabled[data-fs-empty]`,
  `hidden` por padrão — visibilidade alternada automaticamente pelo JS.

## Estados

- Digitar filtra as opções por substring (case-insensitive) — as que não
  correspondem recebem o atributo `hidden` (removidas da árvore de
  acessibilidade junto, não só visualmente).
- Campo vazio mostra a lista completa (sem filtro).
- Opção destacada durante a navegação por teclado: `.is-active` (visual
  idêntico ao item ativo do Dropdown/Select).
- Opção escolhida: `aria-selected="true"` (só nela; as demais voltam a
  `"false"`).

## A11y

`role="combobox"` + `aria-autocomplete="list"` + `aria-controls` +
`aria-expanded` no input, `role="listbox"` na lista, `role="option"` +
`aria-selected` em cada item — todos aplicados automaticamente, com `id`
gerado para quem não tiver um. O foco **nunca sai do input**: a opção
destacada é comunicada via `aria-activedescendant` (não `focus()`), como o
padrão ARIA de combobox exige — por isso as opções não são elementos
focáveis (`<li>`/`<div>`, não `<button>`).

Teclado (com foco no input):
- `ArrowDown`/`ArrowUp`: abre a listbox (se fechada) ou move o destaque
  entre as opções selecionáveis, com wrap.
- `Home`/`End`: vai pra primeira/última opção selecionável (listbox
  aberta).
- `Enter`: seleciona a opção destacada (se houver e a listbox estiver
  aberta) — preenche o input, fecha a listbox.
- `Escape`: fecha a listbox **sem** alterar o valor do input.

## API JS

Auto-init via `data-fs="combobox"` **no `<input>`**, com `data-fs-target`
apontando pro seletor da listbox (convenção idêntica ao Dropdown).
`Combobox.getInstance(inputEl)`.

| Método | Descrição |
|---|---|
| `show()` | Abre a listbox e posiciona relativa ao input. |
| `hide()` | Fecha a listbox, limpa o destaque e `aria-activedescendant`. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove listeners, desregistra a instância. |

| Propriedade | Descrição |
|---|---|
| `value` | Valor da opção selecionada (`data-value` do item, ou o texto visível se não houver). `null` até a primeira seleção. |

| Evento (no input) | Cancelável | Quando |
|---|---|---|
| `change` (nativo) | Não | Ao selecionar uma opção (clique ou `Enter`). |
| `fs:combobox:changed` | Não | Mesmo momento, com `event.detail.value`/`event.detail.label`. |
| `fs:combobox:shown` | Não | Depois de abrir a listbox. |
| `fs:combobox:hidden` | Não | Depois de fechar. |

## Tokens

Os mesmos do [Dropdown](dropdown.md) (`.fs-dropdown-menu`/`.fs-dropdown-item`)
e de [`.fs-form-control`](input.md) — sem tokens próprios. `.fs-combobox-listbox`
soma `max-height: 240px` + scroll interno para listas longas.

## Exemplo

```html
<div class="fs-combobox">
  <input type="text" class="fs-form-control" id="cidade" data-fs="combobox" data-fs-target="#cidade-lista" placeholder="Buscar cidade…">
</div>
<ul class="fs-dropdown-menu fs-combobox-listbox" id="cidade-lista">
  <li class="fs-dropdown-item" data-value="sp">São Paulo</li>
  <li class="fs-dropdown-item" data-value="rj">Rio de Janeiro</li>
  <li class="fs-dropdown-item is-disabled" data-fs-empty hidden>Nenhuma cidade encontrada.</li>
</ul>
<script>
  document.getElementById("cidade").addEventListener("fs:combobox:changed", (e) => {
    console.log("cidade escolhida:", e.detail.value);
  });
</script>
```

Mockup: [laboratório do componente](../../mockup/forms.html#combobox).
