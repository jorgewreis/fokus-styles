> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Tabs

Alterna painéis de conteúdo por clique/teclado. Reusa `.fs-nav-link`
([Navbar](navbar.md)) como item — o HTML e a navegação por teclado são os
mesmos em qualquer um dos 3 estilos visuais.

## Visão geral

```html
<div class="fs-tabs" data-fs="tabs" id="minhas-tabs">
  <button type="button" class="fs-nav-link is-active" data-fs-target="#perfil">Perfil</button>
  <button type="button" class="fs-nav-link" data-fs-target="#seguranca">Segurança</button>
</div>
<div class="fs-tab-content">
  <div class="fs-tab-pane is-active" id="perfil">Conteúdo Perfil.</div>
  <div class="fs-tab-pane" id="seguranca">Conteúdo Segurança.</div>
</div>
```

## Anatomia

`.fs-tabs` (`data-fs="tabs"`) > `.fs-nav-link` (um por aba, `data-fs-target`
apontando pro painel) + `.fs-tab-content` > `.fs-tab-pane` (um por aba,
`id` batendo com o `data-fs-target` correspondente).

## Variações

- **Estilo**: linha (padrão, sublinhado na aba ativa), `.fs-tabs-pill`
  (chip com fundo sólido na aba ativa, sem linha), `.fs-tabs-depth` (aba
  ativa "sobe" com fundo igual ao conteúdo, sobre um backdrop neutro — como
  aba de pasta).
- **Alinhamento**: `.fs-tabs-center`, `.fs-tabs-right`; sem sufixo =
  esquerda (padrão). `.fs-tabs-fill` distribui os itens em largura igual.
- **Tamanho**: `.fs-tabs-sm`, `.fs-tabs-lg`; sem sufixo = padrão.

```html
<div class="fs-tabs fs-tabs-pill fs-tabs-center" data-fs="tabs">...</div>
<div class="fs-tabs fs-tabs-depth fs-tabs-fill fs-tabs-lg" data-fs="tabs">...</div>
```

## Estados

- `.is-active` na aba e no painel correspondente — controlado pelo JS ao
  trocar, ou definido no HTML inicial (exatamente uma aba/painel deve
  começar ativo).
- `.is-disabled` na aba — não recebe clique nem entra na navegação por
  seta.

## A11y

O JS aplica automaticamente ao inicializar: `role="tablist"` no `.fs-tabs`,
`role="tab"` + `aria-selected` + `tabindex` (roving: só a aba ativa tem
`tabindex="0"`) em cada `.fs-nav-link`, e `role="tabpanel"` +
`aria-labelledby` no painel correspondente. Nenhum desses atributos precisa
ser escrito manualmente no HTML.

Teclado (com foco numa aba): `ArrowLeft`/`ArrowRight` no modo horizontal,
`ArrowUp`/`ArrowDown` com `.fs-tabs-vertical` ou `aria-orientation="vertical"`;
`Home`/`End` vai à primeira/última. As setas pulam `.is-disabled`.

Para separar navegação e ativação, use `data-tabs-activation="manual"` no
grupo. Nesse modo as setas apenas movem o foco. Use `<button type="button">`
para que `Enter` e `Espaço` gerem o clique nativo que ativa a aba.

## API JS

Auto-init via `data-fs="tabs"`. `Tabs.getInstance(el)`.

| Método | Descrição |
|---|---|
| `show(tabEl)` | Ativa a aba `tabEl` (deve ser uma das `.fs-nav-link` do grupo) e o painel correspondente; desativa as demais. Não faz nada se `tabEl` já é a ativa. |
| `dispose()` | Remove os listeners de clique/teclado e desregistra a instância. |

| Evento | Cancelável | Quando |
|---|---|---|
| `fs:tab:changed` | Não | Depois de trocar de aba — `event.detail.target` traz o seletor (`data-fs-target`) da aba ativa. |

O módulo abaixo acompanha o HTML da Visão geral, depois de montado. Em um
bundler, carregue também o CSS do pacote na entrada. A montagem permanece ativa;
as funções exportadas são chamadas pela aplicação quando desejar trocar a aba
ou desmontar a região, não automaticamente ao carregar o módulo.

```js
import { Tabs } from 'fokus-styles/js/tabs.js';
const raiz = document.getElementById('minhas-tabs');
if (!raiz) throw new Error('Raiz de abas ausente');
const tabs = Tabs.getOrCreateInstance(raiz);
export function mostrarSeguranca() {
  tabs.show(raiz.querySelector('[data-fs-target="#seguranca"]'));
}
export function desmontarAbas() {
  tabs.dispose();
}
```

## Tokens

Usa `--fs-color-border`, `--fs-color-primary` (linha/pill ativos),
`--fs-color-bg-subtle` (depth), `--fs-color-surface` (depth ativo),
`--fs-radius-sm`.

## Exemplo

