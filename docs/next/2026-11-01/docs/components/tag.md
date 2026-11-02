> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Tag

Badge dismissível — reusa [Badge](badge.md) e `.fs-btn-close`
([Button](button.md)) mais o JS mínimo pra remover do DOM ao clicar no "x".

## Visão geral

```html
<span class="fs-badge fs-tag" data-fs="tag">
  Frontend
  <button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover tag Frontend"></button>
</span>
```

## Anatomia

`.fs-badge.fs-tag` (mesmo elemento, duas classes — Tag é um refinamento de
Badge, não um componente separado) contendo texto + `.fs-btn-close` com
`data-fs-dismiss="tag"`.

## Variações

- **Cor**: as mesmas de [Badge](badge.md) (`.fs-badge-{cor}`).
- **Tamanho**: apenas o tamanho padrão. Tags são controles compactos de
  remoção; usar uma única densidade evita variações de alvo e de texto em
  filtros e formulários.
- **Ícones**: envolva um SVG de `fokus-styles/icons` em `.fs-tag-icon` antes
  de `.fs-tag-label` para ícone inicial ou combine `.fs-tag-icon.fs-tag-icon-end` depois do
  texto para indicar um estado. O contêiner do ícone usa a mesma dimensão
  visual do botão de fechamento; `--fs-tag-icon-size`,
  `--fs-tag-icon-glyph-size`, `--fs-tag-icon-gap` e `--fs-tag-icon-color`
  permitem ajustes locais. O
  ícone é decorativo (`aria-hidden="true"`) quando o texto já descreve a tag;
  nunca use uma Tag somente com ícone como padrão.
- **Texto longo**: use `.fs-tag-truncate` na tag e `.fs-tag-label` no texto.
  Defina `--fs-tag-max-inline-size` conforme o contexto; o texto integral
  continua no DOM e pode ser exposto em `title` como apoio visual.
- **Agrupamento**: `.fs-tag-group` (flex + wrap) no contêiner pai,
  une tags lado a lado com separadores translúcidos; o botão de remoção só é
  revelado em hover ou foco, evitando ruído visual. A reserva simétrica de
  espaço para o botão mantém o texto visualmente centralizado; o fundo da tag
  inteira sinaliza o hover.
- **Protegida**: `.fs-tag-protected` desativa interação com `pointer-events:
  none`; substitua o botão por `.fs-tag-lock` e o ícone `shield-check` de
  `fokus-styles/icons` quando a tag não puder ser removida.
- **Overflow**: `.fs-tag-overflow` é um `<button>` compacto e transparente,
  sem borda, com o ícone `tags` em `primary` centralizado; ele representa tags
  não exibidas.
  Conecte-o a um popover ou a uma lista expandida e mantenha `aria-expanded`
  sincronizado com essa interface.

O botão de fechamento usa `--fs-tag-close-size` e `--fs-tag-close-gap`, herda
o raio do Badge e é a única ação de remoção. A Tag inteira não é um botão.

```html
<div class="fs-tag-group">
  <span class="fs-badge fs-tag" data-fs="tag">Design<button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover tag Design"></button></span>
  <span class="fs-badge fs-tag" data-fs="tag">Frontend<button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover tag Frontend"></button></span>
</div>
```

## Estados

Botão de dispensa é transparente no repouso; tem hover (fundo sutil) e
`:active` (leve "afundar", feedback visual da ação de remoção). Ao
receber foco pelo teclado, a tag inteira também recebe um anel de foco para
ficar distinguível em agrupamentos densos.

Para estado pendente já no HTML inicial, use `aria-busy="true"` e `.is-loading`, que o construtor lê. Depois de construir a instância, use `instance.setLoading(true)` para sincronizar comportamento e apresentação; alterar apenas classes/atributos não atualiza o estado interno. Não existe método estático `Tag.setLoading`. Inclua um `.fs-spinner` depois de `.fs-tag-label`:
o estado pendente usa fundo `warning`, texto e spinner pretos. O botão de
remoção é desabilitado até que o estado seja removido, sem reabilitar botões
que já estavam desabilitados antes do loading.

## A11y

