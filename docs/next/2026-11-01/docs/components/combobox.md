> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Combobox / Autocomplete

Um `<input>` de texto com uma listbox de sugestões que filtra conforme o
usuário digita — diferente do [Select](select.md) (que troca a aparência
de um `<select>` inteiro), o Combobox é sempre texto livre com sugestões,
seguindo o padrão [WAI-ARIA Combobox (List Autocomplete)](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).
Reusa `packages/fokus-js/js/core/positioning.js` (mesmo posicionamento do [Dropdown](dropdown.md))
e a classe `.fs-dropdown-menu`/`.fs-dropdown-item` para a listbox flutuante.

## Visão geral

Use Combobox para ajudar a encontrar um texto entre sugestões locais sem impedir a digitação livre. Isso é diferente de garantir que o formulário contém uma opção válida de um catálogo. O componente pode mostrar uma cidade reconhecida e ainda permitir que a pessoa edite o campo para um texto inexistente. Se a regra exige um código de cidade válido, a aplicação precisa relacionar explicitamente texto e seleção confirmada.

O filtro não consulta servidor, não possui debounce e não carrega mais resultados. Todas as sugestões são nós já presentes na listbox. Esse modelo é adequado a conjuntos locais de tamanho controlado; para catálogos extensos ou dados remotos, uma integração precisa definir requisições, cancelamento, anúncios e atualização do conjunto, sem presumir que essas responsabilidades fazem parte deste controlador.

```html
<div class="fs-combobox">
  <input type="text" class="fs-form-control" data-fs="combobox" data-fs-target="#lista-frameworks" placeholder="Buscar framework…" aria-label="Buscar opção">
</div>
<ul class="fs-dropdown-menu fs-combobox-listbox" id="lista-frameworks">
  <li class="fs-dropdown-item" data-value="bootstrap">Bootstrap</li>
  <li class="fs-dropdown-item" data-value="tailwind">Tailwind CSS</li>
  <li class="fs-dropdown-item is-disabled" data-fs-empty hidden>Nenhum resultado encontrado.</li>
</ul>
```

O JS move a listbox para um portal (diálogo proprietário quando aplicável,
ou `document.body`) e a posiciona relativa ao input. O item com `data-fs-empty` é opcional, mas recomendado: o
componente alterna a visibilidade dele automaticamente quando nenhuma
opção corresponde à busca — o texto dele é escrito por você (o framework
não injeta texto/idioma).

## Anatomia

O input é o ponto de interação e a listbox é o conjunto de opções. O alvo de `data-fs-target` deve existir quando a instância é criada. Se o atributo estiver ausente, o runtime tenta usar o próximo irmão do input; se não encontrar lista, lança erro. Um seletor inválido também não se torna válido por auto-init. Prefira IDs explícitos e únicos para evitar ligar um campo à lista de outro.

O portal procura o diálogo proprietário compatível mais próximo antes de usar `document.body`. Isso mantém popups dentro de regiões que podem isolar o foco, mas muda a relação de ancestralidade para o CSS da aplicação. A lista recebe o tema contextual na abertura; não dependa de um seletor CSS que só funcione enquanto a lista permanece dentro de `.fs-combobox`.

Use itens de texto não focáveis, como li, sem ações interativas aninhadas. O handler escolhe a opção inteira e extrai seu texto; um botão secundário dentro do item concorreria com essa seleção. O bloco de vazio deve ter mensagem informativa e `data-fs-empty`, pois não representa um valor de catálogo.

`.fs-combobox` (wrapper posicionador) > `input[role="combobox"]` +
`.fs-dropdown-menu.fs-combobox-listbox[role="listbox"]` > um ou mais
`.fs-dropdown-item[role="option"]`.

## Variações

`data-value` é lido quando a opção é confirmada. O texto da opção é filtrado e exibido, enquanto esse atributo fornece o valor semântico armazenado na instância. Dois itens com o mesmo rótulo podem ser difíceis de distinguir mesmo com códigos diferentes; acrescente contexto textual útil em vez de esperar que um código invisível ajude a pessoa a decidir.

A lista de opções é consultada pelo runtime durante a interação, mas IDs, roles e `aria-selected` iniciais são atribuídos na construção. Inserir novos itens manualmente não equivale a uma API completa de refresh. Se trocar o catálogo, descarte e remonte de forma controlada, preservando ou invalidando a escolha segundo a regra de dados da aplicação.

