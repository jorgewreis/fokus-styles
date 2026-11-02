> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

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

Cada linha reporta a razão calculada e se atinge AA e AAA para **texto normal**:

- **4.5:1** — mínimo AA para todos os pares deste relatório, inclusive rótulos
  de botões pequenos, normais e grandes. Ser um botão ou ter peso maior não
  torna um texto automaticamente “grande”.
- **7:1** — AAA para texto normal, opcional. A comparação usa a razão sem
  arredondar; apenas a exibição é arredondada para duas casas.
- **3:1** — aplica-se a texto realmente grande (18pt normal ou 14pt bold) e,
  separadamente, a elementos não textuais cobertos por SC 1.4.11. **Não** é o
  limiar dos rótulos de botão neste gate.

Referência normativa explicada pelo W3C:
[WCAG 2.2, SC 1.4.3 — Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Os estados hover/active do botão primary também são medidos (inclusive nas
três marcas): `brightness()` afeta tanto o texto quanto o fundo. Os fatores
são compartilhados com o componente por `settings/_button-states.scss`.

Checkbox, Radio e Switch reutilizam esses tokens semânticos para bordas,
superfícies, estados de ação e validação. O relatório visual dos laboratórios
também deve ser executado após qualquer ajuste nos tokens locais dos controles.

`npm run contrast -- --strict` sai com código de erro se algum par ficar
abaixo do mínimo AA — é o comando rodado pelo gate `contrast:check` do CI
(`.github/workflows/ci.yml`).

## Por que o tema escuro precisa de pesos próprios

O texto de um botão sólido (`.fs-btn-primary` etc.) é decidido uma vez, em
tempo de build, por `color-contrast()` (branco ou preto, o que der mais
contraste contra a cor sólida no **tema claro**) e gravado no token
`--fs-color-on-{nome}`, consumido por `--fs-btn-color`. Ele não é recalculado por tema. O fundo, por
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

## Correção de consolidação Beta

57 pares checados, nenhum abaixo de 4.5:1. Os 41 pares anteriores não incluíam
hover/active do primary e aceitavam indevidamente 3:1 em botões.

Mudanças visuais pontuais, sem trocar a paleta ou a tipografia:

- Secondary escuro mantém 98% da cor original (antes 90%): fundo um pouco
  mais escuro, com texto branco passando de **3.96:1 para 4.59:1**. A mudança
  do token também alcança componentes que consomem `--fs-color-secondary`.
- Primary hover/active passa de clareamento 1.2/1.4 para escurecimento discreto
  0.98/0.95. No escuro, os novos estados medem **4.80:1 / 4.72:1**; no claro,
  **5.33:1 / 5.23:1**. Presets de marca também passam.

`tests/unit/contrast-gate.test.js` cobre os valores reais emitidos em CSS,
as constantes de estado e regressões negativas (secondary antigo e filtros
antigos). O gate foi demonstrado falhando com o secondary antigo a 3.96:1.

Este relatório é um gate de tokens/estados enumerados, **não** uma certificação
WCAG de toda a biblioteca. Bordas, ícones, transparência sobre fundos
arbitrários, temas personalizados e demais estados precisam de testes reais
de navegador e da auditoria axe/visual. Não substitua esses testes pelo gate.
