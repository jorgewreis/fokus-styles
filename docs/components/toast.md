# Toast

Notificação flutuante e temporária para confirmar uma ação não bloqueante.
Para mensagens persistentes no contexto da página use [Alert](alert.md); para
histórico e revisão posterior use [Notification Center](notification-center.md).

## Visão geral

```html
<div class="fs-toast-container">
  <div class="fs-toast fs-toast-success" data-fs="toast" data-delay="4000">
    <div class="fs-toast-header">
      <span>Sucesso</span>
      <button type="button" class="fs-btn-close" data-fs-dismiss="toast" aria-label="Fechar"></button>
    </div>
    <div class="fs-toast-body">Operação concluída com sucesso.</div>
  </div>
</div>
```

O Toast é inicializado pelo atributo `data-fs="toast"`, mas só aparece quando
`.show()` é chamado. O container é fixo, empilha mensagens e usa propriedades
lógicas para funcionar em RTL e respeitar áreas seguras móveis.

## Anatomia

`.fs-toast-container` contém um ou mais `.fs-toast`. Dentro dele, os slots
opcionais são `.fs-toast-header`, `.fs-toast-icon`, `.fs-toast-heading`,
`.fs-toast-title`, `.fs-toast-meta`, `.fs-toast-body`, `.fs-toast-actions`,
`.fs-toast-link`, `.fs-toast-close` e `.fs-toast-progress`.

```html
<div class="fs-toast fs-toast-success" data-fs="toast" data-delay="5000" data-toast-progress="true">
  <div class="fs-toast-header">
    <span class="fs-toast-icon" aria-hidden="true">✓</span>
    <div class="fs-toast-heading">
      <strong class="fs-toast-title">Arquivo salvo</strong>
      <span class="fs-toast-meta">Agora</span>
    </div>
    <button type="button" class="fs-btn-close fs-toast-close" data-fs-dismiss="toast" aria-label="Fechar aviso de arquivo salvo"></button>
  </div>
  <div class="fs-toast-body">O documento foi salvo com sucesso.</div>
  <div class="fs-toast-actions">
    <button type="button" class="fs-btn fs-btn-sm fs-btn-success">Desfazer</button>
    <a href="#detalhes" class="fs-toast-link">Ver detalhes</a>
  </div>
  <div class="fs-toast-progress" aria-hidden="true"></div>
</div>
```

O ícone é fornecido pelo consumidor e deve ser decorativo quando o texto já
explicar o estado. Ações usam Button; o fechamento continua sendo o único
controle obrigatório da dispensa.

## Variações e estados

Variantes: `.fs-toast-primary`, `.fs-toast-secondary`, `.fs-toast-success`,
`.fs-toast-warning`, `.fs-toast-danger` e `.fs-toast-info`.

- `data-delay="4000"` define o tempo de auto-dismiss em milissegundos;
- `data-autohide="false"` mantém o Toast aberto;
- `data-toast-progress="true"` exibe a barra de tempo quando o auto-dismiss está ativo;
- hover, foco e interação pausam o timer e a barra de progresso;
- `prefers-reduced-motion` elimina a animação contínua do progresso.

## Estados

O Toast começa oculto, entra em `.is-open` durante a exibição e pode ser
pausado por hover ou foco. `hide()` e auto-dismiss cancelam o timer e ocultam
o elemento sem transferir foco.

## A11y

O JavaScript aplica `role="status"` e `aria-live="polite"`. O Toast não move
foco automaticamente e não deve usar `aria-live="assertive"` por padrão.
Botões de fechamento precisam de `aria-label` específico; links e ações devem
ter nomes compreensíveis. Ícones decorativos usam `aria-hidden="true"` e não
substituem texto.

Use `data-autohide="false"` para erros que exigem ação. Não use Toast para
decisões críticas, conteúdo extenso ou mensagens que precisam permanecer no
contexto da região afetada.

## API JS

```js
const toast = FokusStyles.Toast.getInstance(document.querySelector(".fs-toast"));
toast.show();
toast.hide();
toast.toggle();
toast.dispose();
```

Eventos preservados: `fs:toast:shown` e `fs:toast:hidden`. O componente pausa
o auto-dismiss durante hover e foco, sem transferir foco para outro Toast.

## Tokens

Container: `--fs-toast-offset`, `--fs-toast-gap`, `--fs-toast-width` e
`--fs-toast-max-width`. Instância: `--fs-toast-padding-block`,
`--fs-toast-padding-inline`, `--fs-toast-gap`, `--fs-toast-radius`,
`--fs-toast-shadow`, `--fs-toast-icon-size`, `--fs-toast-title-gap`,
`--fs-toast-actions-gap`, `--fs-toast-border-width` e
`--fs-toast-progress-height`.

## Mockup

[Laboratório independente do Toast](../../mockup/examples/toast.html).
