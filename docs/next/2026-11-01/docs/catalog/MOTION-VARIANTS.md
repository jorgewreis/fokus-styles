> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Disclosure, tags e carousel — cinco exemplos adicionais

Base 55ac61f. Composições autorais confirmadas no JS, declarações públicas e SCSS:

- Collapse initial-open começa expandido por aria-expanded=true; sem tamanho/cor
  ou opção inexistente. Eventos shown/hidden não são canceláveis.
- Tag loading-recovery bloqueia dismiss durante loading e usa setLoading(false)
  após simulação local. O callback próprio é removido em pagehide.
- Tag truncated-group conserva texto integral, usa token real de largura e permite
  retorno de foco ao próximo botão de remoção do grupo.
- Carousel manual-fade não usa autoplay; data-drag=false evita gestos no conteúdo.
  Contador e indicadores são sincronizados pelo runtime; teclado é do contêiner.
- Carousel single-static demonstra um slide: sem tab stop próprio, timer ou navegação.

Todos os inicializadores fazem dispose em pagehide. Não há alterações de runtime,
SCSS, upload ou publicação. Aprovação JSDOM não comprova pixel, gestos de toque,
leitor de tela nem animações entre motores. Truncamento precisa de conferência visual.
