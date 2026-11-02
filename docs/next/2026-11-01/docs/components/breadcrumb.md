> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Breadcrumb

Trilha de navegação hierárquica ("você está aqui"). O uso básico é 100%
CSS; auto-init opcional (`data-fs="breadcrumb"`) adiciona truncamento com
tooltip e colapso em telas pequenas.

## Visão geral

```html
<nav aria-label="breadcrumb">
  <ol class="fs-breadcrumb">
    <li class="fs-breadcrumb-item"><a href="/">Início</a></li>
    <li class="fs-breadcrumb-item"><a href="/documentos">Categoria</a></li>
    <li class="fs-breadcrumb-item is-active" aria-current="page">Página atual</li>
  </ol>
</nav>
```

## Anatomia

`<ol class="fs-breadcrumb">` > `<li class="fs-breadcrumb-item">` (com
`<a>` interno, exceto o último). O separador `/` entre itens é desenhado
via `::before` — não insira manualmente.

## Variações

Nenhuma variação visual (cor/tamanho); a variação é comportamental (ver
Avançado abaixo).

## Estados

`.fs-breadcrumb-item.is-active` — marca o item atual, sem link, cor de
texto normal (os demais usam `--fs-color-muted`).

## Avançado: truncamento + colapso (JS opcional)

Com `data-fs="breadcrumb"`, cada label longo trunca com reticências (CSS)
e ganha um tooltip com o texto completo **só se realmente transbordar**
(medido após as fontes carregarem, pra não errar o corte com a métrica do
fallback). Abaixo de 640px de largura de viewport, os níveis
intermediários (mantendo sempre o primeiro e o último visíveis) colapsam
num único item "…" que abre um dropdown com os links ocultos.

```html
<ol class="fs-breadcrumb" data-fs="breadcrumb" data-max-items="3">
  <li class="fs-breadcrumb-item"><a href="/">Início</a></li>
  <li class="fs-breadcrumb-item"><a href="/documentos">Categoria de produtos muito específica</a></li>
  <li class="fs-breadcrumb-item"><a href="/documentos/relatorios">Subcategoria</a></li>
  <li class="fs-breadcrumb-item"><a href="/documentos/relatorios/anuais">Marca</a></li>
  <li class="fs-breadcrumb-item is-active" aria-current="page">Produto atual com nome bem longo</li>
</ol>
```

`data-max-items` (padrão `4`) define quantos itens cabem antes do colapso
entrar em ação (só é avaliado abaixo do breakpoint `sm`, 640px).

## A11y

