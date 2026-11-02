> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Range / Slider

`<input type="range">` estilizado — trilha preenchida até o valor atual e
thumb customizados via pseudo-elementos (`::-webkit-slider-thumb`/
`::-moz-range-thumb`, sem padrão unificado entre navegadores). Teclado
(setas, `Home`/`End`, `PageUp`/`PageDown`) e ARIA (`role="slider"` implícito,
`aria-valuenow`/`aria-valuemin`/`aria-valuemax` automáticos) já vêm do
elemento nativo, sem nenhum JS.

## Visão geral

Range é adequado para ajustar uma quantidade dentro de limites conhecidos quando a posição relativa ajuda a decidir, como volume ou intensidade. Não é a melhor entrada para um identificador ou um número longo que precisa ser digitado exatamente. Se precisão textual for importante, considere um campo numérico separado e uma sincronização explícita da aplicação; o framework não cria esse segundo controle.

Defina `min`, `max` e `step` de acordo com a unidade de negócio. Uma escala de 0 a 100 não significa porcentagem por si só: o rótulo e a ajuda precisam explicar a medida. O input nativo continua selecionável sem JavaScript, mas o preenchimento visual e o output opcional não recebem atualização do controlador se ele não foi carregado. Essa distinção permite uma degradação funcional sem prometer equivalência visual.

```html
<label for="volume" class="fs-form-label">Volume</label>
<input type="range" class="fs-form-range" id="volume" min="0" max="100" value="40">
```

## Valor visível (API JS opcional)

Um `<output>` associado via `data-fs-target` mostra o valor atual em texto
— útil pra quem não percebe a posição do thumb só visualmente. Auto-init
com `data-fs="range"` no próprio `<input>`:

```html
<input type="range" class="fs-form-range" id="volume" min="0" max="100" value="40"
  data-fs="range" data-fs-target="#volume-output" aria-label="Intensidade">
<output class="fs-range-output" id="volume-output" for="volume">40</output>
```

O JS também é responsável por pintar a trilha preenchida
(`--fs-range-percent`, ver token abaixo) — sem ele, a trilha renderiza sem
preenchimento (só a cor de fundo neutra), porque só o Firefox suporta
`::-moz-range-progress`; Chrome/Safari não têm equivalente em CSS puro.

## Marcações (`<datalist>`)

Marcações na trilha são nativas via `list` + `<datalist>` (sem JS,
suporte no Chrome/Edge; degrada para nenhuma marcação visível nos
navegadores sem suporte, sem quebrar a funcionalidade):

```html
<input type="range" class="fs-form-range" min="0" max="100" step="25" list="marcas" aria-label="Intensidade">
<datalist id="marcas">
  <option value="0"></option>
  <option value="25"></option>
  <option value="50"></option>
  <option value="75"></option>
  <option value="100"></option>
</datalist>
```

## Tokens

Os valores iniciais são trilha de 6px, thumb de 18px e percentual de 0%. Fundo da trilha usa borda do tema, preenchimento e borda do thumb usam primary, e superfície do thumb usa surface. As variantes de tamanho sobrescrevem tokens, em vez de criar uma nova API de valor.

Quando alterar cores, avalie o thumb contra as partes preenchida e não preenchida. O tamanho desenhado não comprova uma área de toque confortável; teste o gesto e foco com a escala real da interface. O uso de pseudo-elementos vendor-prefixed exige verificação em mais de um motor, não apenas em JSDOM.

| Token | Uso |
|---|---|
| `--fs-range-track-height` | Altura da trilha. |
| `--fs-range-track-color` | Cor da trilha não preenchida. |
| `--fs-range-fill-color` | Cor da trilha preenchida (até o valor atual). |
| `--fs-range-thumb-size` | Diâmetro do thumb. |
| `--fs-range-thumb-color` | Cor de fundo do thumb. |
| `--fs-range-thumb-border-color` | Cor da borda do thumb. |
| `--fs-range-percent` | Percentual preenchido da trilha — escrito pelo JS (`RangeSlider`), não pensado pra edição manual. |

## Estados

O valor corrente é uma string em `input.value`; `valueAsNumber` pertence à API nativa quando a aplicação precisa de número. A trilha preenchida deriva de `(value - min) / (max - min)`, usando 0 e 100 quando os atributos não estão presentes. Se os limites forem iguais, a implementação devolve 0% para evitar divisão por zero. Ela não é um validador geral de configurações inconsistentes.

Mudanças programáticas de valor não disparam `input` sozinhas. Depois de ajustar valor ou limites por código, emita esse evento se quiser que o controlador recalcule o output e a custom property. Apenas `change` não aciona seu listener. O reset de formulário também não tem listener próprio neste módulo; a aplicação deve sincronizar a apresentação depois da ação nativa de reset, se usar esse fluxo.

