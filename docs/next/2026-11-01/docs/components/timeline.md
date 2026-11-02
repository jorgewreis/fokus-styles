> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

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
[`mockup/content-data.html#timeline`](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-877d368f4e29).

## Propósito e escolha da sequência

Timeline apresenta uma sequência de acontecimentos ou marcos com relação temporal. Ela ajuda a compreender o que ocorreu, o que está em andamento e o que ainda é esperado. Use-a quando essa ordem acrescenta significado; para uma lista sem relação cronológica, outro padrão pode ser mais simples. Para conduzir um formulário entre etapas interativas, consulte Stepper: Timeline não gerencia progressão, validação ou mudança de painel.

Defina a perspectiva da sequência antes de preenchê-la. Um histórico de fatos concluídos é diferente de uma previsão de etapas futuras. Não marque uma etapa como concluída apenas para preencher visualmente o conector. As classes de estado devem refletir os dados disponíveis, e o texto precisa esclarecer quando um horário é real, previsto ou ainda desconhecido. A ordenação dos registros é responsabilidade da aplicação.

### Anatomia e apresentação

A lista ordenada mantém a relação entre os itens. Cada item contém marcador e conteúdo, com título e informações opcionais. A linha que conecta os marcadores é desenhada por um pseudo-elemento nos itens que não são os últimos, portanto não é necessário inserir elementos de linha manualmente. Acrescentar traços textuais poderia duplicar informação ou criar ruído para leitores de tela.

Na orientação vertical, o conteúdo ocupa o espaço ao lado do marcador e os itens recebem separação inferior. Na horizontal, cada item se organiza em coluna, com texto centralizado e conector entre os marcadores. Essa mudança não altera a ordem dos registros e não contém um breakpoint que retorne à orientação vertical. Se os títulos ficarem comprimidos, a aplicação precisa escolher outra apresentação para aquela largura.

## Integração de estados

Sem modificador, o marcador representa visualmente uma etapa pendente. Active usa a cor primária; completed aplica cor de sucesso, um check decorativo e cor de sucesso no conector seguinte; failed usa cor de perigo no marcador e o token de texto de alerta no título. Esses efeitos não adicionam descrições acessíveis como “concluído” ou “falhou”. Inclua essas palavras quando o estado for relevante para compreender o processo.

A implementação não estabelece exclusividade entre classes de estado. Se o aplicativo acrescentar active e failed ao mesmo item, a cascata CSS decidirá partes da aparência, mas isso não constitui uma combinação semântica documentada. Escolha um estado principal por item e atualize as classes de maneira consistente com os dados. Uma falha também pode exigir explicação e ação de recuperação fora do marcador.

### Datas, horários e conteúdo dinâmico

Use um elemento `time` com `datetime` válido quando houver uma data ou horário com significado temporal. O texto visível pode seguir a convenção do público, enquanto o valor de máquina deve representar corretamente a informação conhecida. Não invente um fuso ou dia apenas para preencher um atributo. O componente não formata datas, converte fusos ou calcula intervalos automaticamente.

Ao receber novos eventos, preserve uma ordenação definida e explique se a lista é crescente ou decrescente quando isso não for evidente. Uma atualização pode ser anunciada por uma mensagem de status resumida, sem tornar todo o histórico uma região viva que repete dezenas de itens. Se a pessoa estiver lendo eventos anteriores, evite mover seu foco ou rolagem sem necessidade apenas porque chegou um registro novo.

### Acessibilidade e interação

Os marcadores podem ser decorativos quando título e texto comunicam o estado. O check embutido no CSS não possui texto alternativo e não deve ser a única evidência de conclusão. O uso de `ol` preserva a sequência, mas não cria navegação por setas nem torna os itens focáveis. Se houver detalhes expansíveis, use um botão e um padrão de disclosure apropriado, com comportamento testado separadamente.

Uma ação para abrir um documento pode ser um link dentro do conteúdo, sem transformar toda a linha do tempo em menu. Nomeie o destino de modo suficiente e preserve foco visível. Cor, posição e conector ajudam visualmente, mas não substituem a explicação verbal de estados e consequências.

### Limites de revisão

Não há JavaScript próprio, callbacks ou eventos de mudança. Teste títulos extensos, múltiplos parágrafos, ausência de horário e estados de erro. Verifique a orientação horizontal com muitos itens e valide RTL no produto: as regras de conectores usam posições físicas em pontos específicos, não há promessa de adaptação perfeita a qualquer direção. O contrato comprova as regras presentes, não a qualidade visual de todas as sequências possíveis. Avalie com dados reais e considere se a orientação vertical é mais legível no contexto escolhido.
