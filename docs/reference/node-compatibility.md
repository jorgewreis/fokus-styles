# Compatibilidade Node e toolchain

## Três contratos diferentes

- **CSS pronto:** servir ou incluir CSS no navegador não executa Node. A
  compatibilidade é a de [navegadores](browser-support.md), não a do build.
- **Pacote npm agregado:** inclui CSS, fontes, JavaScript, ícones, wrappers React
  e CLI. `sass`, `postcss`, `autoprefixer` e `cssnano` são dependências de produção,
  mesmo quando o consumidor só usa CSS. `npm install --omit=dev` não as remove.
  A CLI compila fontes; os requisitos dessas dependências continuam relevantes.
- **Desenvolvimento:** instalar o checkout, compilar e testar acrescenta jsdom,
  Vite/Vitest, Stylelint, Playwright e as demais ferramentas do lockfile.

O pacote agregado agora declara `^22.11.0 || ^24.11.0 || >=26.0.0`, alinhado
às dependências **de produção**, não ao piso mais alto de desenvolvimento.
Node 18/20 já não satisfaziam a árvore instalada por causa de cssnano, mesmo
quando a raiz declarava `>=18`. A correção torna esse impedimento explícito no
manifesto; não altera dependências, artefatos nem os manifests dos workspaces
privados (CLI, React e ícones mantêm suas declarações locais).

**Risco contratual:** restringir o metadado `>=18` é uma mudança visível para
consumidores e pode ser considerada quebra de contrato na próxima publicação,
ainda que a instalação agregada estrita já falhasse nessas versões. Esta mudança
não publica uma versão npm. Sua política de versionamento deve ser revisada
antes da release. Não usar o requisito da CLI como requisito do CSS no navegador.

## Interseção dos requisitos declarados

Análise do `package-lock.json` de `f052b05bea070f7175a759951657d73e73f9c63b`,
com os manifests dos workspaces, revalidada em 10/11/2026. Não há alteração de
resolução de dependências nesta correção; somente o espelho de engines da raiz
foi atualizado no lockfile.

| Conjunto do lockfile | Interseção Node (versões estáveis) | Restrição determinante |
| --- | --- | --- |
| Produção, incluindo opcionais | `^22.11.0 || ^24.11.0 || >=26.0.0` | cssnano 8.0.2 e seus plugins |
| Desenvolvimento completo | `^22.13.0 || ^24.11.0 || >=26.0.0` | produção + jsdom 29.1.1 |

Foram conferidas 77 declarações Node em entradas não marcadas `dev` e 253 na
árvore completa, incluindo raiz, workspaces e opcionais de outras plataformas.
Cada faixa acima é subconjunto de todas as declarações do respectivo conjunto.
cssnano fornece o limite externo de produção; jsdom eleva apenas o piso da linha
22 para 22.13.0 no desenvolvimento. Sass/chokidar (`>=20.19.0`), Vite
(`^20.19.0 || >=22.12.0`), Stylelint e as demais entradas não estreitam mais
essas interseções. A faixa não é simplesmente `>=22.13`: Node 23, Node 25 e
Node 24 anterior a 24.11 ficam fora.

Isso é compatibilidade **de metadados**, não garantia de execução em todas as
versões, sistemas operacionais ou integrações. Uma instalação nova do tarball
resolve os intervalos das dependências de produção novamente, sem o lockfile
do repositório; portanto sua árvore deve ser conferida separadamente.

## Matriz já executada, sem duplicar o PR existente

