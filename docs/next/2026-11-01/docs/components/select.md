> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Select customizado

Substitui a aparência do `<select>` nativo (impossível de estilizar
consistentemente entre navegadores) por um [Dropdown](dropdown.md), mantendo
o `<select>` real por baixo — sincronizado, escondido visualmente.

## Visão geral

Escolha o Select customizado quando houver um conjunto simples de opções mutuamente exclusivas e a interface precisar do dropdown do framework. Se o select nativo atende à tarefa, ele oferece menor complexidade de integração e preserva diretamente o comportamento de formulário do navegador. A versão customizada acrescenta markup, listeners e movimentação do menu; isso deve trazer uma vantagem real, não ser aplicado indiscriminadamente a todos os selects.

O valor de formulário continua no select original. O botão gerado exibe o texto da opção e abre a lista, enquanto cada item corresponde à posição de uma option. Essa separação é importante: o texto visível não precisa ser o valor enviado, e uma alteração no DOM original pode deixar a interface gerada desatualizada se não respeitar o ciclo de sincronização.

```html
<select class="fs-form-select" data-fs="select" id="pais" aria-label="Escolher opção">
  <option value="br">Brasil</option>
  <option value="pt">Portugal</option>
  <option value="us" disabled>Estados Unidos (indisponível)</option>
</select>
```

O JS constrói o dropdown customizado logo depois do `<select>` no DOM e
esconde o original (`display: none` — continua no DOM, então
`<select>` mantém o valor para o formulário). A sincronização visual é
parcial, conforme os limites abaixo.

## Anatomia

Escreva somente o select nativo com suas options; não mantenha manualmente um segundo menu que duplique o gerado. A construção cria um wrapper depois do select e o Dropdown interno administra o portal do menu. O portal fica no diálogo proprietário mais próximo quando há um ancestral compatível; fora desse contexto, usa `document.body`. A posição física final do menu, portanto, não é necessariamente a de um filho do wrapper.

Como o select recebe `display: none`, o foco passa ao botão gerado. Uma label com `for` apontando ao ID do select original não é automaticamente transferida para esse botão. A implementação também não copia todos os atributos de descrição, erro e validação. Não confunda a presença do select no DOM com preservação integral de sua experiência acessível. Se precisar dessa equivalência sem adaptação adicional, mantenha o nativo.

