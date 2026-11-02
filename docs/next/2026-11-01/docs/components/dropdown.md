> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Dropdown

Menu suspenso posicionado relativo a um gatilho — reposicionamento
automático (flip perto das bordas), navegação por teclado, fecha ao
clicar fora ou `Escape`.

## Visão geral

```html
<div class="fs-dropdown">
  <button type="button" class="fs-btn fs-dropdown-toggle" data-fs="dropdown" data-fs-target="#meu-menu">
    Opções
  </button>
  <div class="fs-dropdown-menu" id="meu-menu">
    <a href="/documentos/42/editar" class="fs-dropdown-item">Editar</a>
    <a href="/documentos/42/copiar" class="fs-dropdown-item">Preparar cópia</a>
    <div class="fs-dropdown-divider"></div>
    <a href="/documentos/42/exclusao" class="fs-dropdown-item">Revisar exclusão</a>
  </div>
</div>
```

Sem `data-fs-target`, o menu é o próximo irmão do gatilho no HTML — usar
`data-fs-target` é mais explícito e não exige ordem específica no DOM (o
JS move o menu para o diálogo proprietário, quando houver, ou `<body>`;
ao descartar a instância, restaura seu pai e posição originais).

## Anatomia

`.fs-dropdown` (wrapper visual opcional) > gatilho (`.fs-dropdown-toggle`, qualquer
elemento clicável) + `.fs-dropdown-menu` > `.fs-dropdown-item` (link ou
botão), `.fs-dropdown-divider` (separador), `.fs-dropdown-header` (rótulo
de grupo, sem interação).

## Variações

- **Posicionamento**: `data-placement` (`top`/`bottom`/`left`/`right`,
  padrão `bottom`) e `data-align` (`start`/`center`/`end`, padrão `start`) no
  gatilho — reposiciona automaticamente (flip) se não couber na direção
  pedida.

```html
<button type="button" class="fs-btn fs-dropdown-toggle" data-fs="dropdown" data-fs-target="#menu2" data-placement="top" data-align="end">
  Opções
</button>
<div class="fs-dropdown-menu" id="menu2">
  <a href="/perfil" class="fs-dropdown-item">Perfil</a>
</div>
```

## Estados

`.fs-dropdown-item.is-active` (fundo primário), `.fs-dropdown-item.is-disabled`
(opacidade reduzida, ponteiro bloqueado e fora da navegação por seta).

## A11y

O JS aplica automaticamente: `aria-haspopup="menu"` + `aria-expanded` no
gatilho, `role="menu"` no menu. Dentro do menu aberto: `ArrowDown`/
`ArrowUp` navegam entre itens (pulando desabilitados); o primeiro item
recebe foco ao abrir. `Escape` fecha e devolve o foco ao gatilho; clicar
num item fecha e devolve o foco ao gatilho também.

## API JS

Auto-init via `data-fs="dropdown"`. `Dropdown.getInstance(el)` (`el` é o
**gatilho**, não o menu).

| Método | Descrição |
|---|---|
| `show()` | Abre o menu, posiciona, foca o primeiro item, ativa fechamento por clique fora. |
| `hide()` | Fecha o menu. |
| `toggle()` | Alterna entre `show()`/`hide()`. |
| `dispose()` | Fecha se aberto, remove todos os listeners e desregistra a instância. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:dropdown:shown` | Não | Depois de abrir. |
| `fs:dropdown:hidden` | Não | Depois de fechar. |

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-color-text`,
`--fs-color-subtle` (hover), `--fs-color-primary` (item ativo),
`--fs-color-muted` (header/desabilitado), `--fs-radius-md`,
`--fs-shadow-md`.

## Exemplo

