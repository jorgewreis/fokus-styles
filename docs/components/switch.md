# Switch

Toggle liga/desliga 100% CSS, sobre um `<input type="checkbox">` nativo —
semanticamente é um checkbox (representa um estado booleano), só a
aparência muda. Knob **retangular arredondado**, não circular — decisão de
design deliberada (nada circular no framework além de radio/spinner).

## Visão geral

```html
<div class="fs-switch">
  <input type="checkbox" class="fs-switch-input" id="notif" checked>
  <label for="notif" class="fs-switch-label">Notificações</label>
</div>
```

## Anatomia

`.fs-switch` (wrapper) > `.fs-switch-input` (oculto via clip) +
`.fs-switch-label` (`<label for="...">`, desenha o trilho via `::before` e
o knob via `::after`, que desliza com propriedades lógicas e `transition`).

## Variações

Tamanho: `.fs-switch-sm`, `.fs-switch-lg` no wrapper.

## Estados

checked/disabled/foco — mesmo padrão do [Checkbox](checkbox.md). O switch
também possui hover com halo sutil, active com redução discreta do thumb,
valid/invalid opcional para uso em formulário, forced colors e redução de
movimento. O trilho desligado usa superfície neutra e o thumb possui contraste
e elevação próprios. Não há `indeterminate`.

## A11y

- `<input type="checkbox">` nativo — `Space` alterna, leitor de tela
  anuncia como checkbox marcado/desmarcado (não há um role "switch" nativo
  em HTML; usar `type="checkbox"` é a escolha correta e amplamente
  suportada — um `role="switch"` explícito é opcional, não aplicado pelo
  framework).
- Quando não houver texto visível ao lado (ex.: dentro de um
  [Tile](tile.md), como no exemplo abaixo), use `aria-label` no `<input>`
  em vez de deixar a `<label>` vazia.
- O Fokus Styles não injeta `role="switch"`: o contrato oficial continua
  sendo o checkbox nativo, com `Space` e anúncio de marcado/desmarcado.

```html
<div class="fs-switch">
  <input type="checkbox" class="fs-switch-input" id="s1" aria-label="Ativar tema escuro">
  <label for="s1" class="fs-switch-label"></label>
</div>
```

## API JS

Nenhuma — 100% CSS.

## Tokens

| Token | Fallback | Uso |
|---|---|---|
| `--fs-switch-track-width` | `40px` | Largura do trilho |
| `--fs-switch-track-height` | `24px` | Altura do trilho |
| `--fs-switch-thumb-width` | `18px` | Largura do knob |
| `--fs-switch-thumb-height` | `18px` | Altura do knob |
| `--fs-switch-thumb-offset` | `3px` | Posição desligada |
| `--fs-switch-on-offset` | `19px` | Posição ligada |
| `--fs-switch-radius` | `--fs-radius-md` | Raio do trilho |
| `--fs-switch-thumb-radius` | `--fs-radius-sm` | Raio do knob |
| `--fs-switch-gap` | `--fs-space-2` | Distância até o texto |
| `--fs-switch-track-bg` | `--fs-color-subtle` | Fundo desligado |
| `--fs-switch-track-border` | `--fs-color-border-default` | Borda do trilho |
| `--fs-switch-track-checked-bg` | `--fs-color-primary` | Fundo ligado |
| `--fs-switch-thumb-bg` | `--fs-color-surface` | Fundo do knob |
| `--fs-switch-thumb-border` | `--fs-color-border-default` | Borda do knob |
| `--fs-switch-thumb-shadow` | `--fs-shadow-sm` | Elevação do knob |
| `--fs-switch-track-shadow` | Sombra interna sutil | Profundidade do trilho desligado |
| `--fs-switch-hover-ring` | Mistura de primary com transparente | Halo de hover |
| `--fs-switch-hover-shadow` | Halo baseado em `--fs-switch-hover-ring` | Sombra de hover |
| `--fs-switch-active-scale` | `0.92` | Escala do knob durante active |

## Exemplo

```html
<div class="fs-switch">
  <input type="checkbox" class="fs-switch-input" id="sw1">
  <label for="sw1" class="fs-switch-label">Desligado</label>
</div>
<div class="fs-switch">
  <input type="checkbox" class="fs-switch-input" id="sw2" checked>
  <label for="sw2" class="fs-switch-label">Ligado</label>
</div>
```

Mockup: [laboratório do componente](../../mockup/forms.html#check-radio-switch).
Uso combinado com Tile: [laboratório de conteúdo e dados](../../mockup/content-data.html#tile).
