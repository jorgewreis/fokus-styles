> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Datepicker / Timepicker

Duas abordagens complementares: **CSS-only**
(`<input type="date">`/`<input type="time">` nativo, só estilizado) para
quem quer o seletor do próprio sistema operacional/navegador, e um
**Datepicker JS customizado** (`.fs-datepicker`) para quando o design
precisa de controle sobre a aparência do calendário — os nativos não
podem ser restilizados além de cor/borda/fonte do campo (o popup em si é
chrome do navegador, fora do alcance de CSS).

## Visão geral

Escolha primeiro entre o controle nativo e o calendário customizado. O nativo integra entrada, seletor do sistema e validação HTML de data; o customizado oferece um popup estilizado sobre input de texto e exige que a aplicação cuide das regras de validade. Trocar de uma abordagem para a outra muda mais do que a aparência: muda o formato digitado, o tipo de valor do input e as responsabilidades do formulário.

Para selecionar uma data de entrega em português, o calendário customizado pode ajudar a relacionar o dia com a semana. Para horários, esta versão documenta apenas o input nativo de time; não há controlador Timepicker equivalente nem opção que converta Datepicker em relógio. Para regras como apenas dias úteis, período permitido ou fuso horário, não presuma suporte a partir do nome do componente.

### CSS-only (`<input type="date">`/`"time"`)

```html
<input type="date" class="fs-form-control" aria-label="Data">
<input type="time" class="fs-form-control" aria-label="Horário">
```

Herdam `.fs-form-control` normalmente (borda, fundo, foco). A única
correção específica do framework é o indicador nativo (ícone de
calendário/relógio) no tema escuro — por padrão o navegador desenha um
ícone escuro fixo, invisível sobre `--fs-color-surface` escuro; o FokusStyles
aplica `filter: invert(1)` nele sob `[data-theme="dark"]`.

### Datepicker customizado (JS)

```html
<div class="fs-datepicker">
  <input type="text" class="fs-form-control" data-fs="datepicker" data-fs-target="#dp-entrega" placeholder="dd/mm/aaaa" aria-label="Data de entrega">
</div>
<div id="dp-entrega"></div>
```

O elemento apontado por `data-fs-target` é o painel do calendário — fica
vazio no HTML, o JS constrói o cabeçalho (mês/ano + navegação) e a grade de
dias dinamicamente a cada abertura/troca de mês. Se o `<input>` já tiver um
valor em `dd/mm/aaaa` (formato de exibição, pt-BR), o Datepicker abre no mês
correspondente com o dia já marcado como selecionado.

## Anatomia

O painel é preenchido pelo construtor, substituindo seu conteúdo inicial por cabeçalho e grade. Deixe-o vazio e não coloque instruções persistentes ou botões de aplicação dentro desse alvo: a renderização dos dias também reconstrói o conteúdo da grade. Se precisar de ajuda textual, posicione-a fora do painel e associe-a ao input por `aria-describedby`.

O portal procura um diálogo proprietário compatível antes de usar body. Fora de diálogos, a movimentação ajuda a evitar o recorte pelo overflow de ancestrais; dentro de regiões com isolamento de foco, a pertença ao diálogo mantém uma relação operacional importante. Um seletor CSS da aplicação que exige o painel dentro do wrapper original pode deixar de funcionar, então verifique tema e overrides na árvore após inicializar.

O seletor de alvo é resolvido na construção; sem `data-fs-target`, o runtime tenta o próximo irmão do input. Se não há painel, lança erro. IDs exclusivos são especialmente importantes em formulários com várias datas, pois um alvo compartilhado faz componentes disputarem a mesma grade.

