> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Table

Tabelas seguem a marcação HTML nativa — classes modificadoras no próprio
`<table>` ligam/desligam comportamentos visuais.

## Visão geral

Use Table para dados cuja leitura depende da relação entre linhas e colunas, como pessoas, contatos e status. O HTML tabular preserva essas relações; transformar cada linha em uma sequência de divs apenas para obter uma aparência de tabela perde informação que a semântica nativa já oferece. Para conteúdo sem comparação por colunas, listas ou cards podem ser uma estrutura mais adequada.

O componente é exclusivamente visual. Zebra, bordas e hover ajudam a percorrer dados, mas não tornam uma linha clicável, selecionável ou ordenável. Se uma célula contém uma ação, use um link com destino real ou um botão com comportamento de aplicação, nomeado de forma que seu alvo seja compreensível. Não use hover como única pista de uma interação que não está implementada.

```html
<table class="fs-table fs-table-striped fs-table-hover">
  <thead>
    <tr><th scope="col">Nome</th><th scope="col">Status</th></tr>
  </thead>
  <tbody>
    <tr><td>Ana</td><td>Ativo</td></tr>
    <tr><td>Bruno</td><td>Inativo</td></tr>
  </tbody>
</table>
```

## Anatomia

A tabela pode conter caption, thead e tbody conforme o conteúdo. Uma caption descreve o conjunto; cabeçalhos descrevem colunas ou linhas. A classe `.fs-table-caption` é aplicada ao caption para posicioná-lo acima e ajustar espaçamento/cor. O estilo não gera o texto da legenda nem associa automaticamente cabeçalhos complexos.

As células possuem padding e borda inferior; cabeçalhos do thead recebem distinção tipográfica e uma borda inferior mais espessa na base. A regra de alinhamento das células usa `text-align: left` nesta versão, enquanto caption usa alinhamento lógico. Portanto, não deduza suporte RTL completo da existência de propriedades lógicas em outros componentes. Para dados numéricos e direção de leitura diferente, a composição pode exigir alinhamento deliberado da aplicação.

`<table class="fs-table">` com `<thead>`/`<tbody>` nativos — nenhuma
marcação extra obrigatória. `<thead th>` já vem em uppercase, cor muted,
peso médio.

## Variações

Zebra atua nas linhas ímpares de tbody, e hover atua na linha sob o ponteiro. Em conjunto, as duas regras podem usar a mesma superfície sutil, então a diferença do hover pode ser pouco perceptível numa linha já listrada. Isso não altera os dados e não é seleção persistente. Escolha as variantes para facilitar leitura, não para codificar estados que precisariam de texto.

Bordas completas ajudam a delimitar matrizes densas; a variante borderless reduz o peso visual. Aplicar ambas não cria um terceiro modo planejado: as regras competem e a ordem CSS resolve. Use um modificador de borda de cada vez, a menos que tenha verificado conscientemente a composição.

`.fs-table-priority` não decide quais colunas são essenciais por metadados. Abaixo de 640px, esconde todas as células a partir da quarta posição, tanto th quanto td. Isso retira essas células da apresentação, inclusive da árvore acessível, e não cria um botão para revelá-las. Só use quando as três primeiras colunas realmente bastarem ou quando houver outro caminho acessível para os detalhes. Para preservar todos os dados, prefira rolagem horizontal.

- `.fs-table-striped` — linhas ímpares do corpo com fundo diferente (zebra).
- `.fs-table-hover` — destaca a linha sob o cursor.
- `.fs-table-bordered` — bordas em todas as células.
- `.fs-table-borderless` — remove todas as bordas internas.
- `.fs-table-sm` — reduz o padding das células.
- `.fs-table-{primary|secondary|success|warning|danger|info}` — tinge
  fundo/texto da tabela inteira com uma cor de estado (mesmos tokens dos
  alerts).
- `.fs-table-responsive` — aplique num `<div>` **envolvendo** a
  `<table>` (não na tabela em si), para rolagem horizontal em telas
  estreitas:

```html
<div class="fs-table-responsive">
  <table class="fs-table">...</table>
</div>
```

Combináveis entre si (ex.: `fs-table-striped fs-table-bordered fs-table-sm`).

## Estados

