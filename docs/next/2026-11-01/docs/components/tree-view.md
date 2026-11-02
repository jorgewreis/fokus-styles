> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Tree View

Lista hierárquica navegável (arquivos, categorias, organogramas), inspirada no padrão [WAI-ARIA Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/).
Marcação nativa `<ul>`/`<li>` aninhada — o JS só adiciona os papéis ARIA,
o indicador decorativo de expandir/colapsar e a navegação por teclado.

## Visão geral

```html
<ul class="fs-tree" data-fs="tree-view">
  <li>
    <span class="fs-tree-label">src</span>
    <ul>
      <li><span class="fs-tree-label">index.js</span></li>
      <li>
        <span class="fs-tree-label">components</span>
        <ul>
          <li><span class="fs-tree-label">Button.js</span></li>
        </ul>
      </li>
    </ul>
  </li>
  <li><span class="fs-tree-label">README.md</span></li>
</ul>
```

Cada `<li>` precisa de um `<span class="fs-tree-label">` como filho direto
(o texto do nó) — nós com filhos somam um `<ul>`/`<ol>` aninhado logo
depois do label. O JS injeta automaticamente o `.fs-tree-toggle` (a seta)
dentro do label de cada nó que tiver filhos; nós-folha não recebem seta.

## Anatomia

`ul.fs-tree[role="tree"]` > `li[role="treeitem"]` (recursivo) >
`span.fs-tree-label` (com `.fs-tree-toggle` auto-injetado se houver
filhos) + opcionalmente `ul[role="group"]` (o próximo nível).

## Variações

- `data-value` num `<li>` define o valor "de verdade" reportado em
  `fs:tree:selected` (`event.detail.value`); sem ele, o valor é o texto
  integral do nó, incluindo seus descendentes.
- `aria-expanded="true"` pré-existente num `<li>` com filhos abre esse
  ramo já expandido na renderização inicial (por padrão, todo ramo nasce
  colapsado).

## Estados

- Colapsado (padrão) / expandido (`aria-expanded="true"` no `<li>`,
  `hidden` removido do `<ul>` filho) — alternado por clique na
  label/seta ou por teclado.
- Selecionado: `aria-selected="true"` (só no nó mais recente; os demais
  voltam a `"false"`) — clicar num nó com filhos expande/colapsa **e**
  seleciona ao mesmo tempo (como um explorador de arquivos).

## A11y

`role="tree"` na raiz, `role="treeitem"` em cada `<li>`, `role="group"` no
`<ul>`/`<ol>` aninhado, `aria-expanded` nos nós com filhos. Roving
`tabindex`: só o nó tabulável atual tem `tabindex="0"`; os demais (visíveis)
ficam em `"-1"` — nós dentro de um ramo colapsado não são alcançáveis por
Tab. `aria-selected` reflete a seleção atual.

Teclado (com foco num nó da árvore):
- `ArrowDown`/`ArrowUp`: move o foco pro próximo/anterior nó **visível**
  (não desce em ramos colapsados).
- `ArrowRight`: nó fechado → expande (foco não se move); nó já aberto →
  move o foco pro primeiro filho; folha → sem efeito.
- `ArrowLeft`: nó aberto → colapsa; nó fechado ou folha → move o foco pro
  nó pai.
- `Home`/`End`: primeiro/último nó visível da árvore inteira.
- `Enter`/`Espaço`: alterna expansão (se houver filhos) e seleciona o nó.

## API JS

Auto-init via `data-fs="tree-view"` na raiz (`<ul>`/`<ol>`).
`TreeView.getInstance(rootEl)`.

| Método | Descrição |
|---|---|
| `expand(item)` | Expande o `<li>` informado (sem efeito se já expandido ou sem filhos). |
| `collapse(item)` | Colapsa o `<li>` informado. |
| `toggle(item)` | Alterna expandido/colapsado. |
| `select(item)` | Marca `aria-selected="true"` no `<li>` informado (e `"false"` nos demais), dispara `fs:tree:selected`. |
| `dispose()` | Remove listeners e desregistra a instância. |

| Evento (na raiz) | Cancelável | Quando |
|---|---|---|
| `fs:tree:expanded` | Não | Após expandir um nó, com `event.detail.item`. |
| `fs:tree:collapsed` | Não | Após colapsar um nó, com `event.detail.item`. |
| `fs:tree:selected` | Não | Após selecionar um nó, com `event.detail.value`/`event.detail.item`. |

## Valores, indisponibilidade e ciclo de vida

Forneça `data-value` explícito nos ramos. Sem ele, o evento usa o textContent
integral do li, incluindo o texto dos descendentes, mesmo colapsados; não somente
a label do pai.

