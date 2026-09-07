# Utilitários de impressão

Classes para ajustar o layout quando a página é impressa (`@media print`),
sem exigir uma folha de estilos de impressão separada.

## Classes

- `.fs-u-print-hide` — oculta o elemento só na impressão (`display: none`).
  Útil para navbars, botões de ação, sidebars de navegação.
- `.fs-u-print-only` — oculta o elemento fora da impressão; ele só aparece no
  resultado impresso (ex.: um bloco com URL/data de geração do documento).
- `.fs-u-print-block` / `.fs-u-print-inline` / `.fs-u-print-inline-block` — força um
  valor de `display` só na impressão, útil para reverter um `.fs-u-d-none` (ou
  outro `display` aplicado na tela) especificamente no documento impresso.

```html
<header class="fs-u-print-hide">
  <nav>…</nav>
</header>

<div class="fs-u-print-only">Gerado em fokus-styles.dev — 2026-07-07</div>
```

## Notas

- São utilitários de `display`, não uma folha de estilos de impressão
  completa — não alteram cor, quebra de página ou tamanho de fonte.
- Combinam com os demais utilitários de `display` (`.fs-u-d-*`): a classe de
  impressão só atua dentro de `@media print`, então não conflita com o
  valor aplicado na tela.
