# Scrollspy

## Visão geral

`data-fs="scrollspy"` no elemento de navegação destaca o link da seção visível.
Carregue o JavaScript do Fokus Styles e use IDs de seções existentes:

```html
<nav data-fs="scrollspy" aria-label="Nesta página">
  <a href="#introducao">Introdução</a>
  <a href="#detalhes">Detalhes</a>
</nav>
<section id="introducao"><h2>Introdução</h2></section>
<section id="detalhes"><h2>Detalhes</h2></section>
```

## Estados

O módulo JS aplica `.is-active` e emite `fs:scrollspy:activate` na navegação,
com `event.detail.section`. Usa IntersectionObserver quando disponível e
um listener de rolagem como fallback.

## A11y

Use uma navegação nomeada, mantenha foco visível e não remova a indicação textual do destino.
O módulo não move o foco nem adiciona `aria-current` automaticamente.

## API JS

`FokusStyles.Scrollspy.getInstance(navEl)` retorna a instância auto-inicializada.
`activate(sectionEl)` destaca uma seção explicitamente; `dispose()` desconecta
o observer/listener e remove o registro da instância.
