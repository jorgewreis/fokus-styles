> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Navbar

Barra de navegação com composição estática ou menu recolhível responsivo.
Para menus suspensos internos, combine com [Dropdown](dropdown.md).

## Visão geral

O exemplo abaixo requer o CSS e o JavaScript do Fokus Styles. Em telas abaixo
 de 768px, o botão abre o menu; a partir de 768px, o CSS mantém o menu visível.

```html
<nav class="fs-navbar" data-fs="navbar" aria-label="Navegação principal">
  <a href="/" class="fs-navbar-brand">Minha Marca</a>
  <button type="button" class="fs-navbar-toggler" data-fs-toggle="navbar"
          data-fs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false">
    Menu
  </button>
  <div id="menuPrincipal" class="fs-navbar-collapse" hidden>
    <ul class="fs-navbar-nav">
      <li><a href="/" class="fs-nav-link is-active" aria-current="page">Início</a></li>
      <li><a href="/produtos" class="fs-nav-link">Produtos</a></li>
    </ul>
  </div>
</nav>
```

## Anatomia

`.fs-navbar` contém marca, botão `.fs-navbar-toggler` e painel
`.fs-navbar-collapse`. O painel contém `.fs-navbar-nav` e `.fs-nav-link`.
`data-fs="navbar"` pertence ao `<nav>`; `data-fs-toggle="navbar"` e
`data-fs-target` pertencem ao botão. Use IDs únicos para cada painel.

## Variações

Para navegação sempre visível, omita o botão, o painel collapse e `data-fs`;
coloque `.fs-navbar-nav` diretamente no `<nav>`. Essa composição não requer JS.
Não existem variantes de cor ou tamanho próprias da Navbar.

## Estados

- `.fs-navbar-collapse.is-open` — painel aberto em telas pequenas.
- `.fs-nav-link.is-active` — destaque visual; acrescente `aria-current="page"`.
- `.fs-nav-link.is-disabled` — aparência e bloqueio do ponteiro, não do teclado.
  Para itens indisponíveis, prefira texto sem `href` e `aria-disabled="true"`.

## A11y

Use `<nav>` nomeado e um botão real com texto acessível, `aria-controls` e
`aria-expanded="false"` inicial. O JS atualiza `aria-expanded`; Escape dentro
do painel o fecha e devolve foco ao botão. Não use `role="menu"` para links
comuns de navegação. Teste também a transição entre larguras de tela.

## API JS

Após montar a Visão geral, este módulo de bundler reutiliza a instância ou a
cria. O CSS deve estar carregado na entrada. O botão do HTML continua operando o
menu; o descarte só deve ser chamado quando a aplicação desmontar a navegação.

```js
import { Navbar } from 'fokus-styles/js/navbar.js';
const raiz = document.querySelector('[data-fs="navbar"]');
if (!raiz) throw new Error('Navegação ausente');
const navbar = Navbar.getOrCreateInstance(raiz);
export function abrirMenu() {
  navbar.show();
}
export function desmontarNavbar() {
  navbar.dispose();
}
```

`show()`, `hide()` e `toggle()` controlam o painel. `isOpen()` consulta seu
estado de collapse, não a visibilidade imposta pelo breakpoint. Não execute uma
sequência de demonstração terminando em `dispose()` durante a montagem: isso
retiraria imediatamente os listeners necessários ao botão.

`new FokusStyles.Navbar(navEl)` permite inicialização manual. `getInstance`
recebe o `<nav>`, não o botão. `show()`/`hide()` emitem `fs:shown`/`fs:hidden`
no `<nav>` com propagação. `dispose()` remove listeners e registro, sem remover HTML.

## Tokens

`--fs-color-border`, `--fs-color-surface`, `--fs-color-text`,
`--fs-alert-primary-text`, `--fs-color-muted`, `--fs-radius-sm`.

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-fa2f9a059c7e).


## Escolha de navegação e comportamento responsivo

Navbar organiza os destinos principais do aplicativo em uma faixa reconhecível, normalmente próxima ao início da página. A marca identifica o produto; os links representam rotas; o botão de menu controla a apresentação em telas estreitas. Essa separação é importante porque o controlador não escolhe a rota ativa, não implementa roteamento e não conhece o conteúdo de Produtos ou Início. As URLs dos exemplos são contratos do aplicativo: elas precisam existir no servidor ou no roteador utilizado pelo consumidor.

A composição sempre visível é a alternativa mais simples quando há poucos destinos e espaço suficiente. Nesse caso, não é necessário criar uma instância JavaScript vazia apenas para registrar a barra. A composição recolhível acrescenta o botão e o painel, mas não transforma a navegação em um diálogo modal. Os links continuam participando da navegação normal da página; não há bloqueio de rolagem, backdrop ou foco preso dentro do menu. Para uma navegação lateral sobreposta, avalie Offcanvas e seu contrato específico.

O breakpoint de 768px pertence ao CSS deste componente. Não existe uma opção do construtor que o substitua. Acima dele, o CSS exibe o painel mesmo que o estado de collapse permaneça fechado e o atributo hidden esteja presente. Portanto, `isOpen()` informa a classe de estado do painel, não uma medição da sua visibilidade real na janela. Não use esse método para decidir, sozinho, se os links estão visíveis em desktop.

