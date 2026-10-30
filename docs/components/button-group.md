# Button group

## Visão geral

`.fs-button-group` une visualmente ações relacionadas. Os botões devem ser
filhos diretos do grupo. Requer também o componente [Button](button.md).

## Anatomia e exemplo

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

Herdam hover, disabled e foco de Button. O filho focado recebe `z-index: 2`
para não esconder seu contorno. `aria-pressed="true"` define os tokens de
fundo/texto/borda para primary; não acrescenta comportamento por si só.

## A11y

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
