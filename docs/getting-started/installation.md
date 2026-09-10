# Instalação

## Via npm

```bash
npm install fokus-styles
```

## Via CDN

Sem instalar nada, direto do jsDelivr ou unpkg:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fokus-styles/dist/css/fokus.css">
<script src="https://cdn.jsdelivr.net/npm/fokus-styles/dist/js/fokus.js"></script>
```

Troque `fokus.css`/`fokus.js` por `fokus.min.css`/`fokus.min.js` para as
versões minificadas em produção.

## Fontes self-hosted

Plus Jakarta Sans (sans) e Source Code Pro (mono) são distribuídas à parte,
em `fonts.css`, para não forçar o download das fontes em quem prefere usar
as próprias. Inclua **antes** do CSS principal:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fokus-styles/dist/css/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fokus-styles/dist/css/fokus.css">
```

Sem `fonts.css`, a tipografia cai no fallback `sans-serif`/`monospace` do
sistema — nada quebra, só muda a fonte.

## Distribuições disponíveis

O pacote publica o bundle completo (`fokus.css`) e distribuições granulares,
para quem não precisa do framework inteiro:

| Arquivo | Conteúdo |
|---|---|
| `dist/css/fokus.css` | Bundle completo: tokens, reset, layout, forms, components, utilities, tema escuro. |
| `dist/css/layout.css` | Só grid/containers (+ tokens/reset/tema). |
| `dist/css/forms.css` | Só formulários (+ tokens/reset/tema). |
| `dist/css/components.css` | Só componentes prontos (+ tokens/reset/tema). |
| `dist/css/helpers.css` | Bundle de compatibilidade com os utilitários atômicos históricos. |
| `dist/css/fokus-helpers.css` | Helpers semânticos isolados, como aspect, object, safe-area e color-scheme. |
| `dist/css/fonts.css` | Só os `@font-face` self-hosted (opcional, ver acima). |
| `dist/js/fokus.js` | Todo o JavaScript dos componentes interativos, IIFE global `FokusStyles`. |

Cada distribuição CSS granular já inclui tokens, reset e tema escuro
completos — pode ser usada isoladamente sem quebrar variáveis ou dark mode.

## Import via Sass

Para compilar com suas próprias variáveis Sass (sobrescrever antes de
compilar, em vez de sobrescrever CSS Custom Properties depois):

```scss
@use "fokus-styles/scss/fokus" with (
  $radius-md: 10px
);
```

Ver [`docs/reference/scss-architecture.md`](../reference/scss-architecture.md)
para a lista completa de variáveis e a organização dos módulos.

## Próximo passo

[Formas de uso](usage.md) — como inicializar componentes interativos e a
convenção de nomenclatura de classes.
