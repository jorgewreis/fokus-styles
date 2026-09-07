# Radio

Radio button 100% CSS, mesma técnica do [Checkbox](checkbox.md) — sobre um
`<input type="radio">` nativo. É a única exceção circular do framework
além do [Spinner](progress.md), por decisão de design (anti-circular no
resto de tudo).

## Visão geral

```html
<div class="fs-radio">
  <input type="radio" name="periodo" class="fs-radio-input" id="dia" checked>
  <label for="dia" class="fs-radio-label">Dia</label>
</div>
<div class="fs-radio">
  <input type="radio" name="periodo" class="fs-radio-input" id="semana">
  <label for="semana" class="fs-radio-label">Semana</label>
</div>
```

Radios do mesmo grupo compartilham `name` — seleção exclusiva é
comportamento nativo do `<input type="radio">`, sem JS.

## Anatomia

`.fs-radio` (wrapper) > `.fs-radio-input` (oculto via clip) +
`.fs-radio-label` (`<label for="...">`, desenha o círculo via `::before` e
o ponto interno via `::after`).

## Variações

Tamanho: `.fs-radio-sm`, `.fs-radio-lg` no wrapper.

## Estados

- **checked**, **disabled**, validação (`.is-valid`/`.is-invalid`) e foco —
  mesmo padrão do [Checkbox](checkbox.md). Não existe `indeterminate` para
  radio.
- Hover e active também alteram a superfície do círculo vazio e selecionado.
- O controle acompanha `dir="rtl"`, `prefers-reduced-motion` e
  `forced-colors: active`.

## A11y

- `<input type="radio">` nativo com `name` compartilhado — `ArrowUp`/
  `ArrowDown`/`ArrowLeft`/`ArrowRight` movem a seleção **dentro do grupo**
  automaticamente (comportamento do navegador, não do framework).
  `Tab`/`Shift+Tab` entram/saem do grupo de uma vez (o item selecionado, ou
  o primeiro se nenhum estiver selecionado, é o único no fluxo de tab).
- Sempre associe `label` via `for`/`id`.
- Agrupe opções relacionadas com `fieldset`/`legend` e associe instruções ou
  erros por `aria-describedby`.

## API JS

Nenhuma — 100% CSS.

## Tokens

| Token | Fallback | Uso |
|---|---|---|
| `--fs-radio-size` | `18px` | Círculo externo |
| `--fs-radio-dot-size` | `8px` | Ponto selecionado |
| `--fs-radio-radius` | `50%` | Forma circular |
| `--fs-radio-gap` | `--fs-space-2` | Distância até o texto |

## Exemplo

```html
<div class="fs-radio">
  <input type="radio" name="plano" class="fs-radio-input" id="p1" checked>
  <label for="p1" class="fs-radio-label">Mensal</label>
</div>
<div class="fs-radio">
  <input type="radio" name="plano" class="fs-radio-input" id="p2">
  <label for="p2" class="fs-radio-label">Anual</label>
</div>
```

Mockup: [laboratório do componente](../../mockup/forms.html#check-radio-switch).
