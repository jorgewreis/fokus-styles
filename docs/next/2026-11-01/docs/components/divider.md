> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Divider

Linha divisória, 100% CSS — traço simples ou com rótulo centralizado.

## Visão geral

```html
<hr class="fs-divider">

<div class="fs-divider"><span class="fs-divider-label">ou</span></div>
```

## Anatomia

Duas formas, conforme o elemento:

- `<hr class="fs-divider">` — traço simples, uma linha (`<hr>` não aceita
  filhos).
- `<div class="fs-divider">` com `.fs-divider-label` dentro — texto
  centralizado, flanqueado por duas linhas desenhadas via
  `::before`/`::after` (precisa ser `<div>`, não `<hr>`, por causa do
  filho).

## Variações

Nenhuma — sem cor, tamanho ou orientação alternativa.

## Estados

Nenhum — elemento estático.

## A11y

`<hr>` já tem `role="separator"` implícito. Na variante com `<div>`, se a
separação for só visual (não estrutural), não precisa de role extra; se
divide seções de conteúdo distintas, considere `role="separator"`
explícito.

## API JS

Nenhuma — 100% CSS.

## Tokens

`--fs-color-border`, `--fs-color-muted` (texto do label).

## Exemplo

```html
<p>Conteúdo acima.</p>
<hr class="fs-divider">
<p>Conteúdo abaixo.</p>

<div class="fs-divider"><span class="fs-divider-label">ou entre com</span></div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-7701ecf4442c).

## Escolha da separação

Divider ajuda a sinalizar uma mudança de assunto ou a separar alternativas dentro de um mesmo fluxo. Use-o quando a linha acrescenta significado à organização, não para compensar uma hierarquia de títulos indefinida. Em um formulário com vários campos relacionados, espaçamento e agrupamento semântico podem comunicar melhor a relação do que uma sucessão de linhas. Em uma tela de autenticação, um rótulo como “ou” pode distinguir caminhos alternativos, desde que o texto dos botões explique cada caminho.

A diferença entre `hr` e o contêiner com rótulo não é apenas estética. O `hr` representa uma quebra temática e é um elemento vazio: não aceita um `span` filho para o texto. A composição rotulada precisa de um elemento que contenha o rótulo. Nesse caso, as duas linhas são pseudo-elementos flexíveis; o texto fica entre elas com espaçamento horizontal. Não acrescente traços manualmente antes e depois do rótulo, pois eles duplicariam a apresentação e poderiam ser anunciados como texto.

### Como o espaço é distribuído

A regra base usa margem vertical de 16px e uma borda superior de um pixel. No contêiner que não é `hr`, essa borda é removida e o layout passa a ser flex, com alinhamento central. Cada pseudo-elemento ocupa a parte disponível em um dos lados. O texto não é truncado automaticamente e não existe um limite de comprimento próprio; uma instrução longa precisa ser escrita como parágrafo, em vez de forçada para dentro do separador.

Não há orientação vertical, tamanhos alternativos ou classe de cor específica. Se a aplicação precisa separar colunas, reveja primeiro o componente de layout. Acrescentar uma classe com nome plausível não cria uma variante no pacote. Personalizações locais devem ser documentadas como estilos do aplicativo e testadas nas larguras em que o conteúdo muda de linha.

## Integração e significado acessível

Para uma quebra temática, o elemento `hr` já oferece a semântica correspondente. Quando a linha é puramente decorativa, não é necessário inventar uma nova região ou inserir uma parada de foco. Um separador estático não deve receber `tabindex`, porque não há operação a executar. Separadores redimensionáveis de painéis constituem outro padrão de interação e não são implementados por esta classe.

Na composição com texto importante, preserve a leitura do rótulo. Antes de acrescentar `role="separator"` a um contêiner, considere como isso afeta a exposição de seus descendentes na tecnologia assistiva usada; o texto da alternativa precisa continuar perceptível. É possível manter a palavra como conteúdo normal e deixar as linhas como decoração. O objetivo não é maximizar a quantidade de ARIA, mas comunicar a divisão corretamente.

O divisor não associa formulários, não cria grupos de opções e não substitui títulos ou legendas de `fieldset`. Se duas seções precisam de nomes, mantenha esses nomes na hierarquia da página. Evite depender apenas de uma linha sutil para explicar que a próxima ação usa outro serviço, outra conta ou outro conjunto de permissões.

### Estados e manutenção

Não existe estado ativo, selecionado, expandido ou carregando. Se o aplicativo remove uma das seções, ele decide se o divisor também deve desaparecer. Não há listener de redimensionamento nem medição de texto a descartar. O uso é somente CSS, e os tokens de borda e texto são resolvidos pelo tema vigente.

Ao alterar os tokens, confira a distinção da linha em superfícies claras e escuras e não confunda uma linha discreta com informação invisível. Teste rótulos longos, tradução, zoom e direção de escrita. A presença do divisor não garante que o agrupamento seja compreensível: faça a revisão da página inteira, inclusive da distância entre o separador e os títulos ou ações que ele relaciona.
