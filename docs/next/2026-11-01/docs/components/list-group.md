> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# List group

## Visão geral

`.fs-list-group` organiza itens verticalmente; `.fs-list-group-item` estiliza
cada item. CSS não mantém seleção, navega rotas nem define papéis ARIA.

## Anatomia e exemplos

Lista de conteúdo estático:

```html
<ul class="fs-list-group">
  <li class="fs-list-group-item">Contrato recebido</li>
  <li class="fs-list-group-item">Documentos conferidos</li>
</ul>
```

Navegação com itens interativos diretos:

```html
<nav class="fs-list-group" aria-label="Seções do escritório">
  <a class="fs-list-group-item is-active" href="/contatos" aria-current="page">Contatos</a>
  <a class="fs-list-group-item" href="/processos">Processos</a>
</nav>
```

Adapte URLs ao aplicativo. Para ações, use botões `type="button"` em um grupo
nomeado, não links sem destino. Links/botões recebem largura total e texto
alinhado ao início. Não crie `li` clicável sem um controle nativo.

## Estados

`.is-active` aplica fundo primary e texto on-primary. Hover aplica subtle aos itens não ativos
(até em itens estáticos); não significa que um item seja clicável. O aplicativo
atualiza `.is-active` e `aria-current`. Não existe variante disabled própria;
`aria-disabled` em link não bloqueia navegação.

## A11y

Preserve lista ul/li para conteúdo e nav/links para navegação. Nomeie a
navegação e marque a página atual semanticamente. Não use `role="listbox"`
sem implementar seu padrão completo de teclado e seleção. Não há roving Tab
nem navegação por setas nesta API.

## Tokens e limites

Borda/raio: `--fs-color-border`, `--fs-radius-md`. Padding:
`--fs-space-3` e `--fs-space-4`. Cores: `--fs-color-text`,
`--fs-color-surface`, `--fs-color-subtle`, `--fs-color-primary`,
`--fs-color-on-primary`. Não há API JS nem variantes flush/horizontal.

## Verificação

`component-docs-contract.test.js` confere classes e semântica de página atual.
Confira foco, textos longos, contraste dos estados e rotas reais no aplicativo.

## Escolha da estrutura

List Group oferece uma apresentação uniforme para sequências de conteúdo ou destinos relacionados. Antes de escolher as classes, decida se os itens são informações, links ou ações. Essa distinção muda a marcação e a interação esperada. Uma lista de etapas já realizadas pode usar `ul` e `li`; uma lista de páginas do produto pode usar uma região de navegação com links; uma coleção de comandos precisa de controles reais com comportamento da aplicação.

A borda externa e os divisores dão continuidade visual, mas não fazem os itens pertencer a um modelo de seleção. Marcar um item como ativo não cria exclusividade nem desmarca os demais. Quando houver um destino atual, a aplicação deve atualizar a classe e `aria-current` no mesmo link. Se o objetivo for escolher valores de um formulário, uma lista de links não substitui automaticamente radio, select ou outro controle apropriado.

## Variações

A implementação atual é vertical. Não existem modificadores oficiais para disposição horizontal, lista sem borda ou seleção múltipla. A classe base usa flex em coluna; cada item tem espaçamento interno, superfície e uma borda inferior que desaparece no último filho. Links e botões com a classe de item recebem largura total, alinhamento de texto ao início e cursor de ponteiro. O componente não exige que todos os itens sejam interativos, mas misturar tipos deve continuar compreensível.

O hover é aplicado à classe de item mesmo quando ela está em um `li` estático. Portanto, a mudança de fundo não demonstra que existe uma ação. Se essa aparência causar ambiguidade no produto, escolha uma composição mais simples ou uma customização local conscientemente documentada. Não adicione um handler ao `li` como atalho sem oferecer teclado, foco e semântica equivalentes.

## Integração e estado da aplicação

No exemplo de navegação, as rotas `/contatos` e `/processos` são contratos do aplicativo. A atualização de página, o histórico e a autorização continuam fora do CSS. O servidor ou roteador deve produzir o estado atual correto ao abrir uma URL diretamente, não apenas depois de um clique dentro da lista. Isso evita que a indicação visual fique errada após usar Voltar, recarregar ou compartilhar um endereço.

A variante ativa usa os tokens de cor primária e de texto sobre a primária. Ela não aplica `aria-selected` nem define um papel de widget. Não acrescente `role="listbox"`, `role="menu"` ou navegação por setas apenas pelo aspecto visual: esses padrões possuem contratos adicionais que List Group não implementa. Em navegação comum, cada link permanece na ordem normal de Tab.

## API JS

Não há construtor ListGroup, evento de seleção, método `activate` ou registro de instâncias. Se a aplicação instalar handlers em botões, ela é responsável por persistência, tratamento de falhas e descarte desses listeners. Para conteúdo puramente estático, nenhum JavaScript é necessário. Recriar o HTML é suficiente para refletir uma nova coleção, desde que a aplicação preserve foco e contexto quando a atualização acontecer durante a interação.

### Indisponibilidade e segurança

Não existe uma variante disabled própria. Um botão pode usar o atributo nativo `disabled`; um link com `aria-disabled="true"` continua tendo uma URL e pode continuar navegável. Para uma opção informativa sem destino disponível, apresente texto em vez de um link fictício. A ausência de um link não substitui validação de autorização no servidor, assim como uma classe de aparência não bloqueia chamadas programáticas.

### Leitura e revisão

Use nomes de links que permitam distinguir os destinos fora do contexto imediato. Um título repetido como “Abrir” em todos os itens pode exigir qualificação. Se acrescentar contagens ou badges, deixe claro a que pertencem e não dependa exclusivamente da cor do item ativo. Confira textos extensos, bordas, foco e espaçamento com zoom; não há truncamento nem ajuste de densidade automático nesta API. Os testes de markup comprovam a semântica demonstrada, mas a clareza da navegação depende da organização real do produto.
