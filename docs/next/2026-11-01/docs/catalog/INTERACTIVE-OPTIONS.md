> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Opções e estados interativos — cobertura parcial

Base: `68bc9151030f948ff058d50d76d802e4a3dbf778`. Auditoria de referência:
`/workspace/shared/catalog-gap-audit-20261031/matrix.json`, prioridade P1.
São 11 exemplos adicionais, sem alteração de runtime/SCSS, sem publicação.

| Componente | Exemplos novos | Contrato exercitado em DOM |
| --- | --- | --- |
| Accordion | multiple, always-open | painéis simultâneos, fechar/reabrir, always-open não fecha |
| Modal | static-backdrop, false-option | Escape, clique fora, dismiss, foco restaurado e repetição |
| Dropdown | top-end-disabled, options-precedence | atributos vs opções JS, setas/Home, disabled, Escape |
| Tabs | vertical-manual, vertical-automatic | orientação, foco/seleção separados, Home/End, disabled |
| Tooltip | delays-description, options-precedence, fallback-values | timers, interrupção, foco imediato, ARIA restaurada, defaults numéricos |

Os casos com opções JS descartam eventual instância criada pelo auto-init ESM
antes de criar a instância configurada; getInstance() sozinho preservaria defaults.
Todos os inicializadores reais são executados; pagehide e reinicialização são
verificados. HTML, classes compiladas, IDs/ARIA, hashes e transformações têm
contrato automatizado. As fontes documentais permanecem intactas.

## Semânticas importantes, não corrigidas silenciosamente

- Modal só distingue `backdrop: "static"`; `false` não remove backdrop e não
  bloqueia Escape/clique fora. A fixture explicita o comportamento observado.
- Accordion `data-fs-always-open="true"` impede fechar **qualquer** painel aberto;
  não significa apenas impedir que o último painel feche.
- Tooltip `title`, depois `data-title`, precedem `options.title`. Este último
  funciona como fallback, não como override. Opções geométricas/delays prevalecem
  sobre atributos. Delay inválido vira 0; offset inválido/negativo vira 8.
- Tabs manual usa ativação nativa de button para Enter/Espaço. jsdom testa clique;
  a suite browser testa Enter real. Não se afirma equivalência do teclado nativo
  com dispatchEvent em DOM simulado.
- Dropdown disabled é botão nativamente disabled mais aria-disabled. O exemplo
  não promete bloquear cliques programáticos em links apenas aria-disabled.

## Reproduzir

```sh
npm run build
npm run docs:generate
npm test
npm run test:catalog
npm run lint
npm run types:check
npm run docs:check
npm run package:check
npm run test:browsers -- tests/browser/catalog-interactive-options.spec.mjs
npm run test:catalog:browser
```

A suite nova prepara 11 cenários por engine (Chromium/Firefox/WebKit), captura
local do estado aberto/selecionado, axe, teclado e ciclo de vida. Capturas não
são baselines aprovados. O smoke HTTP geral reconhece que modal static exige
Cancel e que tabs pode incluir botão disabled.

## Lacunas restantes

Não cobre todos os placements/alinhamentos, valores inválidos de placement,
callbacks/eventos, matrizes de tema/RTL/largura/reduced-motion, tokens, touch,
concorrência entre instâncias ou acessibilidade manual. Layout, geometria,
colisão com viewport e foco físico dependem do browser; DOM não os comprova.
Manter `complete:false`; nenhum grau de maturidade foi promovido.
