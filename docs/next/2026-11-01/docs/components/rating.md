> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Rating

Avaliação por estrelas, 100% CSS — mesma técnica de input oculto + label
irmã do [Checkbox](checkbox.md)/[Segmented Control](segmented-control.md),
usando `<input type="radio">` (seleção exclusiva nativa). A estrela é o
ícone `star` do [`fokus-styles/icons`](../guides/icons.md) — contorno vazio por
padrão, preenchido (`fill: currentcolor`) quando selecionada ou em hover.

## Visão geral

```html
<div class="fs-rating">
  <input type="radio" name="nota" class="fs-rating-input" id="nota-5" value="5">
  <label for="nota-5" class="fs-rating-star" aria-label="5 estrelas">
    <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
  </label>
  <input type="radio" name="nota" class="fs-rating-input" id="nota-4" value="4">
  <label for="nota-4" class="fs-rating-star" aria-label="4 estrelas">
    <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
  </label>
  <input type="radio" name="nota" class="fs-rating-input" id="nota-3" value="3">
  <label for="nota-3" class="fs-rating-star" aria-label="3 estrelas">
    <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
  </label>
  <input type="radio" name="nota" class="fs-rating-input" id="nota-2" value="2">
  <label for="nota-2" class="fs-rating-star" aria-label="2 estrelas">
    <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
  </label>
  <input type="radio" name="nota" class="fs-rating-input" id="nota-1" value="1">
  <label for="nota-1" class="fs-rating-star" aria-label="1 estrela">
    <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
  </label>
</div>
```

**A ordem no HTML é decrescente** (5, 4, 3, 2, 1) — truque clássico de CSS
puro: o contêiner usa `row-reverse` (visualmente reordena pra crescente,
esquerda→direita) e o destaque "estrela clicada + todas à esquerda dela"
usa só o combinador de irmãos gerais (`~`, que só enxerga o que vem
**depois** no DOM) — depende da ordem decrescente pra funcionar.

## Anatomia

`.fs-rating` (contêiner, `row-reverse`) > pares `.fs-rating-input`
(`<input type="radio">`, mesmo `name`, oculto via clip) +
`.fs-rating-star` (`<label for="...">` com `aria-label` + o ícone `star`
dentro, `aria-hidden`), um par por nota possível, em ordem decrescente de
`value`.

## Variações

Tamanho: `.fs-rating-sm` (16px), `.fs-rating-lg` (32px); sem sufixo = 24px
(padrão) — controla o `font-size` do `<label>`, e o ícone (`.fs-icon`,
`1em` × `1em`) acompanha.

## Estados

- Nota selecionada e as de menor valor (seguintes no DOM decrescente) ficam na cor de
  aviso (`--fs-color-warning`) e com a estrela preenchida — via
  `:checked ~ .fs-rating-star`.
- **Hover** prévia a mesma seleção antes de confirmar o clique
  (`:hover`/`:hover ~`).
- `disabled` no input — opacidade reduzida, sem interação.

## A11y

`<input type="radio">` nativo — `Tab` foca o grupo, `ArrowLeft`/
`ArrowRight` (ou `Up`/`Down`) movem a seleção entre notas, `Space`
confirma. Como a estrela é um ícone (`aria-hidden="true"`, sem texto
visível), o `<label>` **precisa** de `aria-label` (`"5 estrelas"`,
`"1 estrela"` etc.) — sem isso a opção pode ficar sem um nome acessível compreensível.

## API JS

Nenhuma — 100% CSS. O valor selecionado é lido como qualquer grupo de
radio nativo (`document.querySelector('input[name="nota"]:checked').value`).

## Tokens

`--fs-color-border` (estrela vazia), `--fs-color-warning` (selecionada/
hover), `--fs-color-primary` (anel de foco).

## Exemplo

