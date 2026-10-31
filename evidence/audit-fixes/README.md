# Correções da auditoria integrada — 31/10/2026

Base: 2d8f2ba1f60bf3ccfb75e390192376ee5c304613. Trabalho em clone isolado.

- Datepicker/basic nomeia a grade pelo DOM de panelEl (tipado).
- Select/basic localiza o botão adjacente ao selectEl (tipado).
- NotificationCenter/basic descarta Toasts pelo contêiner explícito do HTML.
- DataTable/states aborta os três listeners locais antes de dispose no pagehide.
- VISUAL-VARIANTS distingue a frente histórica 56→74 do total integrado 90.
- Provenance preserva a origem histórica e registra hashes anteriores/atuais.

Os testes novos executam os scripts reais com os componentes reais. Para os
três básicos, uma facade de teste lança erro se o script tentar acessar o
campo não tipado; métodos continuam ligados à instância real. Há dois ciclos
de criação/limpeza; DataTable cobre três ciclos, clicks após dispose e ausência
de callbacks antigos. A contagem 90 é comparada com examples.json.

Build, lint, types, docs e os quatro testes de catálogo passaram. A primeira
execução de package:check encontrou cache npm não gravável em /home/agent;
a repetição usa npm_config_cache=/tmp/catalog-audit-npm-cache.
Logs e exit codes nesta pasta documentam os resultados.

Chromium não executou as páginas: socket() failed: Operation not permitted
durante launch (/usr/bin/chromium), exit 1. Isso não é falha de assertion da
fixture, nem comprovação visual/a11y. Não foram alteradas baselines.

Nenhuma alteração em packages/, scss/ ou runtime; nenhum deploy/publicação.

Resultado final: 57 arquivos / 723 testes unitários passaram; os cinco novos
regressivos também passaram isolados. package:check passou com cache em /tmp:
3 exemplos HTML e contrato do pacote validado (4244 arquivos empacotados).
