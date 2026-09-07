# Segmented Control

Grupo de botões com estado selecionado — alternativa compacta a radio
buttons/tabs para poucas opções mutuamente exclusivas (ou não). 100% CSS,
mesma técnica de input oculto + label irmã.

## Visão geral

```html
<div class="fs-segmented-control">
  <div class="fs-segmented-item">
    <input type="radio" name="periodo" class="fs-segmented-input" id="p-dia" checked>
    <label for="p-dia" class="fs-segmented-label">Dia</label>
  </div>
  <div class="fs-segmented-item">
    <input type="radio" name="periodo" class="fs-segmented-input" id="p-semana">
    <label for="p-semana" class="fs-segmented-label">Semana</label>
  </div>
  <div class="fs-segmented-item">
    <input type="radio" name="periodo" class="fs-segmented-input" id="p-mes">
    <label for="p-mes" class="fs-segmented-label">Mês</label>
  </div>
</div>
```

## Anatomia

`.fs-segmented-control` (contêiner, borda externa única) >
`.fs-segmented-item` (um por opção) > `.fs-segmented-input`
(`<input>`, oculto via clip) + `.fs-segmented-label` (`<label for="...">`).

## Variações

- **Exclusivo vs. inclusivo**: use `<input type="radio">` com o mesmo
  `name` (só uma opção selecionada por vez — como no exemplo) ou
  `<input type="checkbox">` (cada item seleciona/deseleciona
  independentemente).
- **Tamanho**: `.fs-segmented-control-sm`, `.fs-segmented-control-lg`; sem
  sufixo = padrão (38px de altura).

```html
<div class="fs-segmented-control fs-segmented-control-sm">...</div>
```

## Estados

- **checked**: item selecionado ganha fundo/texto na cor primária.
- **disabled**: no input — opacidade reduzida, sem interação.
- **Foco**: anel sobre o item focado (`z-index` elevado pra não ficar
  parcialmente escondido pela borda do vizinho).

## A11y

`<input>` nativo (radio ou checkbox) — toda a semântica de grupo (seleção
exclusiva com radio, navegação por seta entre itens do mesmo `name`) vem
do navegador, sem JS. Sempre associe `label` via `for`/`id`.

## API JS

Nenhuma — 100% CSS.

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-color-subtle` (hover),
`--fs-color-primary` (selecionado), `--fs-radius-sm`.

## Exemplo

```html
<div class="fs-segmented-control">
  <div class="fs-segmented-item">
    <input type="checkbox" class="fs-segmented-input" id="f-ativo" checked>
    <label for="f-ativo" class="fs-segmented-label">Ativos</label>
  </div>
  <div class="fs-segmented-item">
    <input type="checkbox" class="fs-segmented-input" id="f-arquivado">
    <label for="f-arquivado" class="fs-segmented-label">Arquivados</label>
  </div>
</div>
```

Mockup: [laboratório do componente](../../mockup/forms.html#segmented-control).
