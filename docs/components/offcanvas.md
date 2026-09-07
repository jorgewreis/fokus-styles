# Offcanvas

Painel deslizante de qualquer borda da tela (menu lateral mobile, carrinho,
filtros) — mesmo focus trap/`Escape`/clique-fora do [Modal](modal.md), mas
não cobre a tela inteira.

## Visão geral

```html
<button type="button" class="fs-btn" data-fs="offcanvas" data-fs-target="#meuPainel">
  Abrir menu
</button>

<div class="fs-offcanvas fs-offcanvas-start" id="meuPainel">
  <div class="fs-offcanvas-header">
    <h3 class="fs-offcanvas-title">Menu</h3>
    <button type="button" class="fs-btn-close" data-fs-dismiss="offcanvas" aria-label="Fechar"></button>
  </div>
  <div class="fs-offcanvas-body">Conteúdo do painel.</div>
</div>
```

`data-fs` vai no gatilho, como no Modal.

## Anatomia

Gatilho + `.fs-offcanvas` (painel, `position: fixed`, fora da viewport até
abrir) > `.fs-offcanvas-header` (título + `.fs-btn-close`, opcional) +
`.fs-offcanvas-body` (rola internamente) + `.fs-offcanvas-footer`
(opcional). Um `.fs-offcanvas-backdrop` é criado/removido dinamicamente
pelo JS a cada abertura (não escreva no HTML).

## Variações

Borda de entrada — obrigatório escolher uma:

- `.fs-offcanvas-start` — esquerda, 320px de largura.
- `.fs-offcanvas-end` — direita, 320px de largura.
- `.fs-offcanvas-top` — topo, 40vh de altura.
- `.fs-offcanvas-bottom` — base, 40vh de altura.

## Estados

`.is-open` — controlado pelo JS, anima via `transform`/`transition`
(desativada automaticamente sob `prefers-reduced-motion: reduce`).

**Backdrop**: `data-backdrop="false"` no `.fs-offcanvas` remove o
backdrop (painel some, mas o resto da página continua interativa por
baixo); `data-backdrop="static"` mantém o backdrop mas desativa
`Escape`/clique-fora (só `data-fs-dismiss="offcanvas"` fecha) — mesma
semântica do Modal.

## A11y

Ao inicializar, o componente controla `aria-hidden` e, quando encontra
`.fs-offcanvas-title`, cria automaticamente o vínculo `aria-labelledby`. Um
`id` existente no título é preservado.

`role="dialog"` + `aria-modal="true"` aplicados automaticamente. Foco
preso dentro do painel enquanto aberto, movido pro primeiro elemento
focável (com um pequeno atraso técnico pra garantir que a transição de
`visibility` já rodou — o painel usa `visibility: hidden` em vez de
`display: none` pra poder animar). Ao fechar, foco volta pro gatilho.

## API JS

Auto-init via `data-fs="offcanvas"` **no gatilho**. `Offcanvas.getInstance(triggerEl)`.

| Método | Descrição |
|---|---|
| `show()` | Abre, cria o backdrop (se aplicável), trava scroll, ativa focus trap. |
| `hide()` | Fecha, remove o backdrop, libera scroll, devolve foco ao gatilho. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove listeners, desregistra a instância. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:offcanvas:shown` | Não | Depois de abrir. |
| `fs:offcanvas:hidden` | Não | Depois de fechar. |

## Tokens

`--fs-color-surface`, `--fs-color-text`, `--fs-color-border`,
`--fs-shadow-lg`.

## Exemplo

```html
<button type="button" class="fs-btn" data-fs="offcanvas" data-fs-target="#filtros">Filtros</button>
<div class="fs-offcanvas fs-offcanvas-end" id="filtros" data-backdrop="static">
  <div class="fs-offcanvas-header">
    <h3 class="fs-offcanvas-title">Filtros</h3>
    <button type="button" class="fs-btn-close" data-fs-dismiss="offcanvas" aria-label="Fechar"></button>
  </div>
  <div class="fs-offcanvas-body">...</div>
  <div class="fs-offcanvas-footer">
    <button type="button" class="fs-btn fs-btn-primary" data-fs-dismiss="offcanvas">Aplicar</button>
  </div>
</div>
```

Mockup: [laboratório do componente](../../mockup/overlays-commands.html#offcanvas).
