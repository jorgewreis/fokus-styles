> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Runtime: pausas/progresso de Toast e índices de Carousel

Base: `7171c75493932d9f76d5e9e04fabb571d337dcde`.
Catálogo preservado: 154 exemplos / 56 componentes. Sem alteração de fixture,
SCSS, tipos, exports ou assinatura pública.

## Efeitos e compatibilidade

- Toast mantém hover e foco como causas independentes. A saída de uma causa não
  retoma o timer enquanto a outra permanece; foco entre descendentes não retoma.
- Progresso é derivado do tempo restante menos o tempo ativo decorrido. Pausar
  não subtrai duas vezes e retomar não recalcula desde a duração original.
  Funciona inclusive com relógio iniciando no epoch zero. Hide limpa as causas;
  dispose continua cancelando timers e removendo listeners sem remover o DOM.
- Carousel ignora valores não inteiros/NaN/infinitos e não faz coerção de strings
  ou outros tipos. Índices inteiros mantêm wrap (inclusive negativos); valores
  inválidos não removem o slide ativo, não alteram ARIA/inert/indicadores e não
  emitem eventos. A rejeição formaliza o contrato number inteiro documentado;
  entradas de formulário precisam conversão/validação pelo consumidor.
- Não se ampliou o lote para normalizar data-delay/interval ou outras APIs.
  Não promete corrigir todas as limitações registradas nas auditorias anteriores.

## Proveniência e orçamento

`runtime-timers-revalidation.json` registra os hashes anteriores e atuais das
referências correntes. Registros históricos anteriores não são reescritos.
Catálogo gerado novamente a partir dos arquivos atuais.

JS gzip 26.616 bytes: +67 sobre a base 26.549 e +286 cumulativos desde 26.330.
O teto anterior 26.560 seria excedido em 56; revisão explicitamente autorizada
para 26.624 (+64), margem 8. Nenhuma guarda foi removida; limites CSS preservados.
Controle negativo injeta carga somente no bundle de teste, verifica falha do
size:check, restaura os bytes exatos e confirma aprovação do bundle real.

## Verificação

- 948/948 unitários, 73 arquivos; catálogo 16/16.
- Build, lint, tipos, docs, empacotamento, React 18/19 (tipos estritos e SSR),
  contraste 57 pares e size:check.
- Dois novos cenários browser × três engines (6 casos) adicionados. Browser,
  a11y e visual invocados com fail-fast; nenhum corpo executou porque falta
  Chromium `chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell`.
  Não há certificação visual/axe; executar no ambiente equipado antes de publicar.
- Checkpoint inclui bundle completo verificável, relatório e logs. Nenhuma
  publicação, update de PR/branch remoto ou repetição de ação bloqueada.
