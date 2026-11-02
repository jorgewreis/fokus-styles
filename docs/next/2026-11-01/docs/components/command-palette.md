> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Command Palette

Um diálogo de busca/comandos disparado por um botão ou por um atalho de
teclado global (ex.: `Ctrl+K`/`Cmd+K`) — combina o overlay/focus trap do
[Modal](modal.md) com o filtro/navegação por teclado do [Combobox](combobox.md).
Reusa `.fs-dropdown-item`/`.is-active`/`.is-disabled` (mesmas classes do
[Dropdown](dropdown.md)) para os itens da lista de comandos.

## Visão geral

```html
<button type="button" class="fs-btn" data-fs="command-palette" data-fs-target="#paleta" data-fs-shortcut="mod+k">
  Comandos (Ctrl+K)
</button>

<div class="fs-command-palette" id="paleta" aria-label="Comandos disponíveis">
  <div class="fs-command-palette-dialog">
    <input type="text" class="fs-command-palette-input" aria-label="Buscar comando" placeholder="Digite um comando…">
    <ul class="fs-command-palette-list">
      <li class="fs-dropdown-item" data-value="new-file">Novo arquivo</li>
      <li class="fs-dropdown-item" data-value="open-settings">Abrir configurações</li>
      <li class="fs-dropdown-item is-disabled" data-fs-empty hidden>Nenhum comando encontrado.</li>
    </ul>
  </div>
</div>
```

Auto-init em `data-fs="command-palette"` **no botão gatilho**, com
`data-fs-target` apontando pro painel (convenção idêntica ao Modal). O
painel não precisa estar pré-posicionado — é um overlay de tela cheia,
como o Modal. `data-fs-shortcut="mod+k"` é opcional: quando presente,
registra um atalho de teclado global (`mod` aceita Ctrl **ou** Meta em qualquer
plataforma) que abre/fecha o painel de qualquer lugar da página, inclusive
campos editáveis. Shift e Alt devem coincidir exatamente com a combinação.
Não há detecção de sistema nem exclusão automática de inputs/contenteditable.

## Anatomia

`.fs-command-palette[role="dialog"]` > `.fs-command-palette-dialog` >
`input.fs-command-palette-input[role="combobox"]` +
`ul.fs-command-palette-list[role="listbox"]` > um ou mais
`li.fs-dropdown-item[role="option"]`.

## Variações

- `data-value` em cada `.fs-dropdown-item` define o valor "de verdade"
  (`event.detail.value` no evento de seleção); sem ele, o valor é o texto
  visível do item.
- Item desabilitado: `.fs-dropdown-item.is-disabled` — ignorado por
  teclado e mouse. O filtro textual ainda controla sua visibilidade; se só
  restarem itens disabled, a mensagem de nenhum comando selecionável aparece.
- Item de "sem resultados": `.fs-dropdown-item.is-disabled[data-fs-empty]`,
  `hidden` por padrão — visibilidade alternada automaticamente pelo JS.
- `.fs-dropdown-header` agrupa comandos por seção, igual ao Dropdown.
- `data-fs-shortcut="mod+k"` (ou `options.shortcut` no construtor): aceita
  combinações com `mod`/`shift`/`alt` + uma tecla, ex. `"mod+shift+p"`.

## Estados

- Ao abrir, o input é limpo e a lista completa (sem filtro) é exibida.
- Digitar filtra os itens por substring (case-insensitive) — os que não
  correspondem recebem o atributo `hidden`.
- Primeiro item selecionável sempre começa destacado (`.is-active`),
  pronto pra `Enter` imediato.
- Selecionar um item fecha o painel e devolve o foco ao gatilho.

## A11y

`role="dialog"` + `aria-modal="true"` no painel, `role="combobox"` +
`aria-autocomplete="list"` + `aria-controls`/`aria-expanded` no input,
`role="listbox"` na lista, `role="option"` + `aria-selected` em cada item.
Foco preso dentro do diálogo (`packages/fokus-js/js/core/focus.js`, mesmo mecanismo do
Modal) enquanto aberto; scroll da página travado
(`packages/fokus-js/js/core/overlay.js#lockScroll`). Durante a navegação da lista, o foco permanece no input — a opção
destacada é comunicada via `aria-activedescendant`, como no Combobox.

