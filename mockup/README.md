# Laboratórios de componentes

Os laboratórios complementam a [documentação publicada do Fokus Styles](https://styles.fokuscloud.com.br/)
e os guias versionados em [`docs/`](../docs/README.md), dentro do ecossistema
[Fokus Cloud](https://www.fokuscloud.com.br/). O código-fonte e o histórico
ficam no [GitHub](https://github.com/jorgewreis/fokus-styles); o pacote
distribuído está no [npm](https://www.npmjs.com/package/fokus-styles).

Os mockups são documentação viva: cada seção combina uma definição em
português, contrato de acessibilidade, configurações suportadas, preview
funcional e o HTML extraído do exemplo que está sendo executado. O markup não
é mantido em duplicidade: o painel de código é sincronizado com o iframe de
demonstração.

| Laboratório | Componentes e fundamentos |
|---|---|
| [Fundamentos](foundations.html) | Layout, temas, ícones, divider e APIs JS compartilhadas. |
| [Ações e feedback](feedback-actions.html) | Button, badge, alert, tag, empty state, skeleton, spinner e progress. |
| [Formulários](forms.html) | Input, select, input group, escolhas, range, segmented, rating, data/hora, combobox e upload. |
| [Navegação](navigation-disclosure.html) | Navbar, breadcrumb, pagination, accordion, tabs, collapse, stepper, nested menu e tree view. |
| [Overlays](overlays-commands.html) | Dropdown, tooltip, hover card, popover, offcanvas, modal, alert dialog, command palette, toast e notification center. |
| [Conteúdo e dados](content-data.html) | Card, tile, carousel, timeline, charts, table e DataTable. |

## Leitura recomendada

1. Abra o laboratório da família de componentes.
2. Navegue pela âncora do componente e leia o contrato antes de copiar o
   código.
3. Interaja com o preview e use **Copiar código** para obter o markup que o
   compõe.
4. Consulte a página equivalente em [`docs/components/`](../docs/components/)
   para a referência completa da API pública.

## Integração e templates

- [`kitchen-sink.html`](kitchen-sink.html) continua como smoke test compacto:
  ele confere a convivência dos componentes, não substitui estes laboratórios.
- [`templates/`](templates/README.md) contém páginas completas de produto e
  aponta para os laboratórios sempre que um componente precisar de consulta
  detalhada.

## Fontes executáveis

Os arquivos em `examples/` preservam a demonstração funcional de origem dos
laboratórios. Eles não fazem parte da navegação editorial nem da descoberta
automática de screenshots; existem para que cada seção tenha uma fonte de
markup única e verificável.
