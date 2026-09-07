# Relatório de contraste

`npm run contrast` audita a razão de contraste WCAG dos pares
texto/fundo emitidos pelos tokens (`packages/fokus-core/scss/tokens/_root.scss`,
`packages/fokus-core/scss/themes/_dark.scss`), nos temas claro e escuro:
texto base sobre superfície, botões sólidos e alerts, nas seis cores de tema
(`primary`/`secondary`/`success`/`warning`/`danger`/`info`).

## Como rodar

```bash
npm run contrast
```

Cada linha reporta a razão calculada e se atinge AA (WCAG 2.1 SC 1.4.3/1.4.11)
e AAA:

- **4.5:1** — mínimo AA para texto normal (corpo de alert, texto base).
- **3:1** — mínimo AA para texto grande/negrito e componentes de UI (usado
  para o texto de botões sólidos, que é sempre bold/UI, não corpo de leitura).
- **7:1** — AAA, opcional.

`npm run contrast -- --strict` sai com código de erro se algum par ficar
abaixo do mínimo AA — é o comando rodado pelo gate `contrast:check` do CI
(`.github/workflows/ci.yml`).

## Por que o tema escuro precisa de pesos próprios

O texto de um botão sólido (`.fs-btn-primary` etc.) é decidido uma vez, em
tempo de build, por `color-contrast()` (branco ou preto, o que der mais
contraste contra a cor sólida no **tema claro**) e gravado como valor
estático em `--fs-btn-color`. Ele não é recalculado por tema. O fundo, por
outro lado, muda no escuro (`--fs-color-{nome}` é misturado em direção ao
branco). Isso significa que uma cor de texto escolhida para o fundo claro
pode ficar com contraste ruim contra o fundo (mais claro) do tema escuro — é
exatamente esse cenário que o relatório cobre nas linhas `dark: btn-* text
(light)/bg(dark)`.

Da mesma forma, os pesos de mistura de `--fs-alert-*-bg`/`-text` no escuro
(`$dark-alert-bg-weight`/`$dark-alert-text-weight` em `themes/_dark.scss`)
foram ajustados a partir do relatório — os pesos "óbvios" (mistura simétrica)
davam ~4.0–4.3:1 em quatro das seis cores, abaixo do mínimo AA de 4.5:1. Se
você alterar esses pesos, ou os pesos de `$dark-color-weights`, rode
`npm run contrast` de novo antes de commitar.

## Última execução

29 pares checados, 0 abaixo do mínimo AA (ver `npm run contrast` para os
valores atuais — este arquivo documenta o processo, não os números, que
mudam a cada ajuste de token).
