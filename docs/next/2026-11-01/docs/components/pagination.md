> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Pagination

Pagination organiza a navegação entre partes de uma listagem quando mostrar todos os registros de uma vez prejudicaria a leitura, o desempenho ou a orientação do usuário. O componente oferece a apresentação dos controles e, opcionalmente, uma pequena camada JavaScript para selecionar uma página. Essas duas responsabilidades são separadas: uma interface pode usar os estilos do Fokus Styles sem instalar um controlador, e o controlador pode selecionar uma página sem saber quais registros pertencem a ela.

Esta página descreve a implementação do candidato de desenvolvimento, não uma promessa de que qualquer versão instalada tenha exatamente a mesma API. Antes de copiar um exemplo, confira a versão e a documentação distribuídas com seu pacote. Os exemplos distinguem explicitamente o código do framework do código da aplicação: carregar registros, decidir permissões, interpretar filtros, alterar a URL e comunicar erros continuam sendo tarefas do aplicativo.

## Visão geral: escolha primeiro o tipo de navegação

### Paginação com links e renderização no servidor

Use links reais quando cada página da listagem tiver uma URL própria, como `/documentos?pagina=2`. Nesse modelo, o servidor recebe o número solicitado, aplica filtros e permissões, seleciona os registros e devolve o HTML correspondente. O navegador mantém o comportamento normal dos links: é possível abrir outra aba, copiar o endereço, usar os botões Voltar e Avançar ou compartilhar uma página da consulta. Os estilos de Pagination não interferem nessas operações.

Não adicione `data-fs="pagination"` nem instancie `Pagination` nesse contêiner se deseja conservar a navegação nativa. O controlador foi feito para seleção local e cancela o comportamento padrão dos controles que possuem `data-fs-page`. Misturar os dois modelos sem uma decisão consciente pode produzir links visualmente corretos que deixaram de carregar a URL esperada. No modo somente CSS, quem atualiza `.is-active`, `aria-current` e os controles indisponíveis é o servidor ou o roteador do aplicativo.

### Paginação local com o controlador opcional

Use `Pagination` quando os registros já estiverem disponíveis no navegador, ou quando a aplicação quiser reagir à seleção antes de executar sua própria integração de dados. Um exemplo simples é uma lista curta de itens carregados previamente que mostra três registros por vez. O controlador sincroniza o número selecionado, as classes visuais e o atributo acessível da página atual; a aplicação recebe um evento e troca os registros exibidos.

O componente não faz requisições, não calcula páginas a partir de um array e não cria botões automaticamente. Também não conhece conceitos como tamanho de página, ordenação, filtros ou cursores de uma API. Essas decisões precisam ser definidas antes da montagem. Se o total de páginas mudar durante o uso, a aplicação deve atualizar o markup e recriar a instância de modo controlado, porque o total é lido na construção e não é recalculado por um observador.

## Anatomia e responsabilidade de cada elemento

A estrutura usual combina um `<nav>` nomeado, uma lista `.fs-pagination`, itens `.fs-page-item` e controles `.fs-page-link`. O `nav` identifica a região de navegação; a lista expressa o conjunto de destinos ou ações; os itens organizam os estados visuais. Use `<a>` quando o controle representa uma URL e `<button type="button">` quando representa uma seleção local. A classe visual não transforma um elemento em link, botão ou região acessível.

O contêiner do controlador pode ser o próprio `nav` ou outro elemento que contenha todos os seus controles. Coloque `data-fs="pagination"`, `data-fs-pages` e o número inicial nesse contêiner. Nos descendentes acionáveis, `data-fs-page` identifica o número de destino. Evite contêineres de Pagination aninhados: a implementação procura controles descendentes, não estabelece uma fronteira especial entre instâncias de paginação contidas umas nas outras. Também não coloque links ou ações alheios à paginação dentro desse contêiner. O handler usa `closest("[data-fs-page]")`, e o próprio contêiner pode corresponder ao seletor; assim, um clique sem controle específico pode alcançar o atributo do contêiner e ter seu comportamento padrão cancelado.

