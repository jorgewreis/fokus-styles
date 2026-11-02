> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Menu

## Visão geral

Navegação vertical contextual para áreas laterais, configurações e grupos de
destinos relacionados.

## Estrutura

```html
<nav class="fs-menu" aria-label="Configurações">
  <p class="fs-menu-label">Conta</p>
  <ul class="fs-menu-list">
    <li><a href="/perfil" aria-current="page">Perfil</a></li>
    <li><a href="/seguranca">Segurança</a></li>
  </ul>
</nav>
```

Use links para navegação. Para ações locais, prefira Button ou Dropdown. O
menu suporta listas aninhadas, itens ativos e itens indisponíveis.

## Classes

| Classe | Uso |
|---|---|
| `.fs-menu` | contêiner do menu vertical; use `nav` ou `aside` com nome acessível |
| `.fs-menu-label` | título visual de uma seção |
| `.fs-menu-list` | lista de links; pode conter `ul` aninhado |
| `.fs-menu-bordered` | superfície com borda e sombra discreta |
| `.fs-menu-compact` | menor densidade vertical |
| `.is-active` | destino ativo quando não houver `aria-current` |

## Estados

O menu suporta destino ativo, níveis aninhados, densidade compacta, superfície
com borda e links temporariamente indisponíveis.

## A11y

- Use `aria-label` ou `aria-labelledby` no `nav`/`aside`.
- Use `aria-current="page"` no destino atual.
- Não comunique o estado apenas por cor.
- Para destinos disponíveis, mantenha links reais com `href` para navegação
  por teclado e contexto de leitor de tela.
- Use `aria-disabled="true"` apenas para um destino temporariamente
  indisponível e ofereça uma alternativa quando necessário.

Menu é um componente **100% CSS**, sem guarda JavaScript de ativação.
`aria-disabled="true"` comunica o estado, e `.is-disabled`/ARIA aplicam a
aparência e `pointer-events: none`; isso **não cancela a ativação por teclado**
de um link que ainda tem `href`, nem chamadas programáticas da aplicação.
Para um destino indisponível sem comportamento, use texto sem `href` (como na
fixture `compact-nested` do catálogo). Se a aplicação precisar manter um link
focável, ela deve cancelar explicitamente sua ativação enquanto indisponível.
Para ações, prefira um `<button disabled>` nativo. Nenhuma dessas opções
substitui autorização ou validação de regras no backend.


## Anatomia e escolha de cenário

Menu apresenta uma navegação vertical que permanece visível, como a lista de seções de uma área de configurações. A pessoa pode percorrer os destinos sem abrir uma camada flutuante. Isso o distingue de Dropdown e Nested Menu, cujos controladores gerenciam abertura, fechamento e foco. Aqui, a hierarquia é a do documento: um nav identificado contém títulos visuais e listas de links, e o navegador executa a navegação para cada href.

Use o componente quando a organização por grupos ajudar a localizar páginas relacionadas. Para um conjunto pequeno de ações sobre um registro, uma barra de botões costuma comunicar melhor a diferença entre fazer algo e ir a algum lugar. O SCSS também estiliza botões dentro da lista, mas essa possibilidade visual não instala handlers nem transforma automaticamente uma navegação em um menu de comandos. Decida primeiro a finalidade de cada item e escolha a semântica correspondente.

A lista aninhada deve ficar dentro do li ao qual pertence. O recuo e a borda lateral mostram o próximo nível, mas não há controle de expansão: todos os níveis presentes continuam exibidos. Se a hierarquia se tornar profunda, avalie reorganizar destinos ou usar outro componente com contrato de árvore. Acrescentar aria-expanded a um link não cria o comportamento de recolher seus filhos, e adicionar data-fs menu não inicializa um controlador inexistente.

O rótulo `.fs-menu-label` é um título visual de grupo. No exemplo ele é um parágrafo, não um heading nem o nome acessível automático da navegação. Se o contexto pedir títulos de seção, use uma hierarquia de headings coerente. Para nomear o nav a partir de um texto visível, dê um ID ao título e use aria-labelledby. Não suponha que a proximidade de um rótulo visual produza essa associação por conta própria.

## Variações e densidade

A variante bordered fornece superfície, borda, arredondamento e sombra discreta. Ela é útil para separar o bloco de uma área de conteúdo próxima, mas não deve ser confundida com um painel flutuante. A variante compact reduz padding dos itens; não elimina a largura mínima do contêiner nem a altura mínima dos links e botões. Verifique com textos reais se o ganho de densidade compensa a redução de espaço entre destinos.

