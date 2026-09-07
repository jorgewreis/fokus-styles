# Checkbox

Checkbox 100% CSS, desenhado sobre um `<input type="checkbox">` nativo —
teclado, foco e semântica são os do navegador; o framework só estiliza.

## Visão geral

```html
<div class="fs-check">
  <input type="checkbox" class="fs-check-input" id="aceite">
  <label for="aceite" class="fs-check-label">Aceito os termos</label>
</div>
```

## Anatomia

`.fs-check` (wrapper) > `.fs-check-input` (`<input>`, visualmente oculto
via clip — continua focável/anunciado por leitor de tela) + `.fs-check-label`
(`<label for="...">`, desenha a caixa via `::before` e a marca via
`::after`). Input e label são **irmãos**, não aninhados — a associação é só
por `for`/`id` (mesma técnica de [Segmented Control](segmented-control.md)
e [Rating](rating.md)).

O `for`/`id` é obrigatório: sem ele, clicar no texto não alterna o
checkbox, e leitores de tela não anunciam o rótulo.

## Variações

Tamanho: `.fs-check-sm`, `.fs-check-lg` no wrapper (sem sufixo = padrão).
O checkbox é quadrado (`border-radius: 0`): desmarcado tem borda `primary`,
marcado usa preenchimento `primary` e check branco.
No hover desmarcado, o fundo recebe um tom sutil de `primary`; em `:active`,
o preenchimento fica mais intenso para confirmar o clique.

```html
<div class="fs-check fs-check-sm">...</div>
<div class="fs-check fs-check-lg">...</div>
```

## Estados

- **checked**: atributo `checked` no `<input>`.
- **indeterminate**: só via JavaScript (`input.indeterminate = true` — não
  existe atributo HTML equivalente; o framework estiliza `:indeterminate`,
  com borda tracejada `primary` e traço horizontal).
- **disabled**: atributo `disabled` no `<input>`.
- **Validação**: use `.is-invalid` no `<input>` quando houver erro. O
  inválido usa preenchimento `danger` com um X branco, inclusive quando não
  está marcado; não há estado visual separado para “válido”.
- **Disabled**: desmarcado usa trilho e borda neutros; marcado mantém uma
  versão atenuada de `primary`, em vez de reduzir a opacidade do controle todo.
- **Foco**: `:focus-visible` no input desenha o anel sobre a caixa
  (`::before` da label), não sobre o texto.

```html
<input type="checkbox" class="fs-check-input is-invalid" id="c1">
<label for="c1" class="fs-check-label">Campo obrigatório</label>
```

```js
document.getElementById("c2").indeterminate = true;
```

## A11y

- `<input type="checkbox">` nativo — `Space` alterna, `Tab` foca, leitor de
  tela anuncia estado (marcado/desmarcado/indeterminado) automaticamente.
  Nenhum ARIA extra é necessário.
- Sempre associe `label` via `for`/`id` — não use só `aria-label` no input
  se houver texto visível ao lado (duplica a leitura ou some com o clique
  no texto).

## API JS

Nenhuma — 100% CSS. `indeterminate` é uma propriedade do DOM nativo do
`<input>`, não uma API do FokusStyles.

## Tokens

Sem tokens de componente próprios — usa `--fs-color-primary` (caixa
marcada), `--fs-color-border`/`--fs-color-surface` (caixa vazia),
`--fs-color-success`/`--fs-color-danger` (validação), `--fs-radius-sm`.

## Exemplo

```html
<div class="fs-check">
  <input type="checkbox" class="fs-check-input" id="c1" checked>
  <label for="c1" class="fs-check-label">Marcado</label>
</div>
<div class="fs-check">
  <input type="checkbox" class="fs-check-input" id="c2" disabled>
  <label for="c2" class="fs-check-label">Desabilitado</label>
</div>
```

Mockup: [laboratório do componente](../../mockup/forms.html#check-radio-switch).
