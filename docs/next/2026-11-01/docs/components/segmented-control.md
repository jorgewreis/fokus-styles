> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Segmented Control

Grupo de botões com estado selecionado — alternativa compacta a radio
buttons/tabs para poucas opções mutuamente exclusivas (ou não). 100% CSS,
mesma técnica de input oculto + label irmã.

## Visão geral

```html
<div class="fs-segmented-control">
  <div class="fs-segmented-item">
    <input type="radio" name="periodo" class="fs-segmented-input" id="p-dia" checked>
    <label for="p-dia" class="fs-segmented-label">Dia</label>
  </div>
  <div class="fs-segmented-item">
    <input type="radio" name="periodo" class="fs-segmented-input" id="p-semana">
    <label for="p-semana" class="fs-segmented-label">Semana</label>
  </div>
  <div class="fs-segmented-item">
    <input type="radio" name="periodo" class="fs-segmented-input" id="p-mes">
    <label for="p-mes" class="fs-segmented-label">Mês</label>
  </div>
</div>
```

## Anatomia

`.fs-segmented-control` (contêiner, borda externa única) >
`.fs-segmented-item` (um por opção) > `.fs-segmented-input`
(`<input>`, oculto via clip) + `.fs-segmented-label` (`<label for="...">`).

## Variações

- **Exclusivo vs. inclusivo**: use `<input type="radio">` com o mesmo
  `name` (só uma opção selecionada por vez — como no exemplo) ou
  `<input type="checkbox">` (cada item seleciona/deseleciona
  independentemente).
- **Tamanho**: `.fs-segmented-control-sm`, `.fs-segmented-control-lg`; sem
  sufixo = padrão (altura mínima também influenciada pelos tokens de controle).

```html
<div class="fs-segmented-control fs-segmented-control-sm">...</div>
```

## Estados

- **checked**: item selecionado ganha fundo/texto na cor primária.
- **disabled**: no input — opacidade reduzida, sem interação.
- **Foco**: anel sobre o item focado (`z-index` elevado pra não ficar
  parcialmente escondido pela borda do vizinho).

## A11y

`<input>` nativo (radio ou checkbox) — toda a semântica de grupo (seleção
exclusiva com radio, navegação por seta entre itens do mesmo `name`) vem
do navegador, sem JS. Sempre associe `label` via `for`/`id`.

## API JS

Nenhuma — 100% CSS.

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-color-subtle` (hover),
`--fs-color-primary` (selecionado), `--fs-radius-sm`.

## Exemplo

```html
<div class="fs-segmented-control">
  <div class="fs-segmented-item">
    <input type="checkbox" class="fs-segmented-input" id="f-ativo" checked>
    <label for="f-ativo" class="fs-segmented-label">Ativos</label>
  </div>
  <div class="fs-segmented-item">
    <input type="checkbox" class="fs-segmented-input" id="f-arquivado">
    <label for="f-arquivado" class="fs-segmented-label">Arquivados</label>
  </div>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-b9041fab6cd0).


## Escolha entre valor de formulário e painel de conteúdo

Segmented Control oferece uma apresentação compacta para poucas escolhas relacionadas. Um grupo de radios pode representar o período de um relatório; checkboxes podem controlar quais categorias ficam incluídas. Apesar da aparência de botões, os controles continuam sendo inputs nativos. O estado selecionado é checked, não uma classe de JavaScript. Essa decisão preserva a semântica de formulário e permite enviar valores mesmo sem carregar um controlador do framework.

Não use esse componente como substituto visual automático de Tabs. Escolher “Semana” normalmente muda um valor de filtro; selecionar uma aba organiza a visibilidade de painéis com papéis tab e tabpanel. Se a aplicação também atualizar o relatório ao mudar o filtro, esse efeito deve ser implementado separadamente. O CSS não busca dados, não troca tabelas e não sabe o que fazer com cada período. A escolha continua funcional como campo, mas o resultado de negócio precisa de integração.

Um grupo pequeno é mais fácil de comparar de relance. Rótulos longos, muitas opções ou traduções extensas podem tornar a faixa difícil de acomodar. A classe mantém o texto sem quebra e não converte automaticamente o grupo em select quando falta espaço. Avalie um Select ou uma lista de radios convencionais quando as opções não couberem com leitura confortável. Reduzir a fonte para preservar uma faixa única nem sempre é a melhor solução.

## Anatomia de inputs, labels e agrupamento

