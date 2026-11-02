> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../README.md).

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
| [Fundamentos](../REFERENCIAS-NAO-INCLUIDAS.md#ref-fe5e43e2c42f) | Layout, temas, ícones, divider e APIs JS compartilhadas. |
| [Ações e feedback](../REFERENCIAS-NAO-INCLUIDAS.md#ref-18368fc375d3) | Button, badge, alert, tag, empty state, skeleton, spinner e progress. |
| [Formulários](../REFERENCIAS-NAO-INCLUIDAS.md#ref-b9f51b567074) | Input, select, input group, escolhas, range, segmented, rating, data/hora, combobox e upload. |
| [Navegação](../REFERENCIAS-NAO-INCLUIDAS.md#ref-56a689da4fd7) | Navbar, breadcrumb, pagination, accordion, tabs, collapse, stepper, nested menu e tree view. |
| [Overlays](../REFERENCIAS-NAO-INCLUIDAS.md#ref-f1ae1ee7472b) | Dropdown, tooltip, hover card, popover, offcanvas, modal, alert dialog, command palette, toast e notification center. |
| [Conteúdo e dados](../REFERENCIAS-NAO-INCLUIDAS.md#ref-1ad9bfa240d3) | Card, tile, carousel, timeline, charts, table e DataTable. |
| [Utility lab](../REFERENCIAS-NAO-INCLUIDAS.md#ref-d2f96ede3ab1) | Grid, Flexbox, spacing, sizing, typography, overflow, states e motion. |

## Leitura recomendada

1. Abra o laboratório da família de componentes.
2. Navegue pela âncora do componente e leia o contrato antes de copiar o
   código.
3. Interaja com o preview e use **Copiar código** para obter o markup que o
   compõe.
4. Consulte a página equivalente em [`docs/components/`](../docs/components/)
   para a referência completa da API pública.

## Estados de validação visual

Os laboratórios agregados também possuem controles na barra superior para
avaliar o comportamento atual em condições importantes de uso:

- **Usar tema escuro** alterna o tema do laboratório e de seus previews;
- **Testar RTL** aplica direção da direita para a esquerda a todos os previews;
- **Reduzir movimento** simula `prefers-reduced-motion` no conteúdo exibido;
- **Simular alto contraste** aplica uma aproximação visual de `forced-colors`.

Esses controles são apenas ferramentas de inspeção dos mockups e não fazem
parte do bundle de produção. Use-os junto com teclado, zoom, textos longos e
estados de erro para identificar melhorias antes de alterar componentes.

## Integração e templates

- [`kitchen-sink.html`](../REFERENCIAS-NAO-INCLUIDAS.md#ref-b06ecc4747ba) continua como smoke test compacto:
  ele confere a convivência dos componentes, não substitui estes laboratórios.
- [`templates/`](templates/README.md) contém páginas completas de produto e
  aponta para os laboratórios sempre que um componente precisar de consulta
  detalhada.

## Fontes executáveis

Os arquivos em `examples/` preservam a demonstração funcional de origem dos
laboratórios. Eles não fazem parte da navegação editorial nem da descoberta
automática de screenshots; existem para que cada seção tenha uma fonte de
markup única e verificável.
