# Matriz de utilitários

Esta matriz é o inventário público da camada `fs-u-*`. Ela relaciona cada grupo ao contrato
de tokens, responsividade e acessibilidade. A implementação fonte fica em
`packages/fokus-utilities/scss/utilities/`.

| Grupo | Fonte | Tokens/configuração | Responsivo | RTL/dark | A11y principal |
|---|---|---|---|---|---|
| Layout/columns | `layout.scss` | `layout`, `columns`, `$spacers` | Sim | Parcial / herdado | Não corte conteúdo focável. |
| Display | `display.scss` | `display`, `responsive` | Sim | Neutro | `display:none` remove da árvore acessível. |
| Flexbox | `flex.scss` | `flex`, breakpoints | Sim | Neutro | Preserve a ordem do DOM. |
| Grid | `grid.scss` | `grid`, breakpoints | Sim | Neutro | Evite reordenar leitura e teclado. |
| Spacing | `spacing.scss` | `$spacers` | Sim | Sim | Não use espaçamento para esconder conteúdo. |
| Sizing | `sizing.scss` | `$fs-utility-sizes` | Sim | Inline/block disponível | Teste zoom e reflow. |
| Typography | `typography.scss` | `$font-size-*`, `$font-weight-*` | Parcial | Neutro | Preserve contraste e legibilidade. |
| Borders/effects | `borders.scss`, `effects.scss` | raios, cores, sombras | Base | Sim | Cor não é único indicador. |
| Motion | `motion.scss`, `transforms.scss` | duração/easing | Base | Neutro | Respeita reduced motion. |
| Interatividade | `interactivity.scss` | `interactivity` | Base | Neutro | Não cria semântica de controle. |
| Helpers | `helpers.scss`, `api.scss` | `helpers`, `$fs-utilities` | Base | Neutro | Aspect/object/safe-area são opt-in; não substituem semântica. |
| Visibility/states | `visibility.scss`, `states.scss` | `states` | Base | Sim | Focus-visible, forced colors e skip link. |

## Contratos semânticos adicionais

| Grupo | Classes | Tokens/fallback | Estados | Observação |
|---|---|---|---|---|
| Cores sutis | `fs-u-bg-{cor}-subtle`, `fs-u-border-{cor}-subtle`, `fs-u-text-{cor}-emphasis` | `--fs-color-{cor}-*` com fallback Sass | Light/dark/forced colors | Não use cor como único indicador. |
| Geração Sass | `$fs-utilities`, `fs-generate-utility` | mapas Sass públicos | responsivo opcional | Sem JIT ou valores arbitrários. |
| Helpers visuais | `fs-u-aspect-*`, `fs-u-object-*` | valores estáticos | base | Preserve `alt`, proporção e conteúdo. |
| Profundidade | `fs-u-z-*` | `--fs-z-*` | base | Use somente em camadas justificadas. |

## Organização recomendada

O projeto separa fundamentos, layout, forms, components, helpers e utilities. Componentes
prontos devem ser usados quando houver semântica, estado ou JavaScript associado; utilitários
devem ser usados para composição local e previsível. A API Sass declarativa permite estender
escalas sem criar classes arbitrárias nem duplicar os aliases históricos.

## Regras de qualidade

- Novas classes devem usar `fs-u-`, valores da escala ou Custom Properties.
- Classes responsivas são mobile-first e usam os breakpoints existentes.
- Utilitários não devem conter HTML, JavaScript, ARIA ou efeitos colaterais.
- Componentes continuam responsáveis por semântica, estados complexos e gestão de foco.
- Recursos modernos devem ter fallback documentado em [suporte de navegadores](browser-support.md).
- Toda classe pública precisa de exemplo ou referência na documentação.