Teclado (com foco no input, painel aberto):
- `ArrowDown`/`ArrowUp`: move o destaque entre os comandos visíveis, com
  wrap.
- `Enter`: seleciona o comando destacado — fecha e dispara
  `fs:command-palette:selected`. A aplicação executa a ação no listener; o
  componente não navega, executa código nem autoriza operações.
- `Escape`: fecha o painel sem selecionar nada.
- `Tab`/`Shift+Tab`: preso dentro do diálogo (focus trap).

## API JS

Auto-init via `data-fs="command-palette"` no botão gatilho, com
`data-fs-target` apontando pro painel. `CommandPalette.getInstance(triggerEl)`.

| Método | Descrição |
|---|---|
| `show()` | Abre o painel, limpa o filtro e foca o input. |
| `hide()` | Fecha o painel, libera o scroll, devolve o foco ao gatilho. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove listeners (incluindo o atalho global, se houver), desregistra a instância. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:command-palette:selected` | Não | Ao selecionar um comando (clique ou `Enter`), com `event.detail.value`/`event.detail.label`. |
| `fs:command-palette:shown` | Não | Depois de abrir o painel. |
| `fs:command-palette:hidden` | Não | Depois de fechar. |

## Tokens

O diálogo consome `--fs-radius-md`, `--fs-shadow-lg`, `--fs-color-text`,
`--fs-color-surface` e `--fs-z-modal`; o input também usa
`--fs-color-border`/`--fs-color-surface-raised`. Itens reutilizam Dropdown.
O backdrop é `rgb(0 0 0 / 50%)` fixo no SCSS: não herda token de backdrop
do Modal. Não há opção JS de cor de backdrop.

## Exemplo

```html
<button type="button" class="fs-btn" id="abrir-paleta" data-fs="command-palette" data-fs-target="#paleta-exemplo" data-fs-shortcut="mod+k">
  Comandos (Ctrl+K)
</button>

<div class="fs-command-palette" id="paleta-exemplo" aria-label="Comandos disponíveis">
  <div class="fs-command-palette-dialog">
    <input type="text" class="fs-command-palette-input" aria-label="Buscar comando" placeholder="Digite um comando…">
    <ul class="fs-command-palette-list">
      <li class="fs-dropdown-item" data-value="new-file">Novo arquivo</li>
      <li class="fs-dropdown-item" data-value="open-settings">Abrir configurações</li>
      <li class="fs-dropdown-item is-disabled" data-fs-empty hidden>Nenhum comando encontrado.</li>
    </ul>
  </div>
</div>

