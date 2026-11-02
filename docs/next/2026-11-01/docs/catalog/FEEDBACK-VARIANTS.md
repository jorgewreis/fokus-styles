> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Feedback — 12 exemplos adicionais, cobertura parcial

Base imutável: `519afe3` (SHA completo nas entradas de proveniência). Clone isolado.
Sem alterações em runtime, SCSS, API, maturidade, produção ou publicação.

| Componente | Exemplos | Contratos exercitados |
|---|---|---|
| Stepper | nonlinear-vertical; validation-error | vertical, data-linear=false, alvos explícitos, Enter/Espaço, cancelamento, erro textual, conclusão |
| Toast | timed-progress; persistent-variants | atraso 1500 ms, pausa por foco, retomada, fechamento, reabertura, warning/danger/success |
| NotificationCenter | history-actions | memória, push, escape de texto, não lidas, abrir=ler tudo, remover, limpar, Escape e foco |
| Progress | determinate-states; indeterminate | 0/1/40/60/100, sm/lg, stripes, marcador, mínimo, complete/error, indeterminado sem aria-valuenow |
| Skeleton | shapes-wave; loading-complete | card/avatar/rect/circle/table/wave, busy e conclusão |
| Placeholder | loading-complete | glow/wave/btn decorativos; busy e conclusão |
| EmptyState | recoverable | hidden vence display:flex; recuperação e mensagem textual |
| Timeline | horizontal-states | horizontal, concluído/ativo/falha/pendente, texto sem depender só de cor, time |

## Origem e rastreabilidade

A matriz anterior em `evidence/feedback/gap-input.json` é uma entrada histórica,
não uma medição da árvore atual. Seu hash e fonte foram preservados. Exemplos
novos são composições autorais derivadas dos fontes; não transcrições históricas.
`fixture-provenance.json` registra commit, hash HTML e fontes SCSS/JS. O gerador
registra hashes dos demais arquivos de cada exemplo.

## Limites importantes

- Stepper linear bloqueia o avanço por clique no cabeçalho, mas goTo não é validação
  de negócio. A fixture cancela beforechange e apresenta texto de erro.
- Status/labels, transição busy e foco no painel NotificationCenter são composição
  do consumidor. Não são garantias novas do runtime. Não há focus trap no painel.
- NotificationCenter usa memória: localStorage não é apropriado ao iframe opaco
  do catálogo. Remover histórico não fecha toast; o teardown limpa ambos.
- Toast com progresso tem medição visual própria; testes não certificam precisão
  após múltiplas pausas nem equivalência de leitores de tela.
- Reduced-motion desativa Skeleton/Placeholder. Spinner e progresso indeterminado
  apenas desaceleram na implementação atual; não afirmar animação zero.
- Pares wide/light/LTR e narrow/dark/RTL/reduce não formam produto cartesiano;
  testes browser preparados não equivalem a revisão visual/manual ou WCAG.

## Reproduzir

```sh
npm run build
npm run docs:generate
npm test
npm run test:catalog
npm run docs:check
npm run lint
npm run types:check
npm run package:check
npm run test:browsers -- tests/browser/catalog-feedback.spec.mjs --workers=3
```

Resultados executados e bloqueios estão em `evidence/feedback/RESULTS.md`.
`complete:false` permanece obrigatório.

O catálogo desta branch contém **102 exemplos** (90 da base + 12 deste lote).
A contagem histórica em VISUAL-VARIANTS.md continua referindo-se à base.
