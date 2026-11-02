> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Spinner & Progress

Dois indicadores visuais de carregamento: Spinner (indeterminado, giratório)
e Progress (determinado, barra linear). A apresentação funciona somente com
CSS. Spinner também oferece uma API JavaScript opcional para estado de
carregamento e eventos; Progress não tem controlador JavaScript próprio.

## Visão geral

```html
<div class="fs-spinner" role="status" aria-label="Carregando"></div>

<div class="fs-progress">
  <div class="fs-progress-bar" style="--fs-progress-value: 60;"></div>
</div>
```

## Anatomia

**Spinner**: um único elemento, `.fs-spinner` — um anel com trilho sutil e
segmento ativo, girando; sem marcação interna.

**Progress**: `.fs-progress` (trilho) > `.fs-progress-bar` (preenchimento
— a largura é controlada pela custom property `--fs-progress-value`, de
`0` a `100`, ou diretamente por `style="width: 60%"`).

## Variações

**Spinner**:
- Tamanho: `.fs-spinner-sm` (14px), `.fs-spinner-lg` (32px); sem sufixo =
  20px.
- Cor: `.fs-spinner-{primary|secondary|success|warning|danger|info}` — o
  spinner herda `currentColor` por padrão, então também responde a
  qualquer utilitário de cor de texto (`.fs-u-text-*`) se você não usar essas
  classes.

**Progress**:
- Altura: `.fs-progress-sm` (4px), `.fs-progress-lg` (16px); sem sufixo =
  8px.
- Cor da barra: `.fs-progress-bar-{cor}` — mesmas 6 cores de tema.
- `.fs-progress-bar-striped` — faixas diagonais; some com
  `.fs-progress-bar-animated` pra elas se moverem continuamente.
- Valor visual: use texto dentro de `.fs-progress-bar` apenas em
  `.fs-progress-lg`; nas barras compactas, exponha o valor por `aria-valuenow`
  e por um rótulo externo quando ele precisar ser visível.
- Rótulo externo: `.fs-progress-meta` contém o nome da operação e
  `.fs-progress-value` para percentual, contagem ou duração.
- Indeterminado: `.fs-progress-indeterminate` mostra deslocamento contínuo;
  omita `aria-valuenow` e use `aria-valuetext="Progresso indeterminado"`.
- Finalização: `.fs-progress-complete` aplica `success`; `.fs-progress-error`
  aplica `danger`. Use `.fs-progress-status` para uma confirmação ou ação de
  recuperação fora da barra.
- Meta: adicione `.fs-progress-marker` dentro do trilho e defina
  `--fs-progress-marker-value` (0–100). Explique a meta em texto externo.
- Início perceptível: `.fs-progress-minimum` força ao menos 4px visíveis,
  inclusive quando o valor é zero ou está ausente. Se zero deve aparecer
  vazio, a aplicação deve aplicar essa classe **somente quando o valor for
  maior que zero** e removê-la ao voltar a zero. `aria-valuenow` continua
  refletindo o valor real, não a largura mínima decorativa.
- Fluxo por etapas: componha [Stepper](stepper.md) para comunicar a etapa
  atual e uma `.fs-progress` para representar o avanço global. Não duplique
  ambos para o mesmo significado.

```html
<div class="fs-spinner fs-spinner-lg fs-spinner-primary"></div>

<div class="fs-progress fs-progress-lg">
  <div class="fs-progress-bar fs-progress-bar-success fs-progress-bar-striped fs-progress-bar-animated" style="--fs-progress-value: 40;"></div>
</div>
```

## Estados

A apresentação reflete o valor/presença que você controla: Spinner anima
enquanto visível; Progress usa `--fs-progress-value`. Classes complete/error
são estados visuais, não resultados de operações detectados automaticamente.
A API opcional do Spinner mantém `aria-busy` e `data-fs-loading`, sem gerir
sozinha a visibilidade ou o ciclo de uma requisição.

## A11y

- Spinner: adicione `role="status"` + `aria-label` (ou um texto
  visualmente oculto dentro) — não é automático, o elemento é puramente
  visual por padrão.
- Progress: para expor o valor a leitores de tela, adicione
  `role="progressbar"` + `aria-valuenow`/`aria-valuemin="0"`/
  `aria-valuemax="100"` **e um nome acessível** (`aria-label="Progresso: 60%"`
  ou `aria-labelledby` apontando pro rótulo visível) no `.fs-progress`
  (mantidos em sincronia com `--fs-progress-value` pela sua aplicação — o
  framework não injeta automaticamente). Sem nome acessível, não se identifica
  qual operação o indicador representa; o gate `axe` sinaliza essa ausência
  pela regra `aria-progressbar-name`.
