> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Carousel

Carrossel de painéis ou mídias relacionadas, com navegação por setas,
indicadores, teclado, arraste e autoplay opcional. Use-o para conteúdo
complementar; informação essencial deve continuar disponível fora dos slides.

## Visão geral

```html
<div class="fs-carousel" data-fs="carousel" aria-label="Destaques de produto">
  <div class="fs-carousel-inner">
    <div class="fs-carousel-item is-active">
      <img src="slide1.jpg" alt="Equipe colaborando em um painel">
      <div class="fs-carousel-caption">
        <h2>Fluxos mais claros</h2>
        <p>Centralize tarefas recorrentes em uma experiência previsível.</p>
      </div>
    </div>
    <div class="fs-carousel-item"><img src="slide2.jpg" alt="Resumo de resultados"></div>
  </div>
  <button type="button" class="fs-carousel-control-prev" aria-label="Slide anterior"></button>
  <button type="button" class="fs-carousel-control-next" aria-label="Próximo slide"></button>
</div>
```

## Anatomia

`.fs-carousel` (`data-fs="carousel"`, rótulo acessível e recorte) >
`.fs-carousel-inner` (trilha flex deslocada por `translate3d`) >
`.fs-carousel-item` (um por slide; exatamente um inicia com `.is-active`).

Use `.fs-carousel-media` com `background-image` para uma fotografia de fundo;
como a imagem é decorativa nesse padrão, deixe-a com `aria-hidden="true"` e
forneça o contexto na legenda. Para imagem semântica, prefira `<img alt>`.

Filhos opcionais do contêiner são `.fs-carousel-control-prev`,
`.fs-carousel-control-next`, `.fs-carousel-control-toggle`,
`.fs-carousel-indicators` (lista de botões) e `.fs-carousel-caption` dentro
de cada item. A legenda recebe um gradiente de leitura, título, texto e CTA
opcional.

## Variações

- **Fade**: `.fs-carousel-fade` troca os slides por opacidade.
- **Controles no hover**: o comportamento padrão revela setas e toggle
  ao passar o mouse ou ao focar um controle.
- **Legenda lateral**: `.fs-carousel-caption-side` posiciona a legenda à
  direita em telas largas e volta ao overlay padrão em telas pequenas. Adicione
  `.fs-carousel-caption-start` à legenda de um slide para alinhá-la à esquerda
  quando isso preservar melhor o assunto da imagem. Em telas pequenas, a
  legenda ocupa a largura disponível, mas mantém o alinhamento visual: à
  direita por padrão e à esquerda com `.fs-carousel-caption-start`.
- **Legenda empilhada**: `.fs-carousel-caption-stacked` posiciona a legenda e
  os indicadores abaixo da mídia, sem qualquer sobreposição.
- **Sem mídia**: `.fs-carousel-no-media` cria painéis de superfície para
  conteúdo informativo ou interativo.
- **Autoplay controlável**: use `data-autoplay="true"` e inclua o botão
  `[data-fs-carousel-toggle]` para oferecer pausa e reprodução explícitas.

```html
<div class="fs-carousel fs-carousel-fade"
     data-fs="carousel" data-autoplay="true" data-interval="4000"
     aria-label="Atualizações automáticas">
  <!-- .fs-carousel-inner e itens -->
  <button type="button" class="fs-carousel-control-toggle" data-fs-carousel-toggle></button>
</div>
```

## Estados

`.fs-carousel-item.is-active` e `.fs-carousel-indicators button.is-active`
são sincronizados pelo JavaScript. O botão de reprodução recebe
`aria-pressed="true"` enquanto o autoplay está habilitado e troca seu nome
acessível entre pausar e reproduzir.

`data-autoplay="true"` avança a cada `data-interval` ms (padrão `5000`). O
timer pausa temporariamente no hover, foco, arraste e quando a aba fica
oculta. `pause()` ou o toggle impedem sua retomada até `play()` ser chamado.

Com zero ou um slide, o componente recebe `.is-static`; controles e
indicadores são ocultados e não é criado um tab stop de navegação.

