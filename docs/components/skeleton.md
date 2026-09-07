# Skeleton

Placeholder de carregamento — 100% CSS, sem JS (você troca pelo conteúdo
real quando os dados chegam).

## Visão geral

```html
<div class="fs-skeleton fs-skeleton-text"></div>
<div class="fs-skeleton fs-skeleton-text"></div>
<div class="fs-skeleton fs-skeleton-circle" style="width: 48px; height: 48px;"></div>
```

## Anatomia

`.fs-skeleton` (base — cor + animação de pulso) combinado com uma forma:
`.fs-skeleton-text` (linha de texto, 1em de altura; o último de uma
sequência automaticamente encolhe pra 80% de largura, imitando o fim de um
parágrafo), `.fs-skeleton-circle` (avatar), `.fs-skeleton-rect` (bloco/
imagem). Tamanho de circle/rect é livre — defina `width`/`height` via
`style` inline ou classe própria.

## Variações

`.fs-skeleton-wave` — em vez de pulsar a opacidade inteira, varre um
brilho da esquerda pra direita (substitui a animação padrão, não combine
os dois).

```html
<div class="fs-skeleton fs-skeleton-rect fs-skeleton-wave" style="width: 100%; height: 120px;"></div>
```

## Estados

Nenhum — é ele mesmo um estado (de carregamento) de outro conteúdo.
Anima infinitamente enquanto presente no DOM; remova/substitua quando os
dados reais chegarem.

## A11y

As variantes `.fs-skeleton-card`, `.fs-skeleton-table` e `.fs-skeleton-avatar` são visuais;
anuncie o carregamento no contêiner com `aria-busy="true"`.

A animação para automaticamente sob `prefers-reduced-motion: reduce`
(fica estática, sem pulso/varredura). Se o carregamento for anunciado a
leitores de tela, envolva o conjunto de skeletons num contêiner com
`aria-busy="true"` (e remova ao trocar pelo conteúdo real) — não aplicado
automaticamente.

## API JS

Nenhuma — 100% CSS.

## Tokens

`--fs-color-subtle` (cor de base), `--fs-radius-sm`/`-md`.

## Exemplo

```html
<div class="fs-tile" aria-busy="true">
  <div class="fs-skeleton fs-skeleton-circle" style="width: 40px; height: 40px;"></div>
  <div class="fs-tile-body" style="width: 100%;">
    <div class="fs-skeleton fs-skeleton-text" style="width: 60%;"></div>
    <div class="fs-skeleton fs-skeleton-text"></div>
  </div>
</div>
```

Mockup: [laboratório do componente](../../mockup/feedback-actions.html#skeleton).