Anterior, Próxima e reticências não são elementos gerados pelo framework. Você decide se aparecem e qual destino representam. Em uma resposta do servidor, Anterior pode ser um link para a página anterior; quando esse destino não existir, substitua-o por texto sem `href`. Reticências devem ser texto ou outro elemento não acionável, nunca um link falso para `#`. Não coloque `data-fs-page` em reticências ou rótulos que não selecionem uma página.

## Variações visuais e composição

`.fs-pagination` cria uma linha flexível, com espaçamento entre itens e possibilidade de quebra. O alinhamento padrão acompanha o fluxo normal; `.fs-pagination-centered` centraliza o grupo e `.fs-pagination-right` o posiciona no final do eixo flexível. Esses modificadores alteram a distribuição visual, não a ordem de foco, a sequência dos números nem a lógica de seleção. Mantenha a ordem do DOM coerente com a ordem que a pessoa deve percorrer.

`.fs-pagination-sm` reduz as dimensões mínimas e a tipografia dos controles; `.fs-pagination-lg` as amplia. Na implementação atual, o tamanho padrão usa mínimo de `2rem`, o compacto `1.625rem` e o grande `2.5rem`. Essas medidas são pisos, não larguras fixas: textos como “Página anterior” podem ocupar mais espaço. Avalie o tamanho com zoom, nomes longos e os dispositivos de entrada usados no produto, em vez de tratar uma variante como garantia automática de acessibilidade.

`.fs-pagination-bordered` remove o espaço entre itens e compõe uma borda contínua, deixando arredondamento apenas nas pontas. `.fs-pagination-rounded` dá aos controles formato arredondado. Combinações de modificadores podem ter precedência determinada pela ordem das regras CSS; não presuma que todo cruzamento produza uma variante visual planejada. Escolha uma composição, verifique o resultado e não use alterações aleatórias de classes como substituto de uma decisão de design.

`.fs-page-link-text` acomoda texto e ícone com espaçamento próprio. Um ícone decorativo pode receber `aria-hidden="true"`, enquanto o texto fornece o nome do controle. Se houver somente ícone, forneça um nome acessível no link ou botão. O pacote de ícones é opcional para esses exemplos; “Anterior” e “Próxima” escritos por extenso funcionam sem SVG ou dependência adicional.

`.fs-pagination-scroll` oferece overflow horizontal para grupos extensos; dentro dele, a lista recebe largura baseada no conteúdo. A classe `.fs-pagination-list` também disponibiliza a composição básica de lista flexível. Nem rolagem horizontal nem quebra de linha resolvem, sozinhas, a experiência de centenas de páginas: nesses casos, a aplicação deve escolher uma janela de números, destinos relevantes e reticências compreensíveis.

## Estados: selecionado não significa indisponível

A página atual recebe destaque por `.is-active` e deve ser exposta por `aria-current="page"` no controle. No modelo CSS, essa sincronização pertence à aplicação. No modelo com controlador, cada renderização alterna `.is-active` nos controles com `data-fs-page` e em seus ancestrais `.fs-page-item`, adiciona `aria-current` aos controles correspondentes ao número atual e remove o atributo dos demais. Se dois controles representarem o mesmo número, ambos podem refletir esse estado.

O estado visual indisponível pode ser aplicado por `.is-disabled` no item ou por `aria-disabled="true"` nos seletores suportados pelo CSS. O estilo reduz a opacidade e desativa eventos de ponteiro. Isso não equivale a retirar um `href`, impedir qualquer chamada JavaScript ou estabelecer uma regra de autorização. Um link com URL real pode continuar ativável por teclado; adicionar `tabindex="-1"` apenas altera sua participação na navegação sequencial, sem torná-lo universalmente inerte.