As áreas superior e inferior ficam reservadas pelos tokens
`--fs-carousel-top-safe-area` e `--fs-carousel-bottom-safe-area`: legendas
padrão nunca ocupam a barra de controles nem os indicadores. Para um
carrossel de dois slides, `.fs-carousel-hide-indicators-two` oculta os dots.
`[data-fs-carousel-counter]` recebe automaticamente o texto `1 de 3`, e
`[data-fs-carousel-progress]` anima o progresso do autoplay. Use
`data-drag="false"` quando o conteúdo do slide for altamente interativo.

Na variação `.fs-carousel-caption-side`, a mesma reserva é aplicada no modo
compacto: a legenda não invade a barra superior ou os indicadores, o excesso
de conteúdo é recortado sem criar barra de rolagem e o gradiente de leitura
ocupa toda a área da mídia.

## A11y

O contêiner recebe `role="group"` e `aria-roledescription="carousel"`; forneça
sempre um `aria-label` que descreva seu conteúdo. Slides inativos recebem
`aria-hidden`; indicadores recebem `aria-current`; e a trilha é `aria-live`
`off` durante autoplay ativo e `polite` quando manual ou pausado.

Com foco no próprio carrossel, `ArrowLeft`/`ArrowRight` trocam o slide e
`Home`/`End` vão ao primeiro/último. Os botões mantêm foco nativo e não têm
suas teclas capturadas pelo contêiner. O arraste por mouse, toque ou caneta
segue o movimento horizontal, preserva rolagem vertical e ignora gestos que
começam em controles ou conteúdo interativo. Transições respeitam
`prefers-reduced-motion: reduce`.

## API JS

Auto-init via `data-fs="carousel"`. `Carousel.getInstance(el)` recupera a
instância criada.

| Método | Descrição |
|---|---|
| `next()` / `prev()` | Avança/volta um slide, circularmente. |
| `goTo(index)` | Vai diretamente ao índice informado. |
| `pause()` | Pausa o autoplay configurado até uma chamada a `play()`. |
| `play()` | Retoma o autoplay configurado, se o carrossel for navegável e a página estiver visível. |
| `dispose()` | Para o timer, remove listeners e desregistra a instância. |

| Evento | Cancelável | Quando |
|---|---|---|
| `fs:carousel:slid` | Não | Após trocar de slide; `detail` contém `{ from, to }`. |

## Configuração e índices

Não há objeto de opções JS: autoplay, interval e drag são lidos dos atributos na
construção. `goTo(index)` espera um inteiro finito e normaliza índices por módulo
circular: -1 vai ao último, e um índice igual à quantidade retorna ao primeiro.
Valores fracionários, NaN e infinitos são ignorados, sem mudar o estado ou emitir
eventos. Não há coerção: strings (inclusive vazias), null e argumentos omitidos
também são ignorados; converta e valide entradas de formulário na aplicação.
Com zero ou um slide, a navegação permanece sem efeito. O componente não sanitiza o markup dos slides.

## Tokens

O componente expõe tokens locais com fallback para tokens globais:
`--fs-carousel-radius`, `--fs-carousel-transition-duration`,
`--fs-carousel-transition-easing`, `--fs-carousel-control-size`,
`--fs-carousel-control-inset`, `--fs-carousel-control-color`,
`--fs-carousel-control-bg`, `--fs-carousel-control-bg-hover`,
`--fs-carousel-focus-color`, `--fs-carousel-indicator-size`,
`--fs-carousel-indicator-active-width`, `--fs-carousel-indicator-color`,
`--fs-carousel-indicator-active-color`, `--fs-carousel-caption-scrim`,
`--fs-carousel-top-safe-area`, `--fs-carousel-bottom-safe-area` e
`--fs-carousel-progress-height`.

## Exemplo

