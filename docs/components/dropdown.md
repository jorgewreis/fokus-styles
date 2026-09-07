# Dropdown

Menu suspenso posicionado relativo a um gatilho — reposicionamento
automático (flip perto das bordas), navegação por teclado, fecha ao
clicar fora ou `Escape`.

## Visão geral

```html
<div class="fs-dropdown">
  <button type="button" class="fs-btn fs-dropdown-toggle" data-fs="dropdown" data-fs-target="#meu-menu">
    Opções
  </button>
  <div class="fs-dropdown-menu" id="meu-menu">
    <a href="#" class="fs-dropdown-item">Editar</a>
    <a href="#" class="fs-dropdown-item">Duplicar</a>
    <div class="fs-dropdown-divider"></div>
    <a href="#" class="fs-dropdown-item">Excluir</a>
  </div>
</div>
```

Sem `data-fs-target`, o menu é o próximo irmão do gatilho no HTML — usar
`data-fs-target` é mais explícito e não exige ordem específica no DOM (o
JS move o menu pra `<body>` na inicialização, pra escapar de
`overflow: hidden` de containers ancestrais).

## Anatomia

`.fs-dropdown` (posicionamento relativo, opcional — só necessário se você
não usa `data-fs-target`) > gatilho (`.fs-dropdown-toggle`, qualquer
elemento clicável) + `.fs-dropdown-menu` > `.fs-dropdown-item` (link ou
botão), `.fs-dropdown-divider` (separador), `.fs-dropdown-header` (rótulo
de grupo, sem interação).

## Variações

- **Posicionamento**: `data-placement` (`top`/`bottom`/`left`/`right`,
  padrão `bottom`) e `data-align` (`start`/`end`, padrão `start`) no
  gatilho — reposiciona automaticamente (flip) se não couber na direção
  pedida.

```html
<button class="fs-btn fs-dropdown-toggle" data-fs="dropdown" data-fs-target="#menu2" data-placement="top" data-align="end">
  Opções
</button>
```

## Estados

`.fs-dropdown-item.is-active` (fundo primário), `.fs-dropdown-item.is-disabled`
(opacidade reduzida, sem interação/fora da navegação por seta).

## A11y

O JS aplica automaticamente: `aria-haspopup="menu"` + `aria-expanded` no
gatilho, `role="menu"` no menu. Dentro do menu aberto: `ArrowDown`/
`ArrowUp` navegam entre itens (pulando desabilitados); o primeiro item
recebe foco ao abrir. `Escape` fecha e devolve o foco ao gatilho; clicar
num item fecha e devolve o foco ao gatilho também.

## API JS

Auto-init via `data-fs="dropdown"`. `Dropdown.getInstance(el)` (`el` é o
**gatilho**, não o menu).

| Método | Descrição |
|---|---|
| `show()` | Abre o menu, posiciona, foca o primeiro item, ativa fechamento por clique fora. |
| `hide()` | Fecha o menu. |
| `toggle()` | Alterna entre `show()`/`hide()`. |
| `dispose()` | Fecha se aberto, remove todos os listeners e desregistra a instância. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:dropdown:shown` | Não | Depois de abrir. |
| `fs:dropdown:hidden` | Não | Depois de fechar. |

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-color-text`,
`--fs-color-subtle` (hover), `--fs-color-primary` (item ativo),
`--fs-color-muted` (header/desabilitado), `--fs-radius-md`,
`--fs-shadow-md`.

## Exemplo

```html
<div class="fs-dropdown">
  <button type="button" class="fs-btn fs-btn-outline-secondary fs-dropdown-toggle" data-fs="dropdown" data-fs-target="#acoes">
    Ações
  </button>
  <div class="fs-dropdown-menu" id="acoes">
    <div class="fs-dropdown-header">Conta</div>
    <a href="#" class="fs-dropdown-item">Perfil</a>
    <a href="#" class="fs-dropdown-item is-disabled">Configurações (em breve)</a>
    <div class="fs-dropdown-divider"></div>
    <a href="#" class="fs-dropdown-item">Sair</a>
  </div>
</div>
```

Mockup: [laboratório do componente](../../mockup/overlays-commands.html#dropdown).
