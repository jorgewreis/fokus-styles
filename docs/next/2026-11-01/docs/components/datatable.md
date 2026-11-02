> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# DataTable

Camada JS opcional sobre uma [Table](table.md) comum: ordenação por coluna,
filtro por texto e paginação client-side, tudo sobre a marcação `<table>`
semântica já existente — sem framework de dados, sem dependência externa.
Reusa `.fs-table` para a tabela, `.fs-pagination`/`.fs-page-link` para o
paginador (mesmas classes do [Pagination](pagination.md)) e
`.fs-empty-state` para a lista vazia.

## Visão geral

DataTable é uma melhoria progressiva para dados que já estão na tabela do navegador. A aplicação entrega linhas e células; o controlador organiza o que fica visível, ordena por coluna e aplica um filtro textual. Ele não consulta API, não resolve permissões e não faz paginação no servidor. Se o conjunto completo é grande demais para carregar, a necessidade é de outro modelo de integração, e não de aumentar indefinidamente a quantidade de linhas ocultas.

A diferença em relação a Table é comportamental: Table fornece estilos sobre HTML semântico, enquanto DataTable acrescenta botões, listeners, navegação de células e paginação. A diferença em relação a Pagination também importa: aqui o paginador é gerado e pertence ao DataTable, usando classes compartilhadas. Não inicialize um segundo controlador Pagination no nav gerado, pois dois controladores poderiam responder ao mesmo clique sem compartilhar estado.

Use uma tabela simples, com uma linha de cabeçalhos e correspondência direta entre posições de cabeçalho e células. A ordenação identifica a coluna pela posição do th no conjunto de cabeçalhos; estruturas com múltiplas linhas, colspan ou rowspan não recebem um mapeamento semântico avançado. Um layout visualmente correto pode produzir correspondência de coluna incorreta se não respeitar essa expectativa.

```html
<div class="fs-datatable" data-fs="datatable" data-fs-page-size="5">
  <div class="fs-datatable-toolbar">
    <input type="search" class="fs-form-control" data-fs-datatable-filter placeholder="Filtrar…" aria-label="Filtrar registros">
  </div>
  <table class="fs-table fs-table-striped fs-table-hover">
    <thead>
      <tr>
        <th scope="col" data-fs-sort="name">Nome</th>
        <th scope="col" data-fs-sort="age">Idade</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Ana</td><td>35</td></tr>
      <tr><td>Bruno</td><td>19</td></tr>
    </tbody>
  </table>
  <div class="fs-empty-state" data-fs-datatable-empty hidden>
    <p class="fs-empty-state-title">Nenhum resultado encontrado.</p>
  </div>
</div>
```

Auto-init em `data-fs="datatable"`, colocado no `<div>` que envolve
toolbar/tabela/estados — não no `<table>` diretamente. O JS lê as linhas de
`<tbody>` uma vez na inicialização; se a tabela for repovoada por fora
(ex.: resposta de uma API), chame `instance.refresh()`.

## Anatomia

A raiz precisa conter uma `.fs-table` e um tbody; o construtor lança erro quando falta qualquer um deles. Uma tabela vazia ainda deve possuir tbody. Os atributos de filtro e estados são procurados dentro da raiz, o que permite manter várias instâncias separadas quando cada região tem seus próprios elementos. Evite raízes aninhadas e tabelas concorrentes no mesmo contêiner, pois os seletores não estabelecem uma fronteira especial de componentes filhos.

Os cabeçalhos ordenáveis devem conter o rótulo, não um botão já montado. O construtor move o conteúdo existente para o botão criado, preservando seus nós. Se o conteúdo já incluir ações interativas, o resultado pode ser um botão dentro de outro ou controles concorrentes. Mantenha o cabeçalho de ordenação simples e coloque ações independentes em outro local.