- `data-value` em cada `.fs-dropdown-item` define o valor "de verdade"
  (`instance.value`); sem ele, o valor é o texto visível do item.
- Item desabilitado: `.fs-dropdown-item.is-disabled` — ignorado por
  teclado, mouse e pelo filtro de "opções selecionáveis".
- Item de "sem resultados": `.fs-dropdown-item.is-disabled[data-fs-empty]`,
  `hidden` por padrão — visibilidade alternada automaticamente pelo JS.

## Estados

A busca retira espaços nas extremidades e compara texto em minúsculas por substring. Ela não remove acentos: “sao” não é garantido como equivalente a “São”. Uma mensagem vazia aparece quando não há opções selecionáveis, o que também inclui um conjunto em que todas as correspondências estão desabilitadas. Não apresente esse estado como falha de rede; nenhuma rede foi consultada pelo componente.

Há uma particularidade de implementação: ao receber `input`, a rotina chama `_setActiveIndex(-1)`, e o cálculo modular transforma esse índice na última opção selecionável quando existe resultado. Portanto, digitar pode deixar a última correspondência ativa; não prometa que a digitação sempre começa sem destaque ou na primeira sugestão. Esse comportamento deve ser considerado ao testar Enter imediatamente depois de digitar.

O valor confirmado e o texto editável são estados distintos. Depois de selecionar “São Paulo” com código `sp`, editar o texto não limpa `instance.value`. Antes de enviar um código, compare com a seleção que sua aplicação considera válida ou invalide seu próprio campo de código em eventos de edição. O componente não cria um input hidden de valor nem sincroniza um formulário por você.

- Digitar filtra as opções por substring (case-insensitive) — as que não
  correspondem recebem o atributo `hidden` (removidas da árvore de
  acessibilidade junto, não só visualmente).
- Campo vazio mostra a lista completa (sem filtro).
- Opção destacada durante a navegação por teclado: `.is-active` (visual
  idêntico ao item ativo do Dropdown/Select).
- Opção escolhida: `aria-selected="true"` (só nela; as demais voltam a
  `"false"`).

## A11y

Os atributos adicionados pelo controlador descrevem o relacionamento e o destaque, mas não nomeiam a pergunta do formulário. Associe uma label ao input; placeholder não substitui esse nome. O foco DOM permanece no input durante navegação por opções, e o ID do destaque é exposto por `aria-activedescendant`. Ao escolher, o componente volta a focar o input e fecha a lista.

Os estados de foco e seleção não são iguais: `.is-active` acompanha o destaque de navegação; `aria-selected` marca a opção confirmada. Não leia somente a classe ativa para decidir qual valor enviar. Teste Escape, reabertura, ausência de resultados e navegação com itens desabilitados em tecnologia assistiva antes de considerar a experiência completa.

`role="combobox"` + `aria-autocomplete="list"` + `aria-controls` +
`aria-expanded` no input, `role="listbox"` na lista, `role="option"` +
`aria-selected` em cada item — todos aplicados automaticamente, com `id`
gerado para quem não tiver um. O foco **nunca sai do input**: a opção
destacada é comunicada via `aria-activedescendant` (não `focus()`), como o
padrão ARIA de combobox exige — por isso as opções não são elementos
focáveis (`<li>`/`<div>`, não `<button>`).

Teclado (com foco no input):
- `ArrowDown`/`ArrowUp`: abre a listbox (se fechada) ou move o destaque
  entre as opções selecionáveis, com wrap.
- `Home`/`End`: vai pra primeira/última opção selecionável (listbox
  aberta).
- `Enter`: seleciona a opção destacada (se houver e a listbox estiver
  aberta) — preenche o input, fecha a listbox.
- `Escape`: fecha a listbox **sem** alterar o valor do input.

## API JS

Em uma aplicação com bundler, importe `Combobox` de `fokus-styles/js/combobox.js` e carregue o CSS na entrada. O construtor aceita o input e, opcionalmente, `{ placement }`. A configuração de placement prefere a opção não nula, depois `data-placement`, depois `bottom`. O tipo Placement aceita `top`, `bottom`, `left` e `right`; não é uma linguagem livre de coordenadas.

O auto-init examina os elementos presentes ao carregar ou no DOMContentLoaded, sem observar inserções posteriores. Em montagem dinâmica, consulte `getInstance` antes de construir. Não chame o construtor duas vezes sobre o mesmo input: um registro substituído não seria uma remoção dos listeners da primeira instância.

