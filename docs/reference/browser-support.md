# Suporte a navegadores

O Fokus Styles mira um alvo **moderno com fallback progressivo**: as duas
últimas versões dos navegadores principais, com piso mínimo garantido em
**Safari/iOS Safari 16.4**. Não há suporte a Internet Explorer.

## Alvo (`.browserslistrc`)

```text
last 2 Chrome versions
last 2 Edge versions
last 2 Firefox versions
Firefox ESR
last 2 Safari versions
Safari >= 16.4
last 2 iOS versions
iOS >= 16.4
not dead
not IE 11
```

Esse alvo alimenta o Autoprefixer no build (`scripts/build.mjs`), então
prefixos são adicionados automaticamente apenas onde o alvo ainda exige.

## Por que Safari 16.4 é o piso

É a versão mínima com suporte estável a todos os recursos usados pela base
do framework — `@layer` (Safari 16.4) e `color-mix()`/OKLCH (Safari 16.4)
são os dois recursos que fixam esse piso; sem eles, o piso seria mais baixo.

## Matriz de compatibilidade por feature

Diferente do alvo geral acima (que é sobre *quais navegadores testamos*),
esta tabela é sobre *o que acontece em navegadores fora do alvo* —
navegador mínimo com suporte nativo e o comportamento de fallback
documentado (não "quebra silenciosamente") para cada recurso moderno
usado no CSS/JS do framework.

| Feature | Uso no FokusStyles | Suporte nativo mínimo | Comportamento sem suporte |
|---|---|---|---|
| `@layer` (cascade layers) | Organiza `reset/tokens/base/layout/components/utilities/overrides` (`packages/fokus-core/scss/tokens/_root.scss:8`; ver [scss-architecture.md](scss-architecture.md)) | Safari 16.4, Chrome 99, Firefox 97, Edge 99 | Todas as regras caem para a cascata padrão (ordem de origem + especificidade). Como o SCSS já é organizado na mesma ordem lógica das camadas, a degradação visual é mínima — sem garantia formal de paridade pixel-a-pixel, mas sem quebra funcional. |
| `color-mix()` / `oklch()` | Tokens de cor gerados em OKLCH, dentro de um bloco `@supports (color: oklch(0% 0 0))` (`packages/fokus-core/scss/tokens/_root.scss:73`); usado também nos temas `data-theme="dark"` e `data-fs-brand="*"` | Safari 16.4, Chrome 111, Firefox 113, Edge 111 | `@supports` faz a detecção — navegadores sem suporte simplesmente ignoram o bloco OKLCH inteiro e usam os valores hex sRGB declarados antes dele (mesmas cores, aproximação visual, não pixel-perfect). Não é uma feature isolada: é o mecanismo de fallback de **todos** os tokens de cor do framework. |
| `@container` (container queries) | Utilitários opt-in `.fs-u-cq`/`.fs-u-cq-{sm,md,lg}-d-*` (`packages/fokus-utilities/scss/utilities/_container-queries.scss`); ver [layout-advanced.md](../guides/layout-advanced.md) | Safari 16.0, Chrome 105, Firefox 110, Edge 105 | Sem suporte, o `@container` inteiro é ignorado pelo navegador — os elementos permanecem no `display` padrão do HTML (ex.: `<div>` como `block`), sem a responsividade condicionada à largura do container. Como é opt-in (só afeta quem usa `.fs-u-cq-*`), não há regressão em quem não usa esses utilitários. |
| Propriedades customizadas (`--fs-*`) | Tokens em todas as camadas (cor, espaçamento, raio, sombra, tipografia) | Suportado desde 2017 em todos os navegadores principais (abaixo do piso Safari 16.4) | Não relevante ao alvo atual — nenhum navegador do alvo (`.browserslistrc`) carece desse suporte. |
| `:focus-visible` | Anel de foco acessível (mixin `focus-ring`, `packages/fokus-core/scss/tools/_mixins.scss`), usado em botões, inputs, itens de menu/tree, etc. | Safari 15.4, Chrome 86, Firefox 85, Edge 86 (abaixo do piso Safari 16.4) | Não relevante ao alvo atual pelo mesmo motivo — mas caso um navegador não suporte, o seletor inteiro é ignorado (sem erro), só o anel de foco customizado some; o `outline` nativo do navegador permanece como fallback funcional (não visual). |
| `prefers-reduced-motion` | Desliga animações de skeleton/carousel/transições (`packages/fokus-js/js/core/transition.js`, `_skeleton.scss`) | Suportado desde 2019 em todos os navegadores principais (abaixo do piso Safari 16.4) | Não relevante ao alvo atual. Em navegadores sem suporte à media query, a regra é ignorada e as animações continuam ativas por padrão (comportamento seguro: anima por padrão, só desliga quando o recurso E a preferência do usuário existem). |

### Recursos considerados, mas não usados hoje

Para não deixar dúvida sobre lacunas silenciosas: `:has()` e
`@custom-media` (as duas features citadas com mais frequência ao lado de
`@container`/`color-mix()` em discussões sobre CSS moderno) **não são
usadas em nenhuma linha do framework atualmente** — não há necessidade
técnica identificada até a v1.0.0. Se/quando entrarem, esta tabela ganha
uma linha nova no mesmo formato antes do merge.

## Fallback progressivo (resumo)

- **Cores**: OKLCH com fallback em hex sRGB via `@supports` (ver tabela
  acima) — nunca "quebra", só perde precisão de mistura de cor.
- **`@layer`**: degrada para cascata padrão, sem garantia formal de
  paridade visual mas sem quebra funcional.
- **`@container`**: opt-in; sem suporte, os elementos ficam no `display`
  HTML padrão.
- Sem polyfills: o projeto não inclui polyfills de CSS; navegadores fora
  do alvo (`.browserslistrc`) devem ser tratados como não suportados, não
  como "degradados".

## Testes

A regressão visual (`npm run test:visual`, Playwright + Chromium) cobre o
navegador mais permissivo do alvo. Não há cobertura automatizada de
Safari/Firefox no momento — mudanças que dependem de recursos recentes
(a tabela acima) devem ser verificadas manualmente nesses engines antes
do release.