O paginador opcional deve ser uma região que o componente possa reconstruir. Se você o fornecer, nomeie-a explicitamente; o aria-label padrão é acrescentado somente quando o controlador cria o nav. O conteúdo interno desse elemento será substituído a cada renderização, portanto não coloque ali contadores ou botões de aplicação que precisem sobreviver.

`.fs-datatable[data-fs="datatable"]` > opcionalmente `.fs-datatable-toolbar`
(com `input[data-fs-datatable-filter]`) + `table.fs-table` (com
`th[data-fs-sort]` no `<thead>`) + opcionalmente
`[data-fs-datatable-empty]`/`[data-fs-datatable-loading]`/`[data-fs-datatable-error]`
+ `nav[data-fs-datatable-pagination]` (criado automaticamente se ausente).

## Variações

O filtro opera sobre o snapshot textual de cada célula, sem busca remota, expressão regular, regras por coluna ou remoção de acentos. A correspondência é substring sem diferenciar maiúsculas e minúsculas. Espaços no começo e fim da consulta são removidos; o texto das células foi capturado e aparado na leitura das linhas. Uma coluna escondida visualmente ainda pode participar da busca, pois esconder não retira seu conteúdo do snapshot.

Tipos de ordenação resolvem representação, não qualidade de dados. Para moedas brasileiras, a normalização distingue textos com vírgula decimal e textos canônicos com ponto. Para datas, a comparação usa Date sobre os valores capturados; forneça ISO em `data-fs-sort-value` para evitar ambiguidade. Um valor malformado não vira automaticamente uma mensagem de erro de negócio: valide antes de renderizar.

O paginador mostra uma janela de até cinco números, além de anterior e próxima. Não cria uma lista de todos os números nem uma URL por página. O tamanho dessa janela é uma constante interna, não uma opção pública de configuração. Se o produto precisa compartilhar o estado da consulta por link, a aplicação deverá traduzir seu próprio estado para URL e reconstruí-lo na navegação.

- `data-fs-sort="chave"` num `<th>` o torna ordenável — o JS envolve o
  conteúdo existente num `<button class="fs-datatable-sort-btn">`
  automaticamente (não escreva o botão você mesmo).
- `data-fs-sort-type="number"`, `"currency"` ou `"date"` no `<th>` ativa
  comparação tipada; números aceitam ponto decimal (como `1.5`) e valores
  brasileiros com vírgula decimal (como `R$ 1.234,50`). Use um valor
  numérico canônico em `data-fs-sort-value` para formatos ambíguos.
  Sem o atributo, textos numéricos são comparados numericamente; os demais usam texto. Combine com
  `data-fs-sort-value` quando o valor exibido for formatado.
- `data-fs-sort-value` numa `<td>` define o valor usado pra ordenar e filtrar aquela
  célula, se for diferente do texto exibido (ex.: data ISO por trás de um
  texto formatado, número por trás de um texto com símbolo).
- `data-fs-page-size="N"` no elemento raiz define quantas linhas por
  página (padrão: 10).
- `[data-fs-datatable-filter]` — um `<input>` (dentro do elemento raiz)
  que filtra por substring em qualquer célula da linha, case-insensitive.
- `[data-fs-datatable-empty]` — bloco (tipicamente `.fs-empty-state`)
  mostrado no lugar da tabela quando o filtro não encontra nenhuma linha.
- `[data-fs-datatable-loading]` / `[data-fs-datatable-error]` — blocos
  mostrados via `setLoading()`/`setError()` (ver API JS); nenhum dos dois é
  obrigatório.
- `[data-fs-datatable-pagination]` — se você quiser controlar onde o
  paginador aparece, forneça o elemento; senão o JS cria um `<nav>` e
  anexa ao final do elemento raiz.

## Estados

Ordenar e filtrar levam a página corrente de volta a 1. Navegar por página limita o pedido aos extremos; pedidos não finitos caem em 1, e números fracionários são arredondados para baixo. Quando a página calculada é igual à atual, `goToPage` não emite novo evento. Assim, um listener de paged não é um sinal universal de que qualquer tentativa de navegação ocorreu.

