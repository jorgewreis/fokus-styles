# Empty State

Bloco padrão para listas/telas vazias ("nenhum resultado", "nada aqui
ainda") — 100% CSS.

## Visão geral

```html
<div class="fs-empty-state">
  <div class="fs-empty-state-icon" aria-hidden="true">
    <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
  </div>
  <h3 class="fs-empty-state-title">Nenhum resultado encontrado</h3>
  <p class="fs-empty-state-text">Tente ajustar os filtros ou buscar por outro termo.</p>
  <button type="button" class="fs-btn fs-btn-primary">Limpar filtros</button>
</div>
```

## Anatomia

`.fs-empty-state` (contêiner centralizado em coluna) > `.fs-empty-state-icon`
(slot vazio — ícone SVG, [`fokus-styles/icons`](../guides/icons.md) recomendado,
ou imagem/ilustração própria, sem variantes fixas de estado)
+ `.fs-empty-state-title` + `.fs-empty-state-text` (opcional) + ação
opcional (reusa [Button](button.md), não é parte do componente).

## Variações

Nenhuma — o componente é deliberadamente sem modificadores; a variação vem
do conteúdo que você põe dentro do slot de ícone.

## Estados

Nenhum — elemento estático.

## A11y

Se o Empty State substitui uma lista que normalmente teria itens (ex.:
resultado de busca), considere `aria-live="polite"` no contêiner pai se ele
aparece dinamicamente após uma ação do usuário (busca, filtro), para
leitores de tela anunciarem a mudança.

## API JS

Nenhuma — 100% CSS.

## Tokens

`--fs-color-subtle`/`--fs-color-muted` (ícone), `--fs-color-text` (título),
`--fs-color-muted` (texto).

## Exemplo

```html
<div class="fs-empty-state">
  <div class="fs-empty-state-icon" aria-hidden="true">
    <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
  </div>
  <h3 class="fs-empty-state-title">Nada por aqui ainda</h3>
  <p class="fs-empty-state-text">Quando você criar seu primeiro projeto, ele aparece nesta lista.</p>
  <button type="button" class="fs-btn fs-btn-primary">Criar projeto</button>
</div>
```

Mockup: [laboratório do componente](../../mockup/feedback-actions.html#empty-state).