## Anatomia, atributos e estado inicial

O controlador procura dentro da raiz um elemento com `data-fs-toggle="navbar"`. Depois resolve seu `data-fs-target` no documento; se o atributo não existir, procura `.fs-navbar-collapse` dentro da barra. Prefira a relação explícita por ID, principalmente quando houver mais de uma navegação. Se botão ou painel estiverem ausentes, o construtor retorna sem registrar uma instância operacional; chamar métodos de abertura sobre uma composição incompleta não é uma maneira segura de recuperar a estrutura.

Escreva o estado inicial no HTML de forma consistente. Para começar fechado em telas pequenas, use o botão com aria-expanded false e o painel sem is-open, como no exemplo. Para começar aberto, alinhe a classe is-open, a ausência de hidden e o atributo do botão. A construção não executa uma normalização completa desses três sinais. IDs e aria-controls devem ser fornecidos pela aplicação; não há geração automática dessa relação como em alguns outros componentes.

A marca é um link de navegação, não o botão de alternância. Evite colocar dois comportamentos concorrentes no mesmo elemento. Nos links de destino, `.is-active` dá destaque visual enquanto `aria-current="page"` informa a localização atual. Atualize ambos quando o roteador mudar a página. A Navbar não acompanha histórico, pathname ou eventos de navegação para escolher o item corrente.

## API JS e integração de aplicação

A consulta e o helper `Navbar.getOrCreateInstance(nav)` recebem a raiz, não o botão. Use o helper quando uma instância pode já ter sido criada por auto-init. Para importação modular em um bundler, o caminho é `fokus-styles/js/navbar.js`. Execute a montagem depois que os elementos existirem, e mantenha a referência para o descarte. Essa classe não oferece um objeto de opções para alterar animação, cor, breakpoint ou política de fechamento.

`show()` retira hidden, acrescenta is-open, atualiza o botão e emite fs:shown. `hide()` realiza o inverso, tenta focar o botão e emite fs:hidden. Esses métodos não possuem a mesma proteção contra repetição presente em Dropdown: chamadas repetidas podem emitir eventos mesmo sem uma mudança perceptível. Não utilize esses eventos como confirmação única de uma operação externa ou contador confiável de visitas. Se precisar de deduplicação, mantenha esse estado na aplicação.

Escape é tratado dentro do painel quando o estado está aberto. O componente não fecha automaticamente ao clicar fora nem ao selecionar qualquer link. Em um aplicativo de página única, pode ser útil fechar após a troca de rota em telas pequenas; isso é integração do roteador, não comportamento embutido. Considere que hide tenta focar o botão, que fica oculto no layout desktop. Decida quando chamar esse método e teste a sequência com o breakpoint real.

## A11y, foco e estados indisponíveis

Use nav com nome acessível quando houver outras áreas de navegação. O texto Menu é um nome simples para o controle; se usar apenas um ícone, forneça um nome equivalente. Não aplique role menu a uma lista de links de páginas só porque ela é chamada informalmente de menu. A navegação por Tab e ativação por Enter continuam sendo as dos links e botões nativos, sem uma malha de setas criada pela Navbar.

A classe is-disabled de um link bloqueia ponteiro e altera aparência, mas não elimina seu href nem oferece guarda de teclado. Para uma rota ainda indisponível, apresente texto sem destino e explique a condição, em vez de um link visualmente desabilitado que continua navegável. O componente também não impede acesso direto a URLs. Regras de autorização pertencem ao aplicativo e ao serviço, não à ausência de um item na barra.

Mudanças de largura merecem teste próprio: abra em mobile, aumente a janela, reduza novamente e verifique foco, classe e leitura dos controles. A exibição desktop é determinada por CSS e não por um listener que sincroniza todos os atributos a cada resize. Uma avaliação DOM não demonstra a experiência de tecnologias assistivas quando uma regra de estilo sobrepõe hidden, nem garante que títulos longos ou traduções caibam na barra.

## Tokens, composição e descarte

Os links usam também `--fs-color-surface-raised` e `--fs-color-subtle`; a marca e o painel compartilham a superfície da barra. Evite criar estilos que removam o foco visível para obter uma aparência uniforme. A largura mínima e a altura mínima do toggler são 44px no SCSS, mas o espaço efetivo continua dependendo do layout ao redor. Combinar Dropdown dentro da barra é possível, desde que cada controlador tenha seu próprio alvo e ciclo de vida.

Ao desmontar, descarte também os Dropdowns internos que a aplicação montou: dispose da Navbar não percorre componentes filhos. Ele remove seus dois listeners e o registro, sem restaurar classes, hidden ou atributos. Remova handlers próprios de eventos e do roteador separadamente. O HTML da Visão geral é o exemplo completo da composição recolhível; para uma versão estática, use a variação descrita acima e preserve os links reais.

## Exemplo

Use a marcação completa da Visão geral com CSS e JavaScript carregados conforme o guia de uso. As rotas `/` e `/produtos` devem existir no aplicativo. O exemplo implementa abertura e fechamento do painel, não essas páginas de destino.