O handler de clique do controlador verifica o próprio `disabled` do controle, `aria-disabled="true"` no controle e a existência de um ancestral `.is-disabled`. Essa é a verificação implementada, não um sistema geral de herança de estados ARIA. Não se deve inferir que qualquer `aria-disabled` em um ancestral bloqueará a ação. Para ações locais indisponíveis, um botão nativamente desabilitado é a escolha mais direta; para um destino sem ação, prefira texto sem URL.

Uma chamada programática a `goTo` não passa por essas verificações dos controles. Mesmo quando um botão está indisponível, a aplicação ainda pode selecionar seu número pelo método. Se determinada página não puder ser acessada, valide essa regra no aplicativo e, quando houver servidor, no servidor; aparência e bloqueio de clique não são mecanismos de autorização.

## Atributos e normalização de números

| Local e atributo | Significado |
|---|---|
| Contêiner: `data-fs="pagination"` | Solicita auto-init quando o módulo é carregado. |
| Contêiner: `data-fs-pages` | Total de páginas disponíveis para a instância. |
| Contêiner: `data-fs-page` | Página inicial; depois também reflete mudanças de seleção. |
| Controle descendente: `data-fs-page` | Número que o clique tenta selecionar. |

A implementação converte os valores numéricos com `Number`. Um valor finito maior ou igual a um é arredondado para baixo; valores inválidos usam o fallback correspondente. Para o total, o fallback é a quantidade de descendentes com `data-fs-page`, ou um quando não existir nenhum. Por isso, em uma paginação que só exibe alguns números de um conjunto maior, informe explicitamente `data-fs-pages`: contar controles visíveis não revela o total real de resultados. Controles duplicados de Anterior/Próxima com o mesmo atributo também entram nessa contagem; o fallback não conta números únicos.

A página inicial usa um como fallback e é limitada ao total na seleção interna. A construção renderiza esse estado, mas não reescreve o atributo inicial `data-fs-page` do contêiner para corrigir um valor inválido. Esse atributo só é gravado quando `goTo` muda efetivamente a seleção. Portanto, forneça valores iniciais válidos e não use um atributo bruto inválido como prova do estado selecionado. Já `goTo(page)` usa a seleção atual como fallback; uma entrada inválida não deve ser usada para limpar a seleção. Por exemplo, `goTo(2.9)` seleciona dois, `goTo(999)` seleciona a última página disponível e `goTo(NaN)` conserva a seleção. Essas regras ajudam a prever o runtime, mas não dispensam a validação das entradas e do total no aplicativo.

O controlador mantém pelo menos uma página interna: zero não representa um estado especial de lista vazia. Quando uma consulta não retornar registros, apresente a mensagem de ausência de resultados e decida se a navegação deve ser omitida. O exemplo local desta página tem nove registros fixos; uma aplicação que aceite conjuntos vazios precisa tratar esse caso antes de montar os controles e calcular o intervalo anunciado.

As declarações públicas tipam `goTo` com um número. Não trate detalhes observáveis da implementação como novos getters públicos: o contrato usado nesta página se apoia nos métodos documentados, no atributo do contêiner e em `event.detail`. Em particular, não dependa de propriedades internas como se fossem uma API tipada para manter a contagem de resultados. Guarde esse estado no seu próprio modelo de dados.

## API JS e inicialização

| Operação | Resultado e cuidado |
|---|---|
| `new Pagination(element)` | Cria uma instância para um contêiner existente; não é idempotente. |
| `Pagination.getInstance(element)` | Recupera a instância registrada ou retorna `undefined`. |
| `Pagination.getOrCreateInstance(element)` | Reutiliza a instância registrada ou cria uma nova. |
| `instance.goTo(page)` | Normaliza e seleciona uma página; retorno tipado `void`, não retorna registros. |
| `instance.dispose()` | Remove o listener de clique e o registro da instância. |

