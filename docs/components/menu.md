# Menu

## Visão geral

Navegação vertical contextual para áreas laterais, configurações e grupos de
destinos relacionados.

## Estrutura

```html
<nav class="fs-menu" aria-label="Configurações">
  <p class="fs-menu-label">Conta</p>
  <ul class="fs-menu-list">
    <li><a href="/perfil" aria-current="page">Perfil</a></li>
    <li><a href="/seguranca">Segurança</a></li>
  </ul>
</nav>
```

Use links para navegação. Para ações locais, prefira Button ou Dropdown. O
menu suporta listas aninhadas, itens ativos e itens indisponíveis.

## Classes

| Classe | Uso |
|---|---|
| `.fs-menu` | contêiner do menu vertical; use `nav` ou `aside` com nome acessível |
| `.fs-menu-label` | título visual de uma seção |
| `.fs-menu-list` | lista de links; pode conter `ul` aninhado |
| `.fs-menu-bordered` | superfície com borda e sombra discreta |
| `.fs-menu-compact` | menor densidade vertical |
| `.is-active` | destino ativo quando não houver `aria-current` |

## Estados

O menu suporta destino ativo, níveis aninhados, densidade compacta, superfície
com borda e links temporariamente indisponíveis.

## A11y

- Use `aria-label` ou `aria-labelledby` no `nav`/`aside`.
- Use `aria-current="page"` no destino atual.
- Não comunique o estado apenas por cor.
- Mantenha links reais com `href` para navegação por teclado e contexto de
  leitor de tela.
- Use `aria-disabled="true"` apenas para um destino temporariamente
  indisponível e ofereça uma alternativa quando necessário.
