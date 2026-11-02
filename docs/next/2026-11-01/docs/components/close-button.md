> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Close button

## Visão geral

Close button fornece uma ação compacta de dispensa para uma região que já está visível. É útil em um aviso local, painel auxiliar ou conteúdo que a pessoa pode retirar da tela sem navegar para outra página. O componente não sabe se fechar significa ocultar, remover, cancelar uma operação ou descartar alterações; essa decisão é da região proprietária.

Não trate o “×” como confirmação de exclusão. Fechar uma mensagem de sucesso geralmente só muda sua visibilidade, enquanto fechar um editor pode exigir confirmação por alterações não salvas. A mesma aparência pode participar dos dois cenários, mas a política de dados deve permanecer explícita no aplicativo. Se o custo de fechar for relevante, explique o resultado e preserve uma forma de recuperação.

`.fs-close` é um botão compacto, com um “×” gerado por `::before`.
É distinto de `.fs-btn-close`, documentado em [Button](button.md).
Não misture as duas classes, nem insira outro “×” como texto.

## Anatomia e exemplo

O elemento é um botão nativo vazio, com o símbolo produzido pelo CSS. O nome acessível vem de `aria-label`, não do caractere visual. Por isso o texto “Fechar aviso” é mais útil do que “X”: descreve a ação e seu alvo. O atributo `aria-controls` cria uma relação identificável entre controle e região, mas não procura nem oculta o alvo sozinho.

O snippet funciona depois de o HTML existir no documento. Ele mantém a região no DOM e aplica `hidden`, em vez de removê-la; a aplicação pode reexibi-la mais tarde. Para uma região descartável, remover o nó seria outra política, não uma opção do componente. Se o controle estiver focado na hora da dispensa, encaminhe o foco para um elemento ainda visível antes de abandonar a região.

```html
<section id="aviso-local" aria-label="Aviso">
  <p>As alterações foram salvas.</p>
  <button type="button" class="fs-close" aria-label="Fechar aviso" aria-controls="aviso-local"></button>
</section>
```

A aparência não fecha nada automaticamente. Para este exemplo isolado, o
aplicativo pode associar a ação abaixo. Execute depois de criar o HTML:

```js
const aviso = document.querySelector('#aviso-local');
const fechar = aviso.querySelector('.fs-close');
fechar.addEventListener('click', () => { aviso.hidden = true; });
```

Em diálogos/toasts, use o contrato de dismiss do componente proprietário, não
este handler genérico. Ao ocultar conteúdo que contém foco, retorne o foco a
um controle lógico do aplicativo (por exemplo, o botão que abriu o painel).

## Estados

A opacidade reduzida no repouso é decorativa e não indica disabled. Um botão habilitado deve continuar operável mesmo quando parece discreto. Já `disabled` usa o comportamento nativo para bloquear a ação, mas este módulo não fornece um tratamento visual específico que o diferencie do repouso; a composição deve tornar a indisponibilidade compreensível se realmente precisar desse estado.

O hover aumenta opacidade e aplica superfície sutil. O foco visível usa contorno, independente de hover, para que a localização do controle não dependa do ponteiro. Como o botão herda a cor, verifique sua legibilidade em cabeçalhos coloridos e fundos personalizados. A existência de tokens de foco não comprova contraste em toda superfície possível.

Base: 2rem × 2rem, cor herdada, opacidade .72. Hover: opacidade 1 e fundo
subtle. `:focus-visible` desenha contorno. Use `disabled` em `<button>` para
bloquear sua ativação nativa; `.fs-close` não define aparência disabled própria.

## A11y

Um botão sem texto visível precisa continuar identificável para quem usa tecnologia assistiva. O nome deve informar qual região será fechada quando houver vários controles semelhantes na tela. Não acrescente `tabindex="-1"` para esconder o botão do teclado: isso remove um caminho de dispensa sem criar alternativa.

A dimensão visual de 2rem deve ser avaliada com os requisitos de alvo de toque do produto, espaçamento dos vizinhos e zoom. Nenhum teste DOM comprova o tamanho físico ou a facilidade de toque. A navegação por Tab, o acionamento por Enter/Espaço e o destino do foco depois da dispensa precisam ser verificados no fluxo completo, inclusive quando a região reaparece.

Nome acessível é obrigatório: `aria-label` descreve o que será fechado.
`aria-controls` identifica o alvo, mas não implementa a ação. Use `type="button"`
para não enviar formulários. Verifique alvo de toque e foco em contexto real.

## Tokens e limites

`--fs-color-subtle`, `--fs-focus-width`, `--fs-focus-color` e
`--fs-focus-offset`. Não há opções, instância ou eventos JS próprios.

## Verificação

O teste `component-docs-contract.test.js` executa o handler acima sobre o
HTML da página e confere o alvo ocultado; também confere nome e type do botão.
Teste manualmente retorno de foco na composição final.

## Variações

Esta implementação não declara modificadores oficiais de tamanho ou cor para `.fs-close`. Ela mede 2rem por 2rem, usa fundo transparente no repouso e herda a cor do contexto. Alterar o tamanho da fonte raiz afeta sua dimensão em rem. Não acrescente sufixos como `fs-close-sm` esperando uma regra que não existe.

A alternativa `.fs-btn-close` tem outra implementação e outras dimensões, apesar de também representar fechamento. Escolha a classe exigida pelo componente que recebe o controle. Misturar as duas soma regras concorrentes e pode produzir símbolos duplicados ou dimensões inesperadas. O desenho circular de `.fs-close` é o que o SCSS desta versão efetivamente declara; não deduza sua forma de uma diretriz visual geral.

## API JS

Não há classe CloseButton, inicialização declarativa ou evento `fs:close:*`. O handler anterior é código da aplicação. Se a região for montada repetidamente em uma página de longa duração, mantenha uma referência ao handler para removê-lo com `removeEventListener`, ou use o mecanismo de cleanup do framework de aplicação. Não crie uma nova inscrição em cada render sobre o mesmo botão.

O exemplo mínimo não é um substituto para `hide()`/dismiss de Modal, Toast ou outro proprietário. Esses componentes podem precisar atualizar registro de overlays, classes, eventos e foco. Ocultar diretamente o contêiner por fora pode deixar seu estado JavaScript inconsistente, mesmo que a tela pareça fechada.

## Exemplo

O exemplo da seção Anatomia demonstra apenas ocultação local e é executável após a marcação. Para levá-lo a uma tela real, identifique um destino de foco permanente e conecte a dispensa ao ciclo de vida da região. O retorno de foco deve acontecer apenas quando o foco estava dentro da região encerrada; não roube o foco de outra tarefa que a pessoa já iniciou.
