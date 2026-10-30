# List group

## Visão geral

`.fs-list-group` organiza itens verticalmente; `.fs-list-group-item` estiliza
cada item. CSS não mantém seleção, navega rotas nem define papéis ARIA.

## Anatomia e exemplos

Lista de conteúdo estático:

```html
<ul class="fs-list-group">
  <li class="fs-list-group-item">Contrato recebido</li>
  <li class="fs-list-group-item">Documentos conferidos</li>
</ul>
```

Navegação com itens interativos diretos:

```html
<nav class="fs-list-group" aria-label="Seções do escritório">
  <a class="fs-list-group-item is-active" href="/contatos" aria-current="page">Contatos</a>
  <a class="fs-list-group-item" href="/processos">Processos</a>
</nav>
```

Adapte URLs ao aplicativo. Para ações, use botões `type="button"` em um grupo
nomeado, não links sem destino. Links/botões recebem largura total e texto
alinhado ao início. Não crie `li` clicável sem um controle nativo.

## Estados

`.is-active` aplica fundo primary e texto on-primary. Hover aplica subtle
(até em itens estáticos); não significa que um item seja clicável. O aplicativo
atualiza `.is-active` e `aria-current`. Não existe variante disabled própria;
`aria-disabled` em link não bloqueia navegação.

## A11y

Preserve lista ul/li para conteúdo e nav/links para navegação. Nomeie a
navegação e marque a página atual semanticamente. Não use `role="listbox"`
sem implementar seu padrão completo de teclado e seleção. Não há roving Tab
nem navegação por setas nesta API.

## Tokens e limites

Borda/raio: `--fs-color-border`, `--fs-radius-md`. Padding:
`--fs-space-3` e `--fs-space-4`. Cores: `--fs-color-text`,
`--fs-color-surface`, `--fs-color-subtle`, `--fs-color-primary`,
`--fs-color-on-primary`. Não há API JS nem variantes flush/horizontal.

## Verificação

`component-docs-contract.test.js` confere classes e semântica de página atual.
Confira foco, textos longos, contraste dos estados e rotas reais no aplicativo.