```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-7d432fb903e6).

## Limites de configuração

A única opção tipada de construtor é shortcut. Ela precede data-fs-shortcut;
string vazia desativa o registro. O painel continua vindo de data-fs-target.
O componente aplica papéis ARIA, mas não inventa nome acessível: forneça
aria-label/aria-labelledby ao diálogo e label/aria-label ao input. O evento
selected é notificação de escolha, não uma verificação de permissão.


## Escolha do padrão e limites da busca

Command Palette reúne comandos de uso frequente em uma superfície pesquisável, normalmente acessada por um botão sempre disponível e, opcionalmente, por um atalho. Ela é útil quando a pessoa conhece parte do nome de uma ação e quer alcançá-la sem percorrer toda a navegação. Não deve ser a única maneira de descobrir uma função essencial: o atalho não é evidente para todos, e alguns usuários preferem menus ou links visíveis.

A busca é local e textual. O controlador compara a consulta com o texto dos itens já existentes, sem requisições, pontuação por relevância, sinônimos, remoção de acentos ou pesquisa aproximada. Uma consulta pode não encontrar uma opção se a grafia não contiver a substring esperada. Escolha nomes claros e não prometa um mecanismo de busca inteligente apenas pela aparência da caixa. Para resultados remotos, a aplicação precisa de uma integração própria com carregamento, falhas e atualização segura do DOM.

O componente é independente de Modal e Combobox, embora reutilize mecanismos e estilos relacionados. Não instancie os três sobre a mesma estrutura tentando obter comportamentos cumulativos. A paleta já controla sua camada, bloqueio de scroll e foco. Opções de Modal, como configuração de backdrop ou política de fechamento, não se tornam automaticamente opções válidas de CommandPalette.

## Anatomia, nomes e identidade dos comandos

O gatilho aponta para o painel por data-fs-target. Dentro dele devem existir input e lista com as classes esperadas; a ausência desses elementos não é um modo vazio suportado. O wrapper dialog é usado quando disponível, mas fornecer a anatomia completa torna o escopo de foco e clique externo explícito. Dê ao painel um nome acessível e ao campo uma label ou aria-label: placeholder é uma dica, não um substituto confiável de nome.

Cada comando precisa de um data-value estável quando sua identidade difere do texto apresentado. O evento também entrega label, derivada de textContent. Não use esse texto como código a executar, URL não validada ou HTML a inserir. Traduções e mudanças editoriais não deveriam alterar a identidade da operação; um mapa explícito entre valores conhecidos e handlers da aplicação é mais previsível do que interpretar o rótulo livremente.

Os exemplos usam elementos li para opções da listbox. O componente não executa ações por esses elementos nem os transforma em links de navegação. O listener do exemplo apenas registra a seleção no console; não cria arquivo nem abre configurações. Em uma aplicação real, implemente essas ações explicitamente e verifique permissões na camada adequada. A escolha de um comando não é uma confirmação universal para operações irreversíveis.

## Atalho global e abertura

A opção shortcut do construtor precede data-fs-shortcut. Uma string vazia desativa o registro do atalho; a ausência de ambos mantém apenas o botão e a API. A gramática demonstrada usa mod, shift e alt mais a tecla final. Mod considera Ctrl ou Meta, não uma detecção do sistema operacional. Evite anunciar apenas um rótulo de tecla que não corresponda às combinações realmente aceitas na plataforma do usuário.

O listener global não exclui inputs, textareas ou contenteditable. Uma combinação pode abrir ou fechar a paleta enquanto a pessoa digita em outro campo e competir com atalhos do navegador ou de ferramentas assistivas. Avalie esse conflito antes de habilitar a opção. Não há configuração pública para uma lista de alvos ignorados ou para alterar dinamicamente o atalho depois da construção; a integração pode optar por não registrar atalho e oferecer um botão claramente identificado.

A abertura limpa o campo, reaplica o filtro vazio e destaca o primeiro item selecionável. O estado de pesquisa anterior não é persistido entre sessões. Isso é útil para começar uma nova escolha, mas não deve ser confundido com histórico de comandos. Os métodos show e hide são protegidos contra repetição no mesmo estado; toggle alterna a visibilidade e não escolhe nem executa o item ativo.

## Filtro, destaque e limitações de estado

Itens marcados com data-fs-empty são tratados como mensagem de ausência de resultado selecionável. Eles não participam da escolha, mesmo que tenham texto compatível com a consulta. A indisponibilidade funcional deste controlador é determinada pela classe is-disabled; não presuma que somente aria-disabled true ou disabled nativo sejam suficientes para o mesmo filtro de seleção. Adicione semântica acessível coerente, mas mantenha a classe exigida pelo comportamento atual.

O destaque visual usa is-active e aria-activedescendant no input. Há uma limitação relevante: aria-selected é inicializado como false nas opções, mas não é atualizado pelo método que move o destaque. Além disso, o algoritmo remove a classe do item anterior a partir da lista selecionável atual, de modo que um item escondido pelo filtro pode conservar uma classe is-active antiga. Não use uma consulta global por is-active como fonte única do comando que será executado; a seleção por Enter usa a lista filtrada e activeIndex internos.

Esses limites devem ser verificados na integração acessível e não escondidos por uma afirmação de conformidade completa com o padrão combobox. O exemplo simples permite examinar filtro, seleção e fechamento, mas não demonstra como todas as tecnologias assistivas interpretam a combinação de atributos. Uma correção de runtime seria uma tarefa distinta; esta página descreve o candidato existente sem alterar sua implementação.

## Foco, eventos e ação escolhida

A navegação por ArrowDown e ArrowUp move o destaque, não o foco para cada opção. Mousedown nos itens é prevenido para preservar o campo. Contudo, a afirmação de que o foco nunca sai do input só é válida para a composição simples durante a navegação da lista: se a aplicação acrescentar outros elementos focáveis ao diálogo, o focus trap pode permitir Tab entre eles. Não acrescente controles arbitrários esperando que o padrão de combobox trate todos da mesma maneira.

Selecionar um item chama hide antes de emitir selected. Portanto, o evento hidden ocorre antes da notificação de comando escolhido. O retorno ao gatilho depende de a camada fechada ser a superior, de o gatilho continuar conectado e de não estar dentro de um ancestral inert. Não prometa retorno incondicional quando uma aplicação removeu o botão ou abriu outra camada. Ao executar o comando, a aplicação pode precisar mover foco para o novo contexto de forma deliberada.

Os eventos shown, hidden e selected propagam no gatilho e não são canceláveis. Não há beforeselect para pedir aprovação por preventDefault. Se um comando exige confirmação, o handler deve abrir a confirmação e só executar a operação após a resposta apropriada. Evite ligar diretamente uma ação irreversível ao simples destaque inicial, que é preparado automaticamente ao abrir a paleta.

## API, ciclo de vida e revisão visual

A montagem manual usa new CommandPalette(trigger, options), e a consulta é getInstance(trigger). Não há getOrCreateInstance declarado. Em um bundler, importe de `fokus-styles/js/command-palette.js` e execute a montagem depois do painel completo. O construtor prepara IDs e papéis para itens presentes; embora a filtragem consulte itens atuais, inserir opções depois não garante que recebam toda essa preparação. Não existe refresh público documentado.

Dispose fecha a paleta quando necessário, remove listeners de input, lista, gatilho, Escape e atalho global, além do registro. Não apaga o DOM fornecido nem remove listeners da aplicação para selected. Guarde esses handlers para removê-los antes da desmontagem e encerre requisições iniciadas pela integração. O bloqueio de scroll compartilhado não significa que a aplicação possa remover o painel aberto sem passar pelo ciclo de descarte.

O diálogo tem largura máxima de 480px e altura limitada pela janela, com lista rolável. O backdrop é fixo no SCSS e não herda uma opção de Modal. Revise títulos longos, zoom, viewport pequeno, foco visível e ausência de resultados. Testes DOM podem confirmar eventos e estado aberto/fechado, mas não validam a aparência da sobreposição, a rolagem real ou a experiência de leitor de tela com os limites de ARIA descritos nesta página.

## Exemplo de integração com descarte explícito

O módulo abaixo acompanha o HTML da seção Exemplo, em um projeto com bundler
que resolve o pacote instalado. Execute-o depois de inserir esse HTML. O handler
apenas registra a seleção; nenhuma operação de negócio é implementada. Chame a
função exportada ao desmontar a página para remover o listener da aplicação e o
controlador, antes de remover seus elementos. O CSS deve ser carregado conforme
o guia de uso; não carregue outra versão do bundle sobre a mesma instância.

```js
import { CommandPalette } from "fokus-styles/js/command-palette.js";
const root = document.querySelector("#abrir-paleta");
if (!root) throw new Error("Elemento do exemplo ausente");
const instance = CommandPalette.getInstance(root) ?? new CommandPalette(root);
function onSelected(event) {
  console.log("Seleção recebida:", event.detail.value);
}
root.addEventListener("fs:command-palette:selected", onSelected);
export function destroyExample() {
  root.removeEventListener("fs:command-palette:selected", onSelected);
  instance.dispose();
}
```
