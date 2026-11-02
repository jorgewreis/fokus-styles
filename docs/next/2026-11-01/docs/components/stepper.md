> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Stepper

Wizard de múltiplos passos — cabeçalho com indicadores de progresso, painéis
de conteúdo opcionais, navegação linear ou livre.

## Visão geral

```html
<div class="fs-stepper" data-fs="stepper">
  <ol class="fs-stepper-header">
    <li class="fs-step fs-step-active">
      <span class="fs-step-indicator">1</span>
      <span class="fs-step-label">Conta</span>
    </li>
    <li class="fs-step">
      <span class="fs-step-indicator">2</span>
      <span class="fs-step-label">Perfil</span>
    </li>
    <li class="fs-step">
      <span class="fs-step-indicator">3</span>
      <span class="fs-step-label">Revisão</span>
    </li>
  </ol>
  <div class="fs-stepper-content">
    <div class="fs-step-panel is-active">Passo 1: dados da conta.</div>
    <div class="fs-step-panel">Passo 2: dados do perfil.</div>
    <div class="fs-step-panel">Passo 3: revise e confirme.</div>
  </div>
  <div class="fs-stepper-actions">
    <button type="button" class="fs-btn" data-stepper="prev">Voltar</button>
    <button type="button" class="fs-btn fs-btn-primary" data-stepper="next">Avançar</button>
  </div>
</div>
```

## Anatomia

`.fs-stepper` (`data-fs="stepper"`) > `.fs-stepper-header` (`<ol>`) >
`.fs-step` (um por passo) > `.fs-step-indicator` (número/check) +
`.fs-step-label` + `.fs-step-description` (opcional) — mais, opcionais:
`.fs-stepper-content` > `.fs-step-panel` (um por passo, na mesma ordem) e
`.fs-stepper-actions` com botões `data-stepper="prev"`/`"next"`.

Um `.fs-step` pode apontar pra um painel específico via `data-fs-target`
(seletor) em vez de depender da ordem posicional.

## Variações

`.fs-stepper-vertical` no `.fs-stepper` — cabeçalho em coluna, cada passo
com label/descrição ao lado do indicador em vez de embaixo.

## Estados

Cada `.fs-step` recebe classes sincronizadas pelo JS; erro/clickable podem
coexistir com estado ativo ou concluído:

| Classe | Significado |
|---|---|
| (nenhuma) | Pendente — ainda não alcançado. |
| `.fs-step-active` | Passo atual. |
| `.fs-step-completed` | Já concluído (indicador vira um check). |
| `.fs-step-error` | Marcado com erro via `setError()` — não muda automaticamente. |
| `.fs-step-clickable` | Aplicada automaticamente aos passos navegáveis pelo cabeçalho. |

**Modo linear** (padrão, `data-linear` ausente ou `"true"`): só permite
voltar clicando em passos já concluídos, não pular pra frente. `data-linear="false"` libera clicar em qualquer passo do cabeçalho a
qualquer momento.

## A11y

Cada `.fs-step` tem `role="listitem"`, `tabindex` (só os clicáveis
recebem `0`) e `aria-current="step"` no passo ativo — navegável e ativável
por teclado (`Enter`/`Space`) quando clicável.

## API JS

Auto-init via `data-fs="stepper"`. `Stepper.getInstance(el)`.

| Método | Descrição |
|---|---|
| `next()` | Avança um passo; no último, chama `complete()`. |
| `prev()` | Volta um passo. |
| `goTo(index)` | Vai direto pro passo `index` (respeitando o modo linear se disparado pelo cabeçalho — via método, não restringido pelo modo linear). |
| `setError(index, hasError = true)` | Marca/desmarca `.fs-step-error` num passo específico. |
| `complete()` | Marca o wizard como concluído (todos os passos ficam `.fs-step-completed`). |
| `dispose()` | Remove todos os listeners e desregistra a instância. |

| Evento | Cancelável | Quando |
|---|---|---|
| `fs:stepper:beforechange` | Sim | Antes de trocar de passo (ou concluir) — `event.detail` traz `{ from, to }`; `preventDefault()` bloqueia a mudança (útil pra validar o passo atual antes de avançar). |
| `fs:stepper:changed` | Não | Depois de trocar de passo. |
| `fs:stepper:completed` | Não | Depois de `complete()`. |

Este módulo acompanha a marcação da Visão geral já montada, em aplicação com
bundler e CSS carregado. A regra demonstrada valida os controles nativos do
painel atual somente ao avançar ou concluir; sem campos, como no HTML mínimo,
a etapa passa. Ela não implementa validação de negócio ou consulta remota.
O handler é registrado antes da montagem e removido pelo teardown nomeado.