`.fs-datepicker` (wrapper posicionador) > `input[role="combobox"]` +
`.fs-datepicker-panel` (movido para portal contextual, posicionado via
`packages/fokus-js/js/core/positioning.js`) > `.fs-datepicker-header` (`.fs-datepicker-nav` ×2 +
`.fs-datepicker-title`) + `.fs-datepicker-grid[role="grid"]` (uma
`.fs-datepicker-week[role="row"]` por semana, cada uma com 7
`.fs-datepicker-day[role="gridcell"]`).

## Variações

O calendário usa locale pt-BR para cabeçalho e nomes dos dias da semana e organiza a semana começando no domingo. Os dias externos completam semanas inteiras e continuam selecionáveis. A classe `is-outside` somente atenua o texto; ela não significa data bloqueada. Não use sua aparência como evidência de uma regra de período permitido.

Não há seletores de mês/ano em dropdown, intervalo de duas datas ou múltipla seleção. Os botões do cabeçalho trocam o mês exibido e as teclas permitem deslocamentos maiores. Uma aplicação que precisa escolher um intervalo pode compor dois campos, mas terá que validar a ordem entre eles e apresentar mensagens próprias; isso não passa a ser um modo oficial de Datepicker.

- Dias fora do mês corrente (preenchendo a primeira/última semana):
  `.fs-datepicker-day.is-outside`.
- Sem suporte a `min`/`max` (intervalo de datas permitido) nesta versão —
  todo dia é selecionável.

## Estados

“Hoje”, “selecionado” e “focado” descrevem situações diferentes. Hoje usa `aria-current="date"` e destaque discreto; selecionado usa `aria-selected` e preenchimento primário; o foco permite navegar sem confirmar. Mover-se com setas não deve ser interpretado como mudança do valor do formulário. O valor só muda por seleção confirmada ou por parsing de um change no input.

Desabilitar manualmente botões de dias não é uma implementação durável de limites. A grade é recriada ao navegar/renderizar, e não existe callback público para reaplicar restrições. Além disso, o handler de teclado para confirmação não fornece o mesmo filtro `:not(:disabled)` usado pelo clique. Não apresente esse caminho manual como proteção contra datas proibidas: valide a escolha na aplicação e prefira o controle nativo ou outra solução quando a restrição de calendário for essencial.

O input não recebe validação automática para texto inválido. A string permanece visível mesmo quando `value` da instância fica null. Isso permite corrigir a digitação sem perdê-la, mas exige uma mensagem clara em vez de enviar silenciosamente um valor nulo como se fosse uma data aceita.

- `.is-today`: contorno sutil no dia atual.
- `.is-selected`: preenchimento sólido na cor de ação primária (mesmo
  par `--fs-color-primary`/`--fs-color-on-primary`).
- `:disabled`: estilo disponível para dia desabilitado; o controlador não gera
  restrições e a alteração manual não é um contrato completo de bloqueio.

## A11y

A comparação com o padrão de date picker é uma referência de interação, não uma alegação de conformidade integral. Este painel é não modal; não bloqueia a página nem instala um ciclo próprio de Tab restrito à grade. Dê ao campo um nome visível e uma instrução de formato. O título de mês/ano com live region ajuda a comunicar navegação, mas não substitui a pergunta do formulário.

Ao abrir por foco, o foco inicialmente permanece no input. As setas verticais transferem-no ao dia tabulável, e a grade passa a receber os comandos. Escape fecha e devolve o foco ao input com uma guarda para não reabrir imediatamente. O método público `hide()` sozinho não é uma rotina geral de retorno de foco: o retorno está nos caminhos de Escape e seleção.

Home e End usam os limites da semana iniciada no domingo; PageUp/PageDown tentam preservar o dia ao mudar mês, limitando-o ao último dia disponível. Isso evita saltos inesperados de um dia 31 para outro mês distante. Verifique esse fluxo, o anúncio dos botões de dia e os nomes abreviados de semana com os leitores de tela realmente usados no produto.

