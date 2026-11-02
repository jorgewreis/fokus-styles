> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Accordion

Grupo de painéis expansíveis, com controle de exclusividade (só um aberto
por vez, ou vários) — construído sobre a mesma animação de altura do
[Collapse](collapse.md).

## Visão geral

```html
<div class="fs-accordion" data-fs="accordion">
  <div class="fs-accordion-item">
    <h3 class="fs-accordion-header">
      <button type="button" class="fs-accordion-button" aria-expanded="true">Pergunta 1</button>
    </h3>
    <div class="fs-accordion-collapse">
      <div class="fs-accordion-body">Resposta 1.</div>
    </div>
  </div>
  <div class="fs-accordion-item">
    <h3 class="fs-accordion-header">
      <button type="button" class="fs-accordion-button" aria-expanded="false">Pergunta 2</button>
    </h3>
    <div class="fs-accordion-collapse">
      <div class="fs-accordion-body">Resposta 2.</div>
    </div>
  </div>
</div>
```

`data-fs="accordion"` vai no contêiner do grupo (não em cada item) — os
botões internos são descobertos automaticamente.

## Anatomia

`.fs-accordion` > `.fs-accordion-item` (um por painel) > `.fs-accordion-header`
(`<h3>`, envolve o botão — nível de heading ajustável conforme a hierarquia
da sua página) > `.fs-accordion-button` (seta gerada via `::after`,
rotaciona ao abrir) + `.fs-accordion-collapse` > `.fs-accordion-body`.

## Variações

`data-multiple="true"` no `.fs-accordion` permite vários painéis abertos
simultaneamente; sem o atributo (padrão), abrir um fecha os demais do
grupo.

```html
<div class="fs-accordion" data-fs="accordion" data-multiple="true">...</div>
```

## Estados

`aria-expanded="true"/"false"` no botão define o estado inicial de cada
item (exatamente como no HTML — o JS lê e sincroniza a partir daí, não
força todos fechados).

## A11y

Use `.fs-accordion-flush` para remover bordas externas. Com `data-fs-always-open="true"`,
um painel aberto não pode ser fechado pelo botão e a exclusividade é desativada.

`aria-controls`/`aria-expanded` (botão) e `role="region"`/
`aria-labelledby` (painel) aplicados automaticamente. Cada botão é um
`<button>` nativo dentro de um heading (`<h3>`) — navegável por `Tab` e
ativável por `Enter`/`Space` sem JS extra. Respeita
`prefers-reduced-motion` (herdado do Collapse).

## API JS

Auto-init via `data-fs="accordion"` **no contêiner do grupo**.
`Accordion.getInstance(el)`.

| Método | Descrição |
|---|---|
| `dispose()` | Remove os listeners de todos os botões do grupo e desregistra a instância. |

Não há `show()`/`hide()` no grupo — a interação é sempre pelo clique no
botão de cada item (ou disparando o evento de clique programaticamente).

| Evento (no botão do item) | Cancelável | Quando |
|---|---|---|
| `fs:accordion:shown` | Não | Depois que o painel termina de expandir. |
| `fs:accordion:hidden` | Não | Depois que o painel termina de recolher. |

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-color-subtle` (hover),
`--fs-color-text`, `--fs-radius-md`.

## Exemplo

```html
<div class="fs-accordion" data-fs="accordion">
  <div class="fs-accordion-item">
    <h3 class="fs-accordion-header">
      <button type="button" class="fs-accordion-button" aria-expanded="true">O que é o Fokus Styles?</button>
    </h3>
    <div class="fs-accordion-collapse">
      <div class="fs-accordion-body">Um framework CSS open source, HTML/CSS/JS nativo, zero dependências.</div>
    </div>
  </div>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-7dc434fb04b5).

`data-fs-always-open="true"` não significa "sempre exatamente um aberto":
ele permite acumular painéis abertos e não abre automaticamente um painel
quando todos começam fechados. `data-multiple` e `data-fs-always-open` só
ativam esses modos com o texto exato `"true"`; não são opções do construtor.


## Escolha do padrão e organização do conteúdo

Accordion organiza informações relacionadas em blocos que o leitor pode abrir sem abandonar a página. É apropriado para perguntas frequentes, detalhes de um registro e explicações complementares relativamente independentes. A vantagem não é economizar HTML: todos os painéis continuam no documento. A vantagem é permitir que a pessoa escolha o nível de detalhe que quer consultar. Não esconda uma instrução essencial para concluir a tarefa apenas para deixar a interface visualmente menor; avalie se um título e um parágrafo sempre visíveis seriam mais claros.

A diferença para Tabs é importante. Nas abas, a seleção costuma apresentar uma entre várias visões equivalentes do mesmo espaço. No Accordion, cada título permanece junto de seu próprio conteúdo, e a configuração pode permitir comparar vários painéis abertos. Para uma única divulgação independente, use Collapse. Para uma sequência obrigatória com validação, use Stepper: abrir respostas não representa conclusão de etapas e Accordion não oferece essa regra de negócio.

