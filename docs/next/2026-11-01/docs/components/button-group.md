> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Button group

## Visão geral

Use o grupo quando várias ações pertencem ao mesmo objeto ou à mesma decisão, por exemplo editar, duplicar e excluir um documento. O contorno contínuo comunica proximidade, mas não transforma ações independentes em uma única ação. Se os comandos não têm relação clara, o agrupamento pode esconder sua hierarquia; nesse caso, botões separados e espaçamento do layout são mais apropriados.

Há uma diferença importante entre agrupar comandos e apresentar escolhas. “Editar” e “Duplicar” são ações momentâneas; “Mostrar concluídas” é uma preferência que pode permanecer ligada. O componente acomoda os dois visualmente, mas apenas o aplicativo sabe qual modelo está sendo usado. Para escolhas exclusivas em formulário, prefira radios ou um controle cuja interação exclusiva esteja explicitamente implementada.

`.fs-button-group` une visualmente ações relacionadas. Os botões devem ser
filhos diretos do grupo. Requer também o componente [Button](button.md).

## Anatomia e exemplo

Os seletores usam `>` e as posições `:first-child` e `:last-child`. Isso significa que a ordem dos filhos é parte do contrato, e não apenas uma decisão estética. Um wrapper em volta de cada botão impede a fusão esperada; um título como primeiro filho também muda qual botão recebe os cantos externos. Coloque rótulos de seção fora do conjunto e associe o grupo a eles com `aria-labelledby` quando necessário.

Cada filho mantém a classe `.fs-btn`, responsável por tipografia, estados e dimensões. A raiz não recria essas regras. Em uma versão montada dinamicamente, insira ou remova os próprios botões como filhos diretos; não é necessário reinicializar o grupo. O HTML abaixo ilustra a anatomia e a aparência, sem implementar edição ou duplicação de documentos.

```html
<div class="fs-button-group" role="group" aria-label="Ações do documento">
  <button type="button" class="fs-btn fs-btn-outline-primary">Editar</button>
  <button type="button" class="fs-btn fs-btn-outline-primary">Duplicar</button>
  <button type="button" class="fs-btn fs-btn-outline-primary" disabled>Excluir</button>
</div>
```

O primeiro e o último filho recebem cantos lógicos arredondados; botões
adjacentes sobrepõem a borda em 1px. Não insira wrappers entre grupo e botões.

## Variações

Na orientação horizontal, a margem lógica negativa une bordas adjacentes e acompanha a direção do texto. A orientação vertical muda o flex para coluna e estende os botões à largura do grupo, mas reaproveita os seletores de cantos e sobreposição existentes. Não suponha que ela produz automaticamente um contorno externo perfeitamente contínuo em qualquer composição; confira o resultado com o tamanho de borda e a direção escolhidos.

Combine tamanhos de Button com consistência quando a intenção for uma barra uniforme. Misturar um botão grande e outro pequeno é possível como HTML, mas não constitui uma variante de grupo com compensação automática de alturas. Da mesma forma, a raiz não implementa quebra responsiva, scroll ou redução de rótulos. A decisão de passar ações para outro layout pertence à aplicação.

```html
<div class="fs-button-group fs-button-group-vertical" role="group" aria-label="Preferências de exibição">
  <button type="button" class="fs-btn" aria-pressed="true">Mostrar concluídas</button>
  <button type="button" class="fs-btn" aria-pressed="false">Mostrar arquivadas</button>
</div>
```

A variante vertical aplica coluna e largura 100% aos botões. O exemplo mostra
estados iniciais de alternância; o aplicativo deve atualizar `aria-pressed`
quando clicados. Não há gerenciador automático de seleção.

## Estados

Um botão pressionado não é um botão em carregamento. `aria-pressed="true"` representa uma alternância persistente e aciona o preenchimento primário do filho. O estado `:active` de Button dura durante a ativação física. Mantenha essa distinção para que uma preferência ligada não dependa de o mouse permanecer pressionado.

A seleção visual não atualiza `aria-pressed` nos irmãos. Em alternâncias independentes, vários filhos podem estar pressionados; em seleção exclusiva, o aplicativo teria que coordenar todos e oferecer o padrão de teclado correto. Não use somente a cor de seleção para simular radio. O estado disabled continua individual e não se propaga automaticamente porque a raiz ganhou uma classe de indisponibilidade.

Herdam hover, disabled e foco de Button. O filho focado recebe `z-index: 2`
para não esconder seu contorno. `aria-pressed="true"` define os tokens de
fundo/texto/borda para primary; não acrescenta comportamento por si só.

## A11y

Um grupo nomeado ajuda a contextualizar comandos repetidos em diferentes regiões. Por exemplo, “Ações do documento” distingue esta barra das ações de uma linha de tabela. O nome do grupo não substitui nomes específicos para cada botão. Caso use ícones, forneça seus nomes acessíveis individualmente.

Não adicione `role="toolbar"` apenas para obter uma descrição mais sofisticada: o componente não oferece o gerenciamento de foco por setas normalmente associado a esse padrão. Em `role="group"`, manter a ativação nativa e cada parada de Tab é uma escolha honesta e previsível. Teste a visibilidade do foco nas junções das bordas; o z-index existe justamente para evitar seu encobrimento.

Nomeie `role="group"` com `aria-label` ou `aria-labelledby`. Cada botão mantém
sua parada de Tab e ativação nativa por Enter/Espaço. Não há navegação por setas
nem papel toolbar/radiogroup implícito. Para escolha exclusiva, implemente
semântica e interação apropriadas em vez de apenas colorir o botão escolhido.

## Tokens e limites

Cantos usam `--fs-radius-sm`. Seleção usa `--fs-color-primary` e
`--fs-color-on-primary` através de `--fs-btn-bg`, `--fs-btn-color` e
`--fs-btn-border-color`. A orientação vertical não redefine todas as bordas
para um conjunto vertical segmentado: avalie os cantos no resultado desejado.
Não há API JS própria.

## Verificação

Confira filhos diretos, nomes dos grupos, Tab, disabled, pressed e RTL.
O teste `component-docs-contract.test.js` verifica classes e anatomia dos exemplos.

## API JS

Não há API JavaScript própria, auto-init, evento de mudança ou descarte do grupo. Os handlers de ações pertencem a cada botão ou à delegação de eventos do aplicativo. Se a aplicação montar um listener para alternar `aria-pressed`, deve removê-lo ao desmontar a região; remover o CSS não seria um cleanup de comportamento.

Para renderização controlada por framework, derive `aria-pressed` do estado da aplicação. Evite que uma rotina externa e o framework alterem o mesmo atributo em momentos diferentes: o grupo não arbitra essa disputa e uma atualização de tela pode desfazer a seleção visual.

## Exemplo

Os dois blocos HTML anteriores são demonstrações estáticas de comandos e alternâncias. Ao copiá-los, substitua os rótulos pelo vocabulário do produto e conecte cada ação real. Antes da integração, verifique a árvore DOM, não apenas uma imagem: filhos diretos, tipos dos botões e nomes acessíveis são requisitos que uma captura de tela não mostra.