Mesmo sem correspondências, pageCount é pelo menos 1; rowCount pode ser zero. Essa escolha mantém os cálculos de limites finitos e não significa que exista uma linha na primeira página. Apresente a mensagem de vazio para explicar a ausência de dados em vez de mostrar “página 1 de 1” como único feedback.

Carregamento e erro são comandos visuais, não uma máquina de requisições. `setLoading(true)` limpa o erro atual, desabilita o filtro e marca a tabela com aria-busy. `setError` com mensagem encerra o carregamento e escreve texto no destino previsto; limpar erro não traz registros novos. O aplicativo deve gerenciar sucesso, falha, cancelamento e respostas atrasadas sem presumir que o componente os resolve.

Ao renderizar, o controlador move as linhas existentes e oculta as demais com hidden. Listeners e estado dos nós são preservados, mas todas as linhas continuam em memória e no DOM. Isso não é virtualização nem medida de segurança: dados que não devem chegar ao usuário não podem ser protegidos apenas por hidden.

- **Vazio**: filtro sem correspondências — tabela ocultada,
  `[data-fs-datatable-empty]` exibido (se fornecido; sem ele, a tabela só
  fica com zero linhas visíveis).
- **Carregando**: acionado por `instance.setLoading(true)` — tabela e
  paginador ocultados, `[data-fs-datatable-loading]` exibido (tipicamente
  linhas `.fs-skeleton-text`).
- **Erro**: acionado por `instance.setError("mensagem")` — tabela e
  paginador ocultados, `[data-fs-datatable-error]` exibido, com o texto
  escrito em `[data-fs-datatable-error-message]` dentro dele (se existir).
- Paginação: o `<nav>` só é exibido quando há mais de uma página.

## A11y

Forneça caption ou outra identificação clara da tabela e um nome explícito para o campo de filtro. Os placeholders dos exemplos explicam intenção visual, mas não substituem uma label. O controlador não cria automaticamente o nome do filtro, scope de cabeçalhos ou um resumo de resultados em live region. Mensagens de carregamento e erro também precisam da semântica que o aplicativo escolher para comunicar mudanças.

O roving tabindex vale para células visíveis; não transforma a tabela inteira em um widget ARIA grid nem remove automaticamente a interação dos elementos internos. O handler de teclado encontra a célula ancestral de eventos vindos de descendentes. Um input ou editor dentro de uma célula pode ter suas setas capturadas pela navegação de tabela. Esta implementação não oferece um modo de edição com arbitragem de teclas; teste ações internas ou prefira conteúdo simples.

A renderização refaz os controles de paginação e redefine o primeiro tabindex de célula visível. Não promete restaurar foco para o botão equivalente depois de uma troca de página ou para um registro anterior depois de filtrar. Confira esse fluxo por teclado no produto final, especialmente quando uma ação oculta a própria célula focada. As teclas documentadas descrevem o handler existente, não uma auditoria concluída de leitores de tela.

`aria-sort` (`"none"`/`"ascending"`/`"descending"`) em cada `<th>`
ordenável, atualizado a cada clique — o botão interno recebe o clique/foco
(padrão recomendado pelo
[WAI-ARIA Table Sort](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/),
`aria-sort` no `th`, ativação num elemento focável dentro dele). Células de
dados usam roving `tabindex` (uma célula visível por vez com `tabindex="0"`,
as demais `-1`) pra navegação em grade sem tornar cada célula uma parada
extra no Tab da página.

Teclado (com foco numa célula do corpo da tabela):
- `ArrowRight`/`ArrowLeft`/`ArrowUp`/`ArrowDown`: move o foco pra célula
  vizinha (não cruza limites da página visível).
- `Home`/`End`: primeira/última célula da linha atual.
- `Ctrl+Home`/`Ctrl+End`: primeira célula da tabela / última célula da
  última linha visível.