O input precisa preceder imediatamente o label que recebe o estilo. Os seletores checked, disabled e focus-visible usam a relação de irmão adjacente; inserir um elemento entre ambos pode interromper a aparência do estado. O atributo for deve apontar para o ID exclusivo do input. Uma label pode então ativar o controle nativo sem um handler adicional de clique, preservando uma área de interação maior do que o input visualmente oculto.

Para exclusividade, use radios com o mesmo name dentro do mesmo grupo de formulário. IDs iguais não criam um grupo; apenas quebram a associação de labels. Para escolhas independentes, use checkboxes e defina names e values conforme o contrato de dados. Os exemplos iniciais demonstram aparência e seleção, mas não um envio para servidor. Em um formulário real, acrescente value explícito a cada opção para não depender do valor padrão on.

Um fieldset com legend visível é uma boa composição para nomear o conjunto. O nome de cada opção não substitui a pergunta que o grupo responde. Se houver texto de ajuda ou erro, associe-o de maneira coerente ao campo ou ao grupo conforme a integração de formulário. Não adicione papéis de tablist e tab a radios apenas para parecer um controle segmentado; isso mistura modelos de interação sem benefício.

## Variações e estados adicionais

Além de sm e lg, `.fs-segmented-control-vertical` coloca os itens em coluna e ajusta as divisórias. A orientação visual não cria um algoritmo de teclado próprio; a navegação dos radios continua sendo a do navegador. Os tamanhos definem alturas mínimas e padding, mas `--fs-control-touch-target` também participa do tamanho final. Por isso, o valor histórico de 38px não deve ser interpretado como altura final garantida em qualquer tema e configuração de controle.

A seleção usa o par de tokens de cor primária e texto sobre primária. O estado disabled deve ser aplicado ao input, não apenas à label. O navegador impede interação de um input disabled e normalmente não o inclui nos dados enviados pelo formulário. Se a aplicação precisa preservar um valor enquanto impede mudança, esse requisito deve ser modelado conscientemente; esconder ou desabilitar um campo não é equivalente a enviar o mesmo dado como válido.

O SCSS também apresenta estado inválido por `aria-invalid="true"` no input ou `.is-invalid` na raiz. Isso acrescenta indicação visual, não valida o grupo nem cria uma mensagem de erro. Explique o motivo da invalidade em texto e remova o estado quando a condição for resolvida. Não confie somente em uma borda colorida para dizer ao usuário que deve selecionar uma opção.

## API JS e integração nativa

Não há construtor SegmentedControl, evento fs específico, getInstance ou dispose. Para reagir a uma escolha, escute change no input ou no contêiner e leia checked/value. O evento nativo ocorre na interação apropriada; atribuir checked programaticamente não significa que um evento change será emitido automaticamente. Se a aplicação atualizar o estado por código, atualize também seu modelo e a região de resultados de forma explícita.

Em formulários, FormData inclui radios selecionados e checkboxes marcados com name e que não estejam disabled. Os demais não representam automaticamente um false serializado. Valide esse contrato no servidor, especialmente quando a ausência de um valor tem significado distinto de uma opção desmarcada. Se usar required, teste as regras nativas do tipo de input escolhido em vez de supor validação própria do componente.

A desmontagem do CSS não exige operação especial. Remova, porém, listeners próprios de change, assinaturas do estado e requisições disparadas pela seleção. Se o grupo for refeito a partir de dados, preserve IDs únicos e associe novamente as labels. Em aplicações que renderizam no servidor e depois hidratam, mantenha a seleção inicial consistente entre HTML e estado do cliente para evitar uma mudança inesperada durante a montagem.

## A11y, tokens e revisão em contexto

O input é visualmente recortado, não removido com display none, preservando seu funcionamento nativo. O foco visível é desenhado na label irmã e recebe z-index para ficar acima do item vizinho. O contêiner tem overflow oculto; confira o resultado de foco e borda em navegador, sobretudo com customizações de radius e espessura. Testes DOM podem comprovar associação e exclusividade, mas não simulam todos os detalhes da navegação de radios por teclado em cada navegador.

Além dos tokens de superfície e cor já listados, são relevantes `--fs-color-on-primary`, `--fs-control-touch-target`, `--fs-control-transition`, `--fs-control-invalid-color`, `--fs-border-width` e `--fs-focus-offset`. Não altere apenas o fundo selecionado sem revisar a cor do texto. A versão vertical deve ser testada com rótulos de comprimentos diferentes e a versão horizontal com zoom e idiomas maiores. A página descreve o contrato do componente, não uma certificação de contraste para qualquer paleta personalizada.
