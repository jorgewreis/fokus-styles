# Navbar

Barra de navegação com composição estática ou menu recolhível responsivo.
Para menus suspensos internos, combine com [Dropdown](dropdown.md).

## Visão geral

O exemplo abaixo requer o CSS e o JavaScript do Fokus Styles. Em telas abaixo
 de 768px, o botão abre o menu; a partir de 768px, o CSS mantém o menu visível.

```html
<nav class="fs-navbar" data-fs="navbar" aria-label="Navegação principal">
  <a href="/" class="fs-navbar-brand">Minha Marca</a>
  <button type="button" class="fs-navbar-toggler" data-fs-toggle="navbar"
          data-fs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false">
    Menu
  </button>
  <div id="menuPrincipal" class="fs-navbar-collapse" hidden>
    <ul class="fs-navbar-nav">
      <li><a href="/" class="fs-nav-link is-active" aria-current="page">Início</a></li>
      <li><a href="/produtos" class="fs-nav-link">Produtos</a></li>
    </ul>
  </div>
</nav>
```

## Anatomia

`.fs-navbar` contém marca, botão `.fs-navbar-toggler` e painel
`.fs-navbar-collapse`. O painel contém `.fs-navbar-nav` e `.fs-nav-link`.
`data-fs="navbar"` pertence ao `<nav>`; `data-fs-toggle="navbar"` e
`data-fs-target` pertencem ao botão. Use IDs únicos para cada painel.

## Variações

Para navegação sempre visível, omita o botão, o painel collapse e `data-fs`;
coloque `.fs-navbar-nav` diretamente no `<nav>`. Essa composição não requer JS.
Não existem variantes de cor ou tamanho próprias da Navbar.

## Estados

- `.fs-navbar-collapse.is-open` — painel aberto em telas pequenas.
- `.fs-nav-link.is-active` — destaque visual; acrescente `aria-current="page"`.
- `.fs-nav-link.is-disabled` — aparência e bloqueio do ponteiro, não do teclado.
  Para itens indisponíveis, prefira texto sem `href` e `aria-disabled="true"`.

## A11y

Use `<nav>` nomeado e um botão real com texto acessível, `aria-controls` e
`aria-expanded="false"` inicial. O JS atualiza `aria-expanded`; Escape dentro
do painel o fecha e devolve foco ao botão. Não use `role="menu"` para links
comuns de navegação. Teste também a transição entre larguras de tela.

## API JS

```js
const navbar = FokusStyles.Navbar.getInstance(document.querySelector('[data-fs="navbar"]'));
navbar.show();
navbar.hide();
navbar.toggle();
navbar.isOpen(); // estado do collapse, não a visibilidade imposta pelo breakpoint
navbar.dispose();
```

`new FokusStyles.Navbar(navEl)` permite inicialização manual. `getInstance`
recebe o `<nav>`, não o botão. `show()`/`hide()` emitem `fs:shown`/`fs:hidden`
no `<nav>` com propagação. `dispose()` remove listeners e registro, sem remover HTML.

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-color-text`,
`--fs-alert-primary-text`, `--fs-color-muted`, `--fs-radius-sm`.

Mockup: [laboratório do componente](../../mockup/navigation-disclosure.html#navbar).
