# Input Group

Funde um [Input](input.md) (ou Select, ou Button) com "addons" de texto/
ícone de prefixo/sufixo — 100% CSS, reaproveita os tokens visuais do
próprio `.fs-form-control` (borda, cor, raio).

## Visão geral

```html
<div class="fs-input-group">
  <span class="fs-input-group-text">R$</span>
  <input type="number" class="fs-form-control">
</div>
```

## Anatomia

`.fs-input-group` (flex, `align-items: stretch` — a altura do addon
acompanha a do controle automaticamente) > qualquer combinação de
`.fs-form-control`/`.fs-form-select`/`.fs-btn` + `.fs-input-group-text`
(addon de texto/ícone estático). As bordas dos itens adjacentes se fundem
(sem borda dupla), com o item focado subindo por cima (`z-index`) pra sua
borda de foco não ficar parcialmente escondida atrás do vizinho.

## Variações

Tamanho: `.fs-input-group-sm`, `.fs-input-group-lg` no
`.fs-input-group` — redimensiona **todos** os filhos de uma vez (controle
+ addons), não precisa repetir `-sm`/`-lg` em cada um.

```html
<div class="fs-input-group fs-input-group-sm">
  <span class="fs-input-group-text">@</span>
  <input type="text" class="fs-form-control">
</div>
```

## Estados

Nenhum próprio — herda os estados do `.fs-form-control`/`.fs-form-select`
interno (foco, disabled, validação).

## A11y

O addon (`.fs-input-group-text`) é só visual — se o texto dele for
essencial pra entender o campo (não decorativo), associe ao input via
`aria-describedby` com um `id` no addon, igual a um texto de apoio comum.

## API JS

Nenhuma — 100% CSS.

## Tokens

Os mesmos de [Input](input.md) — `--fs-color-border`,
`--fs-color-surface`, `--fs-color-subtle` (addon), `--fs-color-muted`
(texto do addon), `--fs-radius-sm`.

## Exemplo

```html
<div class="fs-input-group">
  <span class="fs-input-group-text" id="addon-url">https://</span>
  <input type="text" class="fs-form-control" aria-describedby="addon-url" placeholder="seusite.com">
</div>

<div class="fs-input-group">
  <input type="text" class="fs-form-control" placeholder="Buscar...">
  <button type="button" class="fs-btn">Buscar</button>
</div>
```

Mockup: [laboratório do componente](../../mockup/forms.html#input-group).
