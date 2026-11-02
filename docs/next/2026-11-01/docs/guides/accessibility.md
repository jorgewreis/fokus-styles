> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Acessibilidade

Acessibilidade não é um retrofit no Fokus Styles — foco, teclado e ARIA fazem
parte da API de todo componente interativo desde a primeira versão. Este
guia documenta os padrões **compartilhados** entre componentes; o
comportamento específico de cada um está na sua página em
[Componentes](../README.md#componentes), seção "A11y".

## Foco visível

Os componentes usam `:focus-visible` para destacar foco conforme as heurísticas
do navegador. O indicador pode ser anel ou mudança de superfície; confira o
contrato do componente, inclusive em forced colors. O mixin `focus-ring`
(`packages/fokus-core/scss/tools/_mixins.scss`) oferece um padrão reutilizável.
Não remova o indicador sem fornecer alternativa perceptível e validada.

## Focus trap (modal, offcanvas)

Componentes que sobrepõem a página inteira (Modal, Offcanvas) prendem o
foco dentro de si enquanto abertos — `Tab` no último elemento focável volta
pro primeiro, `Shift+Tab` no primeiro vai pro último
(`packages/fokus-js/js/core/focus.js`, `createFocusTrap()`). Ao abrir, o
foco vai para o primeiro elemento focável do painel; ao fechar, volta para o
elemento que abriu (o gatilho).

## Escape e clique fora

Overlays (Modal, Offcanvas, Dropdown, Popover, Nested Menu) fecham com
`Escape` e com clique fora do painel, por padrão. Componentes com um modo
"preso" (`data-backdrop="static"` no Modal/Offcanvas) desativam essas duas
saídas deliberadamente — para fluxos que exigem uma decisão explícita
(confirmar/cancelar) antes de sair.

## Navegação por teclado em grupos

Não existe uma política única de setas ou `tabindex` para todos os grupos.
Use as páginas individuais e os limites descritos ali; a presença de atributos
ARIA não significa implementação integral de um padrão APG:

- **Tabs**: `ArrowLeft`/`ArrowRight` movem entre abas horizontais; no modo
  vertical, `ArrowUp`/`ArrowDown`. `Home`/`End` vão à primeira/última habilitada.
  O modo manual e alterações dinâmicas de disabled têm
  [limites explícitos](../components/tabs.md), inclusive no roving tabindex.
- **Nested Menu**: `ArrowDown`/`ArrowUp` navegam no nível atual,
  `ArrowRight` abre submenu, `ArrowLeft`/`Escape` fecham. Consulte a
  [política de foco e itens indisponíveis](../components/nested-menu.md).
- **Accordion**: botões nativos permanecem na ordem de `Tab`; `Enter`/`Space`
  ativam o botão. O componente **não implementa setas nem roving tabindex**.

## ARIA injetado automaticamente

Alguns atributos ARIA são calculados e aplicados pelo próprio JS na
inicialização (não precisam ser escritos manualmente no HTML) — por
exemplo, Tabs aplica `role="tablist"`/`role="tab"`/`aria-selected`/
`aria-controls` aos elementos com `data-fs="tabs"`. Onde isso acontece, a
página do componente avisa explicitamente; o resto (`aria-label` em botões
sem texto visível, `alt` em imagens, etc.) é responsabilidade de quem
escreve o HTML — o framework não adivinha texto alternativo.

## `prefers-reduced-motion`

Toda transição de altura acionada por JS (Collapse, Accordion, Toast via
`packages/fokus-js/js/core/transition.js`) verifica
`window.matchMedia("(prefers-reduced-motion: reduce)")` e pula direto para
o estado final — sem animação — quando o usuário pediu menos movimento no
sistema operacional. A camada base do CSS também reduz automaticamente
transições e animações declaradas pelo framework quando essa preferência está
ativa. Se você adicionar uma animação própria, preserve o estado final e
teste o comportamento com `prefers-reduced-motion: reduce`.

## Contraste de cor

Os pares de cores padrão têm testes de contraste. `color-contrast()` atua
durante a compilação Sass onde é usado; **não recalcula cores arbitrárias
sobrescritas em runtime**. Botões e badges também usam pares de tokens de
fundo/texto. Ao customizar, escolha e valide ambos, incluindo hover, active,
tema escuro e superfícies ancestrais.
`npm run contrast` (ver [relatório](../reference/contrast-report.md)) audita
os pares programados no script, não toda composição possível da aplicação.
O gate atual exige 4,5:1 nos 57 pares de texto auditados; valide separadamente
controles, indicadores de foco e os estilos finais do consumidor.

## Formulários

Inputs de validação (`.is-valid`/`.is-invalid`) e os textos de apoio
(`.fs-valid-feedback`/`.fs-invalid-feedback`, `.fs-form-text`) são
elementos visuais — associe-os ao input via `aria-describedby` no seu HTML
para que leitores de tela anunciem a mensagem ao focar o campo. O
framework não injeta esse atributo automaticamente, porque o `id` do texto
de apoio é definido por você.

Para Checkbox, Radio e Switch, mantenha o input nativo e associe o texto com
`for`/`id`. Opções relacionadas devem ficar em `fieldset` com `legend`.
Mensagens de ajuda e erro devem ser referenciadas por `aria-describedby`, e
um campo inválido pode usar `aria-invalid="true"` junto de `.is-invalid`.
Switch não recebe `role="switch"` automaticamente; a semântica oficial é a
do checkbox nativo, inclusive para a tecla `Space`.

## Testes automatizados

A regressão visual (`npm run test:visual`, Playwright) cobre
carregamento/interação sem erros de console, mas não é um gate de
acessibilidade. `npm run test:a11y` roda o axe-core (regras WCAG 2.1 A/AA)
 contra cada laboratório em `mockup/*.html` (claro e escuro) e contra as
 fontes executáveis em `mockup/examples/*.html`; o build falha ao encontrar
violações (nome acessível ausente, contraste insuficiente, papel ARIA
inválido etc.) — roda no CI a cada PR. Veja a cobertura por componente na
[matriz de acessibilidade](../reference/accessibility-matrix.md).

Mesmo com o gate automatizado, valide manualmente com um leitor de tela e
navegação só por teclado antes de considerar um componente pronto — axe
cobre um subconjunto de regras verificáveis por máquina (contraste, nomes,
papéis), não a experiência real de uso (ordem de leitura, clareza dos
anúncios, foco percebido).
