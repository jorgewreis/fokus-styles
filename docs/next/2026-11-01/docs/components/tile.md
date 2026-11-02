> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Tile

Linha compacta ícone + título/subtítulo + ações, para listas de
opções/configurações/itens (sinergia visual com
[Notification Center](notification-center.md) e [Empty State](empty-state.md)).

## Visão geral

```html
<div class="fs-tile">
  <div class="fs-tile-icon" aria-hidden="true">
    <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
  </div>
  <div class="fs-tile-body">
    <p class="fs-tile-title">Relatório mensal.pdf</p>
    <p class="fs-tile-subtitle">2.4 MB · Atualizado há 2h</p>
  </div>
  <div class="fs-tile-actions">
    <button type="button" class="fs-btn fs-btn-sm">Abrir</button>
  </div>
</div>
```

## Anatomia

`.fs-tile` > `.fs-tile-icon` (ícone SVG — [`fokus-styles/icons`](../guides/icons.md)
recomendado — ou imagem, largura fixa) +
`.fs-tile-body` (`.fs-tile-title` + `.fs-tile-subtitle`, opcional, ambos
truncam com reticências se não couberem) + `.fs-tile-actions` (opcional —
botões, switch, badge).

## Variações

- **Ações à direita** (padrão) ou **embaixo**: adicione
  `.fs-tile-actions-bottom` no `.fs-tile` para `.fs-tile-actions` quebrar
  para uma segunda linha, alinhada à direita.
