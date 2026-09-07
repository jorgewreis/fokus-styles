# Alert Dialog (Confirm)

Diálogo de confirmação, 100% programático — ao contrário de todo outro
componente interativo (auto-init declarativo via `data-fs`), este é
montado na hora por `FokusStyles.confirm()`, sem marcação pré-declarada na
página. Reaproveita [Modal](modal.md) internamente (foco/teclado/overlay
já prontos).

## Visão geral

```js
const confirmado = await FokusStyles.confirm({
  title: "Excluir item?",
  message: "Essa ação não pode ser desfeita.",
  confirmText: "Excluir",
  cancelText: "Cancelar",
  variant: "danger",
});

if (confirmado) {
  // ação
}
```

`FokusStyles.confirm()` retorna uma `Promise<boolean>` — `true` se confirmado,
`false` se cancelado (botão Cancelar, `Escape`, ou clique fora).

## Anatomia

Gerada internamente: `.fs-modal.fs-alert-dialog` >
`.fs-modal-dialog.fs-modal-sm` > `.fs-modal-content` > `.fs-modal-body`
(título + `.fs-alert-dialog-message`, se `message` foi passado) +
`.fs-modal-footer` (botão Cancelar + botão de ação, na cor de `variant`).
Não há HTML pra escrever — só a chamada JS.

## Variações

`variant` aceita qualquer cor de tema (`primary`, `secondary`, `success`,
`warning`, `danger` — padrão, `info`) — vira `.fs-btn-{variant}` no botão
de confirmação.

```js
await FokusStyles.confirm({ title: "Sair sem salvar?", variant: "warning" });
```

## Estados

Nenhum estado próprio — é um fluxo de uma chamada só (abre já com foco
preso, resolve e desmonta ao confirmar/cancelar).

## A11y

Herda focus trap, `Escape` e clique-fora do [Modal](modal.md). Ao resolver
(confirmar ou cancelar), o foco volta automaticamente pro elemento que
tinha foco antes de `FokusStyles.confirm()` ser chamado (normalmente o botão
que disparou a ação).

## API JS

| Função | Retorno |
|---|---|
| `FokusStyles.confirm(options)` | `Promise<boolean>` |

| Opção | Padrão | Descrição |
|---|---|---|
| `title` | `"Tem certeza?"` | Título do diálogo. |
| `message` | `""` | Texto de apoio abaixo do título (omitido se vazio). |
| `confirmText` | `"Confirmar"` | Texto do botão de ação. |
| `cancelText` | `"Cancelar"` | Texto do botão de cancelar. |
| `variant` | `"danger"` | Cor do botão de ação (qualquer cor de tema). |

Sem `getInstance()`/`dispose()` — cada chamada cria e desmonta seu próprio
diálogo; não há instância persistente pra gerenciar.

## Tokens

Os mesmos do [Modal](modal.md) — sem tokens próprios além de
`--fs-alert-dialog-message` usar `--fs-color-muted`/`$font-size-sm`.

## Exemplo

```html
<button type="button" class="fs-btn fs-btn-danger" id="btn-excluir">Excluir conta</button>
<script>
  document.getElementById("btn-excluir").addEventListener("click", async () => {
    const ok = await FokusStyles.confirm({
      title: "Excluir conta?",
      message: "Todos os seus dados serão apagados permanentemente.",
      confirmText: "Excluir conta",
      variant: "danger",
    });
    if (ok) {
      // prosseguir com a exclusão
    }
  });
</script>
```

Mockup: [laboratório do componente](../../mockup/overlays-commands.html#alert-dialog).
