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
- **Controles no hover**: `.fs-carousel-hover-controls` revela setas e toggle
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
<div class="fs-carousel fs-carousel-fade fs-carousel-hover-controls"
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

Mockup: [laboratório do componente](../../mockup/content-data.html#carousel).

## Limitações

O Carousel mostra um item por vez e não inclui thumbnails, vídeo, zoom,
lightbox ou múltiplos slides visíveis. Prefira compor recursos existentes para
esses casos antes de propor uma expansão deste componente avançado.