Segue o padrão [WAI-ARIA Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
adaptado (sem o modal — o painel é um popup não-modal, mesma filosofia do
[Combobox](combobox.md)/[Dropdown](dropdown.md)):

- `role="combobox"` + `aria-haspopup="grid"` + `aria-expanded` +
  `aria-controls` no input — `aria-expanded` só é permitido em roles como
  `combobox`/`button`, por isso o `role="combobox"` é necessário mesmo o
  input não filtrando nada (diferente do Combobox de verdade).
- `role="grid"`/`role="row"`/`role="gridcell"` na grade — ao contrário do
  Combobox, os dias **são** focáveis de verdade (roving `tabindex`: só o
  dia selecionado/hoje/primeiro do mês tem `tabindex="0"`).
- Teclado (com o painel aberto):
  - `ArrowDown`/`ArrowUp` com foco no input: abre o painel (se fechado) e
    move o foco pro dia tabável — sem isso, as setas não teriam efeito
    nenhum vindas do input.
  - `ArrowRight`/`ArrowLeft`: dia seguinte/anterior (cruza mês).
  - `ArrowDown`/`ArrowUp` com foco num dia: mesma semana, ±7 dias.
  - `Home`/`End`: primeiro/último dia da semana atual.
  - `PageDown`/`PageUp`: mês seguinte/anterior. `Shift+PageDown`/
    `Shift+PageUp`: ano seguinte/anterior.
  - `Enter`/`Space`: seleciona o dia com foco.
  - `Escape`: fecha o painel sem alterar o valor do input, devolve o foco
    a ele.
- Título do mês/ano (`aria-live="polite"`) anuncia a troca ao navegar.

## API JS

No bundler, importe `Datepicker` de `fokus-styles/js/datepicker.js` depois de configurar o CSS da aplicação. Construa a instância após montar input e painel, usando `Datepicker.getInstance(input) ?? new Datepicker(input)`. O auto-init funciona na carga do módulo/DOMContentLoaded, não observa novos campos inseridos depois. A consulta ao registro evita inscrições concorrentes no mesmo input.

`show()` renderiza o estado já sincronizado; não é um pedido para reler arbitrariamente uma atribuição recente a `input.value`. Depois de mudar o texto por código, dispare change para atualizar selectedDate, viewDate e o ISO antes de abrir. Trocar de mês pelo cabeçalho altera viewDate, não a seleção, e não dispara o evento de data escolhida.

`dispose()` fecha o painel, limpa observação de posição e listeners internos, restaura o painel ao pai original e remove o registro. Ele não devolve todo o markup e os atributos ARIA à forma anterior à construção. Caso a aplicação mantenha o input na tela sem controlador, deverá restaurar sua própria marcação; se remover a região inteira, descarte primeiro para não deixar listeners globais ou portal pendentes.

Auto-init via `data-fs="datepicker"` **no `<input>`**, com `data-fs-target`
apontando pro painel (convenção idêntica ao Dropdown/Combobox).
`Datepicker.getInstance(inputEl)`.

| Método | Descrição |
|---|---|
| `show()` | Abre o painel e renderiza o estado de mês já sincronizado. |
| `hide()` | Fecha o painel. |
| `toggle()` | Alterna. |
| `dispose()` | Fecha se aberto, remove listeners, desregistra a instância. |

| Propriedade | Descrição |
|---|---|
| `value` | Data válida processada em ISO (`aaaa-mm-dd`), inclusive do valor inicial ou de `change` digitado; `null` para entrada vazia/inválida. |

| Evento (no input) | Cancelável | Quando |
|---|---|---|
| `change` (nativo) | Não | Ao selecionar um dia (clique ou `Enter`/`Space`). |
| `fs:datepicker:changed` | Não | Mesmo momento, com `event.detail.value` (ISO) e `event.detail.date` (`Date`). |
| `fs:datepicker:shown` | Não | Depois de abrir o painel. |
| `fs:datepicker:hidden` | Não | Depois de fechar. |

## Parsing, opções e validação

O ISO exposto representa uma data civil formada com ano, mês e dia locais, não um instante UTC. `event.detail.date` é um Date construído para essa data; usar `toISOString()` sem considerar fuso pode produzir uma representação diferente da intenção de negócio. Para enviar uma data sem hora, use a string ISO do componente e valide-a no servidor conforme seu domínio.

Uma confirmação pelo calendário emite change e `fs:datepicker:changed`; digitar e concluir a edição atualiza o parsing por change, mas não produz automaticamente o evento customizado de seleção. Escolha quais eventos sua aplicação observa para evitar salvar duas vezes um clique e ignorar uma alteração digitada. O componente não executa persistência, nem torna o evento customizado cancelável para rejeitar uma seleção a posteriori.

O construtor aceita somente `placement` (`top`, `bottom`, `left` ou `right`): opção JS → `data-placement` → `bottom`
(precedência por valor não nulo). Não há opção de locale/formato, busca, min/max ou
validador customizado; os textos de calendário usam pt-BR.

O parser aceita dia/mês com um ou dois dígitos e ano com quatro (`d/m/aaaa`),
rejeitando datas inexistentes. O valor inicial é processado na construção;
posteriormente o evento `change` atualiza a data/ISO. Alterar `.value` do input
sem evento não sincroniza automaticamente o estado do componente.

Entrada inválida limpa `selectedDate` e `value`, mas conserva o texto digitado.
O componente não chama `setCustomValidity`, não adiciona mensagem de erro nem
valida requisitos de negócio. No input de texto, a aplicação deve implementar
validação e associação de mensagens; isso não equivale à validação do controle
nativo `type="date"`. Selecionar um dia no calendário escreve `dd/mm/aaaa`.

## Tokens

O painel usa largura limitada por 280px e pela viewport, espaçamento, sombra e z-index de dropdown. Os tokens de cores mantêm coerência com Input, mas o popup tem sua própria superfície. Ao alterar primary, teste conjuntamente seleção, hoje e foco, pois podem aparecer no mesmo dia.

O Datepicker instala `watchPosition` enquanto está aberto e remove esse acompanhamento ao fechar. Essa implementação melhora a relação espacial com o campo durante mudanças de viewport, mas não elimina a necessidade de teste visual em diálogos, zoom e telas pequenas. DOM e JSDOM não medem o recorte real nem o posicionamento final.

Reusa `--fs-color-border`/`-surface`/`-text`/`-muted`/`-primary`,
`--fs-radius-sm`/`-md` e `--fs-shadow-md` — sem tokens próprios.

## Exemplo

```html
<div class="fs-datepicker">
  <input type="text" class="fs-form-control" id="entrega" data-fs="datepicker" data-fs-target="#entrega-painel" placeholder="dd/mm/aaaa" aria-label="Data de entrega">
</div>
<div id="entrega-painel"></div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-db31bfcd3b4c) (inclui o
Datepicker customizado e os `<input type="date">`/`"time"` nativos lado a
lado).

## Montagem e cleanup do exemplo

O módulo abaixo acompanha o último bloco HTML, já montado. Em uma aplicação
com bundler e CSS do pacote carregado na entrada, ele evita construção duplicada
e deixa uma função para o ciclo de desmontagem. O listener apenas registra o
evento no console; substitua-o pela integração real, sem confundir observação
com persistência. Não invoque a função de desmontagem enquanto ainda pretende
usar o controle.

```js
import { Datepicker } from 'fokus-styles/js/datepicker.js';
const raiz = document.getElementById('entrega');
const instancia = Datepicker.getInstance(raiz) ?? new Datepicker(raiz);
function observar(evento) {
  console.log(evento.detail);
}
raiz.addEventListener('fs:datepicker:changed', observar);

export function desmontarExemplo() {
  raiz.removeEventListener('fs:datepicker:changed', observar);
  instancia.dispose();
}
```