O [PR #49](https://github.com/jorgewreis/fokus-styles/pull/49), commit
`f9eaddb178729970e6c56a3c650fb09df241b047`, mantém a matriz investigativa.
A [execução 41912443251](https://github.com/jorgewreis/fokus-styles/actions/runs/41912443251)
passou em 04/11/2026 nos dois mínimos, com versões efetivas nos logs:

| Node | npm | Resultado |
| --- | --- | --- |
| 22.13.0 | 10.9.2 | Todos os passos passaram |
| 24.11.0 | 11.6.1 | Todos os passos passaram |

Inclui `npm ci --engine-strict`, lint, build, 485 testes unitários, tipos,
documentação, contraste, orçamento de tamanho, visual, acessibilidade e smoke
do mesmo tarball instalado em diretório isolado. O smoke verifica entradas CSS,
compilação SCSS, importação JS, CLI `--help` e tipos. React teve somente caminho
de declarações conferido, **não** peer/runtime instalado e testado.

Esta evidência pertence ao commit acima, não a futuros commits nem ao pacote
atualmente publicado no registry. A matriz do PR #49 não está no main e sua
aprovação/merge é uma decisão separada. Esta correção não copia nem modifica
seu workflow ou a publicação. Node 22.11.0 (piso apenas de produção), Node 26+
e outras plataformas não foram homologados por essa execução histórica.

## Validação adicional desta correção

Em 10/11/2026, o mesmo tarball local com o manifesto corrigido foi instalado
com `--engine-strict --ignore-scripts` em consumidores isolados, em Node
22.11.0, 24.11.0 e 26.0.0, com npm 11.9.0. Passaram leitura de entradas CSS,
importação dos exports JS, CLI `--help`/`--version`, build do SCSS completo com
`--minify`, geração de tema e análise do CSS. Os consumidores resolveram
Sass 1.108.1, cssnano 8.0.10, PostCSS 8.5.32 e Autoprefixer 10.6.2. Isso confirma
que a resolução nova do consumidor difere do lockfile do checkout, sem alterá-lo.

O checkout foi instalado por `npm ci --engine-strict` em Node 22.13.0,
24.11.0 e 26.0.0, com npm 11.9.0. Lint, build, 458 testes unitários,
tipos, docs, contraste e size passaram. No Node 26, o primeiro teste revelou
conflito entre Web Storage nativo e jsdom; `vitest.config.mjs` desabilita o
Web Storage nativo somente nos workers de teste. O jsdom continua fornecendo
o armazenamento do navegador e os 458 testes passam nas três versões.
Nenhum polyfill ou mudança foi adicionado ao pacote distribuído.

A tentativa de instalar a árvore completa de desenvolvimento em Node 22.11.0
falhou com `EBADENGINE`, como esperado: o piso de produção não é o piso do
checkout. Foram verificadas rejeições de metadados para Node 18/20, 22.10, 23,
24.10 e 25, e aceitação para 22.11, 22.13, 24.11 e 26.0.

Visual e acessibilidade locais não executaram porque o download Chromium
retornou um ZIP inválido. Esses passos continuam obrigatórios no CI; a matriz
histórica acima não substitui a validação do commit final.

Node 26.0.0 foi testado especificamente; `>=26` não significa homologação de
todas as versões futuras. React runtime/peer e sistemas diferentes de Linux
não foram testados nesse smoke.

## Ambiente e validação contínua

Para desenvolvimento, use a versão atualizada da linha 22 (a partir de 22.13.0)
ou 24 (a partir de 24.11.0). Mínimos são pontos de teste, não recomendação para
permanecer em patches antigos. CI, release e atualização visual selecionam a
linha 22 flutuante; agora registram Node/npm e usam `npm ci --engine-strict`.
O lockfile fixa dependências, mas não fixa o patch Node nem o npm desses jobs.
O npm do release pode diferir dos npms da matriz e precisa ser validado no
próprio fluxo de release; a matriz não homologa publicação no registry.

Para reproduzir as verificações do checkout:

```sh
node --version
npm --version
npm ci --engine-strict
npm run lint
npm run build
npm test
npm run types:check
npm run docs:check
npm run contrast:check
npm run size:check
npx playwright install --with-deps chromium
npm run test:visual
npm run test:a11y
```

Não use `--force` ou desative engines para apresentar uma instalação incompatível
como aprovada. Mudanças futuras no lockfile exigem recalcular a interseção e
reexecutar mínimos e consumo isolado. O manifesto corrigido não recupera suporte antigo; oferecer uma distribuição
separada sem dependências de CLI seria uma mudança de arquitetura fora desta
correção. Antes de uma release, revisar o impacto de versionamento da mudança
de engines e manter os testes de consumidores.
