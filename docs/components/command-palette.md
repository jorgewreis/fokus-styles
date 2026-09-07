# Command Palette

Um diálogo de busca/comandos disparado por um botão ou por um atalho de
teclado global (ex.: `Ctrl+K`/`Cmd+K`) — combina o overlay/focus trap do
[Modal](modal.md) com o filtro/navegação por teclado do [Combobox](combobox.md).
Reusa `.fs-dropdown-item`/`.is-active`/`.is-disabled` (mesmas classes do
[Dropdown](dropdown.md)) para os itens da lista de comandos.

## Visão geral

```html
<button type="button" class="fs-btn" data-fs="command-palette" data-fs-target="#paleta" data-fs-shortcut="mod+k">
  Comandos (Ctrl+K)
</button>

<div class="fs-command-palette" id="paleta">
  <div class="fs-command-palette-dialog">
    <input type="text" class="fs-command-palette-input" placeholder="Digite um comando…">
    <ul class="fs-command-palette-list">
      <li class="fs-dropdown-item" data-value="new-file">Novo arquivo</li>
      <li class="fs-dropdown-item" data-value="open-settings">Abrir configurações</li>
      <li class="fs-dropdown-item is-disabled" data-fs-empty hidden>Nenhum comando encontrado.</li>
    </ul>
  </div>
</div>
```

Auto-init em `data-fs="command-palette"` **no botão gatilho**, com
`data-fs-target` apontando pro painel (convenção idêntica ao Modal). O
painel não precisa estar pré-posicionado — é um overlay de tela cheia,
como o Modal. `data-fs-shortcut="mod+k"` é opcional: quando presente,
registra um atalho de teclado global (`mod` = Ctrl no Windows/Linux, Cmd
no Mac) que abre/fecha o painel de qualquer lugar da página, sem precisar
clicar no botão.

## Anatomia

`.fs-command-palette[role="dialog"]` > `.fs-command-palette-dialog` >
`input.fs-command-palette-input[role="combobox"]` +
`ul.fs-command-palette-list[role="listbox"]` > um ou mais
`li.fs-dropdown-item[role="option"]`.

## Variações

- `data-value` em cada `.fs-dropdown-item` define o valor "de verdade"
  (`event.detail.value` no evento de seleção); sem ele, o valor é o texto
  visível do item.
- Item desabilitado: `.fs-dropdown-item.is-disabled` — ignorado por
  teclado, mouse e pelo filtro.
- Item de "sem resultados": `.fs-dropdown-item.is-disabled[data-fs-empty]`,
  `hidden` por padrão — visibilidade alternada automaticamente pelo JS.
- `.fs-dropdown-header` agrupa comandos por seção, igual ao Dropdown.
- `data-fs-shortcut="mod+k"` (ou `options.shortcut` no construtor): aceita
  combinações com `mod`/`shift`/`alt` + uma tecla, ex. `"mod+shift+p"`.

## Estados

- Ao abrir, o input é limpo e a lista completa (sem filtro) é exibida.
- Digitar filtra os itens por substring (case-insensitive) — os que não
  correspondem recebem o atributo `hidden`.
- Primeiro item selecionável sempre começa destacado (`.is-active`),
  pronto pra `Enter` imediato.
- Selecionar um item fecha o painel e devolve o foco ao gatilho.

## A11y

`role="dialog"` + `aria-modal="true"` no painel, `role="combobox"` +
`aria-autocomplete="list"` + `aria-controls`/`aria-expanded` no input,
`role="listbox"` na lista, `role="option"` + `aria-selected` em cada item.
Foco preso dentro do diálogo (`packages/fokus-js/js/core/focus.js`, mesmo mecanismo do
Modal) enquanto aberto; scroll da página travado
(`packages/fokus-js/js/core/overlay.js#lockScroll`). O foco **nunca sai do input** — a opção
destacada é comunicada via `aria-activedescendant`, como no Combobox.

Teclado (com foco no input, painel aberto):
- `ArrowDown`/`ArrowUp`: move o destaque entre os comandos visíveis, com
  wrap.
- `Enter`: executa o comando destacado — dispara `fs:command-palette:selected`
  e fecha.
- `Escape`: fecha o painel sem selecionar nada.
- `Tab`/`Shift+Tab`: preso dentro do diálogo (focus trap).

## API JS

Auto-init via `data-fs="command-palette"` no botão gatilho, com
`data-fs-target` apontando pro painel. `CommandPalette.getInstance(triggerEl)`.

| Método | Descrição |
|---|---|
| `show()` | Abre o painel, limpa o filtro e foca o input. |
| `hide()` | Fecha o painel, libera o scroll, devolve o foco ao gatilho. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove listeners (incluindo o atalho global, se houver), desregistra a instância. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:command-palette:selected` | Não | Ao selecionar um comando (clique ou `Enter`), com `event.detail.value`/`event.detail.label`. |
| `fs:command-palette:shown` | Não | Depois de abrir o painel. |
| `fs:command-palette:hidden` | Não | Depois de fechar. |

## Tokens

Os mesmos do [Modal](modal.md) (backdrop, `--fs-radius-md`,
`--fs-shadow-lg`) e do [Dropdown](dropdown.md) para os itens — sem tokens
próprios de cor.

## Exemplo

```html
<button type="button" class="fs-btn" id="abrir-paleta" data-fs="command-palette" data-fs-target="#paleta-exemplo" data-fs-shortcut="mod+k">
  Comandos (Ctrl+K)
</button>

<div class="fs-command-palette" id="paleta-exemplo">
  <div class="fs-command-palette-dialog">
    <input type="text" class="fs-command-palette-input" placeholder="Digite um comando…">
    <ul class="fs-command-palette-list">
      <li class="fs-dropdown-item" data-value="new-file">Novo arquivo</li>
      <li class="fs-dropdown-item" data-value="open-settings">Abrir configurações</li>
      <li class="fs-dropdown-item is-disabled" data-fs-empty hidden>Nenhum comando encontrado.</li>
    </ul>
  </div>
</div>
<script>
  document.getElementById("abrir-paleta").addEventListener("fs:command-palette:selected", (e) => {
    console.log("comando executado:", e.detail.value);
  });
</script>
```

Mockup: [laboratório do componente](../../mockup/overlays-commands.html#command-palette).
