# Spinner & Progress

Dois indicadores de carregamento, 100% CSS: Spinner (indeterminado, giratório)
e Progress (determinado, barra linear).

## Visão geral

```html
<div class="fs-spinner" role="status" aria-label="Carregando"></div>

<div class="fs-progress">
  <div class="fs-progress-bar" style="--fs-progress-value: 60;"></div>
</div>
```

## Anatomia

**Spinner**: um único elemento, `.fs-spinner` — um anel com trilho sutil e
segmento ativo, girando; sem marcação interna.

**Progress**: `.fs-progress` (trilho) > `.fs-progress-bar` (preenchimento
— a largura é controlada pela custom property `--fs-progress-value`, de
`0` a `100`, ou diretamente por `style="width: 60%"`).

## Variações

**Spinner**:
- Tamanho: `.fs-spinner-sm` (14px), `.fs-spinner-lg` (32px); sem sufixo =
  20px.
- Cor: `.fs-spinner-{primary|secondary|success|warning|danger|info}` — o
  spinner herda `currentColor` por padrão, então também responde a
  qualquer utilitário de cor de texto (`.fs-u-text-*`) se você não usar essas
  classes.

**Progress**:
- Altura: `.fs-progress-sm` (4px), `.fs-progress-lg` (16px); sem sufixo =
  8px.
- Cor da barra: `.fs-progress-bar-{cor}` — mesmas 6 cores de tema.
- `.fs-progress-bar-striped` — faixas diagonais; some com
  `.fs-progress-bar-animated` pra elas se moverem continuamente.
- Valor visual: use texto dentro de `.fs-progress-bar` apenas em
  `.fs-progress-lg`; nas barras compactas, exponha o valor por `aria-valuenow`
  e por um rótulo externo quando ele precisar ser visível.
- Rótulo externo: `.fs-progress-meta` contém o nome da operação e
  `.fs-progress-value` para percentual, contagem ou duração.
- Indeterminado: `.fs-progress-indeterminate` mostra deslocamento contínuo;
  omita `aria-valuenow` e use `aria-valuetext="Progresso indeterminado"`.
- Finalização: `.fs-progress-complete` aplica `success`; `.fs-progress-error`
  aplica `danger`. Use `.fs-progress-status` para uma confirmação ou ação de
  recuperação fora da barra.
- Meta: adicione `.fs-progress-marker` dentro do trilho e defina
  `--fs-progress-marker-value` (0–100). Explique a meta em texto externo.
- Início perceptível: `.fs-progress-minimum` preserva ao menos 4px visíveis
  para valores reais acima de zero; `aria-valuenow` continua sendo a fonte de
  verdade.
- Fluxo por etapas: componha [Stepper](stepper.md) para comunicar a etapa
  atual e uma `.fs-progress` para representar o avanço global. Não duplique
  ambos para o mesmo significado.

```html
<div class="fs-spinner fs-spinner-lg fs-spinner-primary"></div>

<div class="fs-progress fs-progress-lg">
  <div class="fs-progress-bar fs-progress-bar-success fs-progress-bar-striped fs-progress-bar-animated" style="--fs-progress-value: 40;"></div>
</div>
```

## Estados

Nenhum — ambos refletem o valor/presença que você controla (spinner:
presente = carregando; progress: `--fs-progress-value` = progresso atual).

## A11y

- Spinner: adicione `role="status"` + `aria-label` (ou um texto
  visualmente oculto dentro) — não é automático, o elemento é puramente
  visual por padrão.
- Progress: para expor o valor a leitores de tela, adicione
  `role="progressbar"` + `aria-valuenow`/`aria-valuemin="0"`/
  `aria-valuemax="100"` **e um nome acessível** (`aria-label="Progresso: 60%"`
  ou `aria-labelledby` apontando pro rótulo visível) no `.fs-progress`
  (mantidos em sincronia com `--fs-progress-value` pela sua aplicação — o
  framework não injeta automaticamente). Sem nome acessível, o
  `role="progressbar"` é rejeitado por leitores de tela (gate `axe` no CI:
  regra `aria-progressbar-name`).
- A animação de listras (`.fs-progress-bar-animated`), a barra indeterminada
  e a rotação do spinner desaceleram em `prefers-reduced-motion: reduce`, mas
  não param completamente para não parecerem travadas.
- Para o indeterminado, não informe um valor numérico inexistente. O movimento
  reduz a velocidade em `prefers-reduced-motion`, mas continua ativo para não
  parecer uma interface travada.

## API JS

Nenhuma — 100% CSS. Atualizar `--fs-progress-value` é responsabilidade da
sua aplicação (ex.: `barEl.style.setProperty("--fs-progress-value", "75")`).

## Tokens

Spinner: `--fs-color-{nome}` (variantes de cor). Progress:
`--fs-color-subtle` (trilho), `--fs-color-primary`/`--fs-color-{nome}`
(preenchimento), `--fs-progress-height`, `--fs-progress-track`,
`--fs-progress-bar-bg` e `--fs-progress-radius`. O Spinner também expõe
`--fs-spinner-size`, `--fs-spinner-stroke` e `--fs-spinner-duration` para
ajustes locais.

## Exemplo

```html
<div class="fs-spinner" role="status" aria-label="Carregando"></div>

<div class="fs-progress" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
  <div class="fs-progress-bar" style="--fs-progress-value: 60;">60%</div>
</div>

<div class="fs-progress-meta"><span>Upload de anexos</span><span class="fs-progress-value">3 de 8 arquivos</span></div>
<div class="fs-progress" role="progressbar" aria-label="Upload de anexos" aria-valuetext="3 de 8 arquivos enviados" aria-valuenow="38" aria-valuemin="0" aria-valuemax="100">
  <div class="fs-progress-bar" style="--fs-progress-value: 38"></div>
</div>

<div class="fs-progress fs-progress-indeterminate" role="progressbar" aria-label="Processando pagamento" aria-valuetext="Progresso indeterminado" aria-busy="true">
  <div class="fs-progress-bar"></div>
</div>
```

Mockup: [laboratório do componente](../../mockup/feedback-actions.html#progress).
