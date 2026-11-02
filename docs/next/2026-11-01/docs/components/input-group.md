> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Input Group

Funde um [Input](input.md) (ou Select, ou Button) com "addons" de texto/
ícone de prefixo/sufixo — 100% CSS, reaproveita os tokens visuais do
próprio `.fs-form-control` (borda, cor, raio).

## Visão geral

Input Group é uma composição visual para tornar explícita a relação entre um campo e um prefixo, sufixo ou ação próxima. Uma unidade monetária antes do valor, uma unidade de medida depois dele e um botão de busca junto do campo são usos distintos da mesma estrutura. O agrupamento não concatena valores, não aplica máscara e não implementa conversão de unidades: o que o usuário digita continua sendo o valor do controle nativo.

Use essa composição quando o complemento for curto e indispensável para interpretar a entrada. Instruções longas e mensagens de erro pertencem à ajuda do formulário, não a um addon sem quebra de linha. Um “R$” visual não altera a representação numérica enviada ao servidor; defina separadamente como o aplicativo interpreta decimais, arredondamento e moeda.

```html
<div class="fs-input-group">
  <span class="fs-input-group-text">R$</span>
  <input type="number" class="fs-form-control" aria-label="Valor">
</div>
```

## Anatomia

Os seletores que dimensionam os controles dependem de filhos diretos. Um wrapper adicional em volta do input impede a regra de flexibilidade que usa largura de 1% e crescimento no espaço disponível. Mantenha a label fora da raiz visual e associe-a ao input por ID. Um addon é texto estático; para uma ação como mostrar senha, use um botão de verdade, com nome e handler, e não um span clicável.

A borda externa é construída a partir das bordas dos filhos, com raios somente nas extremidades. Não é uma caixa independente que automaticamente absorve qualquer conteúdo. Mensagens inseridas como mais um filho também entram nesse cálculo, por isso devem ficar fora do grupo visual. Quando precisar de feedback por irmãos, uma classe de estado no grupo e uma mensagem posterior podem formar uma composição deliberada; confira o seletor realmente usado.

`.fs-input-group` (flex, `align-items: stretch` — a altura do addon
acompanha a do controle automaticamente) > qualquer combinação de
`.fs-form-control`/`.fs-form-select`/`.fs-btn` + `.fs-input-group-text`
(addon de texto/ícone estático). As bordas dos itens adjacentes se fundem
(sem borda dupla), com o item focado subindo por cima (`z-index`) pra sua
borda de foco não ficar parcialmente escondida atrás do vizinho.

## Variações

Os seletores de tamanho do grupo atingem os filhos diretos `.fs-form-control`, `.fs-form-select` e `.fs-input-group-text`. Eles não incluem `.fs-btn`: aplique o tamanho de Button explicitamente ao botão e confira o alinhamento. Essa diferença importa em uma barra de busca compacta, que pode parecer uniforme no exemplo padrão e desalinhada ao receber somente `fs-input-group-sm`.

Existe também `.fs-input-group-stack-sm`, que permite quebra e atribui largura integral aos filhos. Apesar do nome, a regra não está dentro de media query: ela empilha em qualquer largura. Se o aplicativo deseja empilhamento apenas em telas pequenas, precisa controlar quando essa classe é aplicada ou compor sua própria regra responsiva, em vez de esperar uma condição automática ausente.

Tamanho: `.fs-input-group-sm`, `.fs-input-group-lg` no
`.fs-input-group` — redimensiona controles e addons diretos. Botões exigem seu modificador de tamanho próprio.

```html
<div class="fs-input-group fs-input-group-sm">
  <span class="fs-input-group-text">@</span>
  <input type="text" class="fs-form-control" aria-label="Valor do campo">
</div>
```

## Estados

Além dos estados individuais, a raiz usa `:focus-within` para propagar o token de borda de foco. Reconhece `.is-invalid`/`.is-valid` na própria raiz e, via `:has`, descendentes com as classes ou `aria-invalid`. Essa propagação mantém addons próximos do estado do campo; não valida dados nem atualiza o texto de ajuda.

Evite marcar simultaneamente partes do grupo como válidas e inválidas: as regras concorrem pela mesma custom property e a ordem CSS decide a aparência. O estado desabilitado do input não desabilita automaticamente um botão vizinho. Decida se a ação continua permitida e atualize seu atributo `disabled` separadamente.

Os controles preservam seus estados nativos; a raiz também propaga o token de borda para foco e validação, conforme explicado acima.

## A11y

Prefixos e sufixos importantes devem ser associados por `aria-describedby`, mas ainda é necessário um nome para o campo. O prefixo “https://” não substitui “Endereço do site”. Se ele for apenas decorativo ou repetir exatamente informação já presente no rótulo, avalie evitar anúncio duplicado. A pessoa precisa entender tanto o que preencher quanto qual parte do valor já está representada fora do input.

Um botão de busca precisa deixar claro se submete o formulário ou executa uma ação local. Prefira um formulário real com destino definido pelo aplicativo quando essa for a navegação desejada; para ação local, `type="button"` exige handler. Os exemplos abaixo mostram somente a composição visual, sem consulta a servidor ou comportamento de busca implementado.

O addon (`.fs-input-group-text`) é só visual — se o texto dele for
essencial pra entender o campo (não decorativo), associe ao input via
`aria-describedby` com um `id` no addon, igual a um texto de apoio comum.

## API JS

Nenhuma — 100% CSS.

## Tokens

Os addons consomem diretamente `--fs-control-addon-bg`, `--fs-control-border-color`, `--fs-control-height` e `--fs-control-padding-x`. A alteração do token de borda na raiz pode alcançar o input e os complementos, mas não garante que um Button de variante própria adote a mesma cor. Revise o conjunto como composição de componentes, e não como um componente monolítico.

Os raios das extremidades são lógicos, enquanto a sobreposição normal usa `margin-left: -1px` nesta versão. Isso merece revisão visual em RTL: não prometa simetria completa com base apenas nos cantos. O teste DOM confirma os filhos e associações; a continuidade das bordas requer navegador.

Os mesmos de [Input](input.md) — `--fs-color-border`,
`--fs-color-surface`, `--fs-color-subtle` (addon), `--fs-color-muted`
(texto do addon), `--fs-radius-sm`.

## Exemplo

```html
<div class="fs-input-group">
  <span class="fs-input-group-text" id="addon-url">https://</span>
  <input type="text" class="fs-form-control" aria-describedby="addon-url" placeholder="seusite.com" aria-label="Valor do campo">
</div>

<div class="fs-input-group">
  <input type="text" class="fs-form-control" placeholder="Buscar..." aria-label="Valor do campo">
  <button type="button" class="fs-btn">Buscar</button>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-d7d593e9cb49).

## Integração e limites

O Select customizado cria um wrapper depois do select original e move seu menu para um portal. Essa transformação não é equivalente a manter um `.fs-form-select` nativo como filho direto de Input Group. Para evitar depender de uma anatomia que muda após inicialização, prefira o select nativo nessa composição ou teste explicitamente o markup gerado antes de adotar o customizado.

Não existe instância InputGroup nem cleanup próprio. Quando remover um grupo que contém componentes interativos, descarte cada controlador interno conforme sua API. A raiz CSS pode simplesmente sair do DOM; seus tokens não gerenciam listeners nem dados de formulário.
