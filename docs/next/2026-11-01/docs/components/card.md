> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Card

Contêiner de conteúdo genérico — a peça que mais combina outros
componentes (botões, badges, tipografia) dentro de si.

## Visão geral

```html
<div class="fs-card">
  <div class="fs-card-header">
    <h3 class="fs-card-title">Título do card</h3>
    <button type="button" class="fs-btn-close" aria-label="Fechar"></button>
  </div>
  <div class="fs-card-body">
    <p class="fs-card-text">Corpo de texto do card.</p>
    <button type="button" class="fs-btn fs-btn-primary">Ação</button>
  </div>
  <div class="fs-card-footer">
    <span class="fs-badge fs-badge-success">Ativo</span>
  </div>
</div>
```

## Anatomia

`.fs-card` > até três seções empilhadas, todas opcionais: `.fs-card-header`
(fundo sutil, borda inferior — quando tem `.fs-card-title` + botão, o
layout já vem com `justify-content: space-between`), `.fs-card-body`,
`.fs-card-footer` (fundo sutil, borda superior).

Dentro de `.fs-card-body`: `.fs-card-title` (destaque), `.fs-card-subtitle`
(secundário, cor muted), `.fs-card-text` (parágrafo de corpo — o último de
um card não tem margem inferior).

## Variações

- **Horizontal**: `.fs-card-horizontal` — eixo principal de coluna pra
  linha ("imagem à esquerda, texto à direita"); raios de header/footer se
  ajustam pra lateral em vez de topo/base.
- **Tamanho**: `.fs-card-sm` (5px de padding interno), `.fs-card-lg`
  (15px); sem sufixo = 10px (padrão) — não muda a largura do card, só a
  densidade.
- **Clicável**: `.fs-card-clickable` + `.fs-stretched-link` — ver abaixo.

```html
<div class="fs-card fs-card-horizontal">
  <div class="fs-card-header">Lateral</div>
  <div class="fs-card-body">Conteúdo ao lado.</div>
</div>
```

### `.fs-card-clickable`

Expande a área clicável do link sobre o card, mantendo o foco no link real sem aninhar um `<a>` ao redor de todo
o conteúdo (o que quebraria a semântica havendo outros elementos
interativos dentro). Coloque `.fs-stretched-link` no link que deve capturar
o clique — ele se expande via `::after` pra cobrir o card inteiro:

```html
<div class="fs-card fs-card-clickable">
  <div class="fs-card-body">
    <h4 class="fs-card-title">
      <a href="/detalhes" class="fs-stretched-link">Ver detalhes</a>
    </h4>
    <p class="fs-card-text">O card inteiro é clicável, não só o link.</p>
  </div>
</div>
```

## Estados

`.fs-card-clickable:hover`/`:focus-within` — borda muda pra cor primária +
sombra (`:focus-within` em vez de `:focus` pra destacar tanto no hover
quanto ao navegar por teclado até o link interno).

## A11y

- `.fs-stretched-link` deve estar num elemento nativamente focável (`<a
  href="...">`), nunca num `<div>` — é o link real que recebe o foco/clique
  do teclado, o `::after` só expande a área clicável do mouse.
- Se o card tiver múltiplos links/botões, só o `.fs-stretched-link`
  expande; os demais precisam ser posicionados explicitamente por cima dele
  (`z-index` do `::after` é `1`, mas elementos com `position: relative` e
  `z-index` maior no conteúdo ficam acima).

## API JS

Nenhuma — 100% CSS.

## Tokens

`--fs-border-width`, `--fs-color-border-default` (borda externa), `--fs-color-border` (divisórias), `--fs-color-surface`, `--fs-color-subtle`
(header/footer), `--fs-radius-lg`, `--fs-shadow-sm` (hover clicável),
`--fs-color-primary` (borda hover clicável).

## Exemplo