Sem dados, você pode renderizar uma linha com uma célula de `colspan` igual à quantidade real de colunas e classe `.fs-table-empty`, contendo uma explicação. Esse é um estado de conteúdo escrito pela aplicação, não uma detecção automática do CSS. “Nenhum registro cadastrado” e “Nenhum resultado para o filtro” descrevem situações diferentes e ajudam a escolher o próximo passo.

Uma variante semântica de cor colore a tabela inteira e não comunica sozinha o status de cada linha. Mantenha textos como “Ativo” ou “Pendente” nas células se essa informação faz parte dos dados. O framework não oferece uma seleção de linha CSS que persista ao clicar nem uma marcação automática de erro em valores inconsistentes.

Nenhum — tabela é conteúdo estático. Se precisar de ordenação/filtro/
paginação client-side, veja o [DataTable](datatable.md), a camada JS
opcional que reusa `.fs-table`.

## A11y

A rolagem horizontal permite manter colunas, mas precisa ser utilizável por teclado no ambiente final. Uma região nomeada e focável pode ser usada quando necessário, sem trocar a semântica da tabela por outra. Teste se o foco e o indicador de rolagem continuam perceptíveis e se a região não cria uma parada desnecessária quando não há overflow.

Cabeçalhos simples usam scope para indicar o eixo. Tabelas complexas podem precisar de associações explícitas que não estão no escopo das classes visuais. A caption deve explicar o conjunto sem repetir mecanicamente cada título. Verifique ainda leitura com zoom: uma grade que cabe no desktop pode exigir rolagem e conteúdo mais curto em telas pequenas.

A classe priority esconde por posição, não por importância semântica. Reordenar colunas no aplicativo muda o que permanece visível. Inclua essa situação na revisão quando acrescentar uma nova coluna; um acréscimo aparentemente inocente pode deslocar dados essenciais para a quarta posição.

Use `.fs-table-responsive` para rolagem horizontal, `.fs-table-caption` para legenda e
`.fs-table-empty` para estados sem dados. `.fs-table-priority` mantém apenas as três primeiras colunas abaixo de 640px.

- Use `<th scope="col">`/`<th scope="row">` conforme o cabeçalho for de
  coluna ou linha — não é aplicado automaticamente.
- Para tabelas grandes/complexas, considere `<caption>` descrevendo o
  conteúdo.

## API JS

Nenhuma — 100% CSS. Para ordenação/filtro/paginação, use o
[DataTable](datatable.md).

## Tokens

A superfície base usa `--fs-color-surface-raised`, além de texto, borda e cor muted do cabeçalho. As variantes de estado usam os pares `--fs-alert-{nome}-bg` e `--fs-alert-{nome}-text`. Zebra e hover dependem de subtle, podendo sobrepor a leitura da cor de fundo geral. Avalie o resultado dos estados combinados, não apenas a tabela vazia.

O modificador compacto reduz padding de 8px/12px para 4px/8px. Isso aumenta densidade, mas não aumenta automaticamente a área de ativação de botões ou links internos. Se a tabela contém ações, revise cada alvo interativo separadamente; legibilidade dos dados e facilidade de toque são objetivos relacionados, porém diferentes.

`--fs-color-border`, `--fs-color-text`, `--fs-color-muted` (cabeçalho),
`--fs-color-subtle` (striped/hover), `--fs-alert-{nome}-bg`/`-text`
(variante de cor de estado).

## Exemplo

```html
<div class="fs-table-responsive">
  <table class="fs-table fs-table-striped fs-table-bordered fs-table-sm">
    <thead>
      <tr><th scope="col">Nome</th><th scope="col">E-mail</th><th scope="col">Status</th></tr>
    </thead>
    <tbody>
      <tr><td>Ana</td><td>ana@exemplo.com</td><td>Ativo</td></tr>
    </tbody>
  </table>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-3b4b9adc6c8f).

## Integração e limites

Por ser CSS-only, Table aceita linhas adicionadas ou removidas sem reinicialização. A aplicação continua responsável por escapar dados vindos de fontes externas e manter a contagem de células coerente. Não insira HTML não confiável como conveniência para montar linhas; a classe de tabela não sanitiza conteúdo.

Se houver DataTable sobre a mesma região, sua camada JavaScript captura dados e exige refresh após atualizações externas. Esse requisito pertence ao DataTable, não à Table básica. Evite atribuir ao CSS um ciclo de vida que ele não possui e escolha conscientemente quando precisa de ordenação, filtro e paginação em vez de uma tabela estática simples.
