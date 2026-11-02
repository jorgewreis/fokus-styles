> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Disabled: decisão de contrato e evidências

Base: `2413582`. Catálogo preservado em 154 exemplos/56 componentes, next e
não publicado. Nenhuma fixture removida ou acrescentada. Decisões de foco e
escopo discutidas antes da alteração; links habilitados mantêm seu default.

## Política aprovada

| Componente | Interação indisponível | Foco e compatibilidade |
|---|---|---|
| Tabs | Classe, aria-disabled=true e disabled nativo impedem clique, auxclick, Enter/Espaço e show; alvo externo é ignorado. | Setas pulam itens indisponíveis como já faziam com a classe. Não há seleção/foco substituto automático ao mudar estado. |
| NestedMenu | Mesmo predicate e captura; abertura por hover exige pai habilitado adjacente ao submenu. | Setas/foco inicial pulam indisponíveis. Links e handlers habilitados preservados. Filhos de ramo já aberto mantêm estado local. |
| TreeView | Classe/ARIA no nó bloqueiam seleção, expansão, colapso e toggle, inclusive APIs; alvo externo é ignorado. | Nós permanecem descobríveis pelas setas. Ramo disabled já aberto permite navegar/ativar filhos habilitados; não há propagação inventada de classe/ARIA. |

A [APG orienta a descoberta por foco de controles indisponíveis em composites](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls),
e [menus mantêm itens disabled focáveis sem ativação](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/).
Manter o skip em Tabs/NestedMenu é escolha explícita de compatibilidade, não
alegação de APG integral. No TreeView, estado local também é política explícita;
não se implementa herança geral de aria-disabled sobre todos os descendentes.

## Escopo da captura e efeitos nos consumidores

O helper interno compartilhado intercepta somente click/auxclick e keydown
Enter/Espaço cujo item mais próximo esteja indisponível. Cancela default e
propagação antes dos handlers desse item/descendentes, deliberadamente impedindo
a execução de ações indisponíveis. Não intercepta setas, Escape, Tab, hover ou
ativação habilitada. Capturas externas/anteriores já executadas não são desfeitas;
chamadas diretas da aplicação não são autorização de negócio. Nada sanitiza o
conteúdo nem substitui permissões do backend.

Disabled nativo usa :disabled, inclusive fieldset; classe/ARIA são consultadas
no próprio item. Eventos fora do root não são interceptados. Dispose remove
apenas os listeners adicionados por aquela instância. Helper não foi exportado
como nova API pública.

## Fechamento e foco do NestedMenu

Guarda de ativação não impede fechamento interno de navegação/teardown. Se um
pai de submenu aberto se torna indisponível, Escape/ArrowLeft no filho fecha a
raiz e devolve foco ao gatilho, em vez de focar um button disabled e deixar foco
num filho oculto. Com pai habilitado o retorno usual permanece. Hide/dispose
continuam fechando todos os ramos; flip e fechamento de irmãos não foram
reescritos. CSS mantém a regra .is-open independente do hover.

## Limites remanescentes

- Tabs focada tornada disabled não inicia setas/Home/End: consumidor deve mover
  foco para aba habilitada. Disabled dinâmico não desfaz seleção anterior.
- Roving tabindex do modo manual e detail.target do alias Tabs continuam com
  ressalvas anteriores; links habilitados ainda seguem href, por decisão explícita.
- TreeView não fecha/desseleciona automaticamente ramo que acaba de ficar disabled.
- Políticas estruturais/reinit e autorização de negócio permanecem da aplicação.
- Nenhuma alegação de leitor de tela, conformidade integral ou validação visual.

## Gates, custo e rastreabilidade

1017/1017 testes unitários em 78 arquivos e catálogo 16/16 passaram. Build, lint,
tipos, docs, empacotamento, React 18/19 (tipos estritos e SSR), contraste 57 pares,
size:check e controle negativo do orçamento aprovados. Revisão independente não
identificou regressão séria nos caminhos habilitados e registrou o limite Tabs
dinâmico acima. Testes específicos cobrem ordem de handlers/default habilitado,
API direta, estados dinâmicos, fieldset, teardown, foco e seletor CSS compilado.

JS 26.943 bytes gzip (+278 no lote, +613 acumulados desde 26.330). Teto 27.008
explicitamente autorizado (+320), margem 65. Helper compartilhado evita repetição;
checks de pertencimento, disabled e fallback de foco preservados. CSS completo
43.440 (+20), componentes 20.319 (+19), ambos sob tetos anteriores. Controle negativo
excedeu teto, confirmou erro e restaurou byte a byte o bundle aprovado.

15 casos browser novos invocados (5 cenários × 3 engines), além de a11y e visual:
Chromium ausente impede launch, logo os corpos não executaram. Rodar em ambiente
equipado antes de publicação; não regravar snapshots como substituto dessa prova.

Hashes correntes renovados; helper incluído como dependência nas proveniências
relevantes. auditRows e revalidações anteriores preservados. Bundle completo,
relatório e logs mantidos no checkpoint. Nenhuma publicação, update de PR/branch
remoto ou repetição de operação bloqueada.