`dispose()` fecha a lista, remove listeners internos e de Escape, restaura a lista ao pai original e remove o registro. Não restaura todos os atributos adicionados ao input e às opções, nem apaga o último texto escolhido. Se deseja converter a região de volta para HTML puramente nativo, a aplicação precisa restaurar sua marcação. Listeners de eventos customizados adicionados pela aplicação também exigem cleanup próprio.

Auto-init via `data-fs="combobox"` **no `<input>`**, com `data-fs-target`
apontando pro seletor da listbox (convenção idêntica ao Dropdown).
`Combobox.getInstance(inputEl)`.

| Método | Descrição |
|---|---|
| `show()` | Abre a listbox e posiciona relativa ao input. |
| `hide()` | Fecha a listbox, limpa o destaque e `aria-activedescendant`. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove listeners, desregistra a instância. |

| Propriedade | Descrição |
|---|---|
| `value` | Valor da última seleção confirmada (`data-value` do item, ou texto visível). `null` até a primeira seleção; editar o texto depois não limpa nem atualiza esse valor. |

| Evento (no input) | Cancelável | Quando |
|---|---|---|
| `change` (nativo) | Não | Ao selecionar uma opção (clique ou `Enter`). |
| `fs:combobox:changed` | Não | Mesmo momento, com `event.detail.value`/`event.detail.label`. |
| `fs:combobox:shown` | Não | Depois de abrir a listbox. |
| `fs:combobox:hidden` | Não | Depois de fechar. |

## Opções e limites de sincronização

O construtor aceita somente `placement`: opção JS → `data-placement` → `bottom`
(precedência por valor não nulo). Não há opções de busca remota, múltipla seleção
ou validação do texto livre. Digitar filtra as opções locais, mas não dispara
`fs:combobox:changed` nem invalida a última seleção confirmada. A aplicação deve
conferir se o texto atual ainda corresponde ao valor selecionado antes de enviá-lo.
A label selecionada é extraída como texto; o componente não sanitiza HTML que a
aplicação tenha previamente inserido na listbox.

## Tokens

O limite de 240px da lista cria rolagem interna; não limita a quantidade de opções que o JavaScript percorre. Cada input filtra os nós existentes, portanto uma altura compacta não é virtualização. Verifique listas longas com rótulos extensos e teclado, pois o destaque usa `scrollIntoView` para manter a opção alcançável.

A posição é calculada na abertura. Diferentemente do Datepicker, este módulo não instala `watchPosition` para acompanhar continuamente scroll e resize. Se o campo se mover com o popup aberto, teste o comportamento real; não prometa reposicionamento contínuo a partir do uso do mesmo utilitário inicial.

Os mesmos do [Dropdown](dropdown.md) (`.fs-dropdown-menu`/`.fs-dropdown-item`)
e de [`.fs-form-control`](input.md) — sem tokens próprios. `.fs-combobox-listbox`
soma `max-height: 240px` + scroll interno para listas longas.

## Exemplo

```html
<div class="fs-combobox">
  <input type="text" class="fs-form-control" id="cidade" data-fs="combobox" data-fs-target="#cidade-lista" placeholder="Buscar cidade…" aria-label="Buscar opção">
</div>
<ul class="fs-dropdown-menu fs-combobox-listbox" id="cidade-lista">
  <li class="fs-dropdown-item" data-value="sp">São Paulo</li>
  <li class="fs-dropdown-item" data-value="rj">Rio de Janeiro</li>
  <li class="fs-dropdown-item is-disabled" data-fs-empty hidden>Nenhuma cidade encontrada.</li>
</ul>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-7e91a0b25b46).

## Montagem e cleanup do exemplo

O módulo abaixo acompanha o último bloco HTML, já montado. Em uma aplicação
com bundler e CSS do pacote carregado na entrada, ele evita construção duplicada
e deixa uma função para o ciclo de desmontagem. O listener apenas registra o
evento no console; substitua-o pela integração real, sem confundir observação
com persistência. Não invoque a função de desmontagem enquanto ainda pretende
usar o controle.

```js
import { Combobox } from 'fokus-styles/js/combobox.js';
const raiz = document.getElementById('cidade');
const instancia = Combobox.getInstance(raiz) ?? new Combobox(raiz);
function observar(evento) {
  console.log(evento.detail);
}
raiz.addEventListener('fs:combobox:changed', observar);

export function desmontarExemplo() {
  raiz.removeEventListener('fs:combobox:changed', observar);
  instancia.dispose();
}
```