- **Clicável**: `.fs-tile-clickable` + [`.fs-stretched-link`](card.md#fs-card-clickable)
  num link dentro do `.fs-tile-body` — o tile tem a área de clique expandida; o link continua sendo o elemento focável
  sem aninhar um `<a>` ao redor de tudo.
- **Tamanho**: `.fs-tile-sm`, `.fs-tile-lg`; sem sufixo = padrão.

```html
<div class="fs-tile fs-tile-actions-bottom">
  <div class="fs-tile-icon" aria-hidden="true">
    <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
  </div>
  <div class="fs-tile-body">
    <p class="fs-tile-title">Plano expira em 3 dias</p>
  </div>
  <div class="fs-tile-actions">
    <button type="button" class="fs-btn fs-btn-outline-secondary fs-btn-sm">Depois</button>
    <button type="button" class="fs-btn fs-btn-primary fs-btn-sm">Renovar</button>
  </div>
</div>

<div class="fs-tile fs-tile-clickable">
  <div class="fs-tile-icon" aria-hidden="true">
    <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  </div>
  <div class="fs-tile-body">
    <p class="fs-tile-title"><a href="/perfil" class="fs-stretched-link">Jorge Reis</a></p>
    <p class="fs-tile-subtitle">Ver perfil</p>
  </div>
</div>
```

## Estados

Nenhum próprio — hover/focus da variante clicável reusa o mesmo padrão do
[Card clicável](card.md#fs-card-clickable) (`:hover`/`:focus-within`, borda
+ sombra).

## A11y

- Título/subtítulo truncados (`text-overflow: ellipsis`) escondem texto
  visualmente, mas o conteúdo continua no DOM/acessível — se o truncamento
  for crítico, considere `title="..."` no elemento pra tooltip nativo.
- Na variante clicável, o link dentro de `.fs-tile-body` é o elemento
  focável real — o `::after` do stretched-link só expande a área de
  clique, não tira o foco do link.

## API JS

Nenhuma — 100% CSS.

## Tokens

Sem tokens de componente próprios — usa `--fs-color-border`,
`--fs-color-surface`, `--fs-color-subtle` (ícone), `--fs-color-text`,
`--fs-color-muted`, `--fs-radius-md`, `--fs-shadow-sm` (hover clicável).

## Exemplo

```html
<div class="fs-tile">
  <div class="fs-tile-icon" aria-hidden="true">
    <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>
  </div>
  <div class="fs-tile-body">
    <p class="fs-tile-title">Tema escuro</p>
    <p class="fs-tile-subtitle">Alterna a aparência da interface</p>
  </div>
  <div class="fs-tile-actions">
    <div class="fs-switch">
      <input type="checkbox" class="fs-switch-input" id="tile-theme" checked aria-label="Ativar tema escuro">
      <label for="tile-theme" class="fs-switch-label"></label>
    </div>
  </div>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-3227cf69396b).

## Escolha do formato

Tile é adequado a linhas compactas que combinam identificação visual, título, informação secundária e uma ação opcional. Ele funciona bem em listas de arquivos, preferências e itens de navegação, onde a pessoa compara várias entradas rapidamente. Diferentemente de um card mais amplo, sua organização padrão favorece uma única linha de leitura com regiões lado a lado. Se o conteúdo exigir parágrafos extensos, várias imagens e muitas ações, considere outro contêiner em vez de comprimir tudo no tile.

O componente é uma estrutura visual: não sabe se representa um arquivo, uma pessoa ou uma configuração. O título e o subtítulo devem informar isso. “Relatório mensal.pdf” e “2,4 MB” são dados da aplicação; não existe consulta automática ao arquivo. Uma ação com texto “Abrir” precisa de um destino real ou handler, e um switch com rótulo de tema não altera o tema sem uma integração explícita.

### Distribuição dos espaços

A base usa flex, ícone de largura fixa, corpo flexível e uma região de ações que não encolhe. O corpo tem `min-width: 0`, permitindo que título e subtítulo sejam truncados quando faltam espaço. Isso favorece o alinhamento, mas pode esconder visualmente a parte que distingue dois nomes semelhantes. Não confie apenas nas reticências para apresentar informações críticas; ofereça uma forma de consultar o texto integral.

A variante pequena reduz padding, gaps e ícone; a grande os amplia e aumenta o título. Elas não modificam o número de ações nem criam um layout de duas colunas. A variante actions-bottom permite quebra e faz a região de ações ocupar uma linha inteira, alinhada ao final. Essa composição é explícita e não depende de um breakpoint automático. Confira se as ações cabem na largura mínima e se seus textos continuam completos.

### Clique expandido

A variante clicável oferece borda e sombra em hover ou foco interno. O link real com `.fs-stretched-link` expande sua área de ponteiro por um pseudo-elemento. O elemento que recebe foco continua sendo o link, não o tile. Não adicione outra parada de Tab ao contêiner sem uma ação independente. Uma rota como `/perfil` precisa existir no aplicativo e continuar tendo comportamento de navegação normal.

Quando houver mais de uma ação, avalie se um link expandido é apropriado. A camada pode cobrir outros controles caso a composição não defina prioridades de posicionamento. Não assuma que todos os botões ficam automaticamente acima dela. Para uma linha com switch ou vários comandos, manter as áreas clicáveis restritas aos controles costuma ser uma decisão mais clara do que tornar todo o espaço um destino único.

## Integração e estado

Não há construtor Tile, seleção persistida, evento de abertura ou método de remoção. A aplicação fornece os dados e conecta ações. No exemplo de preferência, o checkbox altera seu próprio estado nativo, mas a troca do tema exige o contrato de Theme ou código equivalente. Identifique essa diferença ao reutilizar a marcação; uma interação visual no controle não demonstra que a preferência foi salva.

Se uma ação carregar dados, mostre um estado de processamento coerente no controle responsável e trate sucesso ou erro. Não substitua o tile inteiro enquanto ele contém o foco sem planejar a continuidade da interação. Para coleções, use uma estrutura de lista ou outra semântica apropriada por fora dos tiles, em vez de presumir que `.fs-tile` cria automaticamente um item de lista acessível.

### Texto, ícones e acessibilidade

Ícones que apenas reforçam o título podem ser decorativos. Um ícone de arquivo não precisa anunciar novamente uma descrição já presente no nome; um estado não explicado pelo texto precisa de informação acessível adicional. Título e subtítulo permanecem no DOM quando truncados, mas isso não garante que todo usuário visual consiga descobri-los. `title` pode ajudar com ponteiro, porém não deve ser a única solução em dispositivos de toque.

Use headings apenas quando a hierarquia da página justificar; parágrafos podem ser suficientes em uma lista de itens. Nomeie ações repetidas de forma distinguível quando o contexto não for claro para tecnologias assistivas. Teste longos nomes de arquivo, tamanhos variados, temas e zoom. As cores e dimensões são fornecidas pelo CSS, mas legibilidade e organização da ação dependem do conteúdo real.
