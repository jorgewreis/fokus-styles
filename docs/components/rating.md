# Rating

Avaliação por estrelas, 100% CSS — mesma técnica de input oculto + label
irmã do [Checkbox](checkbox.md)/[Segmented Control](segmented-control.md),
usando `<input type="radio">` (seleção exclusiva nativa). A estrela é o
ícone `star` do [`fokus-styles/icons`](../guides/icons.md) — contorno vazio por
padrão, preenchido (`fill: currentcolor`) quando selecionada ou em hover.

## Visão geral

```html
<div class="fs-rating">
  <input type="radio" name="nota" class="fs-rating-input" id="nota-5" value="5">
  <label for="nota-5" class="fs-rating-star" aria-label="5 estrelas">
    <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
  </label>
  <input type="radio" name="nota" class="fs-rating-input" id="nota-4" value="4">
  <label for="nota-4" class="fs-rating-star" aria-label="4 estrelas">
    <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
  </label>
  <!-- ... 3, 2, 1, mesmo padrão ... -->
</div>
```

**A ordem no HTML é decrescente** (5, 4, 3, 2, 1) — truque clássico de CSS
puro: o contêiner usa `row-reverse` (visualmente reordena pra crescente,
esquerda→direita) e o destaque "estrela clicada + todas à esquerda dela"
usa só o combinador de irmãos gerais (`~`, que só enxerga o que vem
**depois** no DOM) — depende da ordem decrescente pra funcionar.

## Anatomia

`.fs-rating` (contêiner, `row-reverse`) > pares `.fs-rating-input`
(`<input type="radio">`, mesmo `name`, oculto via clip) +
`.fs-rating-star` (`<label for="...">` com `aria-label` + o ícone `star`
dentro, `aria-hidden`), um par por nota possível, em ordem decrescente de
`value`.

## Variações

Tamanho: `.fs-rating-sm` (16px), `.fs-rating-lg` (32px); sem sufixo = 24px
(padrão) — controla o `font-size` do `<label>`, e o ícone (`.fs-icon`,
`1em` × `1em`) acompanha.

## Estados

- Nota selecionada e todas as anteriores (maior valor) ficam na cor de
  aviso (`--fs-color-warning`) e com a estrela preenchida — via
  `:checked ~ .fs-rating-star`.
- **Hover** prévia a mesma seleção antes de confirmar o clique
  (`:hover`/`:hover ~`).
- `disabled` no input — opacidade reduzida, sem interação.

## A11y

`<input type="radio">` nativo — `Tab` foca o grupo, `ArrowLeft`/
`ArrowRight` (ou `Up`/`Down`) movem a seleção entre notas, `Space`
confirma. Como a estrela é um ícone (`aria-hidden="true"`, sem texto
visível), o `<label>` **precisa** de `aria-label` (`"5 estrelas"`,
`"1 estrela"` etc.) — sem isso o link não tem nome acessível nenhum.

## API JS

Nenhuma — 100% CSS. O valor selecionado é lido como qualquer grupo de
radio nativo (`document.querySelector('input[name="nota"]:checked').value`).

## Tokens

`--fs-color-border` (estrela vazia), `--fs-color-warning` (selecionada/
hover), `--fs-color-primary` (anel de foco).

## Exemplo

```html
<fieldset>
  <legend>Avalie sua experiência</legend>
  <div class="fs-rating">
    <input type="radio" name="exp" class="fs-rating-input" id="exp-5" value="5" checked>
    <label for="exp-5" class="fs-rating-star" aria-label="5 estrelas">
      <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
    </label>
    <input type="radio" name="exp" class="fs-rating-input" id="exp-4" value="4">
    <label for="exp-4" class="fs-rating-star" aria-label="4 estrelas">
      <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
    </label>
    <!-- ... 3, mesmo padrão ... -->
  </div>
</fieldset>
```

Mockup: [laboratório do componente](../../mockup/forms.html#rating).