`aria-disabled="true"` e `.is-disabled` no próprio nó impedem seleção,
expansão e colapso, tanto por ativação quanto pelas APIs `select`, `expand`,
`collapse` e `toggle`. Essas APIs também ignoram itens externos à árvore.
Cliques (inclusive auxiliares), Enter e Space são cancelados na captura da raiz,
antes dos handlers do alvo. Listeners de captura externos/anteriores e chamadas
à lógica de negócio não são interceptados. É uma guarda de interface, não
autorização de acesso. Links habilitados mantêm seu comportamento/default.

Nós indisponíveis continuam descobríveis pelo foco e pelas setas, Home e End.
A indisponibilidade é local ao item: não é propagada por classe/ARIA aos filhos.
Se um ramo indisponível já estiver aberto, seus descendentes habilitados
continuam navegáveis e ativáveis; ArrowRight pode focar o filho, mas não abre
um ramo indisponível fechado. ArrowLeft não fecha um ramo indisponível aberto.
Alterar disabled não desfaz seleção/expansão anteriores automaticamente. Essa
política local explícita preserva a navegação existente; não representa uma
implementação completa de herança de estado ARIA.

A estrutura é preparada na construção; não existe API refresh ou carregamento
remoto. `dispose()` remove listeners/registro, mas conserva os papéis, atributos
e setas já adicionados ao DOM. Alterações estruturais exigem recomposição pela
aplicação e conferência de foco/ARIA.

## Tokens

`--fs-color-text`, `--fs-color-subtle` (hover da label),
`--fs-color-primary` (nó selecionado, com `--fs-color-on-primary` para o texto),
`--fs-radius-sm`.

## Exemplo

```html
<ul class="fs-tree" data-fs="tree-view" aria-label="Arquivos do projeto">
  <li>
    <span class="fs-tree-label">src</span>
    <ul>
      <li><span class="fs-tree-label">index.js</span></li>
    </ul>
  </li>
</ul>

```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-5dddb2afc7e6).


## Quando uma árvore é o padrão adequado

Tree View apresenta uma hierarquia persistente cujos ramos podem ser expandidos e cujos nós podem ser selecionados. Um explorador de arquivos é o exemplo típico: a pessoa precisa compreender relações de pai e filho, mover-se por elas e indicar um item de interesse. Para uma lista pequena de links sem expansão, Menu é menos complexo. Para categorias que apenas organizam uma escolha de formulário, considere se Select ou uma composição de campos comunica melhor a tarefa antes de adotar uma árvore interativa.

A seleção de um nó não é a execução automática de uma operação. O componente informa a escolha e a aplicação decide se abre um documento, mostra propriedades ou atualiza uma prévia. Clicar em um ramo também alterna sua expansão, portanto não associe inadvertidamente a seleção do pai a uma ação destrutiva. Separar navegação, seleção e execução torna o comportamento previsível e permite apresentar detalhes sem confirmar uma operação de negócio.

A árvore não oferece virtualização, carregamento sob demanda nem busca por texto. Todos os nós preparados estão no DOM. Para estruturas grandes, o custo de navegação e renderização deve ser avaliado no consumidor. Não infira suporte a milhares de registros apenas porque a marcação pode ser recursiva. A profundidade também interfere na leitura e na largura necessária para rótulos, especialmente em telas pequenas.

## Anatomia e identidade dos nós

Use uma lista raiz nomeada e elementos li para os nós. A label deve ser filha direta do li; um grupo ul ou ol diretamente dentro desse mesmo li contém seus filhos. A seta injetada é um span decorativo com aria-hidden, não um botão independente: a interação ocorre no nó. Essa distinção evita criar dois controles focáveis concorrentes para a mesma expansão. O texto da label deve identificar claramente o item, sem depender exclusivamente de um ícone de pasta ou arquivo.

Forneça data-value estável quando o nó representa uma entidade de dados. Um identificador como caminho de arquivo ou chave de categoria evita depender do texto integral do li, que inclui descendentes. Não use o índice visual como identidade se a aplicação pode reordenar a árvore. O payload do evento contém também o elemento item, útil para a integração local, mas essa referência DOM não deve ser armazenada como identificador persistente de uma entidade.

A preparação atribui papéis aos li existentes e grupos diretos, conserva aria-expanded true quando fornecido e esconde os demais grupos. Ela não seleciona automaticamente um nó inicial nem normaliza um conjunto arbitrário de seleções preexistentes. Se o aplicativo precisa restaurar seleção anterior, primeiro reconstrua a hierarquia válida e depois selecione uma referência conhecida. Considere também abrir seus ancestrais para que essa escolha seja visível.

## Foco não é seleção

As setas verticais movem o foco pelos nós visíveis sem selecionar cada um. A seleção ocorre por clique, Enter/Espaço ou select(item). Isso permite explorar a estrutura sem disparar a prévia de todos os itens atravessados. A aplicação deve escolher se algum efeito acompanha foco ou seleção; escutar apenas o evento selected evita confundir as duas ações. Home e End alcançam os extremos da lista visível, e as setas verticais não fazem wrap entre o último e o primeiro nó.