```html
<div class="fs-carousel" data-fs="carousel" data-autoplay="true"
     aria-label="Destaques do produto">
  <div class="fs-carousel-inner">
    <div class="fs-carousel-item is-active"><img src="a.jpg" alt="Produto em uso"></div>
    <div class="fs-carousel-item"><img src="b.jpg" alt="Equipe em reunião"></div>
    <div class="fs-carousel-item"><img src="c.jpg" alt="Painel de resultados"></div>
  </div>
  <button type="button" class="fs-carousel-control-prev" aria-label="Slide anterior"></button>
  <button type="button" class="fs-carousel-control-next" aria-label="Próximo slide"></button>
  <button type="button" class="fs-carousel-control-toggle" data-fs-carousel-toggle></button>
  <ul class="fs-carousel-indicators">
    <li><button type="button" class="is-active" aria-label="Ir para o slide 1"></button></li>
    <li><button type="button" aria-label="Ir para o slide 2"></button></li>
    <li><button type="button" aria-label="Ir para o slide 3"></button></li>
  </ul>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-04a8ceb2ce5b).

## Limitações

O Carousel mostra um item por vez e não inclui thumbnails, vídeo, zoom,
lightbox ou múltiplos slides visíveis. Prefira compor recursos existentes para
esses casos antes de propor uma expansão deste componente avançado.

## Conteúdo adequado a uma sequência de slides

Carousel reúne painéis relacionados em uma única área, mas torna parte do conteúdo indisponível visualmente a cada instante. Use-o quando essa seleção sequencial ajuda a explorar material complementar, como demonstrações ou imagens de um produto. Informações necessárias para concluir a tarefa, condições importantes e caminhos principais de navegação não deveriam depender de esperar o slide correto. Uma lista ou uma grade pode ser mais direta quando a pessoa precisa comparar itens lado a lado.

Este componente avançado mostra um item por vez. Ele não carrega imagens, não busca dados e não fornece lightbox ou controle de vídeo. O aplicativo deve disponibilizar arquivos de mídia válidos e texto alternativo apropriado. Os nomes a.jpg, b.jpg e slide1.jpg nos exemplos representam assets que o projeto precisa fornecer; não são recursos distribuídos pelo framework. Não trate um mockup com imagens ausentes como demonstração visual concluída.

## Preparar uma estrutura estável

A trilha inner contém os itens e é deslocada no modo padrão. Os controles e indicadores ficam no contêiner externo; cada indicador corresponde à posição do item na coleção capturada. Mantenha a quantidade e ordem coerentes. O construtor procura os descendentes uma vez, não acompanha adições e remoções por um observador. Se o conjunto mudar, descarte a instância e remonte após atualizar o HTML, em vez de apenas inserir um slide e esperar que o controlador o reconheça.

Quando nenhum item começa ativo, o primeiro é adotado. Se houver mais de um ativo no HTML, a renderização sincroniza o estado a partir do primeiro encontrado. Ainda assim, forneça exatamente um ativo para que a estrutura seja compreensível antes da inicialização. Com zero itens, não há conteúdo a explorar; o contador pode refletir uma composição vazia, por isso prefira um estado vazio da aplicação a exibir um carrossel sem slides.

Os indicadores são botões por posição, não links para URLs. Nomeie-os de modo que a pessoa entenda seu destino; um texto como “Ver imagem da embalagem” pode ser mais informativo que apenas “Slide 2” em uma galeria pequena. O contador informa a posição, mas não substitui o nome do conjunto. O contêiner precisa de aria-label que descreva quais itens estão sendo explorados.

## Navegação circular e evento de mudança

Os índices da API começam em zero. Next e prev normalizam circularmente, de modo que avançar do último retorna ao primeiro. GoTo também usa essa convenção, inclusive para inteiros negativos ou maiores que a coleção. Essa normalização não valida um identificador de domínio: converta a posição de um item da aplicação para seu índice antes de chamar o método. Strings numéricas não são aceitas pelo contrato implementado.

Ir para o item já selecionado não produz uma nova mudança. A notificação fs:carousel:slid contém from e to e propaga no contêiner; existe também fs:shown com o mesmo detalhe. A emissão ocorre após atualizar o estado e o DOM, não após aguardar transitionend. Portanto, não a use como prova de que a animação terminou ou de que uma imagem remota acabou de carregar. Se a aplicação precisa dessas informações, acompanhe os eventos específicos da mídia ou da transição que ela controla.

As conveniências estáticas Carousel.next, Carousel.prev e Carousel.goTo recebem o contêiner e usam getOrCreateInstance. Essa criação implícita também exige HTML pronto. Não combine chamadas estáticas e construções repetidas sem consultar o registro. Não há objeto de opções no construtor; autoplay, intervalo e drag vêm dos atributos e são capturados na montagem.

## Autoplay é uma escolha de produto

Sem data-autoplay true, play não passa a habilitar reprodução automática: ele apenas retoma a configuração existente. O toggle fica desabilitado quando não há autoplay ou quando o conjunto é estático. Forneça controle de pausa quando optar por avanço automático, e permita tempo suficiente para ler o conteúdo real. A duração padrão de 5000ms não é uma recomendação universal para qualquer quantidade de texto.

O intervalo usa conversão numérica com fallback. Ausência, zero e valor não numérico retornam ao padrão; valores negativos ou não finitos não recebem uma validação robusta nesta implementação. Forneça milissegundos finitos positivos e teste a velocidade percebida. Não use o atributo como entrada livre de usuário sem validação, nem espere que uma duração inválida seja automaticamente corrigida para um valor confortável.

Hover, foco dentro, arraste e aba oculta são pausas temporárias. Pause registra uma intenção persistente do usuário até play. O estado aria-pressed do toggle representa reprodução habilitada pela intenção, não necessariamente a presença de um timer naquele instante: durante hover o timer pode estar parado e o botão continuar indicando que a reprodução está habilitada. A trilha muda aria-live de acordo com o timer efetivo.

A retomada recria o intervalo; não existe promessa de preservar o tempo restante do slide como ocorre no Toast. A barra de autoplay é uma indicação visual dessa cadência, não progresso de leitura ou download. A preferência de movimento reduzido afeta o CSS das transições, mas o JavaScript não desliga automaticamente a configuração de autoplay com base nela. Avalie se o produto deve iniciar pausado segundo a preferência da pessoa.

## Teclado, arraste e slides inativos

Os atalhos de setas, Home e End só são capturados quando o alvo do evento é o próprio contêiner. Inputs, botões e links dentro dos slides preservam seu comportamento de teclado. Os slides inativos recebem aria-hidden e inert, impedindo que controles escondidos continuem no percurso normal de foco em navegadores compatíveis. A aplicação deve testar conteúdo interativo de verdade, não apenas fotografias, antes de adotar esse padrão.

O arraste ignora gestos iniciados em elementos interativos e diferencia deslocamento vertical de horizontal. Um movimento horizontal precisa ultrapassar limiar calculado pela largura antes de trocar de slide. O modo fade não inicia arraste, mesmo que data-drag não seja false. Assim, não prometa a mesma interação gestual para todas as variações. As setas e indicadores continuam sendo alternativas importantes ao gesto.

## Legendas, tema e desmontagem

Legendas sobrepostas dependem do contraste entre texto, gradiente e imagem. O scrim ajuda, mas não garante legibilidade sobre qualquer fotografia personalizada. Quando houver texto extenso, prefira a composição empilhada ou conteúdo fora do carrossel. O recorte da legenda lateral compacta pode esconder excesso; reduzir fonte continuamente para fazê-lo caber não é uma solução acessível. Teste a tradução mais longa e o zoom adotado pelo produto.

Os tokens de safe area reservam espaço interno para controles e indicadores; não são uma autorização para posicionar qualquer conteúdo absoluto nessas regiões. Tamanho de controles, foco, transição e cores podem ser customizados localmente, mas devem continuar permitindo identificação e operação. Não use cor isolada para indicar a posição atual quando aria-current e texto podem tornar o estado mais compreensível.

Em bundler, importe estilos de `fokus-styles` e Carousel de `fokus-styles/js`; no IIFE use FokusStyles.Carousel. Antes de remover a região, execute dispose para interromper timers e retirar listeners, inclusive visibilitychange no documento. O método remove o tabindex que ele próprio criou, mas não restaura integralmente classes, atributos inert/ARIA e transforms dos slides. Se quiser exibir todos os itens estaticamente após descartar, a aplicação deve reconstruir ou normalizar essa apresentação. Testes DOM verificam índices e estado; gestos, recortes e leitura assistiva exigem navegador real.