```js
import { Stepper } from 'fokus-styles/js/stepper.js';
const stepperEl = document.querySelector('[data-fs="stepper"]');
if (!stepperEl) throw new Error('Stepper ausente');
function validarEtapa(event) {
  const { from, to, completing } = event.detail;
  if (!completing && to <= from) return;
  const painel = stepperEl.querySelectorAll('.fs-step-panel')[from];
  const campos = painel?.querySelectorAll('input, select, textarea') ?? [];
  const invalido = [...campos].find(campo => !campo.checkValidity());
  if (invalido) {
    event.preventDefault();
    invalido.reportValidity();
  }
}
stepperEl.addEventListener('fs:stepper:beforechange', validarEtapa);
const stepper = Stepper.getInstance(stepperEl) ?? new Stepper(stepperEl);
export function desmontarStepper() {
  stepperEl.removeEventListener('fs:stepper:beforechange', validarEtapa);
  stepper.dispose();
}
```

A associação por posição desse handler corresponde ao HTML demonstrado. Se usar
`data-fs-target` nos passos, adapte também a resolução do painel na validação.
A aplicação chama `desmontarStepper()` apenas ao encerrar essa região.

## Tokens

`--fs-color-border`, `--fs-color-primary` (ativo/concluído),
`--fs-color-danger` (erro), `--fs-color-muted`, `--fs-color-text`.

## Exemplo

Ver acima (Visão geral) — mockup completo com validação por passo em
[`mockup/navigation-disclosure.html#stepper`](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-3e829de88779).

## Limites de estado e entrada

SetError é visual: não impede next/goTo/complete. Valide a etapa em
fs:stepper:beforechange e cancele explicitamente quando necessário. O componente
não submete formulários nem implementa autorização de ações.

Forneça índices inteiros a `goTo(index)`. Inteiros fora da faixa são
limitados às extremidades; frações, NaN, infinitos e valores não numéricos
são rejeitados com `false`, sem alterar estado/DOM nem emitir eventos. O modo linear
restringe o cabeçalho, não chamadas programáticas goTo. Data-linear é lido na
construção; não é uma opção reativa. Concluído é calculado pela posição relativa
ao passo atual (ou finished), não um histórico persistente de etapas visitadas.
Voltar pode retirar a marca de concluído das etapas posteriores.

`next()`, `prev()`, `goTo()` e `complete()` retornam boolean: `true` quando
a operação é aplicada, `false` quando cancelada, quando o índice é inválido
ou quando a navegação não muda o passo de um wizard ainda não concluído.

`complete()` pode ser chamado em qualquer passo e não é idempotente: cada
chamada aceita emite `fs:stepper:beforechange` (com `completing: true`) e
`fs:stepper:completed`, mesmo após a conclusão. Não altera o índice atual.
Proteja efeitos externos contra execução duplicada no aplicativo.


## Escolha de fluxo e significado do progresso

Stepper organiza uma tarefa em etapas reconhecíveis, com um indicador de posição e, opcionalmente, painéis associados. É útil quando a pessoa precisa entender a sequência de um cadastro ou revisar informações antes de confirmar uma operação. A divisão deve refletir decisões ou conjuntos de dados coerentes, não apenas reduzir a altura de um formulário. Uma etapa curta demais cria navegação desnecessária; uma etapa extensa demais pode esconder a estrutura que o indicador deveria esclarecer.

O componente controla apresentação e mudança de posição. Ele não sabe se o usuário salvou um cadastro, se uma API aceitou dados ou se uma etapa está juridicamente concluída. A classe completed é calculada a partir da posição atual ou do estado finished, não de um histórico de tarefas comprovadas. Se o processo possui marcos persistentes, mantenha-os no modelo do aplicativo e diferencie visualmente essa informação da simples posição dentro do wizard.

Modo linear restringe os cliques no cabeçalho para impedir saltos à frente. Isso não é validação e não restringe goTo programático. Uma aplicação pode usar goTo para restaurar uma etapa conhecida ou conduzir o usuário a um problema específico. Se uma regra exige pré-requisitos, aplique-a antes da mudança ou no evento cancelável, independentemente de como a navegação foi iniciada. Não confie no fato de um passo não ser clicável como proteção de acesso.

## Anatomia, painéis e estado inicial

O cabeçalho usa uma lista ordenada porque a sequência tem significado. Cada fs-step contém o indicador e o rótulo; a descrição opcional ajuda quando o título sozinho não explica a tarefa. Na variante vertical, fs-step-content pode agrupar rótulo e descrição ao lado do círculo. Os conectores e o check de conclusão são apresentação CSS, não botões ou provas de que dados foram persistidos.

Os painéis são associados por posição ou por data-fs-target consultado dentro da raiz. Mantenha a mesma ordem entre passos e painéis quando não usar alvos explícitos. Um seletor inválido ou que aponte para conteúdo inesperado não é corrigido automaticamente. O controlador admite ausência de painéis, permitindo um indicador de fluxo, mas isso não o torna um roteador de páginas: a aplicação precisa executar qualquer navegação externa.

