> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Templates prontos

Estes templates fazem parte dos exemplos do [Fokus Styles](https://styles.fokuscloud.com.br/),
o sistema visual do [ecossistema Fokus Cloud](https://www.fokuscloud.com.br/).
Consulte o [GitHub](https://github.com/jorgewreis/fokus-styles) para o código e
o [npm](https://www.npmjs.com/package/fokus-styles) para a versão publicada.

4 páginas completas, prontas para copiar como ponto de partida de um
projeto real — diferente dos [laboratórios de `mockup/`](../README.md), que
documentam componentes e suas configurações, cada arquivo aqui monta vários
componentes juntos numa página só, exatamente como ela apareceria em produção.

Todos usam só CSS/JS já publicado (`../../dist/`) — sem build, sem
dependência nova — e têm tema escuro funcional (botão no topo, mesmo
mecanismo de [`docs/guides/dark-mode.md`](../../docs/guides/dark-mode.md)).

| Arquivo | O que mostra |
|---|---|
| [`dashboard.html`](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-33fef5b67258) | Navegação lateral, KPIs, gráfico (tokens `--fs-chart-*`) e DataTable. |
| [`auth.html`](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-1c805156ab50) | Login/cadastro com Tabs, painel dividido e toggle de visibilidade de senha. |
| [`landing.html`](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-e4898250eb3d) | Página de marketing: hero, recursos, preços (com toggle mensal/anual) e CTA. Marca "Orbit" é fictícia, só para ilustrar o conteúdo. |
| [`admin.html`](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-121695f22216) | Gestão (CRUD) de usuários: DataTable com ações por linha, Modal de criação e Tabs de configurações. |

Nenhum usa classe que não exista no framework publicado — se algo aqui não
funcionar copiado para o seu projeto, é bug, não "mágica do mockup".
