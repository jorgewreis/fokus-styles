# Gráficos (tokens agnósticos de biblioteca)

O FokusStyles **não inclui um wrapper de nenhuma biblioteca de gráficos** — em
vez disso, expõe um conjunto pequeno de tokens (`--fs-chart-*`) que
qualquer lib (Chart.js, ECharts, Recharts, D3, Highcharts…) pode consumir
via `getComputedStyle`. Zero dependência nova, zero manutenção atrelada à
API de uma lib de terceiro que muda com o tempo, e o gráfico acompanha
`data-theme`/`data-fs-brand` automaticamente porque os tokens são aliases da
camada semântica já existente (mesma técnica de `tokens/_semantic.scss`).

## Tokens

| Token | Uso sugerido |
|---|---|
| `--fs-chart-series-1` … `--fs-chart-series-6` | Cor de cada série/categoria de dados. |
| `--fs-chart-grid` | Linhas de grade do plano cartesiano. |
| `--fs-chart-axis` | Rótulos e linhas dos eixos. |
| `--fs-chart-tooltip-bg` / `--fs-chart-tooltip-text` | Fundo/texto do tooltip do gráfico. |

As 6 séries reaproveitam as cores de tema (`primary`/`success`/`warning`/
`danger`/`info`/`secondary`) — uma paleta categórica coerente com o resto
da interface, sem introduzir cor nova. Se seu gráfico precisar de mais de
6 séries ou de uma paleta com propósito diferente (sequencial/divergente),
sobrescreva os tokens que precisar; eles são só `var()`, então qualquer
CSS depois do import do FokusStyles vence.

## Uso

Leia os tokens em runtime com `getComputedStyle` e passe pra sua lib de
gráficos na hora de montar a configuração:

```js
const styles = getComputedStyle(document.documentElement);
const chartColors = {
  series: [1, 2, 3, 4, 5, 6].map((n) => styles.getPropertyValue(`--fs-chart-series-${n}`).trim()),
  grid: styles.getPropertyValue("--fs-chart-grid").trim(),
  axis: styles.getPropertyValue("--fs-chart-axis").trim(),
  tooltipBg: styles.getPropertyValue("--fs-chart-tooltip-bg").trim(),
  tooltipText: styles.getPropertyValue("--fs-chart-tooltip-text").trim(),
};
```

Exemplo com Chart.js:

```js
new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Jan", "Fev", "Mar"],
    datasets: [{ data: [12, 19, 7], backgroundColor: chartColors.series[0] }],
  },
  options: {
    scales: {
      x: { grid: { color: chartColors.grid }, ticks: { color: chartColors.axis } },
      y: { grid: { color: chartColors.grid }, ticks: { color: chartColors.axis } },
    },
  },
});
```

## Tema escuro e multi-brand

Como os tokens de série são aliases de `--fs-color-*`, eles já respondem a
`data-theme="dark"` e `data-fs-brand="x"` (ver [Theming](theming.md)) sem
nenhum código adicional — só é preciso reler `getComputedStyle` (ou
recriar o gráfico) depois de uma troca de tema/marca em runtime, porque a
maioria das libs de gráfico não observa mudanças de CSS custom properties
sozinha.

## Próximo passo

[Theming](theming.md) — as 3 camadas de tokens que os tokens de gráfico
reaproveitam.
