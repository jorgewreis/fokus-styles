> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Badge

Rótulo pequeno de destaque — contagem, status — usado sozinho ou embutido
em cards, navbar, tabelas. Para a variante removível, ver
[Tag](tag.md).

## Visão geral

```html
<span class="fs-badge">Padrão</span>
<span class="fs-badge fs-badge-primary">Primary</span>
```

## Anatomia

Um único elemento, `.fs-badge` — sem marcação interna obrigatória.

## Variações

- **Cor**: `.fs-badge-{primary|secondary|success|warning|danger|info}` —
  fundo sólido, texto de contraste calculado na compilação Sass (não recalculado após qualquer troca de token em runtime). Sem
  modificador, usa cores neutras (`--fs-color-subtle`/`--fs-color-text`).
- **Peso visual**: `.fs-badge-soft-{nome}` cria fundo translúcido com borda
  sutil, recomendado para status recorrentes em tabelas e cards;
  `.fs-badge-outline-{nome}` mantém apenas contorno e texto, útil para
  metadados e filtros. As variantes sólidas permanecem para destaque alto.
- **Tamanho**: `.fs-badge-sm` (mínimo 18px), `.fs-badge-lg` (mínimo 26px); sem sufixo =
  mínimo 22px (padrão).
- **Acabamento**: usa `--fs-radius-sm` (4px) por padrão, mantendo cantos
  levemente arredondados sem transformar o badge em uma pílula.
- **Densidade**: `--fs-badge-padding-inline`,
  `--fs-badge-padding-block-start` e `--fs-badge-padding-block-end` permitem
  ajustar o espaço interno localmente sem substituir o componente inteiro.
- **Padrões**: `.fs-badge-dot` adiciona um indicador circular antes do texto;
  `.fs-badge-count` estabiliza contagens com algarismos tabulares e
  `.fs-badge-count-circle` cria um indicador circular para contagens curtas,
  preferencialmente de um único dígito.
- **Split**: `.fs-badge-split` reúne um rótulo e um valor em segmentos
  conectados. Use `.fs-badge-split-{nome}` para colorir o valor; os elementos
  internos obrigatórios são `.fs-badge-split-label` e
  `.fs-badge-split-value`.

```html
<span class="fs-badge fs-badge-success fs-badge-sm">Ativo</span>
<span class="fs-badge fs-badge-danger fs-badge-lg">Crítico</span>
<span class="fs-badge fs-badge-soft-success fs-badge-dot">Disponível</span>
<span class="fs-badge fs-badge-outline-primary">Beta</span>
<span class="fs-badge-split fs-badge-split-primary">
  <span class="fs-badge-split-label">New</span>
  <span class="fs-badge-split-value">0.7.1</span>
</span>
```

## Estados

Nenhum — elemento estático, sem interação.

## A11y

Badge é decorativo/informativo, não interativo — se o conteúdo for
significativo pra quem usa leitor de tela (ex.: contador de notificações
não lidas), garanta que o texto ao redor já comunique o contexto (não
dependa só da cor).

## API JS

Nenhuma — 100% CSS.

## Tokens

Usa os tokens de cor de tema (`--fs-color-{nome}`, ver
[`docs/reference/design-tokens.md`](../reference/design-tokens.md)) e expõe
`--fs-badge-color`, `--fs-badge-bg`, `--fs-badge-border`,
`--fs-badge-height` e `--fs-badge-radius` (`var(--fs-radius-sm)` por padrão)
para personalização localizada. A densidade também pode ser ajustada com
`--fs-badge-padding-inline`, `--fs-badge-padding-block-start` e
`--fs-badge-padding-block-end`. Split também expõe
`--fs-badge-split-{label|value}-{bg|color}`, `--fs-badge-split-height` e
`--fs-badge-split-radius` (`var(--fs-radius-sm)` por padrão), aplicado ao
contêiner externo que conecta o rótulo e o valor.

## Exemplo

```html
<span class="fs-badge">12</span>
<span class="fs-badge fs-badge-primary">Novo</span>
<span class="fs-badge fs-badge-warning fs-badge-sm">Pendente</span>
<span class="fs-badge fs-badge-soft-success fs-badge-dot">Online</span>
<span class="fs-badge fs-badge-count fs-badge-danger">12</span>
<span class="fs-badge fs-badge-count fs-badge-count-circle fs-badge-danger" aria-label="1 notificação não lida">1</span>
```

## Composição e contraste

