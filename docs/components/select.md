# Select customizado

Substitui a aparência do `<select>` nativo (impossível de estilizar
consistentemente entre navegadores) por um [Dropdown](dropdown.md), mantendo
o `<select>` real por baixo — sincronizado, escondido visualmente.

## Visão geral

```html
<select class="fs-form-select" data-fs="select" id="pais">
  <option value="br">Brasil</option>
  <option value="pt">Portugal</option>
  <option value="us" disabled>Estados Unidos (indisponível)</option>
</select>
```

O JS constrói o dropdown customizado logo depois do `<select>` no DOM e
esconde o original (`display: none` — continua no DOM, então
`<select>` mantém o valor para o formulário). A sincronização visual é
parcial, conforme os limites abaixo.

## Anatomia

Gerado automaticamente a partir do `<select>`: `.fs-dropdown.fs-form-select-dropdown`
> `.fs-form-select` (botão-toggle, mesma aparência estática documentada em
[Input](input.md#anatomia)) + `.fs-dropdown-menu` > um `.fs-dropdown-item`
por `<option>`.

## Variações

Tamanho: `data-size="sm"`/`"lg"` no `<select>` original — vira
`.fs-form-select-sm`/`-lg` no toggle gerado.

```html
<select class="fs-form-select" data-fs="select" data-size="sm">...</select>
```

## Estados

- `<option disabled>` vira um item com `.is-disabled` no menu (não
  clicável).
- `<select disabled>` desabilita o botão-toggle inteiro na construção.
- Item selecionado (`selectedIndex`) fica com `.is-active` no menu.

## A11y

`aria-haspopup="listbox"` no toggle, `role="listbox"` no menu,
`role="option"` + `aria-selected` em cada item — aplicados
automaticamente. Navegação por teclado herdada do
[Dropdown](dropdown.md) (`ArrowDown`/`ArrowUp` entre opções, `Escape`
fecha). Selecionar uma opção dispara `change` no `<select>` original —
formulários/validação que escutam esse evento continuam funcionando sem
mudança.

## API JS

Auto-init via `data-fs="select"` **no `<select>`**. `Select.getInstance(selectEl)`.

| Método | Descrição |
|---|---|
| `show()` / `hide()` / `toggle()` | Delegam pro Dropdown interno. |
| `dispose()` | Desmonta o dropdown gerado, restaura o `<select>` original visível. |

| Evento (no `<select>` original) | Cancelável | Quando |
|---|---|---|
| `change` (nativo) | Não | Ao selecionar uma opção — mesmo evento que um `<select>` comum dispara. |
| `fs:select:changed` | Não | Mesmo momento, com `event.detail.value` (o novo valor). |

## Limites de sincronização e dados

- Opções, textos, `option.disabled`, `select.disabled` e tamanho são capturados na
  construção. Não há observação automática de mudanças nesses atributos/filhos.
  O evento nativo `change` sincroniza o texto da seleção e `aria-selected`, mas
  não reconstrói opções nem atualiza o disabled do botão/menu.
- Após alterar opções ou disponibilidade, desmonte e recrie o componente. Uma
  alteração programática somente do valor exige disparar `change` para sincronizar
  a apresentação. O reset de formulário é sincronizado após a ação nativa.
- `multiple` e `optgroup` não são contratos suportados: as opções são achatadas,
  somente `selectedIndex` é usado, e `disabled` do optgroup não é propagado aos
  itens. Prefira o select nativo nesses casos; não interprete a aparência como
  validação de elegibilidade.
- Não há objeto de opções JS. Somente `data-size="sm"` ou `"lg"` é consumido;
  outros tamanhos não são aplicados ao toggle. Texto das opções é copiado com
  `textContent`, não interpretado como HTML.
- O wrapper não transfere automaticamente toda validação ou semântica acessível
  do select para o botão gerado. Verifique nome acessível, erro e formulário na
  composição final; ouvir `change` não equivale a validar o formulário.

## Tokens

Os mesmos do [Dropdown](dropdown.md) e de
[`.fs-form-select`](input.md) — sem tokens próprios.

## Exemplo

```html
<select class="fs-form-select" data-fs="select" id="prioridade">
  <option value="baixa">Baixa</option>
  <option value="media" selected>Média</option>
  <option value="alta">Alta</option>
</select>
<script>
  document.getElementById("prioridade").addEventListener("fs:select:changed", (e) => {
    console.log("nova prioridade:", e.detail.value);
  });
</script>
```

Mockup: [laboratório do componente](../../mockup/forms.html#select).
