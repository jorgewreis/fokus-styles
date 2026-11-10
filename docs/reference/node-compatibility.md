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

O `engines.node >=18` da raiz e dos workspaces CLI, React e ícones é uma
declaração legada, não uma homologação da árvore atual. Os workspaces são
privados; não representam pacotes independentes publicados com suporte comprovado.
Não elevamos esse campo nem alteramos dependências nesta correção: isso evitaria
apenas o aviso enganoso, mas também formalizaria uma redução de suporte sem
resolver a distribuição para consumidores antigos. Node 18/20 **não satisfazem**
a árvore atual do pacote agregado. Usar CSS pronto continua independente disso.

## Interseção dos requisitos declarados

Análise do `package-lock.json` de `f052b05bea070f7175a759951657d73e73f9c63b`,
com os manifests dos workspaces, revalidada em 10/11/2026. Não há alteração de
resolução de dependências nesta correção.

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
e outras plataformas não foram homologados por essa execução.

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
reexecutar mínimos e consumo isolado. Resolver a declaração legada do pacote
exige decisão separada entre ajustar distribuição/dependências para preservar
Node antigo ou restringir o contrato declarado após testes de consumidores.
