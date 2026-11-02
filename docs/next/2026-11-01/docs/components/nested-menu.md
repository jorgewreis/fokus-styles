> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Nested Menu

[Dropdown](dropdown.md) com submenus recursivos, quantos níveis quiser.
Reusa `.fs-dropdown-menu`/`.fs-dropdown-item` sem reestilizar — só adiciona
o posicionamento em cascata e a navegação por nível. Componente próprio
(não é o Dropdown com opção extra) porque a navegação por teclado é por
nível, não linear sobre todos os itens.

## Visão geral

```html
<button type="button" class="fs-btn fs-dropdown-toggle" data-fs="nested-menu" data-fs-target="#menu">
  Arquivo
</button>
<div class="fs-dropdown-menu" id="menu">
  <a href="/documentos/novo" role="menuitem" class="fs-dropdown-item">Novo documento</a>
  <div class="fs-dropdown-submenu">
    <button type="button" role="menuitem" class="fs-dropdown-item fs-dropdown-item-submenu">Exportar</button>
    <div class="fs-dropdown-menu">
      <a href="/exportacao/pdf" role="menuitem" class="fs-dropdown-item">Preparar PDF</a>
      <a href="/exportacao/csv" role="menuitem" class="fs-dropdown-item">Preparar CSV</a>
    </div>
  </div>
  <a href="/documentos" role="menuitem" class="fs-dropdown-item">Documentos</a>
</div>
```

## Anatomia

Gatilho + `.fs-dropdown-menu` (raiz) — cada submenu é
`.fs-dropdown-submenu` (âncora de posicionamento) envolvendo um
`.fs-dropdown-item.fs-dropdown-item-submenu` (o item que abre, com seta
lateral) seguido de outro `.fs-dropdown-menu` (o submenu em si, mesmo
padrão recursivamente).

## Variações

Mesmas de [Dropdown](dropdown.md) no gatilho raiz (`data-placement`,
`data-align`). Submenus não têm variação própria — abrem sempre à direita
do item pai, com flip automático para a esquerda se não couber (a classe
`.fs-dropdown-submenu-left` é aplicada/removida pelo JS, não escreva
manualmente).

## Estados

`.is-open` em cada `.fs-dropdown-menu` (raiz e submenus, independentes).
Só um submenu por nível fica aberto por vez — abrir um fecha os irmãos do
mesmo nível.

Abertura por **hover** é 100% CSS (`:hover` no `.fs-dropdown-submenu`);
por **clique/teclado** é controlada pelo JS, com as diferenças de estado e ARIA descritas adiante
(passar o mouse fecha ramos abertos por teclado que não estão no caminho
do hover).

## A11y

`role="menu"` em todo nível, `aria-haspopup="menu"` + `aria-expanded` em
todo item que abre submenu (sincronizados automaticamente). Teclado (com
foco num item do menu): `ArrowDown`/`ArrowUp` navegam no nível atual,
`ArrowRight` abre o submenu do item focado e move o foco pro primeiro item
dele, `ArrowLeft` fecha o submenu atual e devolve o foco ao item pai,
`Escape` fecha só o nível atual (se estiver num submenu) ou o menu inteiro
(se estiver na raiz), `Enter`/`Space` num item com submenu alterna
abrir/fechar.

## API JS

Auto-init via `data-fs="nested-menu"`. `NestedMenu.getInstance(el)` (`el`
é o gatilho).