A entrada ESM é `import { Pagination } from "fokus-styles/js"`; com o bundle IIFE, o construtor está em `window.FokusStyles.Pagination`. Imports com nomes de pacote, como o exemplo ESM, exigem o resolvedor do seu bundler ou uma configuração de módulos equivalente. Colar esse import diretamente em um navegador sem resolução do pacote não instala dependências nem cria automaticamente esse mapeamento.

O auto-init padrão acontece no carregamento do módulo: espera `DOMContentLoaded` se o documento ainda está carregando ou procura elementos imediatamente se o DOM já estiver pronto. Não existe observação automática de novos nós. Em interfaces que montam conteúdo depois, inicialize explicitamente após inserir o HTML. Use `getOrCreateInstance` para evitar duplicar a instância já criada pelo auto-init; chamar `new` repetidamente não é a forma de atualizar opções ou reiniciar o componente.

## Eventos e integração com a aplicação

Quando a página realmente muda, o contêiner emite `fs:pagination:change`, com `detail: { page, total }`. O evento propaga para os ancestrais e não é cancelável. Ele é emitido depois que o estado e o markup da seleção foram atualizados; portanto, não funciona como uma pergunta de autorização antes da navegação. `preventDefault()` nesse evento não desfaz a seleção nem impede uma operação que já ocorreu.

A construção não emite esse evento, e selecionar novamente a página atual também não o emite. Por isso, a primeira renderização dos registros precisa ser chamada pela aplicação; não espere um evento inicial para preencher a lista. O exemplo local abaixo faz essa renderização explicitamente e usa o evento apenas para alterações posteriores. Esse detalhe também importa ao restaurar uma tela a partir de estado salvo ou de uma URL.

Em uma integração remota, o listener pode iniciar a requisição da aplicação, mas precisa tratar carregamento, falha e respostas fora de ordem. Se a pessoa selecionar duas páginas rapidamente, uma resposta antiga não deve sobrescrever a mais recente. Cancelamento de requisições, identificação da última solicitação, atualização de status e reconciliação do número selecionado são responsabilidades do aplicativo; Pagination não implementa esses mecanismos e não promete rollback automático quando o servidor falha.

A URL também é uma decisão separada. Para um roteador client-side, sincronize seleção, parâmetros de busca e eventos de histórico de forma explícita, evitando ciclos entre mudanças programáticas e o listener. Se filtros reduzirem o total de páginas, normalize primeiro o estado da aplicação, reconstrua os controles necessários e recrie a instância. Não basta alterar o atributo do total esperando que a instância existente passe a usá-lo.

## A11y: navegação, foco e anúncio dos resultados

Use um `nav` com nome que identifique a listagem, especialmente se a tela tiver mais de uma paginação. “Paginação de documentos” é mais informativo do que repetir “Paginação” em várias regiões. O número atual deve ser identificável sem depender apenas de cor; `aria-current="page"` complementa o destaque visual. Um texto como “Página 2 de 5” também pode ajudar a pessoa a entender sua posição no conjunto.

Links nativos e botões nativos já têm convenções de teclado. O controlador não cria um widget com roving tabindex, não intercepta setas para navegar entre números e não gerencia foco depois da mudança. No exemplo local, o foco permanece no botão acionado enquanto um status anuncia o novo intervalo de registros. Se sua atualização remover o controle focado, planeje um destino de foco coerente antes de substituir a interface.

Uma região `role="status"` pode anunciar o resultado sem deslocar foco, mas evite duplicar mensagens em várias regiões vivas. Informe algo útil, como o intervalo mostrado e o total de registros, em vez de anunciar apenas “atualizado”. Em consultas remotas, diferencie “carregando”, “nenhum resultado” e “falha ao carregar”; uma seleção visual bem-sucedida não demonstra que os dados chegaram. O componente não gera essas mensagens automaticamente.

