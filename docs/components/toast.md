# Toast

Notificação temporária, empilhada num canto da tela, com dispensa manual
ou automática por tempo. Base do [Notification Center](notification-center.md).

## Visão geral

```html
<button type="button" class="fs-btn fs-btn-primary" id="btn-toast">Mostrar toast</button>

<div class="fs-toast-container">
  <div class="fs-toast fs-toast-success" data-fs="toast" id="meuToast" data-delay="4000">
    <div class="fs-toast-header">
      <span>Sucesso</span>
      <button type="button" class="fs-btn-close" data-fs-dismiss="toast" aria-label="Fechar"></button>
    </div>
    <div class="fs-toast-body">Operação concluída com sucesso.</div>
  </div>
</div>
```

```js
document.getElementById("btn-toast").addEventListener("click", () => {
  FokusStyles.Toast.getInstance(document.getElementById("meuToast")).show();
});
```

Ao contrário de Modal/Offcanvas, o Toast **não** abre sozinho ao clicar num
gatilho com `data-fs-target` — ele é mostrado programaticamente via
`.show()`, porque geralmente é disparado por um evento da sua aplicação
(sucesso de uma requisição, etc.), não diretamente por um clique.

## Anatomia

`.fs-toast-container` (posição fixa num canto — um só por página,
compartilhado por todos os toasts) > `.fs-toast` (`data-fs="toast"`) >
`.fs-toast-header` (título + `.fs-btn-close`) + `.fs-toast-body`.

## Variações

Cor: `.fs-toast-{primary|secondary|success|warning|danger|info}` no
`.fs-toast` — tinge só o header.

## Estados

`.is-open` — controlado pelo JS (o toast começa com `display: none`
inline até a primeira `show()`).

- `data-delay` (ms, padrão `4000`) — tempo até auto-esconder.
- `data-autohide="false"` — desativa o auto-esconder; só fecha pelo
  `.fs-btn-close` ou `.hide()` programático.

## A11y

`role="status"` + `aria-live="polite"` aplicados automaticamente — leitor
de tela anuncia o conteúdo ao aparecer, sem interromper o que está sendo
lido (diferente de `aria-live="assertive"`, que interromperia).

## API JS

Auto-init via `data-fs="toast"` (registra a instância, mas **não** mostra
automaticamente). `Toast.getInstance(el)`.

| Método | Descrição |
|---|---|
| `show()` | Mostra (anima expansão), inicia o temporizador de auto-esconder se `autohide` estiver ativo. |
| `hide()` | Esconde (anima recolhimento), cancela o temporizador. |
| `toggle()` | Alterna. |
| `dispose()` | Cancela o temporizador, remove listeners, desregistra a instância. |

| Evento | Cancelável | Quando |
|---|---|---|
| `fs:toast:shown` | Não | Depois que a animação de mostrar termina. |
| `fs:toast:hidden` | Não | Depois que a animação de esconder termina (inclusive auto-hide). |

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-alert-{nome}-bg`/`-text`
(header colorido), `--fs-radius-md`, `--fs-shadow-md`.

## Exemplo

```html
<div class="fs-toast-container">
  <div class="fs-toast fs-toast-danger" data-fs="toast" id="erroToast" data-autohide="false">
    <div class="fs-toast-header">
      <span>Erro</span>
      <button type="button" class="fs-btn-close" data-fs-dismiss="toast" aria-label="Fechar"></button>
    </div>
    <div class="fs-toast-body">Falha ao salvar. Tente novamente.</div>
  </div>
</div>
```

Mockup: [laboratório do componente](../../mockup/overlays-commands.html#toast).