```html
<div class="fs-tabs" data-fs="tabs">
  <button type="button" class="fs-nav-link is-active" data-fs-target="#tab-perfil">Perfil</button>
  <button type="button" class="fs-nav-link" data-fs-target="#tab-seguranca">Segurança</button>
  <button type="button" class="fs-nav-link is-disabled" data-fs-target="#tab-notif">Notificações</button>
</div>
<div class="fs-tab-content">
  <div class="fs-tab-pane is-active" id="tab-perfil">Conteúdo da aba Perfil.</div>
  <div class="fs-tab-pane" id="tab-seguranca">Conteúdo da aba Segurança.</div>
  <div class="fs-tab-pane" id="tab-notif">Conteúdo da aba Notificações (desabilitada).</div>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-6f0e8f39164e).

Além do estilo de linha, estão disponíveis `.fs-tabs-boxed`,
`.fs-tabs-toggle` e `.fs-tabs-vertical`. A rolagem horizontal já faz parte
do estilo padrão, sem classe adicional. Use o modo vertical
em navegação lateral e preserve o padrão `tablist`/`tab`/`tabpanel` gerado pelo
JS.

### Limites de ativação, disabled e ciclo de vida

O handler não implementa Enter/Espaço: depende do click nativo do elemento.
Links ativam por Enter, mas Espaço não é ativação nativa de `<a>`; elementos
genéricos com role=tab também não ganham ativação automática. O handler de
clique não cancela navegação de links, incluindo `href="#"`; prefira botões.

No modo manual, as setas movem foco sem ativar, mas não atualizam o roving
`tabindex`: a aba selecionada conserva `0` e a focada pode continuar `-1`.
Sair e reentrar por Tab pode retornar à selecionada, não à última focada.
Esse limite requer verificação de teclado real no consumidor.

`.is-disabled`, `disabled` nativo (inclusive fieldset) e `aria-disabled="true"`
impedem ativação e seleção. As setas pulam essas abas, preservando o contrato de
foco anterior de Fokus, embora a APG recomende descoberta de itens indisponíveis
por foco em composites. Essa escolha de compatibilidade não é uma afirmação de
conformidade integral com APG. O estado ARIA/classe é local à aba, não herdado.
Não marque uma aba indisponível como ativa inicialmente; mudar disabled não
seleciona automaticamente uma substituta. Se a aba que está focada se tornar
indisponível, a navegação por setas/Home/End não parte dela; a aplicação deve
mover foco para uma aba habilitada. Forneça semântica acessível coerente.

Clicks/auxclicks e Enter/Espaço em aba indisponível são cancelados em captura,
antes dos handlers do item; não navegam, não selecionam e não chamam esses handlers.
Listeners de captura externos/anteriores e chamadas diretas da aplicação não
podem ser desfeitos: essa guarda é de interação, não autorização de negócio.
Links habilitados mantêm sua navegação/default e ordem de handlers neste lote.

`show(tabEl)` ignora abas indisponíveis ou referências fora do grupo sem limpar
a seleção existente nem emitir eventos. As assinaturas públicas permanecem.

Referência: [APG: foco de controles disabled](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls).

As abas são coletadas na construção; não há refresh para inserções dinâmicas.
`dispose()` remove listeners e registro, mas não restaura atributos ARIA,
classes ou visibilidade dos painéis. Recrie a instância após alterar a lista.
Com o alias `data-fs-tab-target`, a seleção funciona, mas o evento
`fs:tab:changed` ainda lê apenas `data-fs-target` e pode trazer target nulo.


## Escolha entre abas, navegação e filtros

Tabs apresenta diferentes painéis de um mesmo contexto mantendo uma seleção ativa. Uma ficha de cliente pode separar dados cadastrais e histórico sem abandonar a entidade consultada; uma área de configurações pode dividir assuntos relacionados. A relação entre título e painel precisa permanecer evidente. Se cada opção representar uma página independente com URL própria e comportamento normal de navegador, uma navegação com links pode ser mais apropriada do que transformar todas as rotas em um tablist.

Não use abas apenas para fazer botões parecerem selecionados. Se o objetivo for escolher um período de relatório, Segmented Control com radios expressa melhor um valor de formulário. Se vários conteúdos precisarem ficar abertos para comparação, Accordion em modo múltiplo evita a exclusividade das abas. A escolha do padrão determina o modelo de teclado e de leitura, não somente a linha ou o fundo desenhados sob o título.

Antes da montagem, escreva uma única aba ativa e o painel correspondente também ativo. O construtor usa as classes presentes para estabelecer `aria-selected`, tabindex e visibilidade; não procura uma “primeira opção ideal” para corrigir automaticamente um conjunto sem seleção ou com seleções duplicadas. A aplicação deve fornecer um estado inicial coerente, inclusive quando a seleção vem de uma URL, de preferências ou de dados carregados no servidor.

## Relação estrutural entre controles e painéis

A raiz agrupa os controles, enquanto os painéis podem ficar fora dela e são encontrados por seletores no documento. Cada controle deve apontar para exatamente o painel pretendido por `data-fs-target`. IDs únicos evitam que uma segunda instância manipule o conteúdo da primeira. A classe `.fs-tab-content` organiza visualmente os painéis; a relação funcional vem do atributo de alvo, não da proximidade entre os elementos no HTML.

Use botões de tipo button como controles. Isso evita submeter um formulário acidentalmente e oferece ativação nativa por Enter e Espaço. Um link habilitado mantém sua ação padrão porque o handler não cancela a navegação; substituir todos os destinos por `href="#"` cria um efeito lateral de fragmento e rolagem, não uma integração completa com histórico. Elementos genéricos com role tab também não ganham o clique nativo de um botão por receber um papel ARIA.

O construtor reconhece `.fs-nav-link`, elementos já marcados com role tab e o alias `data-fs-tab-target`. Para um novo exemplo, prefira o atributo principal, porque o evento changed lê apenas esse atributo. A aplicação não deve inferir que todos os aliases produzem exatamente o mesmo payload. O controlador adiciona IDs ausentes aos controles e vincula o painel por `aria-labelledby`; ele não cria o conteúdo do painel nem valida sua informação de negócio.

## Ativação automática, manual e orientação

No modo padrão, uma seta move o foco e ativa a aba de destino. Esse comportamento é adequado quando os painéis já estão disponíveis e a troca é rápida. No modo manual, as setas apenas posicionam o foco; o clique nativo do botão confirma a seleção. A diferença é útil quando a ativação exige trabalho adicional, mas não transforma o componente em um gerenciador de carregamento assíncrono. A aplicação ainda deve decidir quando buscar dados, apresentar espera e lidar com falhas.

A orientação vertical pode ser declarada por classe ou `aria-orientation`. Quando usar a classe vertical, escreva também o atributo ARIA para comunicar a orientação de forma explícita: o cálculo de teclas reconhece a classe, mas isso não equivale a gerar automaticamente toda a semântica desejada. As setas apropriadas circulam entre os controles habilitados; Home e End alcançam as extremidades. O modo manual conserva a limitação de tabindex descrita abaixo e deve ser avaliado com entrada e saída reais pela tecla Tab.

A seleção não equivale a foco no conteúdo. `show(tab)` troca os estados e a visibilidade, mas não leva o usuário ao primeiro campo ou título do painel. O painel recebe tabindex zero, permitindo sua descoberta sequencial. Evite um listener que sempre mova foco para dentro dele após qualquer mudança: isso pode interromper a navegação contínua pelas setas. Se uma ação externa precisar abrir um painel e destacar um erro, trate esse fluxo específico conscientemente.

## Integração com estado, eventos e dados

Os helpers públicos incluem `Tabs.getOrCreateInstance(root)`, `Tabs.show(root, tab)` e `Tabs.dispose(root)`. Na instância, `show(tab)` recebe o elemento do controle, não o ID do painel nem seu índice. Uma referência de fora do conjunto coletado é ignorada. Métodos não retornam um resultado assíncrono e não existe evento beforechange cancelável. Se a aplicação precisa impedir a saída por dados não salvos, deve projetar essa regra antes de invocar a troca, em vez de tentar revertê-la por um evento posterior.

A troca efetiva emite `fs:shown` e `fs:tab:changed` no controle selecionado, ambos com propagação e sem cancelamento. O segundo inclui o seletor principal em `detail.target`. Escutar o evento na raiz permite atualizar uma área auxiliar ou iniciar o carregamento do painel; mantenha uma referência ao handler para removê-lo no descarte. Uma seleção que já está ativa não dispara uma nova troca, portanto não dependa desse evento como mecanismo universal para a renderização inicial.

Para conectar uma URL à seleção, a aplicação precisa traduzir um fragmento ou parâmetro para um controle conhecido e habilitado. Não passe valores externos diretamente a seletores sem validação. Decida se a mudança usa pushState, replaceState ou nenhuma alteração do histórico e trate o retorno pelo navegador separadamente. Tabs não mantém essa política, não persiste seleção e não carrega automaticamente módulos de cada painel. O fato de um painel estar oculto também não cancela requisições ou timers iniciados dentro dele.

## Ciclo de vida, conteúdo dinâmico e limites visuais

A lista de controles é coletada na construção. Adicionar um botão ao DOM não o torna parte da instância, mesmo que o listener delegado veja o clique: a referência precisa pertencer à lista conhecida. Para reorganizar abas, descarte o controlador, reconstrua controles e painéis coerentes e inicialize novamente. Preserve na aplicação a identidade selecionada, não um índice que pode mudar depois da reordenação.

O descarte remove listeners e registro, mas conserva classes, atributos e estados dos painéis. Se a aplicação substituir um painel enquanto uma operação assíncrona ainda estiver em andamento, também precisa cancelar ou ignorar o resultado antigo. Não atribua esse trabalho a dispose do framework. Uma remontagem deve verificar IDs, seleção inicial e referências de foco, especialmente quando a aba removida era a selecionada.

As variantes pill, depth, boxed, toggle e vertical representam alternativas de apresentação; combinar muitas delas não é uma garantia de desenho coerente. O preenchimento por largura igual é útil para poucos títulos curtos, enquanto textos longos e traduções podem precisar da rolagem horizontal padrão. Revise zoom, foco visível, contraste entre ativa e inativa e títulos que não cabem. O CSS fornece superfícies e tokens, mas não reduz automaticamente o número de abas nem converte o conjunto em um seletor móvel.
