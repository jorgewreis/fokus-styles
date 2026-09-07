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
o knob via `::after`, que desliza com `left` + `transition`).

## Variações

Tamanho: `.fs-switch-sm`, `.fs-switch-lg` no wrapper.

## Estados

checked/disabled/foco — mesmo padrão do [Checkbox](checkbox.md). O switch
também possui hover, active, valid/invalid opcional para uso em formulário,
forced colors e redução de movimento. Não há `indeterminate`.

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
| `--fs-switch-track-width` | `36px` | Largura do trilho |
| `--fs-switch-track-height` | `20px` | Altura do trilho |
| `--fs-switch-thumb-width` | `16px` | Largura do knob |
| `--fs-switch-thumb-height` | `14px` | Altura do knob |
| `--fs-switch-thumb-offset` | `2px` | Posição desligada |
| `--fs-switch-on-offset` | `18px` | Posição ligada |
| `--fs-switch-radius` | `--fs-radius-md` | Raio do trilho |
| `--fs-switch-thumb-radius` | `--fs-radius-sm` | Raio do knob |
| `--fs-switch-gap` | `--fs-space-2` | Distância até o texto |

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

Mockup: [laboratório do componente](../../mockup/content-data.html#tile).
Uso combinado com Tile: [laboratório de conteúdo e dados](../../mockup/content-data.html#tile).