Listas internas recebem recuo pelo token `--fs-menu-nested-indent`, cujo padrão é 0.875rem. A apresentação não desenha conectores semânticos nem identifica um item pai selecionado automaticamente quando uma página filha estiver ativa. O aplicativo deve decidir se só o destino exato recebe aria-current ou se o grupo ganha outro tratamento visual. Evite declarar várias páginas atuais na mesma lista para obter apenas uma cor de destaque.

## Estados e integração com rotas

O estado ativo pode ser indicado por `.is-active` ou por `aria-current="page"`. Para navegação real, prefira o segundo porque comunica a localização, além de acionar a aparência. Em renderização no servidor, gere esse atributo a partir da rota atual. Em um roteador cliente, atualize-o ao concluir a navegação e remova-o dos itens anteriores. O framework não compara URLs, não escuta popstate e não persiste a seleção.

Os destinos do exemplo, `/perfil` e `/seguranca`, representam rotas que o aplicativo deve implementar. Links mantêm comportamentos nativos úteis, como abrir em nova aba, copiar endereço e mostrar o destino na barra de estado. Não substitua todos por href vazio ou cerquilha para depois simular navegação sem explicar essa integração. Se a rota ainda não existe, apresente a indisponibilidade como informação, não como um destino funcional.

Em listas dinâmicas, gere textos como conteúdo textual, não como HTML arbitrário de dados externos. Menu não sanitiza rótulos ou URLs. Também não verifica permissões: ocultar um link pode reduzir ruído, mas o acesso direto à rota continua dependendo da autorização na camada apropriada. Para uma área parcialmente disponível, explique por que um item está bloqueado e como obter acesso, quando essa informação fizer sentido.

## API JS e ciclo de vida

Não existe classe Menu exportada, getInstance, evento de seleção próprio ou auto-init deste componente. A implementação é CSS. Para observar navegação ou executar uma ação local, use os eventos nativos do elemento e o ciclo de vida do roteador. Se a aplicação adicionar listeners, ela deve removê-los ao desmontar o bloco. Não há método dispose do Menu que possa conhecer ou limpar esses handlers.

Essa ausência de controlador é uma característica útil para navegação renderizada no servidor: o HTML já é funcional antes do JavaScript do aplicativo. Um leitor pode seguir Perfil sem esperar inicialização. A estilização também não altera a ordem de Tab dos links habilitados. Não introduza tabindex positivo para imitar um menu de desktop, porque isso interfere na ordem do documento e não é requisito deste padrão de navegação.

## A11y, tokens e revisão

O nome Menu não implica role menu. Uma lista de destinos normalmente deve conservar nav, ul, li e links, com navegação por Tab. Se o mesmo documento contém uma navegação principal e uma de configurações, dê nomes distintos para diferenciá-las. Textos de link devem fazer sentido no contexto e, quando possível, fora dele; ícones decorativos não precisam repetir o nome já apresentado em texto.

Os tokens locais são `--fs-menu-item-padding-block`, `--fs-menu-item-padding-inline`, `--fs-menu-item-radius`, `--fs-menu-label-color` e `--fs-menu-nested-indent`. O destaque ativo usa a cor de texto primária de alerta e a superfície primária sutil. A aparência hover/focus usa a superfície subtle; revise se a distinção permanece perceptível no tema escolhido. JSDOM pode conferir links e atributos, mas não comprova contraste ou o resultado visual do foco.

## Tokens

Além dos tokens locais acima, o SCSS consome `--fs-color-text`, `--fs-color-muted`, `--fs-color-subtle`, `--fs-color-surface`, `--fs-color-border-default`, `--fs-border-width`, `--fs-radius-sm`, `--fs-radius-md`, `--fs-shadow-sm`, `--fs-alert-primary-text` e `--fs-color-primary-bg-subtle`. Personalize o bloco em escopo local quando a mudança for exclusiva de uma área, sem alterar o significado de estados ativos e indisponíveis.

## Exemplo

A estrutura completa no início da página implementa navegação por links reais, desde que o aplicativo forneça as duas rotas. Para testar, confira a navegação por teclado, o destaque da página atual, um título longo e a leitura da lista aninhada. Não é necessário carregar JavaScript do Fokus para esse exemplo.