Não use reticências focáveis, links vazios ou `href="#"` como atalhos de implementação. Para controles realmente indisponíveis, combine a semântica do elemento com o comportamento esperado. Reveja foco visível, contraste, zoom, overflow e os estados de erro no contexto real. Os testes DOM dos exemplos podem comprovar eventos e mudanças de atributos, mas não substituem uma revisão em navegador, teclado real e tecnologias assistivas.

## Exemplo 1: resposta renderizada no servidor, com links reais

O HTML abaixo representa a primeira página de uma listagem servida em `/documentos?pagina=1`. Os links apontam para o mesmo endpoint com outros parâmetros; não há controlador JavaScript nem links fictícios. A rota `/documentos` é um contrato do aplicativo e precisa ser implementada pelo seu servidor: ele deve validar `pagina`, consultar os registros autorizados e renderizar novamente o número atual e a disponibilidade de Anterior/Próxima. Este exemplo é o documento HTML completo dessa resposta, não uma implementação do backend.

Sirva o CSS compilado correspondente à sua instalação em `/assets/fokus.css`, ou substitua esse caminho pela URL de assets do projeto. Os nomes e dados demonstrativos não exigem ícones. Nas páginas seguintes, preserve os filtros relevantes nos links, atualize o conteúdo principal e marque somente a página atual. Se os registros forem fornecidos por usuários, use o escape de HTML do template do servidor em vez de interpolar texto não confiável como marcação.

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Documentos — página 1</title>
  <link rel="stylesheet" href="/assets/fokus.css">
</head>
<body>
  <main>
    <h1>Documentos</h1>
    <p>Mostrando os documentos 1 a 3 de 9.</p>
    <ul>
      <li>Relatório de atividades</li>
      <li>Plano de trabalho</li>
      <li>Ata da reunião</li>
    </ul>
    <nav aria-label="Paginação de documentos">
      <ul class="fs-pagination fs-pagination-bordered">
        <li class="fs-page-item is-disabled">
          <span class="fs-page-link" aria-disabled="true">Anterior</span>
        </li>
        <li class="fs-page-item is-active">
          <a class="fs-page-link" href="/documentos?pagina=1" aria-current="page">1</a>
        </li>
        <li class="fs-page-item">
          <a class="fs-page-link" href="/documentos?pagina=2">2</a>
        </li>
        <li class="fs-page-item">
          <a class="fs-page-link" href="/documentos?pagina=3">3</a>
        </li>
        <li class="fs-page-item">
          <a class="fs-page-link fs-page-link-text" href="/documentos?pagina=2">Próxima</a>
        </li>
      </ul>
    </nav>
  </main>
</body>
</html>
```

Observe que o item Anterior é texto, não um link bloqueado apenas por aparência. O link da página atual continua sendo um destino real e pode ser recarregado ou copiado. A ausência de `data-fs` é intencional: mesmo que outros componentes da tela usem JavaScript, esta paginação conserva a navegação normal do navegador.

## Exemplo 2: lista local com seleção, anúncio e desmontagem

Este exemplo mostra nove registros já presentes em memória, três por página. Ele contém o HTML completo e o módulo da aplicação, sem trechos omitidos. Use um projeto com bundler capaz de resolver `fokus-styles/js` e importar o CSS do pacote. O caminho `/src/pagination-demo.js` abaixo representa a entrada desse projeto; a publicação deve usar a saída gerada pelo bundler, não copiar o import de pacote como se fosse uma URL reconhecida pelo navegador.

O módulo deve executar depois que o HTML estiver disponível, como ocorre com o `script type="module"` mostrado no documento. A aplicação guarda seus registros e tamanho de página, renderiza a lista com `textContent` e reage ao evento do componente. Há também um botão de desmontagem para tornar o lifecycle verificável: depois de acionado, os listeners próprios são removidos, a instância é descartada e os botões de página são desabilitados pela aplicação.

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Documentos locais</title>
</head>
<body>
  <main>
    <h1>Documentos locais</h1>
    <ul id="document-list"></ul>
    <p id="document-status" role="status"></p>
    <nav id="document-pagination" aria-label="Paginação de documentos locais"
      data-fs="pagination" data-fs-pages="3" data-fs-page="1">
      <ul class="fs-pagination">
        <li class="fs-page-item"><button type="button" class="fs-page-link" data-fs-page="1">1</button></li>
        <li class="fs-page-item"><button type="button" class="fs-page-link" data-fs-page="2">2</button></li>
        <li class="fs-page-item"><button type="button" class="fs-page-link" data-fs-page="3">3</button></li>
      </ul>
    </nav>
    <button id="destroy-pagination" type="button" class="fs-btn">Desmontar demonstração</button>
  </main>
  <script type="module" src="/src/pagination-demo.js"></script>
</body>
</html>
```