- Envolva a lista num `<nav aria-label="breadcrumb">` (ou "trilha de
  navegação") — não gerado automaticamente.
- O item "…" do colapso tem `aria-label="Mostrar níveis ocultos"` e abre um
  [Dropdown](dropdown.md) padrão, com toda a navegação por teclado dele.

## API JS

Auto-init via `data-fs="breadcrumb"` (só necessário para truncamento/
colapso — a trilha básica não precisa de JS). `Breadcrumb.getInstance(el)`.

| Método | Descrição |
|---|---|
| `dispose()` | Cancela medição pendente, descarta Tooltips próprios e dropdown, remove listener, restaura itens colapsados e desregistra a instância; é idempotente. |

Sem eventos customizados.

## Tokens

`--fs-color-muted`, `--fs-alert-primary-text` (links), `--fs-color-text`
(item ativo). O dropdown do colapso usa os tokens de
[Dropdown](dropdown.md).

## Exemplo

```html
<nav aria-label="breadcrumb">
  <ol class="fs-breadcrumb">
    <li class="fs-breadcrumb-item"><a href="/">Início</a></li>
    <li class="fs-breadcrumb-item"><a href="/documentos">Categoria</a></li>
    <li class="fs-breadcrumb-item is-active" aria-current="page">Produto atual</li>
  </ol>
</nav>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-3cda40031b7e).

### Limites atuais do truncamento e descarte

A medição de overflow acontece uma vez, após `document.fonts.ready` (ou um
requestAnimationFrame). A media query atualiza o colapso, não recalcula todos
os tooltips quando o conteúdo ou a largura muda. `maxItems` é convertido com
`Number`, sem validação de faixa; forneça um inteiro positivo coerente. Ele é
o limiar de colapso, não a quantidade de itens mantidos: ao colapsar, ficam
primeiro, reticências e último.

**Descarte:** `dispose()` cancela o requestAnimationFrame pendente e torna
inofensivo o callback de `document.fonts.ready`, que não pode ser cancelado.
Remove os Tooltips criados pela própria instância, o dropdown de reticências,
o listener da media query e o registro. Tooltips que já existiam nos alvos
são reutilizados sem mudança de dono e não são descartados pelo Breadcrumb.
Chamadas repetidas de dispose não afetam uma nova instância no mesmo elemento.

As classes de truncamento e o `data-title` adicionados permanecem no DOM;
o descarte não restaura todo o HTML original. Recriar a instância mede o texto
novamente e cria no máximo um Tooltip por alvo sem instância existente.
A versão básica sem data-fs não inicia medição; ao desmontar a versão avançada,
chame dispose antes de remover o HTML e descarte recursos próprios da aplicação.

## Escolha entre trilha básica e comportamento opcional

Breadcrumb representa a posição de uma página dentro de uma hierarquia. Ele não é um histórico dos últimos cliques nem uma sequência de etapas obrigatórias. A pessoa deve poder reconhecer um nível superior e navegar diretamente para ele sem precisar reconstruir o caminho percorrido. Defina os níveis com nomes úteis e URLs estáveis; não acrescente uma entrada apenas para refletir uma pasta técnica sem significado para quem usa a interface.

A apresentação básica funciona com HTML e CSS. Os links mantêm navegação nativa, abertura em outra aba e compartilhamento de endereços. A página atual pode aparecer como texto, com `aria-current="page"`; a classe ativa fornece apenas o destaque visual. As URLs mostradas são contratos do aplicativo e precisam existir. A implementação não consulta o roteador nem descobre a hierarquia de uma URL automaticamente.

O JavaScript opcional acrescenta truncamento e colapso, não substitui o modelo de navegação. Ele é útil quando a trilha contém muitos níveis ou rótulos extensos, mas também introduz um botão de acesso aos níveis ocultos. Antes de ativá-lo, considere se simplificar os nomes ou a hierarquia resolve melhor a dificuldade. Informações indispensáveis não devem ficar acessíveis apenas por um tooltip difícil de descobrir.

### Contrato de construção e propriedades

`new Breadcrumb(listEl, { maxItems: 3 })` recebe a lista existente, não o `nav` externo. A opção de construtor prevalece sobre `data-max-items`; quando nenhuma das duas é informada, o limite é quatro. A conversão usa `Number` e não corrige automaticamente valores inválidos. Forneça um inteiro positivo coerente com a hierarquia. O teste é quantidade de itens maior que o limite, não maior ou igual.

A API pública tipada expõe `listEl`, `maxItems` e `isCollapsed`, além do construtor, de `Breadcrumb.getInstance(element)` e de `dispose()`. Não existe `getOrCreateInstance` nesta classe, nem método público `refresh`, `collapse` ou `expand`. Para evitar duas instâncias sobre a mesma lista, consulte o registro antes de construir. Não escreva em propriedades para tentar forçar uma renderização; a atualização de colapso vem da media query e do lifecycle implementado.

A construção captura os filhos diretos com `.fs-breadcrumb-item`. Inserir novos itens depois não atualiza automaticamente essa coleção. Quando a aplicação troca a hierarquia de uma rota, descarte a instância antiga, atualize a lista e crie outra. O auto-init procura o markup ao carregar o módulo ou no DOMContentLoaded; não observa mutações futuras. Imports ESM de `fokus-styles/js` exigem um bundler ou resolvedor de módulos configurado.

### O que o colapso conserva

Abaixo do limite de viewport de 639.98px, uma quantidade superior a `maxItems` oculta os níveis intermediários e acrescenta reticências entre o primeiro e o último. O valor três não significa “mostrar três níveis originais”: a forma colapsada mantém primeiro, botão de reticências e último. O dropdown cria novas entradas a partir do texto e do `href` dos níveis ocultos. Ele não clona handlers, atributos `target`, metadados ou todo o HTML original do link.

O Dropdown também move seu menu para um portal: o diálogo contextual do controle, quando houver, ou o `body`. Portanto, o menu não permanece necessariamente como descendente da lista. Seletores CSS locais e listeners delegados apenas no `ol` precisam considerar essa mudança de ancestralidade. Eventos do Dropdown continuam seguindo seu próprio contrato; Breadcrumb não acrescenta eventos próprios de colapso.

Por isso, uma aplicação que depende exclusivamente de um listener instalado diretamente em cada link original precisa revisar como os novos destinos serão tratados. Prefira URLs válidas e uma integração de navegação que preserve esse contrato. A cópia textual também não preserva ícones ou badges do nível original. O componente é deliberadamente mais simples que uma renderização completa de menus fornecida pelo roteador.

### Truncamento, foco e limpeza

A classe de truncamento limita a largura do alvo a 160px. O alvo é o primeiro link encontrado no item ou o próprio item quando não existe link. Se houver overflow na medição inicial e nenhum Tooltip registrado, o componente cria um Tooltip próprio. Um item atual sem link não se torna focável automaticamente, portanto não presuma que todo texto truncado terá a mesma descoberta por teclado. Mantenha o nome completo disponível em outra apresentação quando ele for essencial.

O descarte restaura a apresentação dos níveis intermediários removendo o `display` inline aplicado, mas não é uma restauração byte a byte do markup original. Classes de truncamento e atributos de título adicionados permanecem. Tooltips de outro proprietário são reutilizados sem transferência de propriedade; somente os criados pela instância são descartados por ela. Essa distinção evita remover um recurso que outra parte da aplicação ainda utiliza.

Os callbacks de fonte e os listeners da media query têm tratamento próprio no descarte, mas handlers adicionados pela aplicação continuam sendo responsabilidade dela. Teste descarte antes da medição e reconstrução da trilha após uma mudança de rota. Não trate o sucesso de um teste DOM como prova de recorte visual: a largura real de texto, carregamento de fontes e posicionamento do dropdown precisam ser verificados em navegador.

## Exemplo de montagem controlada

O HTML abaixo define uma trilha de quatro níveis com destinos reais do aplicativo. O módulo deve executar depois de esse HTML ser montado. O `nav` permanece responsabilidade do consumidor; o controlador atua sobre a lista identificada.

```html
<nav aria-label="Localização do relatório">
  <ol id="trilha-documento" class="fs-breadcrumb" data-fs="breadcrumb" data-max-items="3">
    <li class="fs-breadcrumb-item"><a href="/">Início</a></li>
    <li class="fs-breadcrumb-item"><a href="/documentos">Documentos</a></li>
    <li class="fs-breadcrumb-item"><a href="/documentos/relatorios">Relatórios</a></li>
    <li class="fs-breadcrumb-item is-active" aria-current="page">Relatório anual</li>
  </ol>
</nav>
```

```js
import { Breadcrumb } from "fokus-styles/js";

const list = document.getElementById("trilha-documento");
if (!list) throw new Error("Monte a trilha antes de inicializar Breadcrumb.");
const trail = Breadcrumb.getInstance(list) ?? new Breadcrumb(list, { maxItems: 3 });

export function desmontarTrilha() {
  trail.dispose();
}
```

Chame `desmontarTrilha()` antes de remover ou substituir essa lista. A função não navega nem remove a marcação; o sistema de rotas continua controlando essas operações. No bundle IIFE, o construtor equivalente está em `window.FokusStyles.Breadcrumb`. Não instale uma segunda instância apenas para trocar o limite: encerre o ciclo anterior e monte o novo de forma explícita.
