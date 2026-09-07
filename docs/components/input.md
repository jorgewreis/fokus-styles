# Input

Campos de formulário de texto — 100% CSS, sobre elementos nativos
(`<input>`, `<textarea>`, `<select>`). Ver também
[Checkbox](checkbox.md)/[Radio](radio.md)/[Switch](switch.md) para
controles booleanos, e [Select customizado](select.md) para um `<select>`
com dropdown estilizado.

## Visão geral

```html
<div class="fs-form-col">
  <label for="nome" class="fs-form-label">Nome completo</label>
  <input type="text" class="fs-form-control" id="nome" placeholder="Seu nome">
</div>
```

## Anatomia

- `.fs-form-control` — em `<input>`/`<textarea>`.
- `.fs-form-select` — versão estática (sem JS) de um `<select>`
  estilizado apenas visualmente com uma seta; para dropdown customizado
  completo, ver [Select](select.md).
- `.fs-form-label` — rótulo (associe via `for`/`id`).
- `.fs-form-text` — texto de apoio, sempre visível.
- `.fs-valid-feedback`/`.fs-invalid-feedback` — texto de apoio que só
  aparece quando o input tem `.is-valid`/`.is-invalid` (via combinador de
  irmãos gerais `~` — precisam estar depois do input no DOM).
- `.fs-form-row`/`.fs-form-col` — helpers de layout (linha/coluna) pra
  organizar label + campo + texto de apoio.

```html
<div class="fs-form-col">
  <label for="email" class="fs-form-label">E-mail</label>
  <input type="email" class="fs-form-control is-invalid" id="email">
  <div class="fs-invalid-feedback">E-mail inválido.</div>
</div>
```

## Variações

- **Tamanho**: `.fs-form-control-sm`, `.fs-form-control-lg` (idem para
  `.fs-form-select`); sem sufixo = 38px de altura.
- **Largura**: `.fs-form-size-{sm|md|lg|xl|xxl}` — larguras fixas
  (120px–360px) pra campos que não devem esticar 100%.

```html
<input type="text" class="fs-form-control fs-form-control-sm fs-form-size-sm">
```

## Estados

- `:focus` — anel de foco (mixin `focus-ring`).
- `:disabled` — cor muted, fundo sutil, opacidade reduzida.
- `:read-only` — fundo sutil, cursor padrão (não indica edição).
- `.is-valid`/`.is-invalid` — borda verde/vermelha + ativa o
  `.fs-valid-feedback`/`.fs-invalid-feedback` correspondente.

## A11y

- Sempre associe `.fs-form-label` ao campo via `for`/`id`.
- Associe o texto de apoio (`.fs-form-text`, `.fs-valid-feedback`) ao
  campo via `aria-describedby` — não é automático (o `id` do texto de
  apoio é definido por você).
- `.fs-form-select` estático não tem teclado/ARIA customizados — é a
  aparência de um `<select>` nativo real, herda tudo do navegador.

## API JS

Nenhuma — 100% CSS. Para o `<select>` com dropdown customizado (JS), ver
[Select](select.md).

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-color-text`,
`--fs-color-muted`, `--fs-color-subtle` (disabled/read-only),
`--fs-color-success`/`--fs-color-danger` (validação), `--fs-radius-sm`.

## Exemplo

```html
<div class="fs-form-col">
  <label for="senha" class="fs-form-label">Senha</label>
  <input type="password" class="fs-form-control is-valid" id="senha" aria-describedby="senha-ok">
  <div class="fs-valid-feedback" id="senha-ok">Senha forte.</div>
</div>
```

Mockups: [`mockup/forms.html#input`](../../mockup/forms.html#input),
[`mockup/foundations.html#layout`](../../mockup/forms.html#input).
