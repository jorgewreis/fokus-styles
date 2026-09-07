# Collapse

Expande/recolhe um painel com transição de altura animada — primitivo
usado internamente por [Accordion](accordion.md); use direto quando quiser
só um "mostrar mais" sem a semântica de grupo do Accordion.

## Visão geral

```html
<button type="button" class="fs-btn" data-fs="collapse" data-fs-target="#detalhes">
  Ver detalhes
</button>
<div class="fs-collapse" id="detalhes">
  Conteúdo que expande/recolhe.
</div>
```

## Anatomia

Gatilho (`data-fs="collapse"` + `data-fs-target`) + `.fs-collapse`
(precisa de `overflow: hidden`, já incluso na classe — não remova via CSS
próprio, quebra a animação de altura).

## Variações

Nenhuma — sem tamanho/cor; é um comportamento, não um estilo visual
próprio (o conteúdo interno usa suas próprias classes).

## Estados

Estado inicial definido por `aria-expanded` no gatilho: `"true"` começa
aberto, ausente ou `"false"` começa fechado.

```html
<button type="button" class="fs-btn" data-fs="collapse" data-fs-target="#painel" aria-expanded="true">
  Recolher
</button>
```

## A11y

`aria-controls`/`aria-expanded` no gatilho são sincronizados
automaticamente pelo JS a cada `show()`/`hide()`.
[`prefers-reduced-motion: reduce`](../guides/accessibility.md#prefers-reduced-motion)
pula a animação e aplica o estado final direto.

## API JS

Auto-init via `data-fs="collapse"` **no gatilho**. `Collapse.getInstance(triggerEl)`.

| Método | Descrição |
|---|---|
| `show()` | Expande com animação de altura. |
| `hide()` | Recolhe com animação de altura. |
| `toggle()` | Alterna (é o que o clique no gatilho já faz). |
| `dispose()` | Remove o listener de clique e desregistra a instância. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:collapse:shown` | Não | Depois que a animação de expandir termina. |
| `fs:collapse:hidden` | Não | Depois que a animação de recolher termina. |

## Tokens

Nenhum próprio — o conteúdo interno usa suas próprias cores/espaçamento.

## Exemplo

```html
<button type="button" class="fs-btn fs-btn-outline-secondary" data-fs="collapse" data-fs-target="#mais-info">
  Mais informações
</button>
<div class="fs-collapse" id="mais-info">
  <p class="fs-u-mt-2">Texto adicional que só aparece quando expandido.</p>
</div>
```

Mockup: [laboratório do componente](../../mockup/navigation-disclosure.html#collapse).
