# Navbar

Barra de navegação horizontal estática — marca de um lado, links do outro.
Versão "crua": sem collapse/hambúrguer próprio para mobile e sem dropdown
embutido; para um menu suspenso dentro da navbar, combine com
[Dropdown](dropdown.md).

## Visão geral

```html
<nav class="fs-navbar">
  <a href="#" class="fs-navbar-brand">Minha Marca</a>
  <ul class="fs-navbar-nav">
    <li><a href="#" class="fs-nav-link is-active">Início</a></li>
    <li><a href="#" class="fs-nav-link">Produtos</a></li>
    <li><a href="#" class="fs-nav-link is-disabled">Em breve</a></li>
  </ul>
</nav>
```

## Anatomia

`.fs-navbar` (flex, `justify-content: space-between`, quebra linha se não
houver espaço) > `.fs-navbar-brand` (nome/logo) + `.fs-navbar-nav`
(`<ul>` sem marcadores) > `<li>` > `.fs-nav-link`.

`.fs-nav-link` é compartilhado com [Tabs](tabs.md) — o mesmo estilo de
link de navegação serve pros dois contextos.

## Variações

Nenhuma variação de cor/tamanho — a navbar é sempre o mesmo visual; a
composição (o que vai dentro) que muda.

## Estados

- `.fs-nav-link.is-active` — destaque de cor primária + peso de fonte
  maior.
- `.fs-nav-link.is-disabled` — cor muted, não clicável.

## A11y

O padrão responsivo usa `.fs-navbar-toggler`, `.fs-navbar-collapse` e `data-fs-target`.
Mantenha `aria-expanded` e um nome acessível no botão.

- Use `<nav>` como elemento raiz (já no exemplo) — landmark de navegação
  pra leitores de tela.
- Se houver mais de uma navbar na página, diferencie com
  `aria-label="Navegação principal"` (ou similar) em cada `<nav>`.

## API JS

Nenhuma — 100% CSS.

## Tokens

`--fs-color-border` (borda inferior), `--fs-color-surface` (fundo),
`--fs-color-text`, `--fs-color-primary` (ativo), `--fs-color-muted`
(desabilitado), `--fs-radius-sm` (hover do link).

## Exemplo

```html
<nav class="fs-navbar" aria-label="Navegação principal">
  <a href="#" class="fs-navbar-brand">FokusStyles</a>
  <ul class="fs-navbar-nav">
    <li><a href="#" class="fs-nav-link is-active">Dashboard</a></li>
    <li><a href="#" class="fs-nav-link">Relatórios</a></li>
    <li><a href="#" class="fs-nav-link">Configurações</a></li>
  </ul>
</nav>
```

Mockup: [laboratório do componente](../../mockup/navigation-disclosure.html#navbar).
