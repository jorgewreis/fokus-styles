# Modal

Diálogo sobreposto à página inteira, com focus trap, `Escape` e clique
fora pra fechar. Base do [Alert Dialog](alert-dialog.md).

## Visão geral

```html
<button type="button" class="fs-btn fs-btn-primary" data-fs="modal" data-fs-target="#meuModal">
  Abrir modal
</button>

<div class="fs-modal" id="meuModal">
  <div class="fs-modal-dialog">
    <div class="fs-modal-content">
      <div class="fs-modal-header">
        <h3 class="fs-modal-title">Título</h3>
        <button type="button" class="fs-btn-close" data-fs-dismiss="modal" aria-label="Fechar"></button>
      </div>
      <div class="fs-modal-body">Conteúdo do modal.</div>
      <div class="fs-modal-footer">
        <button type="button" class="fs-btn" data-fs-dismiss="modal">Cancelar</button>
        <button type="button" class="fs-btn fs-btn-primary">Confirmar</button>
      </div>
    </div>
  </div>
</div>
```

`data-fs` vai no **gatilho** (o botão que abre), não no `.fs-modal` — ao
contrário da maioria dos outros componentes.

## Anatomia

Gatilho (`data-fs="modal"` + `data-fs-target`) + `.fs-modal` (overlay de
tela cheia, centraliza o conteúdo) > `.fs-modal-dialog` (limita a largura)
> `.fs-modal-content` (card visual) > `.fs-modal-header` (título +
`.fs-btn-close`, opcional) + `.fs-modal-body` (rola internamente se o
conteúdo for maior que a viewport) + `.fs-modal-footer` (ações, opcional).

## Variações

Tamanho do diálogo: `.fs-modal-sm` (320px), `.fs-modal-lg` (720px) em
`.fs-modal-dialog`; sem sufixo = 480px (padrão).

```html
<div class="fs-modal-dialog fs-modal-lg">...</div>
```

## Estados

`.is-open` no `.fs-modal` — controlado pelo JS.

**Backdrop estático** (`data-backdrop="static"` no `.fs-modal`): desativa
fechamento por `Escape` e clique fora — só um `data-fs-dismiss="modal"`
explícito fecha. Use para fluxos que exigem uma decisão explícita.

```html
<div class="fs-modal" id="modalCritico" data-backdrop="static">...</div>
```

## A11y

Use `.fs-modal-sm`, `.fs-modal-lg`, `.fs-modal-xl`, `.fs-modal-fullscreen` e
`.fs-modal-scrollable` conforme o fluxo. Em telas menores o diálogo respeita safe areas.

Ao inicializar, o componente controla `aria-hidden` e, quando encontra
`.fs-modal-title`, cria automaticamente o vínculo `aria-labelledby`. Um
`id` existente no título é preservado.

`role="dialog"` + `aria-modal="true"` aplicados automaticamente. Ao abrir:
foco preso dentro do `.fs-modal-dialog` (`Tab`/`Shift+Tab` ciclam só entre
os elementos focáveis internos), primeiro elemento focável recebe foco,
scroll da página é bloqueado. Ao fechar: foco volta pro gatilho que abriu.

## API JS

Auto-init via `data-fs="modal"` **no gatilho**. `Modal.getInstance(triggerEl)`.

| Método | Descrição |
|---|---|
| `show()` | Abre, trava o scroll, ativa o focus trap. |
| `hide()` | Fecha, libera o scroll, devolve o foco ao gatilho. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove listeners, desregistra a instância. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:modal:shown` | Não | Depois de abrir. |
| `fs:modal:hidden` | Não | Depois de fechar (inclusive via Escape/clique fora). |

## Tokens

`--fs-color-surface`, `--fs-color-text`, `--fs-color-border`,
`--fs-radius-md`, `--fs-shadow-lg`.

## Exemplo

```html
<button type="button" class="fs-btn fs-btn-danger" data-fs="modal" data-fs-target="#confirmarExclusao">
  Excluir
</button>
<div class="fs-modal" id="confirmarExclusao">
  <div class="fs-modal-dialog fs-modal-sm">
    <div class="fs-modal-content">
      <div class="fs-modal-body">
        <h3 class="fs-modal-title">Excluir item?</h3>
        <p>Essa ação não pode ser desfeita.</p>
      </div>
      <div class="fs-modal-footer">
        <button type="button" class="fs-btn" data-fs-dismiss="modal">Cancelar</button>
        <button type="button" class="fs-btn fs-btn-danger">Excluir</button>
      </div>
    </div>
  </div>
</div>
```

Para o mesmo padrão sem escrever HTML, ver [Alert Dialog](alert-dialog.md)
(`FokusStyles.confirm()`). Mockup: [laboratório do componente](../../mockup/overlays-commands.html#modal).
