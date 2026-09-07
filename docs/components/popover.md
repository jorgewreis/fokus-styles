# Popover

Painel flutuante com conteúdo rico (header/body/footer, pode conter
elementos interativos) — mesmo posicionamento do [Tooltip](tooltip.md),
aparência de card de superfície em vez do chip escuro.

## Visão geral

```html
<button type="button" class="fs-btn" data-fs="popover" data-fs-target="#meu-popover">
  Mais informações
</button>
<div class="fs-popover" id="meu-popover">
  <div class="fs-popover-header">Título</div>
  <div class="fs-popover-body">Conteúdo detalhado aqui.</div>
</div>
```

## Anatomia

Gatilho (qualquer elemento) + `.fs-popover` > `.fs-popover-header`
(opcional) + `.fs-popover-body` + `.fs-popover-footer` (opcional, ações
alinhadas à direita). A seta (`.fs-popover-arrow`) é gerada
automaticamente.

## Variações

- **Posicionamento**: `data-placement`/`data-align` no gatilho — mesma
  convenção do [Dropdown](dropdown.md).
- **Gatilho**: `data-trigger` no elemento gatilho —
  `click` (padrão), `hover` (com pequeno atraso ao sair, pra dar tempo de
  mover o mouse até o popover), `focus` (mostra ao focar, some ao perder
  foco pra fora do trigger+popover), `manual` (você chama `show()`/`hide()`
  vocẽ mesmo, sem listener automático).
- **Hover Card**: `.fs-popover-hover-card` — não é um componente
  separado, é este mesmo Popover com `data-trigger="hover"` e um
  modificador visual (mais largo, corpo em linha) pra conteúdo tipo
  avatar + bio.

```html
<a href="#" data-fs="popover" data-fs-target="#hc-1" data-trigger="hover">@jorgewreis</a>
<div class="fs-popover fs-popover-hover-card" id="hc-1">
  <div class="fs-popover-body">
    <img src="avatar.jpg" alt="" width="40" height="40">
    <div>
      <strong>Jorge Reis</strong>
      <p>Mantenedor do Fokus Styles.</p>
    </div>
  </div>
</div>
```

## Estados

`.is-open` — controlado pelo JS.

## A11y

`role="dialog"` + `aria-modal="false"` no popover, `aria-controls`/
`aria-expanded` no gatilho (JS aplica automaticamente). Com
`data-trigger="click"` (padrão): `Escape` fecha e devolve foco ao gatilho;
clique fora fecha. Um elemento dentro do popover com
`data-fs-dismiss="popover"` fecha ao ser clicado (útil pra um botão "OK"
no footer).

## API JS

Auto-init via `data-fs="popover"`. `Popover.getInstance(el)` (`el` é o
**gatilho**).

| Método | Descrição |
|---|---|
| `show()` | Abre, posiciona, ativa fechamento por clique fora (só no trigger `click`). |
| `hide()` | Fecha. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove todos os listeners, remove o elemento do popover do DOM. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:popover:shown` | Não | Depois de abrir. |
| `fs:popover:hidden` | Não | Depois de fechar. |

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-color-subtle` (header),
`--fs-color-text`, `--fs-radius-md`, `--fs-shadow-md`.

## Exemplo

```html
<button type="button" class="fs-btn" data-fs="popover" data-fs-target="#confirmar-envio">
  Enviar
</button>
<div class="fs-popover" id="confirmar-envio">
  <div class="fs-popover-header">Confirmar envio?</div>
  <div class="fs-popover-body">Não será possível editar depois de enviado.</div>
  <div class="fs-popover-footer">
    <button type="button" class="fs-btn fs-btn-sm" data-fs-dismiss="popover">Cancelar</button>
    <button type="button" class="fs-btn fs-btn-primary fs-btn-sm">Confirmar</button>
  </div>
</div>
```

Mockup: [laboratório do componente](../../mockup/overlays-commands.html#popover),
[`mockup/overlays-commands.html#hover-card`](../../mockup/overlays-commands.html#popover).
