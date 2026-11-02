> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Variantes, estados e tokens — candidato local

Base: commit 68bc915 do catálogo expandido; matriz de lacunas de 31/10/2026.
Foram acrescentadas 18 fixtures: três por componente (variants, states,
tokens). Esta frente passou de 56 a 74 exemplos. Após integrar também estados
de formulários, opções interativas, conteúdo, feedback e Navigation, o catálogo contém **154 exemplos**, ainda
parcial e não publicado.
Nada em packages/, scss/ ou no comportamento do runtime foi alterado.

| Componente | Exemplos concretos |
| --- | --- |
| Button | Seis cores e outline, pequeno/grande/ícone; disabled nativo e busy; tokens de marca e de hover/active. |
| Alert | Seis cores, inline e estrutura completa; busy e fechar/restaurar local com devolução de foco; geometria e cores. |
| Badge | Seis cores em sólido/soft/outline/split; tamanhos, ponto e contagem circular; tokens próprios e split. |
| Card | Pequeno/grande/horizontal; link real estendido e focus-within; tokens semânticos escopados. |
| Table | Seis cores, bordas/sem bordas/compacta; vazio, prioridade e contêiner rolável; superfície e zebra. |
| DataTable | Moeda com valor numérico separado, duas linhas/página; filtro, vazio, loading, erro e recuperação; tokens de tabela/foco/paginação. |

## Decisões de implementação

- As cores vêm de $theme-colors; as classes foram conferidas no CSS compilado.
- Badges não ganham estados disabled/loading inventados. Cards não ganham
  tokens --fs-card-* inexistentes.
- Button usa --fs-color-bg-subtle para a base personalizada: sobrescrever
  --fs-btn-bg fora de @layer também venceria a atribuição interna de hover.
  --fs-btn-hover-bg e --fs-btn-active-bg continuam consumidos nos estados.
- aria-busy não desabilita teclado sozinho. O exemplo ocupado usa disabled
  nativo; não apresenta aria-disabled como bloqueio funcional completo.
- Fechar/restaurar Alert é JavaScript de demonstração, não API do pacote.
- DataTable usa a instância existente quando autoInit já executou e dispose
  no pagehide; states também remove os listeners locais antes de descartar a
  instância, permitindo reinicialização sem callbacks antigos. Os testes acessam somente linhas não ocultas: o runtime mantém
  outras páginas no DOM.
- A matriz estática pode listar classes de componentes importados como
  lacunas do componente atual; não se pretende eliminar essas ocorrências
  com markup artificial nem declarar cobertura exaustiva.

## Evidência e reprodução

Hashes de fixtures, SCSS de origem, DataTable JS e matriz de entrada:
../../evidence/visual-variants/provenance.json. Recorte original da matriz
em audit-input-subset.json.

Executar a partir da raiz:

    npm run build
    npm run docs:generate
    npm test -- tests/unit/catalog-visual-variants.test.js
    npm run test:catalog
    CHROMIUM_EXECUTABLE=/usr/bin/chromium node scripts/catalog-visual-variants-check.mjs

O script browser inclui 18 previews, temas claro/escuro, larguras 375/1280,
overflow, tokens, fechamento/restauração repetidos, ordenação e filtro.
**Não passou nesta máquina:** Chromium abortou antes da primeira página
(socket Operation not permitted); tentativa de execução ampliada falhou na
montagem bwrap. Portanto layout, contraste, foco visual, RTL, zoom, engines,
forced-colors, movimento e revisão manual de acessibilidade NÃO estão
certificados. Não foram criados snapshots de referência sem inspeção.

Os testes unitários executam o HTML real em jsdom, não validam pixels.
Logs e resultado dos gates estão em ../../evidence/visual-variants/.