- A animação de listras (`.fs-progress-bar-animated`), a barra indeterminada
  e a rotação do spinner desaceleram em `prefers-reduced-motion: reduce`, mas
  não param completamente para não parecerem travadas.
- Para o indeterminado, não informe um valor numérico inexistente. O movimento
  reduz a velocidade em `prefers-reduced-motion`, mas continua ativo para não
  parecer uma interface travada.

## API JS

**Progress:** sem API própria. Atualizar `--fs-progress-value` é responsabilidade
da aplicação (ex.: `barEl.style.setProperty("--fs-progress-value", "75")`).

**Spinner:** importe `Spinner` de `fokus-styles/js` ou use
`FokusStyles.Spinner` no bundle IIFE. `data-fs="spinner"` permite auto-init;
para elementos inseridos depois da inicialização, use `getOrCreateInstance`.
O construtor recebe um `HTMLElement`, sem objeto de opções.

| Método | Efeito |
| --- | --- |
| `new Spinner(element)` | Lê o estado inicial e registra a instância. Prefira reutilizar uma instância existente. |
| `Spinner.getInstance(element)` | Retorna a instância ou `undefined`. |
| `Spinner.getOrCreateInstance(element)` | Reutiliza a instância ou cria uma. |
| `start()` | Define estado carregando e emite `fs:loading:start`. |
| `stop()` | Define estado não carregando e emite `fs:loading:stop`. |
| `toggle()` | Alterna entre `start()` e `stop()`. |
| `dispose()` | Remove o registro da instância; não oculta nem restaura atributos do elemento. |

Na construção, `data-fs-loading` presente e diferente do texto exato `"false"`
inicia carregando (inclusive atributo vazio). Ausente ou `"false"` inicia
parado. O runtime grava `aria-busy="true"`/`"false"`; quando para, **remove**
`data-fs-loading`, não grava `"false"`. A propriedade `loading` existe no
runtime JavaScript, mas não está declarada em `spinner.d.ts`; em consumidores
TypeScript, consulte `aria-busy` ou mantenha o estado da aplicação, sem presumir
essa propriedade no contrato tipado.

Os dois eventos são emitidos no elemento, propagam (`bubbles: true`) e não são
canceláveis; não têm payload `detail`. Chamadas repetidas de `start()`/`stop()`
emitem o evento novamente. O construtor não emite esses eventos.

`start()`/`stop()` **não mostram/escondem** o indicador e não iniciam/cancelam
uma operação. O seletor CSS `.fs-spinner[data-fs-loading="false"]` oculta esse
markup estático, mas a inicialização JavaScript remove o atributo no estado
parado. Para visibilidade previsível, controle `hidden` em um contêiner sem a
classe visual, separadamente do estado lógico:

```html
<button type="button" id="iniciar-indicador">Iniciar exemplo</button>
<button type="button" id="parar-indicador">Concluir exemplo</button>
<span id="estado-indicador" data-fs="spinner" role="status" hidden>
  <span class="fs-spinner" aria-hidden="true"></span>
  Processando exemplo…
</span>
```

Execute após inserir o HTML:

```js
import { Spinner } from "fokus-styles/js";

const status = document.querySelector("#estado-indicador");
const indicador = Spinner.getOrCreateInstance(status);
const iniciar = document.querySelector("#iniciar-indicador");
const parar = document.querySelector("#parar-indicador");
function iniciarIndicador() {
  status.hidden = false;
  indicador.start();
}
function pararIndicador() {
  indicador.stop();
  status.hidden = true;
}
iniciar.addEventListener("click", iniciarIndicador);
parar.addEventListener("click", pararIndicador);

// Chame antes de remover ou remontar esta composição.
function desmontarIndicador() {
  iniciar.removeEventListener("click", iniciarIndicador);
  parar.removeEventListener("click", pararIndicador);
  indicador.stop();
  status.hidden = true;
  indicador.dispose();
}
```

Na desmontagem, chame `desmontarIndicador()` no ciclo de vida da aplicação.
A função remove os dois handlers nomeados, encerra o estado do exemplo, oculta
o wrapper e descarta o registro. A API do Spinner não controla esses handlers
externos; os botões deixam de alterar o indicador depois desse descarte.

## Tokens

