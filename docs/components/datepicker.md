# Datepicker / Timepicker

Duas abordagens complementares: **CSS-only**
(`<input type="date">`/`<input type="time">` nativo, só estilizado) para
quem quer o seletor do próprio sistema operacional/navegador, e um
**Datepicker JS customizado** (`.fs-datepicker`) para quando o design
precisa de controle total sobre a aparência do calendário — os nativos não
podem ser restilizados além de cor/borda/fonte do campo (o popup em si é
chrome do navegador, fora do alcance de CSS).

## Visão geral

### CSS-only (`<input type="date">`/`"time"`)

```html
<input type="date" class="fs-form-control">
<input type="time" class="fs-form-control">
```

Herdam `.fs-form-control` normalmente (borda, fundo, foco). A única
correção específica do framework é o indicador nativo (ícone de
calendário/relógio) no tema escuro — por padrão o navegador desenha um
ícone escuro fixo, invisível sobre `--fs-color-surface` escuro; o FokusStyles
aplica `filter: invert(1)` nele sob `[data-theme="dark"]`.

### Datepicker customizado (JS)

```html
<div class="fs-datepicker">
  <input type="text" class="fs-form-control" data-fs="datepicker" data-fs-target="#dp-entrega" placeholder="dd/mm/aaaa">
</div>
<div id="dp-entrega"></div>
```

O elemento apontado por `data-fs-target` é o painel do calendário — fica
vazio no HTML, o JS constrói o cabeçalho (mês/ano + navegação) e a grade de
dias dinamicamente a cada abertura/troca de mês. Se o `<input>` já tiver um
valor em `dd/mm/aaaa` (formato de exibição, pt-BR), o Datepicker abre no mês
correspondente com o dia já marcado como selecionado.

## Anatomia

`.fs-datepicker` (wrapper posicionador) > `input[role="combobox"]` +
`.fs-datepicker-panel` (reanexado a `document.body`, posicionado via
`packages/fokus-js/js/core/positioning.js`) > `.fs-datepicker-header` (`.fs-datepicker-nav` ×2 +
`.fs-datepicker-title`) + `.fs-datepicker-grid[role="grid"]` (uma
`.fs-datepicker-week[role="row"]` por semana, cada uma com 7
`.fs-datepicker-day[role="gridcell"]`).

## Variações

- Dias fora do mês corrente (preenchendo a primeira/última semana):
  `.fs-datepicker-day.is-outside`.
- Sem suporte a `min`/`max` (intervalo de datas permitido) nesta versão —
  todo dia é selecionável.

## Estados

- `.is-today`: contorno sutil no dia atual.
- `.is-selected`: preenchimento sólido na cor de ação primária (mesmo
  `color-contrast()` dos demais preenchimentos sólidos do framework).
- `:disabled`: dia desabilitado (não gerado automaticamente hoje — para uso
  manual caso você desabilite dias específicos via JS próprio).

## A11y

Segue o padrão [WAI-ARIA Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
adaptado (sem o modal — o painel é um popup não-modal, mesma filosofia do
[Combobox](combobox.md)/[Dropdown](dropdown.md)):

- `role="combobox"` + `aria-haspopup="grid"` + `aria-expanded` +
  `aria-controls` no input — `aria-expanded` só é permitido em roles como
  `combobox`/`button`, por isso o `role="combobox"` é necessário mesmo o
  input não filtrando nada (diferente do Combobox de verdade).
- `role="grid"`/`role="row"`/`role="gridcell"` na grade — ao contrário do
  Combobox, os dias **são** focáveis de verdade (roving `tabindex`: só o
  dia selecionado/hoje/primeiro do mês tem `tabindex="0"`).
- Teclado (com o painel aberto):
  - `ArrowDown`/`ArrowUp` com foco no input: abre o painel (se fechado) e
    move o foco pro dia tabável — sem isso, as setas não teriam efeito
    nenhum vindas do input.
  - `ArrowRight`/`ArrowLeft`: dia seguinte/anterior (cruza mês).
  - `ArrowDown`/`ArrowUp` com foco num dia: mesma semana, ±7 dias.
  - `Home`/`End`: primeiro/último dia da semana atual.
  - `PageDown`/`PageUp`: mês seguinte/anterior. `Shift+PageDown`/
    `Shift+PageUp`: ano seguinte/anterior.
  - `Enter`/`Space`: seleciona o dia com foco.
  - `Escape`: fecha o painel sem alterar o valor do input, devolve o foco
    a ele.
- Título do mês/ano (`aria-live="polite"`) anuncia a troca ao navegar.

## API JS

Auto-init via `data-fs="datepicker"` **no `<input>`**, com `data-fs-target`
apontando pro painel (convenção idêntica ao Dropdown/Combobox).
`Datepicker.getInstance(inputEl)`.

| Método | Descrição |
|---|---|
| `show()` | Abre o painel, renderiza o mês do valor atual (ou o mês corrente). |
| `hide()` | Fecha o painel. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove listeners, desregistra a instância. |

| Propriedade | Descrição |
|---|---|
| `value` | Data selecionada em ISO (`aaaa-mm-dd`), `null` até a primeira seleção. |

| Evento (no input) | Cancelável | Quando |
|---|---|---|
| `change` (nativo) | Não | Ao selecionar um dia (clique ou `Enter`/`Space`). |
| `fs:datepicker:changed` | Não | Mesmo momento, com `event.detail.value` (ISO) e `event.detail.date` (`Date`). |
| `fs:datepicker:shown` | Não | Depois de abrir o painel. |
| `fs:datepicker:hidden` | Não | Depois de fechar. |

## Tokens

Reusa `--fs-color-border`/`-surface`/`-text`/`-muted`/`-primary`,
`--fs-radius-sm`/`-md` e `--fs-shadow-md` — sem tokens próprios.

## Exemplo

```html
<div class="fs-datepicker">
  <input type="text" class="fs-form-control" id="entrega" data-fs="datepicker" data-fs-target="#entrega-painel" placeholder="dd/mm/aaaa">
</div>
<div id="entrega-painel"></div>
<script>
  document.getElementById("entrega").addEventListener("fs:datepicker:changed", (e) => {
    console.log("data escolhida:", e.detail.value); // "2026-07-20"
  });
</script>
```

Mockup: [laboratório do componente](../../mockup/forms.html#datepicker) (inclui o
Datepicker customizado e os `<input type="date">`/`"time"` nativos lado a
lado).