Defina a política de abertura antes de escrever o HTML. O modo exclusivo fecha os outros itens quando um item fechado é aberto, mas não corrige retroativamente uma marcação inicial com vários botões expandidos. Se a intenção for começar com exatamente uma resposta, escreva exatamente um `aria-expanded="true"`. O modo múltiplo é útil para comparação; o modo always-open, apesar do nome, permite acumular aberturas sem recolher pelo botão e pode começar sem qualquer painel aberto. A classe visual `.fs-accordion-always-open` não substitui o atributo que configura esse comportamento.

## Anatomia explicada e preparação inicial

Cada botão precisa estar dentro de um `.fs-accordion-item` que contenha seu `.fs-accordion-collapse`. Essa relação não é apenas uma convenção visual: o construtor procura o item ancestral e, dentro dele, o painel correspondente. Uma árvore incompleta pode interromper a inicialização; não dependa de recuperação automática para um botão sem painel. O corpo interno concentra padding e conteúdo, enquanto o elemento de collapse fornece o recorte necessário à animação de altura. Essa separação evita animar diretamente um bloco cujo espaçamento dificulte a transição.

O componente cria identificadores quando faltam, mas preservar IDs explícitos é útil para testes e referências externas. Ele associa o botão ao painel com `aria-controls`, dá `role="region"` ao painel e usa `aria-labelledby` para derivar seu nome do botão. Não repita IDs entre instâncias. Também evite aninhar outro Accordion no mesmo grupo: a coleta de botões usa uma busca por descendentes, não uma separação automática entre grupos internos. Componentes independentes devem ter raízes independentes ou uma integração especialmente verificada.

O estado inicial vem do texto exato `"true"` em `aria-expanded`. Os painéis inicialmente fechados recebem `hidden` e estilo de exibição; os abertos permanecem disponíveis. O atributo `data-multiple` não aceita um objeto de opções nem é observado continuamente. Alterar esse atributo depois de construir a instância não reconfigura os campos já lidos. Se a aplicação trocar a política, descarte e reconstrua o controlador sobre uma marcação inicial coerente.

## Eventos, integração e ciclo de vida

Além dos eventos específicos apresentados acima, a abertura emite `fs:show` antes da transição e `fs:shown` quando ela termina; o fechamento emite `fs:hide` e `fs:hidden`. Todos partem do botão e propagam. Não são canceláveis: chamar `preventDefault()` neles não implementa uma etapa de aprovação. Para responder à expansão concluída, use `fs:accordion:shown`; para conhecer a intenção imediata, o evento genérico anterior à transição tem um momento diferente. Uma transição interrompida não deve ser interpretada como uma conclusão garantida.

Um listener delegado na raiz pode distinguir o item usando `event.target`, mas deve considerar eventos provenientes de outros controles compostos dentro do conteúdo. Restrinja o tratamento ao botão esperado e ao evento específico de Accordion. Se carregar uma explicação sob demanda, a aplicação deve cuidar de estado de carregamento, falhas e requisições antigas; o componente só expande o painel que já existe. Não há carregamento remoto, persistência de preferências ou sincronização com fragmentos de URL.

Para controle manual em um projeto com bundler, importe `Accordion` de `fokus-styles/js/accordion.js` e inicialize depois que o HTML existir. Reutilize `Accordion.getInstance(root)` quando já houver auto-init; esta classe não declara `getOrCreateInstance`. Uma forma explícita é `Accordion.getInstance(root) ?? new Accordion(root)`. Não chame o construtor novamente sobre a mesma raiz ainda ativa. Ao desmontar, remova os listeners da aplicação e chame `dispose()` antes de remover o DOM.

O descarte cancela transições em andamento e remove listeners dos botões, mas não é uma operação de restauração integral da marcação. IDs, associações ARIA e estados visuais já aplicados podem permanecer. Os itens são coletados na construção; acrescentar novos blocos depois não instala seus listeners. Para atualizar a estrutura, preserve o estado desejado na aplicação, descarte, componha o HTML novo e inicialize novamente.

## A11y e revisão visual em contexto

Os botões conservam a navegação nativa por Tab. Não há roving tabindex nem implementação de setas, Home ou End entre os títulos; a ativação por Enter/Espaço resulta do botão nativo. Escolha o nível de heading conforme o documento, não conforme o tamanho de fonte desejado. Um grupo com muitos painéis também cria muitas regiões; verifique se essa organização realmente facilita a leitura, sobretudo quando quase todas as respostas são muito curtas.

A variante flush remove bordas laterais e a borda superior inicial, mas não converte o grupo em uma lista sem estrutura. O corpo usa `--fs-color-surface-raised`, além dos tokens já listados, e o botão usa a superfície regular. Ajustar apenas uma dessas superfícies pode reduzir a distinção entre título e resposta. A preferência por movimento reduzido deve ser testada junto da navegação por teclado; testes DOM verificam atributos e eventos, não demonstram legibilidade, contraste, animação real ou experiência de leitor de tela.