- `:disabled` — opacidade reduzida, cursor `not-allowed`, sem interação.
- `:focus-visible` — anel de foco no thumb (mesma técnica de
  `focus-ring()` dos demais controles).

## A11y

Expor o valor pela semântica nativa não equivale a criar atributos literais `aria-valuenow`, `aria-valuemin` e `aria-valuemax` no DOM. Não duplique manualmente esses atributos sem necessidade, pois poderiam divergir do valor real. Para unidades não óbvias, forneça instrução compreensível e avalie a necessidade de `aria-valuetext` controlado pela aplicação.

O output é atualizado com texto simples, sem unidade acrescentada automaticamente. Se precisar exibir “40%” ou um rótulo qualitativo, implemente a formatação fora do destino que o controlador sobrescreve, ou assuma a responsabilidade pelo output. Verifique anúncios sem excesso enquanto a pessoa arrasta: cada evento input pode acontecer muitas vezes durante um único gesto.

Nativo — `<input type="range">` já expõe `role="slider"` e os valores
`aria-value*` automaticamente. Sempre associe um `<label>` (via `for`), e
use `aria-label`/`aria-labelledby` quando não houver label visível.

## API JS

Em um módulo processado por bundler, importe `RangeSlider` de `fokus-styles/js/range.js`, com o CSS do pacote carregado pela entrada do aplicativo. O auto-init examina a página ao carregar o módulo ou em `DOMContentLoaded`; não observa inserções futuras. Para um input montado depois, use `RangeSlider.getInstance(input) ?? new RangeSlider(input)` após montar o HTML.

O construtor recebe somente o input e renderiza imediatamente. Não há opções de formatação, eventos `fs:range:*`, método de atualização público nem método de ajuste de valor. `dispose()` remove o listener e o registro, mas deixa o último texto do output e `--fs-range-percent` no elemento. Se quiser retornar ao markup original, a aplicação deve restaurar esses detalhes explicitamente.

- `data-fs="range"` — auto-init.
- `data-fs-target="#id"` — `<output>` que recebe o valor atual em texto.

| Método | Descrição |
|---|---|
| `RangeSlider.getInstance(el)` | Retorna a instância associada ao `<input>` (ou `undefined`). |
| `dispose()` | Remove o listener de `input`. |

## Anatomia

A raiz funcional é o próprio `<input type="range">` com `.fs-form-range`. O thumb e a trilha são desenhados por pseudo-elementos específicos dos motores, não por filhos que você deva escrever. Um label externo aponta para seu ID; um output pode apontar para o mesmo controle por `for`. O atributo `data-fs-target`, por sua vez, informa ao controlador qual nó receberá o texto do valor.

O destino é procurado com `document.querySelector` na construção. Ele pode estar fora do wrapper visual, mas precisa existir nesse momento e ser identificado sem ambiguidade. A ausência de destino não impede o controlador de pintar a trilha. Alterar o seletor depois não faz o componente procurar outro output automaticamente; remonte a instância se a composição mudar.

## Variações

Há modificadores `.fs-form-range-xs`, `-sm`, `-lg` e `-xl`, que ajustam altura da trilha e dimensão do thumb. Eles não alteram mínimo, máximo ou passo. A variante `.fs-form-range-vertical` declara altura de 160px, largura baseada no thumb, `writing-mode: vertical-lr` e `direction: rtl`. Sua apresentação e operação precisam de teste nos motores alvo; não há um controlador vertical separado.

A folha mantém gradientes com direção `to right`. Por isso a existência da classe vertical não comprova que preenchimento e geometria ficarão equivalentes em todos os navegadores. Datalist acrescenta marcações quando suportado pelo controle nativo, mas não restringe o valor apenas às opções listadas: essa restrição é dada pelo passo e pelos limites apropriados.

## Exemplo

Este exemplo completo mostra um controle nomeado e seu output. Monte o HTML antes de executar o módulo JavaScript. A função de descarte é disponibilizada para o ciclo de vida da aplicação: não deve ser chamada imediatamente depois da criação se o controle ainda será usado.

```html
<label for="intensidade" class="fs-form-label">Intensidade de 0 a 100</label>
<input id="intensidade" name="intensidade" type="range" class="fs-form-range"
  min="0" max="100" step="5" value="40" data-fs-target="#intensidade-valor">
<output id="intensidade-valor" class="fs-range-output" for="intensidade">40</output>
```

```js
import { RangeSlider } from 'fokus-styles/js/range.js';
const input = document.getElementById('intensidade');
const slider = RangeSlider.getInstance(input) ?? new RangeSlider(input);
export function desmontarRange() {
  slider.dispose();
}
```

O código não persiste a intensidade: a aplicação pode ler o campo em seu formulário ou observar eventos nativos para uma ação local. Escolher entre atualizar durante `input` e confirmar ao terminar a interação é parte desse contrato de aplicação.