```html
<div class="fs-card fs-card-clickable" style="max-width: 320px;">
  <div class="fs-card-body">
    <h4 class="fs-card-title"><a href="/relatorios/trimestral" class="fs-stretched-link">Relatório Q3</a></h4>
    <p class="fs-card-subtitle">Atualizado há 2 dias</p>
    <p class="fs-card-text">Resumo financeiro do terceiro trimestre.</p>
  </div>
  <div class="fs-card-footer">
    <span class="fs-badge fs-badge-success">Publicado</span>
  </div>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-52d3162b927c).

## Escolha do contêiner

Card agrupa conteúdo relacionado e dá a ele uma superfície visual reconhecível. É útil para resumos, resultados de pesquisa e blocos de configuração, mas não deve ser aplicado a cada parágrafo apenas para criar caixas. Antes de usar, defina qual informação pertence ao mesmo conjunto e qual é a ação principal, se houver. O componente não cria essa relação semântica: um `article` pode representar conteúdo independente, uma `section` pode agrupar uma seção nomeada e um `div` pode ser suficiente para organização visual.

Cabeçalho, corpo e rodapé são opcionais. O cabeçalho pode reunir título e ação, o corpo contém a explicação principal e o rodapé costuma reunir metadados. Essa distribuição é uma convenção de leitura, não uma validação automática. Um rodapé com ação destrutiva deve explicar sua função tão claramente quanto uma ação colocada em outro lugar. O CSS não associa botões aos dados do card nem instala handlers para fechar, editar ou navegar.

### Densidade e orientação

Os tamanhos alteram o padding das três áreas, sem determinar largura, quantidade de linhas ou número de cards por tela. Para uma grade de resultados, o layout externo decide colunas e intervalos. A variante horizontal muda o eixo flex e ajusta bordas e cantos das áreas nas pontas, mas não contém um breakpoint que a transforme novamente em vertical. Em telas estreitas, confira se texto e mídia ainda têm espaço; uma classe horizontal não substitui uma estratégia responsiva.

O título recebe estilo tipográfico sem impor seu nível HTML. Escolha `h2`, `h3` ou outro nível segundo a hierarquia real da página. O subtítulo não precisa ser um heading apenas porque aparece abaixo do título. O último parágrafo com `.fs-card-text` perde a margem inferior quando é o último filho, ajudando o alinhamento; a regra depende dessa posição no DOM e não de uma análise de todo o conteúdo.

### Clique expandido e múltiplas ações

`.fs-card-clickable` oferece resposta visual em hover e foco interno. A expansão da área clicável vem do pseudo-elemento de `.fs-stretched-link`, que ocupa o ancestral posicionado. O card base já é posicionado, mas um ancestral intermediário também posicionado pode mudar a referência desse pseudo-elemento. Confira a estrutura antes de concluir que toda a caixa será o destino do link.

O card não recebe foco por si: o link real é a parada de teclado. Não acrescente `tabindex` ao contêiner para duplicar esse foco sem criar uma operação diferente. Se houver vários links, botões ou campos, considere não expandir um deles sobre a caixa inteira. A camada do stretched link tem `z-index: 1`; outros controles precisam de composição explícita acima dela ou podem ficar cobertos. Essa prioridade não é adicionada automaticamente a todos os descendentes.

## Integração e estados da aplicação

O conteúdo pode ser renderizado no servidor ou por código cliente, mas Card não busca registros, não acompanha mudanças e não mantém seleção. Um badge de “Publicado” deve refletir o estado real da aplicação. Para carregamento, erro ou ausência de resultados, componha o conteúdo adequado e preserve uma mensagem compreensível. Não trate um card vazio como sinal suficiente de que os dados ainda estão chegando.

Os botões do exemplo inicial demonstram posições de ação; seus textos não instalam comportamento. Conecte uma ação a seu handler ou use um link quando houver um destino navegável. A classe de fechamento desenha o controle, mas não remove automaticamente este card. Se uma ação remover o elemento focado, planeje para onde o foco deve ir e anuncie o resultado quando necessário.

### Tokens e revisão

A borda externa usa largura e cor de borda padrão; divisórias internas usam o token de borda geral. Os fundos de cabeçalho e rodapé são sutis, enquanto o corpo segue a superfície. No estado clicável, além de borda e sombra, existe uma pequena translação vertical. Revise movimento reduzido e estilos globais no contexto completo, sem inferir uma garantia específica de todos os estados apenas pela existência do componente.

Confira títulos longos, múltiplas ações, ausência de cabeçalho/rodapé, zoom e imagens maiores que o contêiner. Não há recorte automático geral de mídia no card; uma imagem pode precisar de Ratio ou outra composição. Os exemplos de rota exigem páginas implementadas pela aplicação. O contrato aqui é de estrutura e apresentação, não de persistência, autorização ou organização automática de uma grade.