Gerado automaticamente a partir do `<select>`: `.fs-dropdown.fs-form-select-dropdown`
> `.fs-form-select` (botão-toggle, mesma aparência estática documentada em
[Input](input.md#anatomia)) + `.fs-dropdown-menu` > um `.fs-dropdown-item`
por `<option>`.

## Variações

Somente `data-size="sm"` ou `"lg"` é aplicado ao botão na construção. Classes de tamanho presentes no select original não são copiadas genericamente. Essa regra é diferente da gama de tamanhos CSS disponível em Input; colocar `data-size="xl"` não cria um toggle extra grande.

O componente não oferece busca digitada, seleção múltipla, agrupamento hierárquico ou carregamento remoto de opções. O menu é uma projeção simples das options disponíveis inicialmente. Para busca textual com sugestões, consulte Combobox, lembrando que ele tem um contrato de valor diferente e não é um select de substituição direta.

Tamanho: `data-size="sm"`/`"lg"` no `<select>` original — vira
`.fs-form-select-sm`/`-lg` no toggle gerado.

```html
<select class="fs-form-select" data-fs="select" data-size="sm" aria-label="Escolher opção">...</select>
```

## Estados

A seleção é representada no original por `selectedIndex` e no menu por `.is-active` e `aria-selected`. Um clique habilitado no menu altera o índice, sincroniza a apresentação e emite os eventos no select. Um item indisponível é ignorado pelo handler; isso não transforma a disponibilidade capturada na construção em uma observação contínua de permissões.

Para atualizar somente o valor programaticamente, altere `select.value` e dispare `new Event('change', { bubbles: true })`. Essa sincronização não emite automaticamente `fs:select:changed`; o evento customizado pertence ao fluxo de seleção do menu. Não escute os dois eventos para repetir uma mesma persistência sem deduplicação, porque um clique gera ambos.

- `<option disabled>` vira um item com `.is-disabled` no menu (não
  clicável).
- `<select disabled>` desabilita o botão-toggle inteiro na construção.
- Item selecionado (`selectedIndex`) fica com `.is-active` no menu.

## A11y

O Dropdown acrescenta a operação de abertura, deslocamento por setas e fechamento, mas o nome acessível do campo permanece um ponto de integração. O texto selecionado pode nomear o botão, porém não necessariamente explica qual pergunta ele responde. O aplicativo deve verificar isso na tela final, com a opção vazia, a opção padrão e mensagens de erro.

Não considere `required` no select escondido uma implementação completa de feedback acessível. Validar o valor é uma coisa; encaminhar foco e explicar a correção no controle visível é outra. Se a aplicação não consegue garantir esse fluxo com o componente customizado, o select nativo com label e descrição é a alternativa mais segura e simples.

`aria-haspopup="listbox"` no toggle, `role="listbox"` no menu,
`role="option"` + `aria-selected` em cada item — aplicados
automaticamente. Navegação por teclado herdada do
[Dropdown](dropdown.md) (`ArrowDown`/`ArrowUp` entre opções, `Escape`
fecha). Selecionar uma opção dispara `change` no `<select>` original —
formulários/validação que escutam esse evento continuam funcionando sem
mudança.

## API JS

O construtor é `new Select(selectEl)` e rejeita um elemento que não seja SELECT. `getInstance` retorna a instância registrada ou `undefined`; consulte-o antes de construir novamente sobre o mesmo nó. A propriedade `isOpen` existe no runtime como getter que consulta o Dropdown. A declaração TypeScript a lista como boolean não readonly, mas atribuí-la não é um comando de abertura: use `show`, `hide` ou `toggle`.

Auto-init depende de carregar o módulo JavaScript e só procura a marcação na inicialização ou em `DOMContentLoaded`. Não há MutationObserver procurando selects inseridos depois. Para telas dinâmicas, inicialize após a montagem e descarte antes de substituir o select. `dispose()` cancela o timer de reset, remove listeners, descarta o Dropdown, remove o wrapper e restaura exatamente o valor inline de display guardado na construção.

Em aplicação com bundler, o import específico é `import { Select } from 'fokus-styles/js/select.js'`, além do CSS carregado na entrada. Na distribuição IIFE, use o namespace documentado `FokusStyles` depois de carregar seu bundle; não use o nome importado como global sem esse contexto. As duas formas não devem construir instâncias concorrentes no mesmo select.

Auto-init via `data-fs="select"` **no `<select>`**. `Select.getInstance(selectEl)`.

| Método | Descrição |
|---|---|
| `show()` / `hide()` / `toggle()` | Delegam pro Dropdown interno. |
| `dispose()` | Desmonta o dropdown gerado, restaura o `<select>` original visível. |

| Evento (no `<select>` original) | Cancelável | Quando |
|---|---|---|
| `change` (nativo) | Não | Ao selecionar uma opção — mesmo evento que um `<select>` comum dispara. |
| `fs:select:changed` | Não | Mesmo momento, com `event.detail.value` (o novo valor). |

## Limites de sincronização e dados

- Opções, textos, `option.disabled`, `select.disabled` e tamanho são capturados na
  construção. Não há observação automática de mudanças nesses atributos/filhos.
  O evento nativo `change` sincroniza o texto da seleção e `aria-selected`, mas
  não reconstrói opções nem atualiza o disabled do botão/menu.
- Após alterar opções ou disponibilidade, desmonte e recrie o componente. Uma
  alteração programática somente do valor exige disparar `change` para sincronizar
  a apresentação. O reset de formulário é sincronizado após a ação nativa.
- `multiple` e `optgroup` não são contratos suportados: as opções são achatadas,
  somente `selectedIndex` é usado, e `disabled` do optgroup não é propagado aos
  itens. Prefira o select nativo nesses casos; não interprete a aparência como
  validação de elegibilidade.
- Não há objeto de opções JS. Somente `data-size="sm"` ou `"lg"` é consumido;
  outros tamanhos não são aplicados ao toggle. Texto das opções é copiado com
  `textContent`, não interpretado como HTML.
- O wrapper não transfere automaticamente toda validação ou semântica acessível
  do select para o botão gerado. Verifique nome acessível, erro e formulário na
  composição final; ouvir `change` não equivale a validar o formulário.

## Tokens

A aparência do botão deriva dos tokens de controle e a do menu deriva de Dropdown. Como o menu pode sair da hierarquia visual original por portal, confira o tema realmente aplicado na abertura. Overrides feitos por seletores que exigem que o menu seja descendente de um wrapper local podem deixar de casar após a montagem. Prefira os contratos de tema do framework e teste a composição em diálogo e fora dele.

Os mesmos do [Dropdown](dropdown.md) e de
[`.fs-form-select`](input.md) — sem tokens próprios.

## Exemplo

```html
<select class="fs-form-select" data-fs="select" id="prioridade" aria-label="Escolher opção">
  <option value="baixa">Baixa</option>
  <option value="media" selected>Média</option>
  <option value="alta">Alta</option>
</select>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-06cbea9e7777).

## Integração prática e descarte

Para alterar a lista de opções, primeiro descarte a instância existente, atualize o select nativo e depois crie uma nova instância. Essa ordem evita que itens antigos continuem apontando para índices que agora representam outros valores. Recriar não deve ser a resposta a cada simples mudança de seleção: para isso, o evento change é suficiente.

Os exemplos HTML desta página são trechos de estrutura e demonstração. Adicione nomes e rótulos adequados ao formulário real e não reutilize IDs em cópias montadas simultaneamente. No exemplo final, o listener de console só observa a seleção; ele não salva uma prioridade. Ao substituir esse listener por persistência, remova-o no cleanup junto com o componente, pois `dispose()` não remove listeners criados pelo aplicativo no select original.

## Montagem e cleanup do exemplo

O módulo abaixo acompanha o último bloco HTML, já montado. Em uma aplicação
com bundler e CSS do pacote carregado na entrada, ele evita construção duplicada
e deixa uma função para o ciclo de desmontagem. O listener apenas registra o
evento no console; substitua-o pela integração real, sem confundir observação
com persistência. Não invoque a função de desmontagem enquanto ainda pretende
usar o controle.

No Select, a aplicação acrescenta um nome ao botão visível por consulta ao DOM gerado e o atualiza em change. Isso é adaptação explícita do exemplo, não uma transferência automática de ARIA nem uma propriedade pública tipada do controlador. Se adicionar reset ao formulário, sincronize também esse nome após a ação nativa.

```js
import { Select } from 'fokus-styles/js/select.js';
const raiz = document.getElementById('prioridade');
const instancia = Select.getInstance(raiz) ?? new Select(raiz);
function observar(evento) {
  console.log(evento.detail);
}
raiz.addEventListener('fs:select:changed', observar);

const botao = raiz.nextElementSibling.querySelector('button');
function nomearSelecao() {
  const texto = raiz.selectedOptions[0]?.textContent ?? 'Sem seleção';
  botao.setAttribute('aria-label', `Prioridade: ${texto}`);
}
nomearSelecao();
raiz.addEventListener('change', nomearSelecao);

export function desmontarExemplo() {
  raiz.removeEventListener('fs:select:changed', observar);
  raiz.removeEventListener('change', nomearSelecao);
  instancia.dispose();
}
```