Teclado (com foco no botão de ordenação do cabeçalho): `Enter`/`Espaço`
ativam nativamente (é um `<button>`), ciclando
ascendente → descendente → nenhuma.

## API JS

Com bundler, importe `DataTable` de `fokus-styles/js/datatable.js`, com o CSS já carregado na entrada. O construtor recebe a raiz e `{ pageSize }` opcional; consulte `getInstance` antes de criar em montagens repetidas. O auto-init ocorre na carga/DOMContentLoaded para elementos já presentes, sem observação contínua de novas raízes. Para conteúdo inserido dinamicamente, inicialize explicitamente depois de montar a tabela.

`refresh()` relê as linhas atualmente no tbody e reinicia a página, mas não reconstrói cabeçalhos ordenáveis nem os elementos de toolbar. A “ordem original” passa a ser a ordem do DOM nesse momento. Como a própria renderização move linhas, chamar refresh sem repovoar deliberadamente pode redefinir a ordem de referência de sort none. Preserve o dataset da aplicação se precisar recuperar uma ordem de origem externa.

`dispose()` remove listeners e o registro, desfaz os botões de cabeçalho, remove aria-sort e reanexa todas as linhas do snapshot sem hidden na ordem capturada. Não remove o nav de paginação nem todo o estado de apresentação: tabindex de células, visibilidade da tabela/estados e disponibilidade do filtro podem permanecer. Se precisa voltar a uma tabela estática limpa, restaure o markup da aplicação; se desmontar tudo, descarte antes de remover a raiz.

Auto-init via `data-fs="datatable"` no elemento raiz.
`DataTable.getInstance(rootEl)`.

| Método | Descrição |
|---|---|
| `sort(key, direction)` | Ordena pela coluna com `data-fs-sort="key"`. `direction`: `"asc"` \| `"desc"` \| `"none"`. |
| `filter(query)` | Filtra por substring (aplica também no input, se houver um). |
| `goToPage(page)` | Navega pra página (1-indexado, com clamp nos limites). |
| `refresh()` | Relê as linhas de `<tbody>` do zero — use após repovoar a tabela por fora. |
| `setLoading(bool)` | Alterna o estado de carregamento. |
| `setError(mensagem \| null)` | Mostra (com mensagem) ou limpa (`null`) o estado de erro. |
| `dispose()` | Remove listeners e desregistra a instância. |

| Propriedade | Descrição |
|---|---|
| `sortKey` / `sortDirection` | Coluna e direção de ordenação atuais (`sortDirection`: `"asc"` \| `"desc"` \| `"none"`). |
| `filterQuery` | Texto de filtro atual. |
| `currentPage` / `pageCount` | Página atual e total de páginas (considerando o filtro). |
| `rowCount` | Quantidade de linhas que correspondem ao filtro atual. |
| `pageSize` | Linhas por página (lido de `data-fs-page-size`, ou 10). |

| Evento (no elemento raiz) | Cancelável | Quando |
|---|---|---|
| `fs:datatable:sorted` | Não | Após ordenar, com `detail.key`/`detail.direction`. |
| `fs:datatable:filtered` | Não | Após filtrar, com `detail.query`/`detail.matched`. |
| `fs:datatable:paged` | Não | Após trocar de página, com `detail.page`/`detail.pageCount`. |

## Opções e limites do contrato

`data-fs-page-size` tem precedência sobre `options.pageSize`, seguido do padrão
10. O runtime converte com Number, aceita valores finitos maiores ou iguais a 1
e arredonda para baixo. Valores menores que 1, não finitos ou não numéricos usam
10, evitando páginas sem linhas e contagens infinitas. Prefira inteiro positivo.

O snapshot de células usa `data-fs-sort-value` quando presente, tanto para ordenar
quanto para filtrar. Portanto, uma data exibida como “31 outubro” com override
“2026-10-31” será encontrada por “2026”, não por “outubro”. Sem tipo explícito,
textos numéricos reconhecidos por Number são comparados numericamente; os demais
usam comparação textual pt-BR. Valores tipados devem ser válidos e canônicos;
a comparação não é validação de datas ou números de negócio.