- `.fs-btn-close` **precisa** de `aria-label` descritivo (ex.: "Remover tag
  Frontend", não só "Remover") — é um botão só-ícone.
- A remoção só acontece ao clicar no botão de fechar, nunca ao clicar na
  tag inteira — evita remoção acidental.
- Se o botão de fechar estiver focado quando a Tag for removida, o foco vai
  para a próxima Tag do mesmo grupo; se não houver, vai para a anterior.
  Remoções programáticas sem foco no botão não movem o foco.
- Ícones com significado próprio precisam ser acompanhados por texto ou
  descrição acessível; não dependa apenas do desenho ou da cor.
- Para tags truncadas, mantenha a string completa dentro de `.fs-tag-label`;
  ela continua disponível para tecnologias assistivas. `title` é apenas uma
  ajuda adicional para ponteiro.
- O botão `.fs-tag-overflow` requer um nome acessível descritivo, como
  `aria-label="Mostrar mais 3 tags"`.

## API JS

Auto-init via `data-fs="tag"`. `Tag.getInstance(el)`.

| Método | Descrição |
|---|---|
| `dismiss()` | Dispara `fs:tag:dismissed` (cancelável); se não cancelado, remove o elemento do DOM e retorna `true`. Retorna `false` se estiver carregando ou se o evento for cancelado. |
| `setLoading(loading)` | Retorna a própria instância e alterna `.is-loading`, `aria-busy` e o estado desabilitado do botão de remoção. |
| `dispose()` | Remove o listener de clique e desregistra a instância (não remove o elemento). |

| Evento | Cancelável | Quando |
|---|---|---|
| `fs:tag:dismissed` | Sim | Antes de remover — `event.preventDefault()` cancela a remoção. |

## Limites de proteção e disabled

`fs-tag-protected` é uma composição visual/de ponteiro, não uma trava na API.
`dismiss()` não consulta essa classe. Substitua o botão de remoção pela marca de
proteção indicada acima e aplique autorização/regras de negócio na aplicação.

A construção e `setLoading(false)` preservam um botão já `disabled` pelo
consumidor. Ao entrar em loading, a instância registra apenas os botões que ela
própria desabilita e os reabilita ao sair; chamadas repetidas não substituem essa
informação. Isso também vale para markup inicialmente loading: um `disabled`
explícito é considerado do consumidor e não será removido automaticamente.
Para loading gerenciado pelo JS, deixe o componente aplicar `disabled`; para
conteúdo que precisa ficar bloqueado antes do JS, a aplicação deve administrar
esse `disabled` explícito (como no exemplo de markup pendente abaixo).

```js
import { Tag } from "fokus-styles/js";
// Em projeto com bundler, após obter o elemento da tag:
const instance = Tag.getInstance(element) ?? new Tag(element);
// Ao concluir a operação cujo HTML já trazia disabled:
instance.setLoading(false);
element.querySelector('[data-fs-dismiss="tag"]').disabled = false;
```

Evite alterar diretamente `disabled` durante o loading: o mesmo atributo não
distingue uma segunda causa de bloqueio. Termine o loading e aplique o estado
da aplicação. `disabled` protege a ativação nativa do botão, não chamadas
programáticas a `dismiss()`; para impedir a remoção, use o evento cancelável
e a regra de negócio apropriada.

## Tokens

Usa os tokens de [Badge](badge.md) e expõe tokens locais para composição:
`--fs-tag-icon-size`, `--fs-tag-icon-glyph-size`, `--fs-tag-icon-gap`, `--fs-tag-icon-color`,
`--fs-tag-close-size` e `--fs-tag-close-gap`.

## Exemplo

```html
<div class="fs-tag-group">
  <span class="fs-badge fs-badge-primary fs-tag" data-fs="tag">
    Urgente
    <button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover tag Urgente"></button>
  </span>
  <span class="fs-badge fs-badge-danger fs-tag" data-fs="tag">
    Bloqueado
    <button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover tag Bloqueado"></button>
  </span>
</div>
```

```html
<span class="fs-badge fs-tag fs-tag-truncate" style="--fs-tag-max-inline-size: 20rem;" data-fs="tag">
  <span class="fs-tag-icon" aria-hidden="true"><!-- SVG de fokus-styles/icons --></span>
  <span class="fs-tag-label">Revisão de acessibilidade e compatibilidade entre navegadores</span>
  <button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover tag Revisão de acessibilidade e compatibilidade entre navegadores"></button>
</span>

<button type="button" class="fs-badge fs-tag fs-tag-overflow" aria-label="Mostrar mais 3 tags" aria-expanded="false">
  <svg class="fs-icon" aria-hidden="true"><!-- SVG tags de fokus-styles/icons --></svg>
</button>

<span class="fs-badge fs-tag is-loading" data-fs="tag" aria-busy="true">
  <span class="fs-tag-label">Salvando</span>
  <span class="fs-spinner" aria-hidden="true"></span>
  <button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover tag Salvando" disabled></button>
</span>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-4e58d603d0e0).

`.fs-tag-rounded` cria um raio total e `.fs-tag-addons` agrupa duas ou mais
tags como uma unidade visual. Esses refinamentos são visuais; a remoção
continua sendo responsabilidade exclusiva de um botão nomeado.

## Escolha da interação e vínculo com os dados

Tag representa um valor curto associado a uma ação de remoção, como um filtro aplicado ou uma classificação selecionada. Ela não é uma caixa de texto, não cria categorias automaticamente e não sincroniza um formulário ou banco de dados. Antes de usar, defina o que “remover” significa: retirar um filtro da consulta, desfazer uma seleção local e excluir uma classificação persistida têm consequências diferentes. A mesma aparência não deve ocultar essa diferença de responsabilidade.

O comportamento padrão remove o elemento do DOM quando a dispensa é aceita. Isso não apaga o valor de um array da aplicação, não atualiza um input oculto e não salva a alteração no servidor. Se a interface for renderizada novamente a partir de um modelo que ainda contém o valor, a tag pode reaparecer. Mantenha a fonte de dados e a apresentação coerentes, em vez de tratar a remoção visual como persistência concluída.

A ação fica no botão nomeado de fechamento. A superfície textual da tag não é um botão de alternância e não seleciona novamente o valor. Para categorias somente informativas, um Badge pode ser mais adequado; para escolher valores, o controle de seleção deve ter seu próprio contrato. Essa separação evita que a pessoa precise adivinhar se clicar no texto abre algo, marca uma opção ou remove o conteúdo.

### Inicialização e API pública

O construtor é `new Tag(tagEl)`, sem objeto de opções. `Tag.getInstance(element)` recupera a instância registrada ou retorna `undefined`; não há `getOrCreateInstance` nesta classe. A API tipada expõe `tagEl`, `dismiss()`, `setLoading(boolean)` e `dispose()`. Não dependa de `_isLoading` ou de coleções internas de botões como getters públicos. Guarde o estado de negócio no modelo da aplicação.

O auto-init é solicitado por `data-fs="tag"` e ocorre no carregamento do módulo ou no DOMContentLoaded. Conteúdo inserido posteriormente exige inicialização explícita. Use o registro para evitar duplicar listeners sobre o mesmo elemento. Os imports de pacote mostrados requerem bundler ou outra resolução de módulos; no IIFE, a classe fica em `window.FokusStyles.Tag`. A base CSS e a marcação do botão continuam necessárias, independentemente da forma de carregar o JavaScript.

### O evento acontece antes da remoção

Apesar do nome no passado, `fs:tag:dismissed` é disparado antes de retirar a tag. Ele propaga para ancestrais e é cancelável; `preventDefault()` impede a remoção. O evento não contém um payload de dados de negócio. Se precisar identificar o filtro removido, use o elemento associado ou um atributo definido pelo aplicativo, sem presumir um `detail.id` que o componente não fornece.

A operação é síncrona. Retornar uma Promise de um listener não faz `dismiss()` aguardar sua resolução. Para pedir confirmação ou persistir uma mudança remotamente antes de remover, cancele o primeiro evento, gerencie a operação na aplicação e defina como autorizar a remoção posterior sem iniciar um ciclo infinito no mesmo listener. Um booleano de autorização ou a retirada controlada do handler pode fazer parte dessa integração, mas não é um mecanismo embutido em Tag.

Quando a dispensa não é cancelada e não há loading, `dismiss()` retorna `true`; quando bloqueada por loading ou cancelamento, retorna `false`. Não há um segundo evento específico “depois de removido”. Se outro listener também puder cancelar, coordene os responsáveis antes de anunciar que uma exclusão persistida terminou. A aparência do botão e o valor de retorno não substituem uma confirmação de sucesso do servidor.

### Loading e proteção real

`setLoading(true)` ativa classe, busy e bloqueio do botão que a instância administra. O spinner precisa existir no markup se você quiser mostrá-lo; o método não cria automaticamente o desenho. A implementação rastreia o botão que desabilitou para não reabilitar um controle já indisponível por outra causa. Essa distinção exige que o aplicativo não alterne arbitrariamente o mesmo atributo durante o período de loading.

A classe de proteção afeta ponteiro e composição visual, não a API de remoção. Do mesmo modo, um botão nativamente disabled impede sua ativação normal, mas não proíbe uma chamada programática a `dismiss()`. Regras de autorização ou impossibilidade de remover devem existir no modelo e, quando houver persistência, no servidor. Para uma tag permanentemente informativa, não inclua um botão de remoção escondido apenas por CSS.

### Foco após remoção e grupos

A restauração de foco só é tentada quando o primeiro botão de dispensa da tag é exatamente o elemento ativo. O destino é procurado dentro de `.fs-tag-group`, entre controles que não estão disabled, hidden nem marcados com `aria-hidden="true"`. A implementação tenta o próximo e depois o anterior. Ela não realiza uma avaliação completa de visibilidade por estilos de todos os ancestrais, então grupos que escondem elementos de outras formas precisam de testes próprios.

Se a última tag for removida, pode não haver destino interno para o foco. A aplicação deve planejar uma alternativa, como o campo que permite acrescentar valores, sem mover o foco em toda remoção programática. Uma mensagem de status curta pode explicar que o filtro foi retirado. Não transforme todos os rótulos em regiões vivas ou anúncios duplicados quando apenas uma ação ocorreu.

### Descarte e propriedade dos recursos

Remover a tag por `dismiss()` não chama `dispose()` automaticamente. O registro ainda pode apontar para a instância enquanto a aplicação mantém referência ao elemento. Descarte a instância quando encerrar seu uso e retire os listeners que a aplicação adicionou. `dispose()` remove o listener do componente e o registro, mas não remove o elemento nem restaura todas as classes e atributos de loading.

Evite manter duas instâncias sobre a mesma tag ou reutilizar uma referência descartada como se estivesse ativa. O lifecycle da interface deve definir quem cria, remove e descarta cada instância. Em uma aplicação com renderização declarativa, reconcilie a mudança no estado da biblioteca de UI; não deixe dois sistemas disputarem a mesma remoção de DOM sem uma política explícita.

## Exemplo completo de remoção condicionada

Este exemplo local usa uma regra explícita de permissão para demonstrar o cancelamento. Não é uma autorização de servidor. Monte o HTML, carregue o CSS do pacote e execute o módulo abaixo em um projeto com bundler. O listener pertence exclusivamente à demonstração; em uma integração com vários ouvintes, coordene também os demais cancelamentos.

```html
<label><input id="permitir-remocao-tag" type="checkbox"> Permitir remover este filtro</label>
<div class="fs-tag-group">
  <span id="tag-remocao-controlada" class="fs-badge fs-tag" data-fs="tag">
    <span class="fs-tag-label">Documentos recentes</span>
    <button type="button" class="fs-btn-close" data-fs-dismiss="tag" aria-label="Remover filtro Documentos recentes"></button>
  </span>
</div>
<p id="tag-resultado" role="status"></p>
```

```js
import { Tag } from "fokus-styles/js";

const element = document.getElementById("tag-remocao-controlada");
const permission = document.getElementById("permitir-remocao-tag");
const result = document.getElementById("tag-resultado");
if (!element || !permission || !result) throw new Error("Monte o HTML da demonstração.");
const instance = Tag.getInstance(element) ?? new Tag(element);

function onDismiss(event) {
  if (!permission.checked) {
    event.preventDefault();
    result.textContent = "O filtro foi mantido. Habilite a opção para permitir a remoção.";
    return;
  }
  result.textContent = "Filtro removido desta demonstração local.";
  queueMicrotask(() => {
    if (!element.isConnected) desmontarTagDemo();
  });
}

element.addEventListener("fs:tag:dismissed", onDismiss);

export function desmontarTagDemo() {
  element.removeEventListener("fs:tag:dismissed", onDismiss);
  instance.dispose();
}
```

A primeira tentativa mantém o elemento e informa a causa. Depois de marcar a opção, o botão remove a tag e a limpeza ocorre após o evento terminar. Chame a função exportada também se a aplicação desmontar a demonstração por outro caminho. O exemplo não possui requisição, persistência nem promessa de excluir um registro real; seu objetivo verificável é demonstrar cancelamento, remoção e propriedade dos listeners.
