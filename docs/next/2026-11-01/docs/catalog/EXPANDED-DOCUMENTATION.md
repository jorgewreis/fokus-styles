> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Documentação ampliada — candidato local

As 56 páginas de componentes foram ampliadas em relação à árvore
`d0fa95f122e97cdf5490416c8d596412ffe63d66`. O baseline e o método de contagem
estão em `expanded-documentation-baseline.json`. Dobrar texto fora de blocos
não prova completude: a revisão confronta propósito, integração, exemplos,
API, acessibilidade e limites com a implementação desta versão.

O catálogo continua candidato `next`, não publicado e com cobertura completa
marcada como falsa. As receitas de preview curadas não foram promovidas a
novas implementações apenas porque a prosa cresceu. Snippets das páginas
continuam referências não executáveis no preview até revisão específica.

## Preservação das evidências anteriores

Alguns exemplos antigos foram substituídos por markup mais correto ou por
receitas completas. Os fixtures de preview anteriores permanecem intactos.
Quando seu trecho de origem não está mais na documentação atual,
`fixture-provenance.json` registra `documentationEvidence.historical`: cópia
integral de bytes do Markdown da árvore base, seu hash, caminho original e
linha de extração. Essas cópias estão em `history/` com extensão `.md.txt`
para distingui-las das páginas atuais de leitura.

O teste continua exigindo trecho exato, linha exata, hash do snapshot, hash
do fixture e transformações reproduzíveis. Também confere o hash da página
atual e a indicação explícita de presença ou ausência do trecho. Não se
rotula uma evidência histórica como exemplo extraído do texto novo e não se
ignora uma divergência de proveniência. Audit rows históricas permanecem
preservadas; hashes de referências correntes são regenerados separadamente.

## Escopo das verificações

Os lotes usam código real compilado e testes DOM, além de conferência de
classes, tokens e contratos. A consolidação precisa dos gates de unidade,
catálogo, build, lint, tipos e pacote. Esses resultados não substituem
navegador real, inspeção visual, axe, leitor de tela ou integração de backend.
Não há publicação, merge ou promoção de estabilidade implícita nesta rodada.