Mantenha o badge próximo do título, status ou contagem que ele qualifica e
não use a cor como única indicação de estado. Para filtros ou ações, use um
botão ou Tag, não um badge estático. Em temas e marcas customizadas, meça as variantes `soft` e `outline` nas superfícies reais e confirme que o texto continua legível nos temas claro e escuro. `npm run contrast:check` audita pares predefinidos do tema, mas não cobre automaticamente essas variantes nem cores arbitrárias alteradas em runtime.

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-d4bd366a3fbe).

## Escolha do destaque e contexto

Badge apresenta uma informação curta que qualifica outro conteúdo: o estado de um documento, uma contagem ou uma marca de versão. Ele funciona melhor quando o leitor consegue identificar imediatamente o que está sendo qualificado. Um número isolado como “12” pode significar mensagens, tarefas ou dias; prefira colocá-lo junto de um nome visível ou de uma descrição acessível. O componente desenha o rótulo, mas não decide o significado dos dados nem calcula a contagem.

Escolha o peso visual conforme a importância relativa. Um badge sólido chama mais atenção; soft usa mistura translúcida; outline preserva o fundo e destaca o contorno. Em uma tabela extensa, transformar todos os metadados em destaque sólido reduz a capacidade de localizar uma exceção relevante. O nome da cor não é uma validação de negócio: aplicar success a um processo não comprova que ele foi concluído nem altera seus dados.

### Anatomia de contagens e valores compostos

A base é um elemento inline-flex com altura mínima, padding e texto em uma única linha. O mínimo de 22px pode crescer quando fonte, conteúdo ou personalização exigirem mais espaço; as variantes pequena e grande também definem mínimos, não caixas imutáveis. Não corte palavras essenciais para encaixá-las em uma dimensão imaginada. Como há `white-space: nowrap`, um rótulo muito extenso pode criar problemas de largura em contêineres estreitos.

A variante count estabiliza a largura mínima e usa algarismos tabulares, ajudando quando números mudam. A forma circular é mais adequada a contagens curtas: adicionar três ou quatro dígitos não produz automaticamente abreviações como “99+”. Essa escolha, o tratamento de zero e o limite apresentado pertencem à aplicação. Se o número completo for importante, mantenha-o disponível de forma textual e coerente com o valor abreviado.

Split tem uma anatomia própria, com dois segmentos nomeados, não dois badges independentes apenas colocados lado a lado. O segmento de rótulo explica o valor; por exemplo, “Versão” e “2.7”. As classes de cor modificam o segmento de valor, enquanto o contêiner externo mantém a conexão e recorta os cantos. Os modificadores pequeno e grande também possuem regras específicas para split. Preserve a ordem de leitura rótulo–valor no DOM.

## Integração de atualização dinâmica

Não existe contador automático nem ligação com Notification Center ou outra fonte de dados. A aplicação pode alterar o texto quando recebe novos resultados, mas deve definir se essa mudança precisa de anúncio. Um indicador decorativo dentro de um botão pode fazer parte de seu nome acessível; contagens que mudam a todo instante não devem gerar mensagens repetitivas sem necessidade. Use uma região de status apenas quando a informação for relevante para a tarefa em andamento.

O ponto criado por `.fs-badge-dot` é um pseudo-elemento decorativo, não um estado semântico. O texto “Disponível” continua sendo necessário para explicar o significado. Se o estado for uma ação de alternância, use um botão com estado apropriado ou um controle de formulário; o badge não implementa clique, foco ou `aria-pressed`. Para remoção, o componente relacionado é Tag, com contrato próprio, não um evento escondido de Badge.

### Personalização e contraste real

As variantes sólidas calculam o texto de contraste durante a compilação Sass a partir das cores configuradas. Alterar apenas a variável de fundo em runtime não recalcula esse texto automaticamente. Soft e outline usam misturas CSS que dependem das cores e da superfície do contexto. Portanto, uma alteração de marca exige revisar os estados no fundo em que serão exibidos, inclusive tema escuro e alto contraste.

Os tokens locais permitem ajustar cor, borda, raio e densidade sem substituir todas as regras. Faça mudanças no escopo desejado, evitando que um ajuste para uma contagem altere badges de status de todo o produto. O contraste medido para o tema distribuído não certifica qualquer combinação de tokens escolhida depois pela aplicação.

### Limites e verificação

Badge não trunca texto, não traduz estados, não limita números e não fornece um lifecycle JavaScript. Confira rótulos traduzidos, números grandes, zero, atualização de dados e alinhamento junto de headings ou botões. Verifique se o estado permanece compreensível sem cor e se a escolha de tamanho não produz uma informação visualmente pequena demais para seu contexto. Esses critérios complementam os testes de classe: presença do seletor no CSS não basta para tornar um rótulo claro.
