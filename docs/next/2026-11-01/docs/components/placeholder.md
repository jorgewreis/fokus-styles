> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Placeholder

## Visão geral

`.fs-placeholder` desenha um bloco de carregamento. É apresentação CSS, não
um carregador de dados; consulte também [Skeleton](skeleton.md) para outra opção.

## Anatomia e exemplo

```html
<section aria-label="Resumo do processo" aria-busy="true">
  <p role="status">Carregando resumo…</p>
  <span class="fs-placeholder fs-placeholder-glow" style="width: 75%" aria-hidden="true"></span>
  <span class="fs-placeholder fs-placeholder-wave" style="width: 50%" aria-hidden="true"></span>
  <span class="fs-placeholder fs-placeholder-btn" aria-hidden="true"></span>
</section>
```

A largura das linhas é definida pelo consumidor; a classe base não determina
largura. Os estilos inline do exemplo são dimensões de conteúdo, não variantes
do framework. Não use o placeholder de botão como controle interativo.

## Variações

| Classe combinada com `.fs-placeholder` | Efeito |
| --- | --- |
| `.fs-placeholder-glow` | Oscilação de opacidade em 1.5s |
| `.fs-placeholder-wave` | Gradiente em movimento em 1.5s |
| `.fs-placeholder-btn` | Forma 6rem × 2.5rem e raio sm |

## Estados

Base: `min-height:1em`, fundo currentColor, opacidade .18, cursor wait.
Glow chega a .08. Em `prefers-reduced-motion:reduce`, glow/wave têm
`animation:none`. Ao concluir, substitua os placeholders pelo conteúdo e mude
`aria-busy` para false; em erro, mostre mensagem e possibilidade real de tentar
novamente. O framework não controla esse ciclo.

## A11y

Marque as formas como `aria-hidden="true"`, sem foco ou ações. Um texto de
status informa o carregamento; `aria-busy` informa atualização da região.
Leitores podem adiar anúncios dentro de região busy: se o anúncio imediato
for essencial, use a região live fora dela. Não anuncie cada forma individualmente.

## Tokens e limites

Apenas a forma de botão usa `--fs-radius-sm`; cor vem de currentColor.
Não há API JS, progress percentual ou substituição automática de conteúdo.

## Verificação

`component-docs-contract.test.js` verifica classes, formas ocultas da árvore
acessível e ausência de botões interativos. Confira carregamento/erro/sucesso e
preferência de movimento reduzido no aplicativo real.

## Escolha do indicador

Placeholder oferece formas leves que sugerem a área em atualização sem representar conteúdo verdadeiro. Ele é adequado para pequenos trechos de resumo, números ou linhas cuja largura aproximada já é conhecida. Se for necessário desenhar a composição de um card inteiro ou uma imagem de perfil, compare com Skeleton; se o progresso tiver percentual confiável, consulte Progress em vez de atribuir uma porcentagem fictícia a uma animação decorativa.

A cor deriva de `currentColor`, com opacidade reduzida. Isso facilita a integração com o contexto, mas também significa que uma cor herdada pouco perceptível pode tornar a forma quase invisível. O fundo não é um token de conteúdo carregado nem revela se a requisição está avançando. A animação se repete em duração fixa, independentemente da quantidade de dados recebidos.

### Dimensões e composição

A classe base tem altura mínima de um em, mas não define largura. Um `span` vazio sem largura apropriada pode não produzir o espaço visual esperado. Defina a largura segundo a área que será substituída, evitando que todas as linhas tenham medidas aleatórias que causem grandes saltos quando o texto chegar. A altura da fonte e o tamanho do contêiner continuam influenciando a composição.

A forma `.fs-placeholder-btn` tem dimensões de 6rem por 2.5rem e raio pequeno. Ela imita a área de um botão; não é um botão desabilitado nem deve entrar na ordem de Tab. Nos exemplos, todos os blocos são spans ocultos da árvore acessível. Se uma ação real existe enquanto o conteúdo carrega, mantenha um controle nativo separado e defina explicitamente se ele está disponível.

## API JS

Não há construtor Placeholder, evento de conclusão, temporizador de requisição ou método para substituir conteúdo. A aplicação alterna entre carregamento, sucesso, vazio e erro. Esse ciclo deve ser derivado da operação real, não de uma espera artificial escolhida para combinar com a animação. Se uma solicitação falhar, uma forma que continua pulsando indefinidamente não comunica a falha nem oferece recuperação.

### Integração do ciclo de dados

Ao iniciar uma atualização, mantenha um status compreensível e identifique a região ocupada com `aria-busy="true"` quando apropriado. Ao terminar, substitua as formas pelo conteúdo, finalize o estado busy e atualize a mensagem. Se o resultado for vazio, apresente uma explicação de ausência de itens; se houver erro, informe o problema e um caminho de tentativa coerente. O componente não toma essas decisões e não impede que uma resposta antiga substitua dados mais recentes.

Evite apagar controles em que a pessoa está digitando apenas para mostrar um carregamento. Uma lista pode atualizar sem remover o campo de busca ou seu foco. Em solicitações sucessivas, considere manter os resultados anteriores com uma indicação clara de atualização, em vez de reconstruir toda a área. Essa escolha depende da experiência do produto, não de uma variante de Placeholder.

### Anúncios e movimento

As formas decorativas não precisam ser anunciadas uma por uma. Uma mensagem de status deve explicar o que está sendo carregado, sem tornar cada ciclo da animação um anúncio. Leitores de tela podem adiar atualizações dentro de uma região busy; se a mensagem inicial precisa ser percebida imediatamente, mantenha sua região de status fora da área marcada como ocupada. Teste a combinação na tecnologia assistiva usada pelo público.

As variantes glow e wave fornecem efeitos diferentes e não devem ser empilhadas como se somassem dois indicadores de progresso. Sob preferência de movimento reduzido, ambas deixam de animar. Isso não remove o placeholder nem conclui a operação: o estado visual permanece até a aplicação substituí-lo. Não torne a animação a única forma de reconhecer que algo está pendente.

### Limites e critérios de revisão

Confira a interface com rede lenta, resposta vazia e erro, além do caminho de sucesso. Verifique se os blocos não parecem ações disponíveis e se o conteúdo final não desloca inesperadamente o foco. O cursor wait é uma indicação visual local, não uma trava da interface. Testes de CSS e DOM confirmam classes e atributos; duração percebida, estabilidade do layout e anúncio real precisam de revisão no aplicativo em execução.
