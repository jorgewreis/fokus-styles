# Range / Slider

`<input type="range">` estilizado — trilha preenchida até o valor atual e
thumb customizados via pseudo-elementos (`::-webkit-slider-thumb`/
`::-moz-range-thumb`, sem padrão unificado entre navegadores). Teclado
(setas, `Home`/`End`, `PageUp`/`PageDown`) e ARIA (`role="slider"` implícito,
`aria-valuenow`/`aria-valuemin`/`aria-valuemax` automáticos) já vêm do
elemento nativo, sem nenhum JS.

## Visão geral

```html
<label for="volume" class="fs-form-label">Volume</label>
<input type="range" class="fs-form-range" id="volume" min="0" max="100" value="40">
```

## Valor visível (API JS opcional)

Um `<output>` associado via `data-fs-target` mostra o valor atual em texto
— útil pra quem não percebe a posição do thumb só visualmente. Auto-init
com `data-fs="range"` no próprio `<input>`:

```html
<input type="range" class="fs-form-range" id="volume" min="0" max="100" value="40"
  data-fs="range" data-fs-target="#volume-output">
<output class="fs-range-output" id="volume-output" for="volume">40</output>
```

O JS também é responsável por pintar a trilha preenchida
(`--fs-range-percent`, ver token abaixo) — sem ele, a trilha renderiza sem
preenchimento (só a cor de fundo neutra), porque só o Firefox suporta
`::-moz-range-progress`; Chrome/Safari não têm equivalente em CSS puro.

## Marcações (`<datalist>`)

Marcações na trilha são nativas via `list` + `<datalist>` (sem JS,
suporte no Chrome/Edge; degrada para nenhuma marcação visível nos
navegadores sem suporte, sem quebrar a funcionalidade):

```html
<input type="range" class="fs-form-range" min="0" max="100" step="25" list="marcas">
<datalist id="marcas">
  <option value="0"></option>
  <option value="25"></option>
  <option value="50"></option>
  <option value="75"></option>
  <option value="100"></option>
</datalist>
```

## Tokens

| Token | Uso |
|---|---|
| `--fs-range-track-height` | Altura da trilha. |
| `--fs-range-track-color` | Cor da trilha não preenchida. |
| `--fs-range-fill-color` | Cor da trilha preenchida (até o valor atual). |
| `--fs-range-thumb-size` | Diâmetro do thumb. |
| `--fs-range-thumb-color` | Cor de fundo do thumb. |
| `--fs-range-thumb-border-color` | Cor da borda do thumb. |
| `--fs-range-percent` | Percentual preenchido da trilha — escrito pelo JS (`RangeSlider`), não pensado pra edição manual. |

## Estados

- `:disabled` — opacidade reduzida, cursor `not-allowed`, sem interação.
- `:focus-visible` — anel de foco no thumb (mesma técnica de
  `focus-ring()` dos demais controles).

## A11y

Nativo — `<input type="range">` já expõe `role="slider"` e os valores
`aria-value*` automaticamente. Sempre associe um `<label>` (via `for`), e
use `aria-label`/`aria-labelledby` quando não houver label visível.

## API JS

- `data-fs="range"` — auto-init.
- `data-fs-target="#id"` — `<output>` que recebe o valor atual em texto.

| Método | Descrição |
|---|---|
| `RangeSlider.getInstance(el)` | Retorna a instância associada ao `<input>` (ou `undefined`). |
| `dispose()` | Remove o listener de `input`. |