| Método | Descrição |
|---|---|
| `show()` | Abre o menu raiz, posiciona, foca o primeiro item. |
| `hide()` | Fecha o menu raiz e todos os submenus abertos. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove todos os listeners, desregistra a instância. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:nested-menu:shown` | Não | Depois de abrir o menu raiz. |
| `fs:nested-menu:hidden` | Não | Depois de fechar o menu raiz (fecha todos os submenus junto). |

## Opções e itens indisponíveis

As opções JS placement/align precedem os atributos data-placement/data-align;
os padrões são bottom/start. Placement aceita top, bottom, left e right; align aceita start, center e end. Não há objeto de opções equivalente ao Dropdown
inteiro: este componente tem contrato próprio.

O filtro de navegação ignora itens com `.is-disabled`, `aria-disabled="true"`
ou estado nativo `:disabled` (incluindo fieldset desabilitado). A classe e ARIA
são consultadas no próprio item: não há herança inventada de `aria-disabled`
do contêiner. Mantenha aparência, semântica e regras da aplicação coerentes.

Itens indisponíveis são pulados pelas setas e pelo foco inicial. Essa é uma
divergência deliberada do padrão APG de menu, no qual itens indisponíveis podem
receber foco; não é uma implementação integral desse padrão.

Uma guarda em capture cancela click, auxclick e Enter/Espaço nesses itens,
incluindo eventos originados em seus descendentes, antes de handlers no alvo.
Não registra autorização: ações e regras de negócio continuam na aplicação.
Itens habilitados preservam handlers, ações padrão de links e fechamento normal;
setas, Escape e Tab não são interceptados pela guarda. Pais de submenu
indisponíveis não podem ser abertos/fechados por ativação; o fechamento geral
ao ocultar/descartar o menu continua limpando todos os submenus.
Hover também exige um item pai habilitado, imediatamente seguido do submenu.
Um ramo já aberto pode permanecer aberto se o pai se tornar indisponível; seus
filhos continuam com estado local próprio, sem herdar ARIA do pai. O fechamento
geral continua limpando esse ramo. Nenhum conteúdo HTML do menu é sanitizado
pelo componente.

## Tokens

Mesmos do [Dropdown](dropdown.md) — sem tokens próprios.

## Exemplo

Ver acima (Visão geral) — mockup com múltiplos níveis em
[laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-75784a2862b7).

### Retorno de um ramo que ficou indisponível

Fechamento de navegação e limpeza não são bloqueados pelo disabled do pai. Se
Escape ou ArrowLeft partir de um filho cujo pai ficou indisponível, a raiz fecha
e o foco retorna ao gatilho, evitando tentar focar um botão disabled e deixar
foco em conteúdo oculto. Com pai habilitado, o retorno usual ao pai permanece.


## Escolha de hierarquia e organização de ações

Nested Menu é apropriado quando um conjunto de ações realmente tem níveis, como escolher uma categoria de exportação antes de escolher seu formato. Cada submenu pertence a um item pai, e as setas laterais representam a entrada e a saída desse nível. Essa hierarquia é diferente de uma lista de destinos sempre visível: Menu resolve a navegação lateral sem precisar abrir camadas. Também é diferente de Tree View, que mantém nós de uma árvore e seleção persistente em uma região do documento.

Embora a estrutura possa ser recursiva, isso não significa que qualquer profundidade seja confortável. Muitos níveis exigem precisão de ponteiro, espaço horizontal e memória do caminho percorrido. Prefira agrupar comandos de maneira compreensível e teste se a pessoa consegue alcançar a opção desejada sem descobrir ramos por tentativa. Uma paleta pesquisável pode ser mais adequada quando há muitos comandos independentes, enquanto um formulário costuma ser melhor para configurar várias opções antes de executar uma operação.

O componente compartilha classes com Dropdown, mas não herda sua implementação. Não inicialize os dois no mesmo gatilho e não transfira opções ou helpers de uma classe para a outra. Aqui, o teclado percorre os itens diretos do nível atual. Um wrapper arbitrário entre o menu e uma folha pode impedir que ela entre nessa lista, mesmo que a classe fs-dropdown-item ainda dê a aparência correta. Preserve a anatomia exigida pelo algoritmo.

## Anatomia, semântica e conteúdo dos níveis

Cada pai de submenu deve ser seguido imediatamente pelo seu painel, dentro de fs-dropdown-submenu. A busca do próximo nível usa nextElementSibling; colocar um texto auxiliar ou um separador entre pai e painel quebra essa relação. Use um botão real para o pai e links reais para folhas que navegam. O pai não deve tentar executar uma ação irreversível ao mesmo tempo que revela opções, porque seu clique é reservado à expansão.

O controlador atribui role menu aos painéis e aria-haspopup/aria-expanded aos pais, mas não atribui automaticamente role menuitem a cada folha como o Dropdown faz. Forneça essa semântica explicitamente aos controles do exemplo. Também não inventa um nome acessível para toda a estrutura: use o texto do gatilho e associações explícitas quando necessário. A presença de alguns atributos gerados não deve ser interpretada como implementação integral do padrão ARIA de menu.

Os exemplos usam rotas de aplicação para as folhas, como páginas de preparação de exportação. Essas rotas precisam existir no aplicativo consumidor. O framework não gera PDF, CSV ou arquivos novos. Para executar uma ação local, substitua a folha por button e registre seu handler, mantendo referência para remoção no descarte. O evento de fechamento do menu não contém um comando de negócio e não deve servir como substituto dessa ligação explícita.

## Abertura por ponteiro e navegação por teclado

A abertura visual por hover vem de CSS, enquanto o estado is-open usado por teclado e clique vem do controlador. Essa coexistência exige uma ressalva: hover não escreve automaticamente aria-expanded true como a abertura por método interno. Não trate a visibilidade visual de um ramo sob o mouse como prova de que todos os atributos ARIA espelham esse estado. O mouseover remove ramos marcados por teclado fora do caminho atual, mas não transforma cada movimento do ponteiro em um evento público de abertura.

ArrowDown e ArrowUp circulam pelos itens habilitados do nível. ArrowRight entra no submenu do pai; ArrowLeft retorna ao pai quando o foco está em um submenu. Escape fecha o nível atual ou a raiz, conforme o contexto. Diferentemente do Dropdown, não há handler de ArrowDown/ArrowUp no gatilho para abrir diretamente, nem implementação de Home/End ou busca por letras no menu. A ativação inicial deve usar o botão nativo ou a API show.

Um pai indisponível não abre pelo teclado ou clique. Se ele ficar indisponível quando o ramo já estiver aberto, o estado dos filhos não é automaticamente herdado. A política de retorno evita focar um pai desabilitado: fecha a raiz e volta ao gatilho. Essa escolha precisa ser explicada ao integrar mudanças de permissão em tempo real, porque a indisponibilidade de uma categoria não oculta necessariamente todos os seus descendentes já exibidos.

## Posicionamento, portal e limites geométricos

O painel raiz utiliza portal, contexto de tema e cálculo de posição na abertura. Submenus usam a estrutura CSS em cascata e a classe de inversão lateral calculada para o pai. O cálculo de flip usa a largura disponível e, se não conseguir medir o submenu, uma estimativa de 180px. Não há garantia de que textos longos, zoom elevado ou vários níveis sempre caibam confortavelmente. Revise o componente em janelas estreitas e perto das bordas reais.

Ao contrário do Dropdown, esta implementação não instala watchPosition para atualizar continuamente a raiz durante resize e scroll. Não prometa acompanhamento automático equivalente só porque placement e align têm nomes iguais. O offset da posição raiz é quatro pixels, definido internamente. Não há opção pública para controlar atraso de hover, direção independente de cada nível ou estratégia de recorte. Se esses requisitos forem essenciais, registre a necessidade em vez de inventar atributos.

## API, eventos e ciclo de vida

A importação modular usa `fokus-styles/js/nested-menu.js` em um projeto com bundler. `NestedMenu.getInstance(trigger)` consulta o registro; se ainda não houver instância, crie com `new NestedMenu(trigger, options)`. Não existe getOrCreateInstance tipado nesta classe. Execute a montagem após o HTML e não reconstrua um controlador ativo sem descartá-lo. As opções são lidas na construção, não observadas reativamente.

Os dois eventos públicos específicos descrevem abertura e fechamento da raiz, não cada submenu. Eles propagam a partir do gatilho e não são canceláveis. Show e hide repetidos no mesmo estado não produzem uma nova mudança. Hide fecha os ramos controlados e remove a posição da raiz, mas não devolve foco por si; os handlers de Escape e seleção de folha fazem o retorno conforme seu fluxo. Uma aplicação que fecha o menu programaticamente deve avaliar o foco restante.

Dispose remove handlers locais e globais, fecha a raiz quando necessário e restaura o painel à posição original no DOM. Ele não apaga os elementos de conteúdo nem remove listeners que a aplicação instalou nos comandos. Como o portal muda o ancestral físico do painel, prefira registrar handlers no próprio item ou no painel, não apenas no wrapper original. Ao desmontar, remova esses handlers antes de descartar e remover o HTML.

## Verificação específica

Teste o caminho até um segundo nível, o retorno por Escape, um pai que se torna indisponível e uma folha com destino real. Teste também a alternância entre mouse e teclado sem presumir que JSDOM reproduz hover ou geometria. O CSS não sanitiza conteúdo e o controlador não valida permissões. O resultado DOM comprova estado e eventos examinados, mas não certifica acessibilidade, alinhamento ou adequação da hierarquia ao uso real.
