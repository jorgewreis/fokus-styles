# Alert

Mensagem de estado (sucesso, erro, aviso, informação) com destaque visual —
fundo tintado, texto com contraste garantido, barra lateral colorida.

## Visão geral

```html
<div class="fs-alert">Alerta neutro, sem cor de estado.</div>
<div class="fs-alert fs-alert-success">Operação concluída com sucesso.</div>
```

## Anatomia

Um único elemento, `.fs-alert` — sem marcação interna obrigatória.

## Variações

Cor: `.fs-alert-{primary|secondary|success|warning|danger|info}`. Sem
modificador, usa borda/texto neutros. Sem tamanhos (`-sm`/`-lg`) — Alert é
sempre o mesmo `padding`.

```html
<div class="fs-alert fs-alert-danger">Ocorreu um erro ao processar a solicitação.</div>
<div class="fs-alert fs-alert-warning">Atenção: essa ação não pode ser desfeita.</div>
```

## Estados

Nenhum — elemento estático. Para um alerta dispensável, monte você mesmo
com um `.fs-btn-close` (ver [Toast](toast.md) para o padrão de dispensa com
JS, caso precise).

## A11y

Para alertas que aparecem dinamicamente (não já presentes no HTML da
carga), adicione `role="alert"` (ou `role="status"` para os menos urgentes)
no elemento, pra leitores de tela anunciarem automaticamente — o framework
não injeta esse atributo.

## API JS

Nenhuma — 100% CSS.

## Tokens

`--fs-alert-{nome}-bg`/`-text` (fundo tintado e texto, calculados por
`tint-color()`/`shade-color()` a partir do primitivo — ver
[`docs/reference/design-tokens.md`](../reference/design-tokens.md)),
`--fs-color-border`. Alerts usam `border-radius: 0`.

## Exemplo

```html
<div class="fs-alert fs-alert-success" role="status">Operação concluída com sucesso.</div>
<div class="fs-alert fs-alert-danger" role="alert">Erro ao salvar as alterações.</div>
```

Mockup: [laboratório do componente](../../mockup/feedback-actions.html#alert).