Spinner: `--fs-color-{nome}` (variantes de cor). Progress:
`--fs-color-subtle` (trilho), `--fs-color-primary`/`--fs-color-{nome}`
(preenchimento), `--fs-progress-height`, `--fs-progress-track`,
`--fs-progress-bar-bg` e `--fs-progress-radius`. O Spinner também expõe
`--fs-spinner-size`, `--fs-spinner-stroke` e `--fs-spinner-duration` para
ajustes locais.

## Exemplo

```html
<div class="fs-spinner" role="status" aria-label="Carregando"></div>

<div class="fs-progress fs-progress-lg" role="progressbar" aria-label="Progresso do exemplo" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
  <div class="fs-progress-bar" style="--fs-progress-value: 60;">60%</div>
</div>

<div class="fs-progress-meta"><span>Upload de anexos</span><span class="fs-progress-value">3 de 8 arquivos</span></div>
<div class="fs-progress" role="progressbar" aria-label="Upload de anexos" aria-valuetext="3 de 8 arquivos enviados" aria-valuenow="38" aria-valuemin="0" aria-valuemax="100">
  <div class="fs-progress-bar" style="--fs-progress-value: 38"></div>
</div>

<div class="fs-progress fs-progress-indeterminate" role="progressbar" aria-label="Processando pagamento" aria-valuetext="Progresso indeterminado" aria-busy="true">
  <div class="fs-progress-bar"></div>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-c86df771acbf).

## Limites de valor

A aplicação deve fornecer valor finito entre 0 e 100 e manter CSS/ARIA coerentes.
O CSS calcula a largura a partir de --fs-progress-value, sem validar o número.
O indicador não mede upload/rede e os estados complete/error são visuais.

## Escolher o indicador pela informação disponível

Spinner comunica que existe uma atividade em andamento sem afirmar quanto falta. Progress comunica uma medida conhecida do trabalho concluído em relação a um total. Essa diferença deve vir do processo real, não da aparência desejada. Se uma API apenas responde ao final, inventar porcentagens com um timer cria uma promessa enganosa de avanço. Use o estado indeterminado enquanto não houver uma medida válida e migre para determinado quando o total estiver disponível.

Nem todo trabalho pode ser representado por bytes transferidos. Um envio pode ter duas fases: transferência e processamento no servidor. Chegar a 100% dos bytes enviados não significa que o arquivo foi validado ou aceito. Escreva o rótulo de forma precisa, por exemplo “Enviando arquivo” durante transferência e “Processando arquivo” depois, sem manter um falso percentual de conclusão global. O framework não descobre essas fases automaticamente.

## Nome, valor e trilho são responsabilidades diferentes

O trilho define a área disponível; a barra preenche uma fração dela. O valor CSS controla largura, enquanto aria-valuenow comunica a medida para tecnologias assistivas. Atualizar um não atualiza o outro, pois Progress não possui controlador. Use uma única fonte de estado na aplicação e derive dela o número, o texto e a propriedade visual. Isso evita uma barra em 75% que continua sendo anunciada como 40%.

O nome acessível identifica a operação e pode permanecer estável: “Envio de anexos”. O valor acessível informa o avanço. Não é necessário mudar o nome para repetir o percentual em cada atualização quando aria-valuenow já o comunica. Para uma unidade mais compreensível, aria-valuetext pode dizer “3 de 8 arquivos enviados”, mas deve permanecer coerente com o número proporcional. No exemplo de contagem, 38 representa um arredondamento de 37,5%, não uma medida obtida pela biblioteca.

O rótulo externo é especialmente importante em barras pequenas, nas quais texto interno seria recortado ou ilegível. A variante grande oferece espaço visual para percentual, mas não garante que textos longos caibam. Não coloque botões ou links dentro de uma região progressbar esperando preservar toda a semântica interativa; mantenha cancelar, tentar novamente e detalhes fora do indicador, próximos do status correspondente.

## Determinado, indeterminado e concluído

No estado determinado, normalize o número na fronteira da integração. Verifique Number.isFinite, calcule o percentual a partir de valores conhecidos e limite-o ao intervalo aceito antes de atualizar DOM. Decida como tratar total zero, ausência de total e respostas inconsistentes. O CSS não substitui essa validação; um valor negativo, infinito ou textual pode produzir uma apresentação inválida sem indicar claramente o erro de dados.

No indeterminado, remova aria-valuenow e não mantenha um percentual antigo apenas para preencher o atributo. Use uma descrição que comunique a ausência de estimativa. Quando a medição se torna disponível, retire a classe indeterminada e aplique valor e limites de forma conjunta. Não combine estado indeterminado com uma mensagem de conclusão: o movimento contínuo e o texto final transmitiriam informações opostas.

Complete e error alteram a apresentação da barra, mas não encerram a operação nem atualizam os atributos ARIA por conta própria. Se houve falha em 40%, o status deve explicar o que falhou e a possibilidade de tentar novamente. Não transforme a barra em 100% somente para usar uma cor de erro. Se a operação terminou com sucesso, confirme em texto além da cor e escolha se o indicador permanece como registro ou é substituído pelo resultado.

## Marcadores, mínimos e etapas

Um marcador representa uma meta ou um ponto relevante na escala, não o progresso atual. Defina --fs-progress-marker-value dentro da mesma convenção de 0 a 100 e explique a meta fora do trilho. Duas marcas sem legenda não revelam qual é a medida e qual é o objetivo. O componente não compara automaticamente valor e meta para emitir um evento ou mudar a cor.

A classe minimum evita que um avanço muito pequeno desapareça visualmente, mas cria uma largura mínima decorativa. Por isso deve ser aplicada somente depois de começar o avanço quando zero precisa aparecer vazio. O valor acessível continua sendo o número real. Não aumente aria-valuenow para corresponder aos quatro pixels mínimos: a proporção de pixels depende da largura disponível e não é uma nova medida de trabalho.

Stepper e Progress podem coexistir quando descrevem aspectos diferentes: Stepper identifica a fase atual, Progress mede uma transferência dentro daquela fase. Se ambos apenas repetem o mesmo avanço global, a duplicação pode confundir. Defina o que cada indicador mede e quais mudanças o usuário precisa acompanhar. Nenhum deles, por si só, cria a máquina de estados de um processo de negócio.

## Spinner opcional e visibilidade controlada

O Spinner CSS é apenas uma forma animada. A classe não sabe se há requisições em andamento. O controlador opcional acrescenta estado lógico, aria-busy e eventos, mas não possui timer de operação, cancelamento de rede ou vínculo automático com uma Promise. Comece e finalize o estado no mesmo fluxo que gerencia a operação, usando finally quando houver múltiplos caminhos de sucesso e erro.

O exemplo de dois botões demonstra somente iniciar e parar um indicador. Não representa uma requisição real. O wrapper sem classe fs-spinner recebe hidden, enquanto a forma animada está dentro dele. Essa separação evita depender do seletor visual data-fs-loading false, já que stop remove o atributo. Se a aplicação desmontar o wrapper, remova os handlers dos botões e descarte o controlador; dispose não encerra trabalhos assíncronos externos.

Se vários trabalhos compartilham um único Spinner, um simples stop de qualquer deles pode ocultar a atividade dos demais. Mantenha uma contagem ou um estado agregado no aplicativo, ou use indicadores separados por operação. Essa coordenação não é fornecida pelo controlador. Também não use aria-busy como bloqueio de interação: ele comunica estado, enquanto disabled e regras de autorização têm responsabilidades diferentes.

## Aparência, movimento e testes

Os tokens de Spinner ajustam tamanho, espessura e duração; os de Progress ajustam trilho, altura, raio e preenchimento. Uma barra muito baixa pode perder legibilidade de texto interno, e uma cor customizada exige verificar contraste com o trilho e com qualquer percentual. A fonte atual distribui estilos de Progress entre os módulos progress e spinner; confira o CSS compilado da versão consumida em vez de inferir dimensões a partir de um único seletor isolado.

A preferência de movimento reduzido desacelera indicadores contínuos e retira certas transições, sem representar pausa do trabalho real. Não deixe uma animação ser a única forma de perceber que o sistema está ocupado. Ofereça texto de estado e resultado; evite anúncios a cada pequena atualização, que podem tornar a interface excessivamente falante. A frequência de atualização acessível deve acompanhar informação útil, não cada evento de rede.

Testes DOM podem comparar valor visual e aria-valuenow, verificar eventos de Spinner e confirmar o descarte do registro. Eles não verificam a percepção de movimento, a leitura em contraste elevado, o anúncio por leitor de tela ou a aparência sob zoom. Complete a integração com esses cenários em navegador, incluindo falha, cancelamento, total desconhecido, zero inicial e conclusão. A barra é uma representação do processo; sua confiabilidade depende da fidelidade dos dados que a aplicação fornece.
