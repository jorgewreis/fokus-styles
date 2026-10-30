# Trabalhando com Fokus Styles

## Neste repositório (manutenção)
- Leia `CONTRIBUTING.md`, `docs/reference/definitions.md` e
  `docs/reference/stability.md` antes de alterar a API.
- Consulte `USAGE.md` para o contrato de consumo e `docs/README.md` para os
  detalhes. Confirme classes/estados no SCSS e JS da versão deste checkout.
- Reutilize tokens, componentes e utilitários antes de criar variantes.
  Uma necessidade recorrente pode justificar extensão documentada e testada;
  uma composição exclusiva de um aplicativo não pertence automaticamente ao núcleo.
- Edite fontes em `packages/`/`scss/`, nunca os bundles gerados em `dist/`.
- Valide com `npm run lint`, `npm run build`, `npm test`,
  `npm run types:check`, `npm run docs:check` e `npm run package:check`.
  Mudanças visuais/interativas também exigem os testes visuais e de acessibilidade
  descritos em `CONTRIBUTING.md`. Não publique ou faça deploy sem autorização.

## Em aplicativos consumidores
Leia `node_modules/fokus-styles/USAGE.md` e a versão instalada em
`node_modules/fokus-styles/package.json`. As instruções de governança do
aplicativo continuam válidas; este arquivo não substitui o `AGENTS.md` dele.
Não presuma que toda classe com prefixo `fs-` encontrada no aplicativo pertence
à API oficial: confirme na distribuição instalada antes de reutilizar.