```html
<div class="fs-dropdown">
  <button type="button" class="fs-btn fs-btn-outline-secondary fs-dropdown-toggle" data-fs="dropdown" data-fs-target="#acoes">
    Ações
  </button>
  <div class="fs-dropdown-menu" id="acoes">
    <div class="fs-dropdown-header">Conta</div>
    <a href="/perfil" class="fs-dropdown-item">Perfil</a>
    <a aria-disabled="true" class="fs-dropdown-item is-disabled">Configurações (em breve)</a>
    <div class="fs-dropdown-divider"></div>
    <a href="/conta" class="fs-dropdown-item">Gerenciar conta</a>
  </div>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-d91868442959).

### Refinamentos visuais

Use `.fs-dropdown-menu-sm` ou `.fs-dropdown-menu-lg` para ajustar densidade,
`.fs-dropdown-content` para conteúdo composto simples, `.fs-dropdown-rich` para
painéis com cabeçalho, metadados e ações descritas, e `.fs-dropdown-item-danger` para
ações destrutivas. O JS publica `data-placement` no menu após o flip automático,
permitindo ajustes de origem no CSS.

### Itens indisponíveis

`.is-disabled`, `disabled` nativo e `aria-disabled="true"` excluem o item da
navegação por setas e bloqueiam ativação dentro do menu. O componente cancela
click/auxclick e Enter/Espaço em fase de captura, antes dos handlers do item:
não segue o link, não fecha o menu e não transfere foco ao gatilho. Itens
habilitados preservam a ativação nativa e a ordem normal dos seus handlers.

Prefira `<button type="button" disabled>` para ações quando possível. Esses
estados são controles de interface, não um contrato de autorização de negócio;
chamadas diretas à lógica da aplicação e listeners de captura externos/anteriores
não são interceptados pelo componente. Valide permissões na camada apropriada.

Somente `placement` e `align` são opções lidas. Opções JS precedem os atributos;
o offset interno é 4px. `hide()` não devolve foco por si: Escape e seleção de
item fazem isso nos respectivos handlers. `dispose()` preserva o painel DOM
fornecido pela aplicação e o retorna ao pai original.


## Escolha do menu e responsabilidades da aplicação

Dropdown reúne destinos ou ações secundárias que não precisam ocupar permanentemente uma barra de ferramentas. O botão revela uma lista curta, e a seleção encerra a interação com o menu. Para uma navegação lateral sempre visível, Menu é mais simples; para opções hierárquicas, Nested Menu possui um controlador próprio. Não trate Dropdown como um seletor de formulário: ele não mantém um valor de campo, não serializa uma opção selecionada e não implementa o contrato de um select nativo.

Escolha links quando o resultado for navegar para uma rota e botões quando o resultado for uma ação local. O componente fecha a lista, mas não sabe o que “Excluir”, “Duplicar” ou “Sair” significa. Um botão com esse texto só implementa a ação quando a aplicação registra um handler; um link precisa de destino verdadeiro. Os exemplos de navegação desta página usam rotas que o aplicativo deve fornecer, não endpoints implementados pelo framework. Para ações destrutivas, a variante danger é um sinal visual, não uma confirmação nem uma validação de permissão.

O gatilho deve ser um botão nativo, com `type="button"` e nome compreensível. A aparência `.fs-dropdown-toggle` acrescenta uma seta, mas não cria semântica de botão em um elemento genérico. A opção de alvo explícito é preferível quando a composição muda com frequência. A alternativa de próximo irmão funciona sem um wrapper especial; `.fs-dropdown` é uma convenção visual de composição, não uma exigência do algoritmo de resolução do alvo.

## Posicionamento e painel fora do contêiner original

O menu é movido por um portal para a camada apropriada, dentro do diálogo proprietário quando existir ou junto ao body. Isso evita parte dos problemas de recorte, mas muda a relação física entre os elementos no DOM. Seletores CSS baseados exclusivamente em um ancestral local podem deixar de alcançar o painel. Da mesma forma, um listener delegado no wrapper original não acompanha automaticamente cliques no painel depois da movimentação. Registre ações no próprio item ou no menu, mantendo referências para o descarte.

As opções do construtor são apenas `placement` e `align`. Elas precedem `data-placement` e `data-align`; os padrões são bottom e start. O deslocamento de quatro pixels é definido internamente, não por uma opção `offset` do Dropdown. O cálculo pode inverter a direção conforme o espaço disponível, e o menu recebe o placement efetivo. O alinhamento solicitado e o lado efetivo não são conceitos intercambiáveis: não escreva regras visuais assumindo que uma solicitação de top sempre resultará em top.

Durante a abertura, o componente acompanha alterações de posicionamento e aplica o contexto de tema ao painel. Ao fechar, remove estilos de posição e atributos de posicionamento calculados, encerra a observação e desregistra a camada. A inspeção com JSDOM comprova alterações de estado e atributos, mas não calcula uma janela real com zoom, recortes, rolagem e colisões. Essas situações precisam de revisão visual no aplicativo consumidor, especialmente em diálogos e barras fixas.

## API, eventos e fluxo de foco

Além dos métodos de instância, existem `Dropdown.getOrCreateInstance(trigger, options)`, `Dropdown.show(trigger, options)`, `Dropdown.hide(trigger)` e `Dropdown.toggle(trigger, options)`. A reutilização não reaplica novas opções a uma instância já existente. Se precisar mudar placement ou align de forma declarativa, descarte a instância anterior e reconstrua com a configuração desejada. O construtor manual não deve ser chamado repetidamente sobre um gatilho que ainda possui listeners ativos.

Os eventos específicos convivem com `fs:shown` e `fs:hidden`, também emitidos no gatilho e com propagação. Não são canceláveis e não constituem um evento de seleção com valor de negócio. Para reagir a um comando, escute o clique do botão correspondente; para observar a visibilidade, use os eventos do menu. `show()` e `hide()` não repetem os eventos se o estado já for o solicitado, e não há uma Promise pública de abertura.

Ao abrir, o primeiro item habilitado recebe foco. No gatilho, ArrowDown abre e vai ao primeiro item; ArrowUp abre e vai ao último. No menu, Home e End completam a navegação por setas. Não existe uma busca de itens por digitação nem focus trap equivalente ao de um diálogo modal. Escape e clique em item retornam o foco ao gatilho, enquanto `hide()` chamado diretamente não faz esse retorno. A aplicação deve avaliar onde ficará o foco ao fechar programaticamente, sem supor uma regra única para todos os caminhos.

A guarda de itens indisponíveis consulta a classe, a propriedade disabled e o atributo ARIA do próprio item. Não prometa herança universal do estado de um contêiner. Ela intercepta ativações no menu antes de handlers no alvo, mas não desfaz código já executado por listeners externos anteriores. Também não transforma esconder um comando em autorização de negócio. Para permissões sensíveis, valide a operação no serviço responsável, independentemente da apresentação do menu.

## Variações, tokens e conteúdo composto

Os tamanhos sm e lg alteram principalmente largura mínima e espaçamento dos itens; não são um mecanismo de responsividade automática baseado no número de comandos. Entre os tokens locais estão `--fs-dropdown-min-inline-size`, `--fs-dropdown-max-block-size`, `--fs-dropdown-padding-block`, `--fs-dropdown-item-padding-block` e `--fs-dropdown-item-padding-inline`. O menu usa ainda borda padrão, sombra e z-index de dropdown. Alterar o token CSS de offset não deve ser apresentado como configuração do cálculo JS, que usa o deslocamento fixo descrito acima.

O painel rich organiza identidade, metadados e descrições, mas conserva as responsabilidades semânticas de seus controles. Não introduza formulários complexos dentro de um menu esperando que a navegação por setas entenda cada campo. Textos truncados visualmente precisam continuar identificáveis, e o leitor deve distinguir um cabeçalho de grupo de uma ação. Se o conteúdo exigir navegação livre por vários controles, avalie um Popover ou outro padrão apropriado ao caso, em vez de apenas aplicar classes de menu a qualquer superfície.

Na desmontagem, remova os listeners da aplicação, chame `dispose()` e só então remova o HTML. O descarte restaura o pai e a posição original do painel, mas preserva o DOM fornecido e não promete apagar todos os atributos ARIA introduzidos. Teste reabertura, Escape, item desabilitado, clique externo e retorno de foco; nenhum desses testes isoladamente demonstra conformidade de acessibilidade em todos os navegadores.
