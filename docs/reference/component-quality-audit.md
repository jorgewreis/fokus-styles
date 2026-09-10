# Auditoria de qualidade dos componentes

Esta matriz transforma a revisão visual dos componentes em critérios repetíveis. Ela deve ser
revisitada quando um componente ganhar novo estado, token ou comportamento JavaScript.

| Grupo | Estados mínimos | Tema/RTL | Acessibilidade | Situação |
|---|---|---|---|---|
| Button | hover, active, focus-visible, disabled, loading | claro/escuro e propriedades lógicas | nome acessível, teclado e área de interação | coberto |
| Forms | valid, invalid, readonly, disabled, loading | claro/escuro, RTL e forced colors | label, `aria-invalid`, `aria-describedby` e feedback persistente | coberto |
| Alert/Badge | variantes semânticas e dismiss | tokens adaptativos | não depender apenas da cor | coberto |
| Card/Tile | hover, focus, stretched link | superfície e borda semânticas | link real e ordem do DOM | coberto |
| Modal/Offcanvas | abertura, fechamento, focus trap, Escape | backdrop e reduced motion | foco devolvido e `aria-modal` | coberto |
| Dropdown/Tabs/Accordion | teclado, active, disabled | RTL e foco | papéis e relações ARIA | coberto |
| Toast/Progress/Spinner | loading, pausa, estado final | dark mode e reduced motion | `aria-live`, progresso textual quando necessário | coberto |
| Navigation | foco, active, collapse | RTL e viewport estreita | landmarks e teclado | coberto |

## Procedimento

Para qualquer alteração de componente:

1. conferir tokens claros e escuros;
2. testar conteúdo longo e viewport estreita;
3. navegar sem mouse;
4. ativar forced colors e reduced motion;
5. executar Axe no exemplo correspondente;
6. atualizar a página do componente e o laboratório visual;
7. medir impacto no bundle.

Os componentes continuam responsáveis por semântica, estados complexos e foco. Utilitários
podem ajustar composição, mas não devem ser necessários para que um componente funcione.
