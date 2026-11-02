> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Collapse

Expande/recolhe um painel com transição de altura animada — primitivo
usado internamente por [Accordion](accordion.md); use direto quando quiser
só um "mostrar mais" sem a semântica de grupo do Accordion.

## Visão geral

```html
<button type="button" class="fs-btn" data-fs="collapse" data-fs-target="#detalhes">
  Ver detalhes
</button>
<div class="fs-collapse" id="detalhes">
  Conteúdo que expande/recolhe.
</div>
```

## Anatomia

Gatilho (`data-fs="collapse"` + `data-fs-target`) + `.fs-collapse`
(precisa de `overflow: hidden`, já incluso na classe — não remova via CSS
próprio, quebra a animação de altura).

## Variações

Nenhuma — sem tamanho/cor; é um comportamento, não um estilo visual
próprio (o conteúdo interno usa suas próprias classes).

## Estados

Estado inicial definido por `aria-expanded` no gatilho: `"true"` começa
aberto, ausente ou `"false"` começa fechado.

```html
<button type="button" class="fs-btn" data-fs="collapse" data-fs-target="#painel" aria-expanded="true">
  Recolher
</button>
```

## A11y

`aria-controls` é associado ao ID do painel na construção. `aria-expanded`
é inicializado nessa mesma etapa e atualizado quando `show()`/`hide()` mudam o
estado. Alterar posteriormente o ID do painel não atualiza `aria-controls`
automaticamente.
[`prefers-reduced-motion: reduce`](../guides/accessibility.md#prefers-reduced-motion)
pula a animação e aplica o estado final direto.

## API JS

Auto-init via `data-fs="collapse"` **no gatilho**. `Collapse.getInstance(triggerEl)`.

| Método | Descrição |
|---|---|
| `show()` | Expande com animação de altura. |
| `hide()` | Recolhe com animação de altura. |
| `toggle()` | Alterna (é o que o clique no gatilho já faz). |
| `dispose()` | Remove o listener de clique e desregistra a instância. |

| Evento (no gatilho) | Cancelável | Quando |
|---|---|---|
| `fs:collapse:shown` | Não | Depois que a animação de expandir termina. |
| `fs:collapse:hidden` | Não | Depois que a animação de recolher termina. |

## Tokens

Nenhum próprio — o conteúdo interno usa suas próprias cores/espaçamento.

## Exemplo

```html
<button type="button" class="fs-btn fs-btn-outline-secondary" data-fs="collapse" data-fs-target="#mais-info">
  Mais informações
</button>
<div class="fs-collapse" id="mais-info">
  <p class="fs-u-mt-2">Texto adicional que só aparece quando expandido.</p>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-7e288a07e468).


## Quando usar um painel independente

Collapse serve para revelar um bloco adicional associado a um controle explícito: detalhes de entrega, critérios de uma pesquisa ou uma explicação longa que não precisa ocupar espaço inicialmente. Seu contrato é deliberadamente pequeno. Ele anima a altura de um elemento existente e sincroniza a expansão no gatilho. Não cria uma janela, não bloqueia a página e não organiza múltiplos painéis como um grupo exclusivo. Quando a pessoa precisa comparar respostas, Accordion pode ser mais apropriado; quando precisa executar uma tarefa em uma camada modal, o padrão de foco é outro e deve ser tratado por Modal.

A decisão de ocultar conteúdo afeta o fluxo de leitura. Informações indispensáveis, erros que impedem o envio de um formulário e instruções necessárias antes de preencher campos não devem depender de uma descoberta acidental. Use um rótulo que descreva o conteúdo, como “Detalhes da entrega”, em vez de apenas “Clique aqui”. Abrir não significa validar, concluir, autorizar ou carregar esses detalhes. Essas operações continuam sob responsabilidade do aplicativo, mesmo quando são iniciadas pelo mesmo gesto.

## Relação entre gatilho e painel

O elemento que recebe `data-fs="collapse"` é o gatilho, não o painel. `data-fs-target` é um seletor consultado no documento; portanto, precisa ser válido e encontrar o painel pretendido. Um ID exclusivo torna essa relação fácil de inspecionar. Sem alvo correspondente, o construtor lança um erro em vez de inventar um painel vazio. Evite seletores que encontrem várias instâncias e dependa de um identificador distinto para cada detalhe recolhível.

A classe `.fs-collapse` fornece overflow oculto para a transição, mas não contém padding, borda, cor ou decoração de cartão. Coloque esses estilos no conteúdo interno. Assim, uma mudança visual não precisa interferir com a altura animada do contêiner. Se o painel contiver imagens, fontes ou conteúdo inserido depois, sua geometria pode mudar durante a transição; confira o resultado com dados reais, não apenas com uma linha de texto fixa.

O estado inicial é lido de `aria-expanded` no gatilho. Ausência ou qualquer texto diferente de `"true"` significa fechado. A inicialização escreve `aria-controls` com o ID do painel e normaliza o atributo de expansão. Não acrescente `hidden` manualmente a um painel que espera abrir pelo controlador: este módulo gerencia a exibição por estilos de altura/display e não implementa a mesma sincronização de `hidden` usada por Accordion. Evite duas fontes de visibilidade concorrentes na aplicação.

## API e integração manual

Em um projeto que resolva os subpaths do pacote com bundler, use `import { Collapse } from "fokus-styles/js/collapse.js"`. Execute a montagem após inserir o HTML. A consulta `Collapse.getInstance(trigger)` recebe o elemento do botão; se retornar undefined, `new Collapse(trigger)` cria a instância. Não há helper tipado `getOrCreateInstance` nesta classe. O bundle global oferece o mesmo construtor em `FokusStyles.Collapse`, desde que tenha sido carregado pelo aplicativo.

`show()` e `hide()` mudam imediatamente o estado interno e `aria-expanded`, mas o evento específico indica o término da transição. Esses métodos não retornam uma Promise pública para aguardar a animação. Se precisar medir o conteúdo após abrir, registre `fs:collapse:shown` antes de solicitar a abertura e remova esse listener ao desmontar. Chamadas que já correspondem ao estado atual não iniciam uma nova mudança. Uma animação substituída ou cancelada pelo descarte não representa uma expansão concluída.

`toggle()` escolhe a operação a partir do estado da instância; ele não reinterpreta continuamente alterações arbitrárias feitas no atributo pela aplicação. Escrever `aria-expanded` sozinho não é uma alternativa aos métodos. Também não há uma coordenação automática entre dois gatilhos apontando para o mesmo painel: cada instância guarda seu próprio estado e seus próprios listeners. Prefira um controlador responsável por cada painel ou implemente explicitamente a sincronização dos controles adicionais.

Para montagem e desmontagem previsíveis, mantenha a referência à instância e aos handlers próprios. Chame `dispose()` antes de remover o botão e o painel; ele cancela a transição e remove o listener de clique, mas não devolve todos os atributos e estilos aos valores originais. Não remova indiscriminadamente o atributo style de um painel que contém estilos legítimos da aplicação. Se o componente reaparecer, prepare seu estado inicial coerente e crie uma nova instância.

## A11y, foco e limites do comportamento

Use um botão nativo com `type="button"`, particularmente dentro de formulários. A ativação nativa atende Enter e Espaço sem criar um handler de teclado paralelo. O listener de clique de Collapse não chama `preventDefault()`: usar um link pode produzir navegação além da expansão, enquanto um botão sem type dentro de form pode submeter o formulário. O atributo `aria-controls` relaciona os elementos, mas não substitui um nome acessível que explique o que será revelado.

O controlador não move foco para o painel nem o devolve ao gatilho ao fechar. Isso costuma ser adequado para uma pequena explicação logo após o botão, mas exige atenção quando a aplicação fecha programaticamente um painel contendo o foco. Nesse caso, escolha um destino de foco visível antes de ocultar o conteúdo. Não espere Escape, focus trap, navegação por setas ou guarda universal de disabled: tais mecanismos não fazem parte deste módulo.

A redução de movimento é tratada pelo mecanismo compartilhado de transição. Verifique tanto a abertura quanto o fechamento com essa preferência ativa, inclusive depois de ações rápidas repetidas. O estilo CSS isolado não inicializa o estado recolhido do exemplo: se não carregar JavaScript, o conteúdo continua como HTML normal. Defina conscientemente essa experiência sem script e não confunda disponibilidade do conteúdo com falha de segurança. Dados protegidos não devem estar no DOM apenas porque começam visualmente escondidos.

## Exemplo de montagem com descarte

O HTML da seção Exemplo usa `#mais-info` e seu botão correspondente. O módulo abaixo é uma entrada do bundler, executada depois desse HTML; a função exportada deve ser chamada pelo ciclo de vida da página ao desmontar.

```js
import { Collapse } from "fokus-styles/js/collapse.js";
const trigger = document.querySelector('[data-fs-target="#mais-info"]');
if (!trigger) throw new Error("Gatilho de detalhes ausente");
const collapse = Collapse.getInstance(trigger) ?? new Collapse(trigger);
export function destroyDetails() {
  collapse.dispose();
}
```

Esse exemplo não instala listeners adicionais e, por isso, seu descarte só precisa remover o controlador. Se adicionar analytics, carregamento remoto ou tratamento dos eventos de transição, guarde as funções usadas em `addEventListener` para removê-las também. O descarte do framework não conhece o código de integração da aplicação.