Runtime e declaração TypeScript aceitam `sort(chave, "none")`, que restaura a
ordem original. `pageCount` e `rowCount` são getters readonly tipados; `pageSize`
e `currentPage` continuam públicos, mas alterar campos diretamente não valida
nem renderiza. Use configuração inicial e `goToPage()` para paginação.

## Tokens

O estilo próprio cobre toolbar, botão de ordenação, alinhamento do paginador e foco de células. O indicador de direção é conteúdo CSS; a descrição programática vem de aria-sort no th. Trocar o desenho do indicador não deveria remover esse atributo ou deixar o estado acessível contraditório.

Combinar zebra, hover e variantes de Table altera o fundo das linhas, enquanto o botão de cabeçalho usa surface-raised. Revise contraste no conjunto, incluindo estado ativo do paginador. Não presuma que uma variante de cor aplicada à tabela automaticamente personaliza todos os controles externos da raiz.

Reusa os tokens de [Table](table.md) e [Pagination](pagination.md) — sem
tokens próprios de cor. `.fs-datatable-sort-btn` usa
`var(--fs-color-muted)`/`var(--fs-color-text)` pro indicador de direção
(↕/↑/↓).

## Exemplo

```html
<div class="fs-datatable" data-fs="datatable" data-fs-page-size="3">
  <div class="fs-datatable-toolbar">
    <input type="search" class="fs-form-control" data-fs-datatable-filter placeholder="Filtrar por nome ou status…" aria-label="Filtrar registros">
  </div>
  <table class="fs-table fs-table-striped">
    <thead>
      <tr>
        <th scope="col" data-fs-sort="name">Nome</th>
        <th scope="col" data-fs-sort="status">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Ana</td><td>Ativo</td></tr>
      <tr><td>Bruno</td><td>Inativo</td></tr>
    </tbody>
  </table>
  <div class="fs-empty-state" data-fs-datatable-empty hidden>
    <p class="fs-empty-state-title">Nenhum resultado encontrado.</p>
  </div>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-1594c8731679).

## Integração e verificação

Em uma carga de dados controlada pela aplicação, a sequência conceitual é indicar carregamento, obter e validar dados, repovoar o tbody e chamar refresh, encerrando o carregamento. Na falha, apresente a mensagem por setError e permita a política de nova tentativa da aplicação. Se houver várias requisições concorrentes, impeça que uma resposta antiga sobrescreva uma consulta recente; nenhuma opção do DataTable faz esse controle.

Os exemplos desta página demonstram transformação local de dados estáticos. Os listeners de console não implementam analytics ou persistência. Ao adicionar listeners próprios aos eventos customizados, remova-os no cleanup: dispose não remove inscrições da aplicação. Valide os limites de página, filtro sem resultado, retorno do erro e descarte, além do caminho feliz de ordenar duas linhas.

## Montagem e cleanup do exemplo

O módulo abaixo acompanha o último bloco HTML, já montado. Em uma aplicação
com bundler e CSS do pacote carregado na entrada, ele evita construção duplicada
e deixa uma função para o ciclo de desmontagem. O listener apenas registra o
evento no console; substitua-o pela integração real, sem confundir observação
com persistência. Não invoque a função de desmontagem enquanto ainda pretende
usar o controle.

```js
import { DataTable } from 'fokus-styles/js/datatable.js';
const raiz = document.querySelector('.fs-datatable');
const instancia = DataTable.getInstance(raiz) ?? new DataTable(raiz);
function observar(evento) {
  console.log(evento.detail);
}
raiz.addEventListener('fs:datatable:sorted', observar);

export function desmontarExemplo() {
  raiz.removeEventListener('fs:datatable:sorted', observar);
  instancia.dispose();
}
```
