# Stepper

Wizard de múltiplos passos — cabeçalho com indicadores de progresso, painéis
de conteúdo opcionais, navegação linear ou livre.

## Visão geral

```html
<div class="fs-stepper" data-fs="stepper">
  <ol class="fs-stepper-header">
    <li class="fs-step fs-step-active">
      <span class="fs-step-indicator">1</span>
      <span class="fs-step-label">Conta</span>
    </li>
    <li class="fs-step">
      <span class="fs-step-indicator">2</span>
      <span class="fs-step-label">Perfil</span>
    </li>
    <li class="fs-step">
      <span class="fs-step-indicator">3</span>
      <span class="fs-step-label">Revisão</span>
    </li>
  </ol>
  <div class="fs-stepper-content">
    <div class="fs-step-panel is-active">Passo 1: dados da conta.</div>
    <div class="fs-step-panel">Passo 2: dados do perfil.</div>
    <div class="fs-step-panel">Passo 3: revise e confirme.</div>
  </div>
  <div class="fs-stepper-actions">
    <button type="button" class="fs-btn" data-stepper="prev">Voltar</button>
    <button type="button" class="fs-btn fs-btn-primary" data-stepper="next">Avançar</button>
  </div>
</div>
```

## Anatomia

`.fs-stepper` (`data-fs="stepper"`) > `.fs-stepper-header` (`<ol>`) >
`.fs-step` (um por passo) > `.fs-step-indicator` (número/check) +
`.fs-step-label` + `.fs-step-description` (opcional) — mais, opcionais:
`.fs-stepper-content` > `.fs-step-panel` (um por passo, na mesma ordem) e
`.fs-stepper-actions` com botões `data-stepper="prev"`/`"next"`.

Um `.fs-step` pode apontar pra um painel específico via `data-fs-target`
(seletor) em vez de depender da ordem posicional.

## Variações

`.fs-stepper-vertical` no `.fs-stepper` — cabeçalho em coluna, cada passo
com label/descrição ao lado do indicador em vez de embaixo.

## Estados

Cada `.fs-step` recebe uma destas classes, sincronizadas pelo JS:

| Classe | Significado |
|---|---|
| (nenhuma) | Pendente — ainda não alcançado. |
| `.fs-step-active` | Passo atual. |
| `.fs-step-completed` | Já concluído (indicador vira um check). |
| `.fs-step-error` | Marcado com erro via `setError()` — não muda automaticamente. |
| `.fs-step-clickable` | Aplicada automaticamente aos passos navegáveis pelo cabeçalho. |

**Modo linear** (padrão, `data-linear` ausente ou `"true"`): só permite
voltar clicando em passos já concluídos, não pular pra frente. `data-linear="false"` libera clicar em qualquer passo do cabeçalho a
qualquer momento.

## A11y

Cada `.fs-step` tem `role="listitem"`, `tabindex` (só os clicáveis
recebem `0`) e `aria-current="step"` no passo ativo — navegável e ativável
por teclado (`Enter`/`Space`) quando clicável.

## API JS

Auto-init via `data-fs="stepper"`. `Stepper.getInstance(el)`.

| Método | Descrição |
|---|---|
| `next()` | Avança um passo; no último, chama `complete()`. |
| `prev()` | Volta um passo. |
| `goTo(index)` | Vai direto pro passo `index` (respeitando o modo linear se disparado pelo cabeçalho — via método, sempre permitido). |
| `setError(index, hasError = true)` | Marca/desmarca `.fs-step-error` num passo específico. |
| `complete()` | Marca o wizard como concluído (todos os passos ficam `.fs-step-completed`). |
| `dispose()` | Remove todos os listeners e desregistra a instância. |

| Evento | Cancelável | Quando |
|---|---|---|
| `fs:stepper:beforechange` | Sim | Antes de trocar de passo (ou concluir) — `event.detail` traz `{ from, to }`; `preventDefault()` bloqueia a mudança (útil pra validar o passo atual antes de avançar). |
| `fs:stepper:changed` | Não | Depois de trocar de passo. |
| `fs:stepper:completed` | Não | Depois de `complete()`. |

```js
stepperEl.addEventListener("fs:stepper:beforechange", (event) => {
  if (!formularioValido()) event.preventDefault();
});
```

## Tokens

`--fs-color-border`, `--fs-color-primary` (ativo/concluído),
`--fs-color-danger` (erro), `--fs-color-muted`, `--fs-color-text`.

## Exemplo

Ver acima (Visão geral) — mockup completo com validação por passo em
[`mockup/navigation-disclosure.html#stepper`](../../mockup/navigation-disclosure.html#stepper).
