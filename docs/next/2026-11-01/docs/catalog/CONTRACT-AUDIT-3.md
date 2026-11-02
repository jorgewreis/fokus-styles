> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Terceira auditoria: navegação, dados e ciclo de vida

Base `2132738`. Catálogo 154/56 preservado; esta rodada não altera exemplos,
runtime, SCSS, tipos, API, PR ou qualquer operação externa bloqueada.

> Registro histórico da base acima. O lote posterior de runtime corrige a
> ativação disabled do Dropdown e o descarte de recursos próprios do Breadcrumb.
> Outro lote posterior coordena hover/foco e progresso do Toast e rejeita
> índices inválidos do Carousel (veja `RUNTIME-TIMERS-INDICES.md`).
> A rodada final também corrige pageSize DataTable, disabled Tag e índice Stepper;
> consulte `FINAL-PRIORITY-AUDIT.md` para estado atual e pendências.
> Consulte as páginas atuais dos componentes e `RUNTIME-HARDENING.md`; as
> demais observações abaixo continuam delimitadas pela auditoria original.

## Contratos documentais corrigidos

- Tabs: orientação vertical; Enter/Espaço depende da ativação nativa do elemento;
  preferir button. Show exige alvo pertencente e habilitado; não valida essas
  pré-condições. Classe is-disabled não equivale a qualquer atributo disabled.
- Dropdown: exclusão de setas/pointer não assegura bloqueio da ativação nativa
  de links. Preferir botão disabled ou guarda explícita na aplicação. Portal pode
  pertencer ao diálogo, não necessariamente body, e dispose restaura posição.
- Breadcrumb: dispose tem teardown parcial; Tooltip e callbacks assíncronos não
  são necessariamente cancelados. Não prometer remoção integral após descarte.
- Accordion: always-open também implica modo não exclusivo.
- DataTable: override de sort também entra no filtro; números reconhecidos são
  comparados numericamente; atributo page-size precede opção. Exigir inteiro
  positivo; contrato runtime de sort none ainda não corresponde ao tipo público.
- TreeView: fallback textual inclui descendentes; data-value explícito evita
  ambiguidade. aria-disabled não é proteção contra seleção programática/nativa.
- Toast: isOpen é propriedade, não classe is-open. Hover/focus não são condições
  coordenadas; delay 0 usa fallback 4000 e configuração é capturada na construção.
- Tag: protected é apresentação, não bloqueio de dismiss(); setLoading inicial
  pode reabilitar botão. Carousel: índices fazem wrap; exigir inteiro finito.
- NestedMenu: exclusão de teclado consulta is-disabled, não apenas aria-disabled.
- Stepper: erro visual não impede avanço; use beforechange. GoTo programático
  bypassa limite linear; concluído é relativo ao passo atual, não histórico.
- Progress: exemplo com role progressbar agora possui nome acessível; CSS não
  mede operação nem valida números. A aplicação mantém CSS e ARIA sincronizados.

Navbar, Scrollspy e Collapse foram revisados sem divergência principal encontrada
nessa rodada; isso não equivale a cobertura completa ou certificação.

## Pontos para endurecimento futuro do runtime

As regressões documentam fatos observados, não recomendam preservar bugs:
1. Dropdown disabled e Tabs manual/native keyboard precisam decisão de contrato.
2. Breadcrumb pode criar Tooltip depois do dispose por callback pendente.
3. Toast pode retomar timer no mouseleave mesmo com foco interno.
4. DataTable/Carousel e outros índices precisam normalização finita consistente;
   tipos DataTable devem ser alinhados ao runtime em tarefa separada.
5. Estado protected/disabled de Tag/TreeView não é autorização de negócio.

Nenhum desses pontos foi silenciosamente corrigido no runtime nesta rodada.

## Proveniência

Hashes documentais correntes de Breadcrumb/TreeView/NestedMenu renovados.
Restaurado auditRows histórico ao snapshot `79dff2f`: no lote anterior um hash
histórico de CommandPalette havia sido atualizado junto às referências correntes.
Agora snapshot original e sources atuais permanecem separados e rastreáveis.
