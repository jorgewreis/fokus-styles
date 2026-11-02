> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Empty State

Bloco padrão para listas/telas vazias ("nenhum resultado", "nada aqui
ainda") — 100% CSS.

## Visão geral

```html
<div class="fs-empty-state">
  <div class="fs-empty-state-icon" aria-hidden="true">
    <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
  </div>
  <h3 class="fs-empty-state-title">Nenhum resultado encontrado</h3>
  <p class="fs-empty-state-text">Tente ajustar os filtros ou buscar por outro termo.</p>
  <button type="button" class="fs-btn fs-btn-primary">Limpar filtros</button>
</div>
```

## Anatomia

`.fs-empty-state` (contêiner centralizado em coluna) > `.fs-empty-state-icon`
(slot vazio — ícone SVG, [`fokus-styles/icons`](../guides/icons.md) recomendado,
ou imagem/ilustração própria, sem variantes fixas de estado)
+ `.fs-empty-state-title` + `.fs-empty-state-text` (opcional) + ação
opcional (reusa [Button](button.md), não é parte do componente).

## Variações

Nenhuma — o componente é deliberadamente sem modificadores; a variação vem
do conteúdo que você põe dentro do slot de ícone.

## Estados

Nenhum — elemento estático.

## A11y

Se o Empty State substitui uma lista que normalmente teria itens (ex.:
resultado de busca), considere `aria-live="polite"` no contêiner pai se ele
aparece dinamicamente após uma ação do usuário (busca, filtro), para
leitores de tela anunciarem a mudança.

## API JS

Nenhuma — 100% CSS.

## Tokens

`--fs-color-subtle`/`--fs-color-muted` (ícone), `--fs-color-text` (título),
`--fs-color-muted` (texto).

## Exemplo

```html
<div class="fs-empty-state">
  <div class="fs-empty-state-icon" aria-hidden="true">
    <svg class="fs-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
  </div>
  <h3 class="fs-empty-state-title">Nada por aqui ainda</h3>
  <p class="fs-empty-state-text">Quando você criar seu primeiro projeto, ele aparece nesta lista.</p>
  <button type="button" class="fs-btn fs-btn-primary">Criar projeto</button>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-a9b8077203f0).

## Quando um resultado vazio merece uma explicação

Empty State organiza a mensagem exibida quando uma área não possui itens para mostrar. Isso pode significar que uma pessoa ainda não criou conteúdo, que os filtros não encontraram correspondências ou que uma coleção foi esvaziada. Esses casos exigem textos diferentes. “Crie seu primeiro projeto” não ajuda alguém que apenas selecionou um filtro restritivo; “Limpe os filtros” não resolve uma conta que não tem permissão para consultar os dados.

Também não confunda ausência de resultados com carregamento ou erro. Enquanto a requisição está pendente, ainda não se sabe se a lista está vazia. Se houve falha, informar que não existem itens pode induzir uma conclusão incorreta. A aplicação deve decidir qual estado mostrar a partir do resultado real da operação e apresentar orientação coerente, sem prometer que o componente detecta esses estados por conta própria.

### Conteúdo e hierarquia

O contêiner centraliza os filhos em coluna e aplica espaçamento generoso. O slot de ícone tem dimensões de 64px e formato circular; ele não escolhe um desenho segundo o título. O texto explicativo possui largura máxima de 360px, favorecendo frases curtas, mas esse limite não faz resumo automático nem valida a clareza da mensagem. Escolha um título que descreva a situação e um parágrafo que explique o próximo passo possível.

A ação é opcional e usa componentes normais de botão ou link. Se existe uma página para criar um projeto, um link real pode ser a integração mais simples. Se a ação modifica os filtros na mesma tela, um botão precisa de handler da aplicação. Um botão com a inscrição “Criar projeto” não cria nada apenas por estar dentro de Empty State. Os primeiros exemplos desta página demonstram estrutura visual; conecte as ações ao comportamento real antes de apresentá-las como fluxo funcional.

## Estados de apresentação e atualização

O CSS possui uma regra explícita para `.fs-empty-state[hidden]`, com `display: none`. Assim, o atributo `hidden` pode ocultar a composição sem ser sobreposto pelo `display: flex` da base. A regra não decide quando ocultar: isso pertence ao código que troca entre lista, carregamento, erro e vazio. Remova ou atualize também mensagens anteriores para evitar que resultados e ausência de resultados apareçam simultaneamente.

Em uma consulta dinâmica, mantenha um resumo de status separado da decoração. Uma região viva já presente pode informar “Nenhum documento corresponde aos filtros”, enquanto o bloco apresenta a explicação visual. Evite tornar todo um painel extenso uma região de anúncio repetitivo. Quando um filtro não remove o controle focado, normalmente não há necessidade de deslocar o foco apenas para informar que a busca ficou vazia.

### Acessibilidade e contexto

O nível do título deve acompanhar a página: a classe visual funciona em diferentes níveis de heading e não determina que sempre se use `h3`. Ícones decorativos devem ficar ocultos da árvore acessível, pois o título e a explicação já comunicam a situação. Se uma ilustração acrescenta informação essencial, forneça uma alternativa textual equivalente, sem depender de sua cor ou expressão.

O próximo passo precisa ser possível para aquela pessoa. Não exiba uma ação de criação para usuários sem essa permissão apenas porque ela aparece em um exemplo. Se a aplicação alternar a mensagem depois de remover o último item, verifique onde ficou o foco e ofereça um caminho de continuidade. O componente não restaura foco nem implementa autorização, histórico ou requisições.

### Limites e verificação

Não há opções JavaScript, eventos próprios, temporizador ou API para calcular a condição de vazio. Os tokens controlam as cores do slot e do texto, não o conteúdo da mensagem. Revise comprimentos de tradução, espaço vertical disponível e aparência em painéis pequenos: o padding de 48px por 24px pode ser generoso para áreas muito compactas. Teste separadamente primeiro uso, filtro sem correspondência, exclusão do último item, falha de rede e permissão insuficiente, mantendo textos diferentes onde a causa for diferente.