Salve o módulo seguinte como `src/pagination-demo.js` no projeto com bundler:

```js
import "fokus-styles";
import { Pagination } from "fokus-styles/js";

const records = [
  "Relatório de atividades", "Plano de trabalho", "Ata da reunião",
  "Inventário", "Cronograma", "Memória de cálculo",
  "Termo de abertura", "Resumo executivo", "Registro de decisões",
];
const pageSize = 3;
const totalPages = Math.ceil(records.length / pageSize);
const element = document.getElementById("document-pagination");
const list = document.getElementById("document-list");
const status = document.getElementById("document-status");
const destroyButton = document.getElementById("destroy-pagination");

if (!element || !list || !status || !destroyButton) {
  throw new Error("Monte o HTML da demonstração antes de inicializar a paginação.");
}
if (Number(element.getAttribute("data-fs-pages")) !== totalPages) {
  throw new Error("O total do HTML deve corresponder aos registros da demonstração.");
}
const initialPage = Number(element.getAttribute("data-fs-page"));
if (!Number.isInteger(initialPage) || initialPage < 1 || initialPage > totalPages) {
  throw new Error("Informe uma página inicial válida no HTML antes da montagem.");
}

const pagination = Pagination.getOrCreateInstance(element);
let disposed = false;

function render(page) {
  const start = (page - 1) * pageSize;
  const selected = records.slice(start, start + pageSize);
  const fragment = document.createDocumentFragment();
  for (const title of selected) {
    const item = document.createElement("li");
    item.textContent = title;
    fragment.append(item);
  }
  list.replaceChildren(fragment);
  status.textContent = `Página ${page} de ${totalPages}. Documentos ${start + 1} a ${start + selected.length} de ${records.length}.`;
}

function onPageChange(event) {
  render(event.detail.page);
}

export function destroyPaginationDemo() {
  if (disposed) return;
  disposed = true;
  element.removeEventListener("fs:pagination:change", onPageChange);
  destroyButton.removeEventListener("click", destroyPaginationDemo);
  pagination.dispose();
  for (const button of element.querySelectorAll("button[data-fs-page]")) {
    button.disabled = true;
  }
  destroyButton.disabled = true;
  status.textContent = "Demonstração desmontada; a lista permanece visível, sem navegação ativa.";
}

element.addEventListener("fs:pagination:change", onPageChange);
destroyButton.addEventListener("click", destroyPaginationDemo);
render(initialPage);
```

A primeira chamada de `render` não depende de um evento de construção. Nas mudanças seguintes, o número selecionado vem de `event.detail.page`, e o total dos registros continua pertencendo à aplicação. O exemplo não usa `innerHTML` para inserir os títulos, não acessa getters inexistentes de dados e não simula uma busca remota que o framework não realiza.

Em uma aplicação com rotas ou montagem de painéis, chame `destroyPaginationDemo()` antes de remover essa interface, em vez de depender de um fechamento de página para limpar recursos. A função também remove o listener instalado no botão de demonstração. Não descarte uma instância compartilhada por outra parte da tela sem definir quem é seu proprietário; este exemplo assume que a demonstração controla seu próprio contêiner.

