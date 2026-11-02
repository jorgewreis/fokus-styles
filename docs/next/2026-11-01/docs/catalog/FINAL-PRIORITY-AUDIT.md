> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Auditoria final de prioridades — catálogo 154

Base desta rodada: `8df3f39`. Esta é uma revisão dos defeitos prioritários
identificados nas auditorias anteriores, não certificação completa dos 56
componentes ou de toda aplicação que use os 154 exemplos. O catálogo continua
next, não publicado e com cobertura parcial explícita.

> Registro histórico desta base. A rodada posterior
> `DISABLED-ACTIVATION-AUDIT.md` trata disabled de TreeView/Tabs/NestedMenu,
> default de links indisponíveis e pertencimento Tabs, com políticas explícitas.
> Os demais limites permanecem; não interpretar a tabela abaixo como status
> corrente sem consultar esse complemento.

## Corrigidos nesta rodada

- DataTable: pageSize fracionário entre 0 e 1 produzia zero, linhas invisíveis e
  pageCount infinito. Agora usa fallback 10; valores >=1 continuam arredondados
  para baixo e precedência do atributo sobre opção permanece. Tipos de sort none
  e getters readonly pageCount/rowCount alinhados ao runtime existente.
- Tag: construção/setLoading(false) não reabilitam disabled pré-existente do
  consumidor. Rastreia somente botões desabilitados pela própria instância. A
  fixture loading-recovery libera explicitamente o disabled que sua aplicação
  forneceu no HTML, preservando o bloqueio antes da inicialização JS.
- Stepper: entradas não inteiras/NaN/infinitas são rejeitadas antes de perder a
  seleção atual; inteiros fora da faixa conservam clamp. Retornos boolean
  existentes passam a constar nos tipos. Complete continua não idempotente.

## Pendências confirmadas e impacto

| Prioridade | Limite confirmado | Impacto e orientação temporária |
|---|---|---|
| Alta, interação | TreeView não implementa disabled para seleção/expansão/navegação | Não representar indisponibilidade só com ARIA/classe. Definir contrato completo para foco e expansão antes de implementar; autorização permanece na aplicação. |
| Alta, interação | Tabs e NestedMenu consideram só `.is-disabled` em partes da navegação | Botão nativamente disabled pode ser selecionado pelo Tabs ou travar setas no NestedMenu. Usar classe e semântica coerentes; correção futura precisa predicate comum e regressões de foco. |
| Alta, interação | NestedMenu retorna para link `.is-disabled` sem cancelar default | Ativação nativa/sintética pode navegar. Preferir button disabled, não associar ações indisponíveis; não confundir com a guarda já corrigida do Dropdown. |
| Média, consistência | Tabs.show aceita alvo externo/disabled; alias do alvo pode emitir detail.target nulo | Validar alvo pertencente/habilitado e usar data-fs-target. Guard de pertencimento e alias devem ser tratados juntos com o contrato de seleção. |
| Média, teclado | Tabs manual não transfere roving tabindex ao mover foco; Enter/Espaço dependem do elemento | Usar button; Tab de retorno pode focar selecionada em vez da última focada. Exige browser para decidir/validar sequência. |
| Média, fluxo | Stepper complete pode ocorrer em qualquer passo e emite eventos novamente em chamadas repetidas; linear não bloqueia goTo programático | Validar em beforechange e tornar conclusão externa idempotente. Mudar isso seria mudança de comportamento, não mero guard de índice. |
| Média, estado | Tag protected é visual; disabled não bloqueia dismiss programático | Usar veto cancelável e regra de negócio. Causas concorrentes no mesmo atributo disabled não podem ser inferidas; documentadas. |
| Média, entrada | Upload avançado não valida NaN em progresso, MIME/tamanho/contagem; DataTable sort tipado não valida datas/números de negócio | Validar valores finitos/arquivos no consumidor e no backend; não prometer controles inexistentes. |
| Média, temporização | Toast data-delay e Carousel interval ainda aceitam configurações inválidas segundo conversão/fallback existentes | Fornecer duração finita positiva. Correção futura deve especificar política de fallback sem silenciosamente mudar delay0. |
| Baixa, atualização | Select/Tabs/TreeView e outras estruturas são snapshots; dispose nem sempre restaura markup original | Seguir docs de ciclo de vida e recriar componentes após mudanças estruturais. Não prometer reatividade genérica. |

Nenhum item acima é autorização de negócio. Tests que registram limites
conhecidos são evidência diagnóstica e devem ser substituídos quando corrigidos,
não um motivo para perpetuar defeitos.

## Evidências e limites de validação

Regressões novas exercitam fronteiras de pageSize, propriedade de disabled,
índices Stepper e quatro limites de navegação. Documentação e hashes correntes
são revalidados sem apagar snapshots anteriores; uma fixture Tag mudou apenas
no script de conclusão. Nenhum exemplo removido ou acrescentado.

Browser/a11y/visual dependem de executável Chromium ausente neste ambiente.
Passar JSDOM, tipos ou contraste calculado não prova layout, leitor de tela,
teclado real, segurança ou conformidade de uma aplicação. Sem publicação,
update de branch remoto/PR ou repetição de operação bloqueada.

## Gates e tamanho da integração

- 982/982 unitários em 75 arquivos; catálogo 16/16.
- Build, lint, tipos, docs, package, consumidores React 18/19 (tipos estritos e
  SSR), contraste 57 pares e size:check aprovados.
- JS gzip 26.665 bytes: +49 neste lote, +335 desde 26.330 anterior ao endurecimento.
  Teto 26.688 explicitamente autorizado (+64), margem 23; nenhum limite CSS mudou.
  Guardas são mínimas; a coleção Tag mantém propriedade em chamadas/replacements,
  sem retirar salvaguardas por tamanho. Controle negativo acima do teto falhou
  corretamente; bundle restaurado byte a byte voltou a passar.
- Browser 21 casos selecionados (incluindo novos DataTable/Stepper e fixtures
  motion/Tag), a11y e visual invocados; impedidos no launch por Chromium ausente,
  sem execução dos corpos. Não houve regravação de snapshots.
- auditRows histórico e registros de revalidação anteriores conferidos intactos.