```html
<fieldset>
  <legend>Avalie sua experiência</legend>
  <div class="fs-rating">
    <input type="radio" name="exp" class="fs-rating-input" id="exp-5" value="5" checked>
    <label for="exp-5" class="fs-rating-star" aria-label="5 estrelas">
      <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
    </label>
    <input type="radio" name="exp" class="fs-rating-input" id="exp-4" value="4">
    <label for="exp-4" class="fs-rating-star" aria-label="4 estrelas">
      <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
    </label>
    <input type="radio" name="exp" class="fs-rating-input" id="exp-3" value="3">
    <label for="exp-3" class="fs-rating-star" aria-label="3 estrelas">
      <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
    </label>
  <input type="radio" name="exp" class="fs-rating-input" id="exp-2" value="2">
    <label for="exp-2" class="fs-rating-star" aria-label="2 estrelas">
      <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
    </label>
  <input type="radio" name="exp" class="fs-rating-input" id="exp-1" value="1">
    <label for="exp-1" class="fs-rating-star" aria-label="1 estrela">
      <svg class="fs-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
    </label>
  </div>
</fieldset>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-fb2d398d5df4).

## Avaliação como escolha exclusiva

Rating usa um grupo de radios para registrar uma única nota. É apropriado quando a pessoa escolhe um valor discreto em uma escala conhecida, como de uma a cinco estrelas. Não representa automaticamente uma média de avaliações nem suporta frações de estrela. Para apresentar uma média como 4,7, use uma representação informativa acompanhada de texto, em vez de forçar um radio a guardar um valor que não corresponde às opções disponíveis.

Defina o significado da escala antes de estilizar. O usuário precisa saber o que está avaliando e se uma estrela significa desempenho ruim, baixa prioridade ou outro conceito. Um fieldset com legend oferece contexto para o grupo; os labels identificam cada valor. A seleção de uma nota não envia o formulário automaticamente. Salvar a avaliação, mostrar confirmação e tratar erros são responsabilidades da aplicação.

## Ordem do DOM e seleção visual

O preenchimento cumulativo depende dos seletores de irmãos. Cada input precisa ser seguido por seu label, e os pares seguem ordem decrescente no HTML. O row-reverse apresenta visualmente a sequência em sentido contrário. Se você rearranjar os pares em ordem crescente para tornar o código mais intuitivo, a relação entre estrela marcada e estrelas preenchidas deixa de corresponder ao padrão implementado.

Não envolva cada par em outro elemento sem revisar o contrato: os seletores que usam o combinador de irmãos precisam alcançar os labels seguintes no mesmo contêiner. Todos os radios de uma pergunta devem compartilhar name; perguntas diferentes devem usar nomes distintos. IDs precisam ser únicos na página, inclusive quando várias avaliações são renderizadas em uma lista. Um for duplicado pode ativar o input de outra linha.

A ordem reversa também merece teste de teclado. A navegação nativa dos radios acompanha o DOM e a direção implementada pelo navegador, enquanto a apresentação visual foi invertida por CSS. Não prometa que toda seta sempre aumentará a nota no sentido visual esperado em qualquer plataforma. Verifique o comportamento com a combinação de navegador, direção de texto e tecnologia assistiva do produto.

## Estados e formulário nativo

Checked é a fonte de verdade da nota; a cor das estrelas é apenas sua representação. Hover mostra uma prévia, não uma seleção persistida. Se o aplicativo captura analytics ou atualiza um resumo, use a mudança real do radio, não eventos de mouse sobre o label. O framework não oferece evento fs:rating:change: use change nativo e leia o valor selecionado como string.

Antes de acessar value, considere que nenhum radio pode estar marcado. Uma consulta por :checked retorna null nesse caso, e a aplicação precisa tratar ausência de resposta. Se a nota for obrigatória, configure validação nativa ou do aplicativo e explique a exigência. Não selecione cinco estrelas antecipadamente apenas para evitar null quando isso faria parecer que o usuário já avaliou algo.

Disabled impede operação do input e altera a aparência do label adjacente. Para bloquear o conjunto, aplique o estado de forma consistente a todos os radios ou use a semântica apropriada do fieldset. Um controle disabled não participa do envio normal do formulário; não use esse estado como equivalente silencioso de somente leitura se o valor ainda precisa ser enviado. Radios não possuem um modo readonly equivalente ao de campos textuais.

## Ícones, nomes e variações

A estrela SVG é decorativa porque o label informa a nota. Mantenha aria-hidden no SVG e forneça texto acessível no label. Um ícone sem nome não torna o radio compreensível. Os exemplos incluem os cinco pares: uma escala executável de cinco valores precisa conter todas as opções, não somente cinco e quatro.

As classes sm e lg mudam o tamanho tipográfico do label, que o ícone em em acompanha. Isso não muda a quantidade de opções, o valor enviado ou a área de interação por uma API JavaScript. Teste o tamanho compacto por toque e com zoom antes de escolhê-lo somente por economia de espaço. Não transforme a nota em um conjunto de ícones pequenos impossíveis de distinguir.

Os tokens de borda, warning e primary controlam estrela vazia, preenchimento e foco. Warning aqui é a cor visual escolhida para a estrela; não indica necessariamente uma advertência de negócio. Personalizar essa cor exige conferir contraste contra o fundo e distinguir vazio, preenchido e foco sem depender apenas de uma mudança sutil de tonalidade.

## Integração e limites

Basta carregar os estilos do pacote, por bundler ou CSS compilado. Não há controlador Rating, auto-init, método setValue ou dispose. Para preencher uma resposta existente, marque checked no radio correspondente; para limpar um formulário, use o comportamento nativo e o estado inicial escolhido pelo aplicativo. Handlers de envio, persistência e feedback precisam ser implementados e removidos pela aplicação quando ela desmonta a região.

Os testes de DOM podem conferir nomes, IDs, associação de labels e seleção exclusiva. Não reproduzem a aparência cumulativa nem toda a navegação nativa de teclado. Valide visualmente o preenchimento, a ordem e o foco antes de concluir que uma escala customizada está correta. A técnica CSS é pequena, mas depende de uma estrutura HTML precisa e de um significado de avaliação bem definido.