## Lifecycle, atualização estrutural e limites de descarte

`dispose()` remove o listener de clique registrado pelo controlador e exclui a instância do registro. Ele não restaura a página inicial, não remove classes de seleção, não redefine `aria-current` e não apaga a lista renderizada pela aplicação. Essa diferença permite que você decida se deseja preservar a tela, mostrar um estado final ou removê-la completamente. Também significa que listeners adicionados pela aplicação precisam de limpeza própria.

Depois de descartar uma instância, é possível criar outra sobre um contêiner válido, mas o estado inicial será lido do markup que existir naquele momento. Se você quer reiniciar na primeira página, ajuste os atributos e os controles antes da nova construção. Não reutilize referências de instâncias descartadas como se ainda participassem do ciclo normal da interface, e não mantenha duas instâncias ativas sobre o mesmo elemento.

Controles inseridos dinamicamente podem receber o clique delegado e participar de uma renderização posterior, mas isso não recalcula o total capturado nem oferece uma API geral de atualização. Em mudanças estruturais relevantes, prefira uma sequência explícita: retirar listeners próprios, descartar a instância anterior, atualizar total e controles, criar a nova instância e renderizar os dados iniciais. Essa sequência evita expectativas implícitas de reatividade que o componente não fornece.

## Tokens e personalização responsável

Os controles usam os tokens gerais do sistema para superfície, texto, bordas, estado ativo e transições. Entre os tokens efetivamente presentes nas regras estão `--fs-border-width`, `--fs-color-border-default`, `--fs-radius-sm`, `--fs-color-text` e `--fs-color-surface`. No hover entram `--fs-color-primary` e `--fs-color-subtle`; na seleção, `--fs-color-on-primary` contrasta com `--fs-color-primary`. O estado indisponível utiliza `--fs-color-muted` junto da redução de opacidade.

As transições usam `--fs-transition-fast` e `--fs-ease-standard`; o foco visível vem do mixin de foco do framework. Não há uma API JavaScript para alterar esses valores. Você pode sobrescrever tokens no escopo apropriado do seu aplicativo, mas precisa verificar todos os estados afetados: uma cor agradável no estado normal pode perder contraste quando o item fica ativo, recebe hover ou é desabilitado.

Mantenha a distinção entre customização visual e comportamento. Aumentar o raio não cria outra política de seleção; alterar a opacidade não bloqueia navegação; modificar a cor primária não altera os destinos dos links. Para avaliar mudanças, use os temas e os estados reais da aplicação. Esta página registra os recursos disponíveis, não certifica toda combinação de tokens, tamanho, tema e dispositivo.

## Checklist de integração

Antes de concluir uma tela, confirme qual modelo foi escolhido: links reais para URLs ou seleção local com controlador. Verifique se o número inicial e o total são válidos, se a aplicação renderiza a primeira página sem depender de evento e se o conteúdo mostrado corresponde ao controle marcado como atual. Confirme também que Anterior, Próxima e reticências foram tratados como elementos da aplicação, não como funcionalidades geradas automaticamente.

Depois, percorra a interface por teclado, confira os nomes da navegação e dos controles, teste indisponibilidade e mantenha foco coerente quando o conteúdo mudar. Exercite seleção repetida, primeira e última página, desmontagem e remontagem. Em integrações com rede, inclua resposta lenta, erro, troca rápida de página e alteração de filtros. Finalmente, confira a limpeza dos listeners e a separação entre indicação visual, dados carregados e autorização do servidor.

Essas verificações tornam a integração observável e evitam atribuir ao componente responsabilidades que ele não possui. Elas não transformam o exemplo em cobertura exaustiva de todos os cenários: a validação final deve considerar o produto que usa a paginação, os dados reais, o navegador e as necessidades de acessibilidade dos seus usuários.
