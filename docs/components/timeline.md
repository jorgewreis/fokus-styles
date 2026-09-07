# Timeline

Linha do tempo de eventos — 100% CSS, com marcadores conectados e estados
por item (pendente/ativo/concluído/falhou).

## Visão geral

```html
<ol class="fs-timeline">
  <li class="fs-timeline-item fs-timeline-completed">
    <div class="fs-timeline-marker"></div>
    <div class="fs-timeline-content">
      <p class="fs-timeline-title">Pedido criado</p>
      <p class="fs-timeline-text">Seu pedido foi registrado.</p>
      <span class="fs-timeline-time">10:32</span>
    </div>
  </li>
  <li class="fs-timeline-item fs-timeline-active">
    <div class="fs-timeline-marker"></div>
    <div class="fs-timeline-content">
      <p class="fs-timeline-title">Em preparação</p>
    </div>
  </li>
  <li class="fs-timeline-item">
    <div class="fs-timeline-marker"></div>
    <div class="fs-timeline-content">
      <p class="fs-timeline-title">Enviado</p>
    </div>
  </li>
</ol>
```

## Anatomia

`<ol class="fs-timeline">` > `.fs-timeline-item` (um por evento) >
`.fs-timeline-marker` (círculo) + `.fs-timeline-content` >
`.fs-timeline-title` + `.fs-timeline-text` (opcional) +
`.fs-timeline-time` (opcional). O conector entre marcadores é desenhado
via `::before` — não insira manualmente.

## Variações

`.fs-timeline-horizontal` no `<ol>` — inverte o eixo (itens em colunas,
marcador no topo, conector na horizontal).

## Estados

Cada `.fs-timeline-item` aceita uma destas classes (mesma lógica visual do
[Stepper](stepper.md) — controle manual, sem JS):

| Classe | Efeito |
|---|---|
| (nenhuma) | Pendente — marcador vazio, conector cinza. |
| `.fs-timeline-active` | Em andamento — marcador preenchido na cor primária. |
| `.fs-timeline-completed` | Concluído — marcador com check verde; o conector seguinte também fica verde (indica progresso). |
| `.fs-timeline-failed` | Falhou — marcador e título em vermelho. |

## A11y

Use `<ol>` (ordem cronológica importa) — já no exemplo. Sem JS, sem
interação por teclado própria; se os itens forem clicáveis (ex.: expandir
detalhes), essa interação é sua responsabilidade.

## API JS

Nenhuma — 100% CSS. Estados são classes que você controla pela sua
aplicação.

## Tokens

`--fs-color-border` (conector/marcador padrão), `--fs-color-primary`
(ativo), `--fs-color-success` (concluído), `--fs-color-danger` (falhou),
`--fs-color-text`, `--fs-color-muted`.

## Exemplo

Ver acima (Visão geral) — mockup completo com as duas orientações em
[`mockup/content-data.html#timeline`](../../mockup/content-data.html#timeline).