O roving tabindex estabelece um ponto de entrada sequencial entre os itens visíveis. Quando um nó recebe foco, os demais visíveis passam a tabindex negativo. Nós em grupos hidden não são apresentados pela navegação sequencial normal, embora possam conservar atributos anteriormente escritos. Não use apenas uma consulta por tabindex zero para calcular todos os itens realmente disponíveis: o estado dos grupos ancestrais também determina visibilidade.

A API expand(item) abre um ramo sem focar seu primeiro filho; a seta direita em um ramo já aberto faz essa navegação. Da mesma forma, select(item) não move foco nem expande todos os ancestrais. Um item oculto dentro de um ramo pode ser selecionado programaticamente se for um nó habilitado pertencente à árvore. Se uma ação externa deve mostrar um arquivo ao usuário, coordene expansão dos ancestrais, seleção e foco explicitamente, em vez de esperar que um único método implemente esse fluxo.

## Estados indisponíveis e fechamento programático

A indisponibilidade não elimina a descoberta por foco. Setas, Home e End continuam permitindo conhecer nós marcados como indisponíveis, enquanto as operações de ativação são bloqueadas. A classe e o atributo ARIA pertencem ao nó; um ramo indisponível aberto não transmite automaticamente esse estado a cada filho. Essa política deve ser consistente com as permissões de dados que o aplicativo apresenta.

Alterar disabled não remove uma seleção antiga nem recolhe automaticamente um ramo. Se o estado de uma entidade mudar durante o uso, a aplicação precisa decidir o que fazer com a prévia já exibida e com o foco. A guarda de interface não substitui a autorização para abrir um arquivo ou alterar uma categoria. Também não impede chamadas diretas a serviços de negócio feitas fora do componente.

Um cuidado adicional aparece quando collapse(item) é chamado programaticamente enquanto o foco está em um descendente. O método esconde o grupo, mas não transfere automaticamente o foco para o pai. Antes de esconder o ramo, a integração pode focar seu nó pai quando isso for apropriado. Esse caso é diferente da seta esquerda pressionada no próprio pai e merece um teste específico com teclado real.

## API, eventos e ciclo de vida

A montagem manual usa `new TreeView(root)` depois que a estrutura estiver no documento; a consulta é TreeView.getInstance(root). Não há objeto de opções nem helper getOrCreateInstance declarado. Em um bundler, importe de `fokus-styles/js/tree-view.js`; no bundle global, use FokusStyles.TreeView. Evite criar duas instâncias sobre a mesma raiz ainda ativa, porque o registro não é uma garantia de remoção dos listeners anteriores.

Os eventos expanded, collapsed e selected são emitidos na raiz e propagam sem cancelamento. Expansão e colapso que não mudam o estado não anunciam uma transição nova. Select pode emitir novamente para o mesmo nó, pois não contém deduplicação de seleção. Se o listener iniciar carregamento remoto, evite duplicar requisições ou aplicar resultados antigos depois que a pessoa escolher outro item. O controlador não oferece cancelamento de fetch nem cache de dados.

Embora consultas de navegação sejam feitas sobre o DOM atual, a preparação de papéis e setas ocorre na construção. Inserir li depois não garante que ele tenha todo o contrato de acessibilidade. Não existe refresh público: descarte, componha a nova estrutura e remonte com estado coerente. Dispose conserva as setas e atributos adicionados e não restaura o HTML original. A aplicação continua responsável por remover seus listeners de seleção e referências a nós removidos.

## Tokens e limites de apresentação

O destaque selecionado usa `--fs-color-on-primary` sobre `--fs-color-primary`; o foco é desenhado na label do treeitem. O recuo dos grupos é fixado em 20px no SCSS, não por uma opção JS de profundidade. Rótulos extensos, zoom e muitas camadas precisam de revisão visual. A descrição do teclado não equivale a suporte completo a todas as funcionalidades do padrão APG: não há seleção múltipla, typeahead, drag-and-drop ou edição de nomes embutidos.

## Exemplo de integração com descarte explícito

O módulo abaixo acompanha o HTML da seção Exemplo, em um projeto com bundler
que resolve o pacote instalado. Execute-o depois de inserir esse HTML. O handler
apenas registra a seleção; nenhuma operação de negócio é implementada. Chame a
função exportada ao desmontar a página para remover o listener da aplicação e o
controlador, antes de remover seus elementos. O CSS deve ser carregado conforme
o guia de uso; não carregue outra versão do bundle sobre a mesma instância.

```js
import { TreeView } from "fokus-styles/js/tree-view.js";
const root = document.querySelector(".fs-tree");
if (!root) throw new Error("Elemento do exemplo ausente");
const instance = TreeView.getInstance(root) ?? new TreeView(root);
function onSelected(event) {
  console.log("Seleção recebida:", event.detail.value);
}
root.addEventListener("fs:tree:selected", onSelected);
export function destroyExample() {
  root.removeEventListener("fs:tree:selected", onSelected);
  instance.dispose();
}
```