A primeira classe fs-step-active encontrada define o índice inicial; se não houver uma, o índice zero é usado. Forneça ao menos um passo válido e evite depender de comportamento de uma raiz vazia. Na renderização, as classes dos passos são sincronizadas, e apenas o painel do índice atual recebe is-active. Os painéis não recebem automaticamente papéis ARIA, nomes ou hidden; sua visibilidade depende do CSS de fs-step-panel.

## Validação antes de avançar

Fs:stepper:beforechange é o ponto público de veto síncrono. Seu detail contém from e to e, na conclusão, completing true. Chamar preventDefault durante o despacho faz a operação retornar false. Uma Promise retornada por um listener não é aguardada: para validar remotamente, cancele a mudança imediata, inicie a verificação e só depois solicite a transição aprovada, com uma guarda que evite repetir indefinidamente a mesma validação.

SetError altera a aparência de um passo e não cancela nada. Use-o junto de uma mensagem textual explicando o problema e de uma regra efetiva no beforechange. Não marque o passo em vermelho e permita avançar supondo que o componente vai inferir a proibição. Também decida se voltar deve exigir a mesma validação que avançar; muitos fluxos precisam permitir correções sem aprisionar a pessoa na etapa atual.

Complete pode ser chamado em qualquer etapa e não envia um formulário. O evento completed significa que o controlador aceitou a apresentação de conclusão, não que um pedido foi criado no servidor. Se esse evento dispara uma operação externa, proteja contra duplicação, porque chamadas sucessivas aceitas de complete emitem novamente os eventos. Uma estratégia mais clara pode ser executar o envio pela aplicação e marcar a conclusão apenas após receber confirmação válida.

## API, índices e eventos

Os índices de goTo e setError são baseados em zero. GoTo exige inteiro; frações, valores não numéricos, NaN e infinitos não são convertidos em páginas válidas. Inteiros fora da faixa são limitados às extremidades. Uma tentativa de ir ao índice atual, enquanto o wizard ainda não está finished, retorna false sem anunciar uma mudança. Depois da conclusão, uma navegação aceita pode reabrir o fluxo, removendo o estado finished.

Next, prev, goTo e complete retornam boolean, não Promise. O evento changed contém from e to e não é cancelável. Completed não contém um resultado de backend nem um conjunto de valores de formulário. Não use campos internos como current ou finished como uma API tipada que não está declarada: mantenha o estado necessário na aplicação a partir do HTML inicial e dos eventos públicos. A classe oferece getInstance, mas não getOrCreateInstance.

Para um projeto com bundler, importe Stepper de `fokus-styles/js/stepper.js` e monte depois da estrutura HTML. Quando usar auto-init, consulte a instância antes de criar outra. Registre o beforechange antes de permitir que o usuário avance e remova esse listener no descarte. A ausência de um listener inicial pode deixar uma janela em que o botão avança sem a regra da aplicação, especialmente em telas que carregam código por partes.

## A11y e foco entre etapas

O controlador atribui role listitem aos passos e tabindex zero aos que podem ser acionados pelo cabeçalho. Enter e Espaço chamam a navegação quando ela é permitida. Isso não equivale a uma lista de tabs: não há role tablist, setas de navegação ou associação automática entre cada indicador e seu painel. Não misture esses papéis apenas para reutilizar exemplos de Tabs, porque o padrão de progresso é outro.

A mudança de passo não move foco para o título do painel nem para o primeiro campo. O botão Avançar pode continuar focado fora do painel, enquanto o conteúdo é substituído visualmente. A aplicação deve decidir um destino previsível quando necessário, especialmente após falhas de validação. Forneça um título reconhecível em cada etapa e mensagens de erro associadas aos campos, em vez de depender apenas do círculo colorido ou do aria-current do cabeçalho.

Voltar pode retirar a aparência de concluído de passos posteriores porque a classe reflete posição, não visitas acumuladas. Explique essa escolha ao projetar um fluxo em que a pessoa espera preservar “etapas feitas”. O check visual de conclusão usa uma imagem SVG embutida com traço branco; alterar apenas tokens de cores pode exigir revisão desse contraste. A variante vertical muda o desenho, não a política de navegação ou validação.

## Ciclo de vida e verificação

A construção coleta passos, painéis e botões de navegação. Não há refresh para adicionar etapas, substituir botões ou mudar data-linear reativamente. Se a sequência mudar, descarte, recomponha o HTML e remonte com um estado válido. Dispose remove os listeners registrados e o registro da instância, mas mantém classes, tabindex e atributos já escritos. Listeners de validação, requisições pendentes e efeitos de conclusão pertencem à aplicação.

Teste uma mudança aceita, um veto, retorno para etapa anterior, índice inválido, conclusão repetida e remontagem. Use dados reais para verificar se erros são anunciados e se o foco não fica em conteúdo invisível. A validação DOM desta documentação confirma as mudanças observadas no controlador, não o envio de dados, a qualidade do fluxo ou conformidade de acessibilidade em navegador.
