# Matriz de acessibilidade por componente

Resumo rápido do que cada componente cobre em teclado, ARIA e gestão de foco.
O detalhe completo (com exemplos) está na seção "A11y" da página de cada
componente em [Componentes](../README.md#componentes); os padrões
compartilhados entre vários componentes (foco visível, focus trap,
`prefers-reduced-motion` etc.) estão no [guia de acessibilidade](../guides/accessibility.md).

Todo laboratório em `mockup/*.html` roda no gate `npm run test:a11y` em tema
claro e escuro. As fontes executáveis em `mockup/examples/*.html` também são
verificadas por axe-core via
Playwright, regras WCAG 2.1 A/AA) no CI — um componente só é considerado
"coberto" abaixo se aparecer em algum mockup testado. Contraste de cor é verificado em dois níveis complementares:
pares de token conhecidos (`npm run contrast`, ver
[contrast-report.md](contrast-report.md)) e, de forma mais abrangente, texto
renderizado de fato nos mockups (via o gate axe).

| Componente | Teclado | ARIA | Gestão de foco | Contraste AA | Coberto por axe (CI) |
|---|---|---|---|---|---|
| [Accordion](../components/accordion.md) | Nativo (`<button>`) | Automático | — | ✓ | Sim |
| [Alert Dialog](../components/alert-dialog.md) | Herdado do Modal | Herdado do Modal | Focus trap + devolve ao gatilho | ✓ | Sim |
| [Alert](../components/alert.md) | Nativo quando houver link/botão | Manual (`role="alert"`/`"status"`) | Nenhuma automática | ✓ | Sim |
| [Badge](../components/badge.md) | N/A (decorativo) | N/A | — | ✓ | Sim |
| [Breadcrumb](../components/breadcrumb.md) | Nativo (links) | Manual (`<nav aria-label>`) | — | ✓ | Sim |
| [Button](../components/button.md) | Nativo | Manual (`aria-label` em só-ícone) | Foco visível padrão | ✓ | Sim |
| [Card](../components/card.md) | Nativo (stretched-link) | — | Foco no link real | ✓ | Sim |
| [Carousel](../components/carousel.md) | Automático (setas/Home/End e arraste) | Automático (`aria-hidden`, `aria-current`, toggle) | Recebe foco no contêiner; autoplay pausável | ✓ | Sim |
| [Checkbox](../components/checkbox.md) | Nativo (Space) | Nativo + `aria-describedby` manual | Foco visível no controle | ✓ | Sim |
| [Collapse](../components/collapse.md) | Nativo (gatilho) | Automático | — | ✓ | Sim |
| [Divider](../components/divider.md) | N/A | Implícito (`<hr>`) | — | ✓ | Sim |
| [Dropdown](../components/dropdown.md) | Automático (setas/Escape) | Automático | Primeiro item ao abrir; devolve ao gatilho | ✓ | Sim |
| [Empty State](../components/empty-state.md) | N/A | Manual (`aria-live` opcional) | — | ✓ | Sim |
| [File Upload](../components/file-upload.md) | Nativo | Nativo | — | ✓ | Sim |
| [Input / Select estático](../components/input.md) | Nativo | Manual (`for`/`id`, `aria-describedby`) | — | ✓ | Sim |
| [Input Group](../components/input-group.md) | Nativo | Manual (`aria-describedby` no addon) | — | ✓ | Sim |
| [Modal](../components/modal.md) | Nativo dentro do trap | Automático (`role="dialog"`) | Focus trap; devolve ao gatilho | ✓ | Sim |
| [Navbar](../components/navbar.md) | Nativo | Manual (`<nav aria-label>`) | — | ✓ | Sim |
| [Nested Menu](../components/nested-menu.md) | Automático (setas, Escape por nível) | Automático | Move foco entre níveis | ✓ | Sim |
| [Notification Center](../components/notification-center.md) | Automático (Escape) | Automático | Devolve ao gatilho | ✓ | Sim |
| [Offcanvas](../components/offcanvas.md) | Nativo dentro do trap | Automático (`role="dialog"`) | Focus trap; devolve ao gatilho | ✓ | Sim |
| [Pagination](../components/pagination.md) | Nativo (links) | Manual (`<nav aria-label>`, `aria-current`) | — | ✓ | Sim |
| [Popover](../components/popover.md) | Automático (Escape) | Automático | Devolve ao gatilho | ✓ | Sim |
| [Spinner / Progress](../components/progress.md) | N/A | Manual (`role`+`aria-label`/`aria-valuenow`) | — | ✓ | Sim |
| [Radio](../components/radio.md) | Nativo (setas no grupo) | Nativo + `fieldset/legend` manual | Foco visível no controle | ✓ | Sim |
| [Rating](../components/rating.md) | Nativo (setas no grupo) | Manual (`aria-label` por estrela) | — | ✓ | Sim |
| [Segmented Control](../components/segmented-control.md) | Nativo (setas no grupo) | Nativo | — | ✓ | Sim |
| [Select (custom)](../components/select.md) | Herdado do Dropdown | Automático (`role="listbox"`) | Herdado do Dropdown | ✓ | Sim |
| [Skeleton](../components/skeleton.md) | N/A | Manual (`aria-busy` opcional) | — | ✓ | Sim |
| [Stepper](../components/stepper.md) | Automático (passos clicáveis) | Automático (`aria-current="step"`) | — | ✓ | Sim |
| [Switch](../components/switch.md) | Nativo (Space) | Checkbox nativo; nome manual sem texto | Foco visível no trilho | ✓ | Sim |
| [Table](../components/table.md) | Nativo | Manual (`scope`, `<caption>`) | — | ✓ | Sim |
| [Tabs](../components/tabs.md) | Automático (roving tabindex) | Automático (`role="tab"`/`"tabpanel"`) | — | ✓ | Sim |
| [Tag](../components/tag.md) | Nativo (botão de fechar) | Manual (`aria-label` descritivo, `aria-busy`) | Foco preservado/transferido após dismiss | ✓ | Sim |
| [Tile](../components/tile.md) | Nativo (link real) | — | Foco no link, não no `::after` | ✓ | Sim |
| [Timeline](../components/timeline.md) | N/A (sem interação própria) | — | — | ✓ | Sim |
| [Toast](../components/toast.md) | Nativo em fechamento e ações | Automático (`role="status"`, `aria-live="polite"`) | Nenhuma automática; pausa em foco/hover | ✓ | Sim |
| [Tooltip](../components/tooltip.md) | Nativo (`focus`/`blur`, ponteiro e Escape) | Automático (`role="tooltip"`, `aria-describedby`) | Nenhuma; foco permanece no gatilho | ✓ | Sim |

## Legenda

- **Nativo**: comportamento do elemento HTML nativo (`button`, `input`,
  links), sem JS do framework.
- **Automático**: o JS do FokusStyles aplica/atualiza o atributo ou o
  comportamento de teclado ao inicializar — nada a fazer no HTML.
- **Manual**: precisa ser adicionado por quem usa o componente (o framework
  não infere texto/contexto).
- **N/A**: componente não interativo por padrão.

## Processo

- Toda contribuição de componente novo segue o checklist de acessibilidade
  do [guia de contribuição](../contributing/contributing.md) antes do merge.
- O gate `npm run test:a11y` roda no CI a cada PR (ver
  [.github/workflows/ci.yml](../../.github/workflows/ci.yml)); uma
  regressão de contraste, nome acessível ou papel ARIA quebra o build.
- Esta tabela é mantida manualmente — ao adicionar/alterar teclado, ARIA ou
  foco de um componente, atualize a linha correspondente na mesma PR.
