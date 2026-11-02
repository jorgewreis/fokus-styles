> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Segunda auditoria de contratos — 11 componentes

Base79dff2f, catálogo154. Nenhum exemplo removido ou acrescentado; nenhum
runtime, SCSS, API ou tipo alterado. Correções documentais sustentadas por
17 novos testes de regressão que exercitam a implementação real.

## Maior impacto de uso

- Offcanvas sem backdrop continua modal: focus trap, isolamento e scroll lock
  permanecem. Backdrop static/false e opções ignoradas não prometem modo não modal.
- Popover dispose devolve painel ao DOM original; não destrói conteúdo da aplicação.
  Modo manual não tipado não instala Escape; hover não equivale a interação teclado.
- Tooltip usa texto, explicita precedência e não restaura title no dispose.
  Confirm trata texto/HTML conforme implementação, sem API de token inexistente.
- CommandPalette emite seleção; não executa nem autoriza ações. Mod aceita Ctrl
  ou Meta, inclusive em campos editáveis; disabled ainda participa do filtro.
  Backdrop fixo não herda token do Modal.
- NotificationCenter escapa texto. Persistência local não é armazenamento de
  segredos. Clear/remove/dispose do centro não descartam toasts já criados.
- Upload avançado não implementa5MB, MIME, contagem ou deduplicação. GetFiles é
  lista autoritativa; remoção não sincroniza FileList nem cancela requisição externa.
  Exige progresso finito; não prometemos correção do comportamento NaN do runtime.
- Select monta opções/disabled no início; não suporta reatividade completa,
  optgroup/multiple, nem tamanhos além dos consumidos pelo JS.
- Combobox value é a última seleção confirmada, não texto livre atual.
- Datepicker value pode vir ISO do valor inicial; texto inválido não vira validação
  HTML automaticamente. Opções de locale/formato/busca remota não foram inventadas.

## Rastreabilidade

O primeiro bloco histórico do upload foi mantido para não romper extração literal;
a ressalva explícita imediatamente após informa que a regra5MB não é implementada.
A fixture histórica já não anuncia esse limite. Nenhum teste foi desativado.

CommandPalette possui seu Markdown entre implementation[] das variantes Navigation.
Seus hashes documentais foram renovados nos dois manifests correspondentes;
hashes de runtime/SCSS e markup foram preservados. Catálogo gerado foi regenerado,
não escolhido unilateralmente durante conflitos.

Ver `tests/unit/catalog-command-notification-contract.test.js`,
`tests/unit/overlay-doc-options-audit.test.js` e
`tests/unit/form-documentation-limits.test.js`. Passar em JSDOM não
prova teclado real, layout, leitor de tela ou segurança de uma aplicação consumidora.
