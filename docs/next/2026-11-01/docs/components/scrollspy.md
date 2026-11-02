> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Scrollspy

## Visão geral

Destaca o link correspondente à seção visível. Carregue o CSS e o JavaScript
conforme [uso](../getting-started/usage.md). A navegação precisa dos dois
atributos abaixo: `data-fs="scrollspy"` inicializa JS e `data-fs-scrollspy`
é o seletor CSS que dá cor/peso a `.is-active`. Eles não são intercambiáveis.

## Anatomia e exemplo

```html
<nav data-fs="scrollspy" data-fs-scrollspy class="fs-scrollspy-nav" aria-label="Nesta página">
  <a href="#introducao">Introdução</a>
  <a href="#detalhes">Detalhes</a>
</nav>
<section id="introducao"><h2>Introdução</h2><p>Conteúdo introdutório.</p></section>
<section id="detalhes"><h2>Detalhes</h2><p>Detalhes do documento.</p></section>
```

IDs devem existir e ser únicos. Use fragmentos locais `#id`, não URLs completas.
`.fs-scrollspy-nav` torna a navegação sticky com offset `--fs-space-4`;
é opcional e depende do layout/overflow dos ancestrais. O exemplo curto não
precisa produzir rolagem: use conteúdo real longo para avaliar o rastreamento.

## Estados

O JS alterna `.is-active` nos links e emite `fs:scrollspy:activate` na navegação,
com `event.detail.section` (elemento da seção). O evento borbulha e pode se
repetir para uma mesma seção. A ativação não rola a página nem move o foco.

Usa IntersectionObserver com rootMargin fixo `-20% 0px -65%`. Sem essa API,
um listener de scroll escolhe a última seção na ordem dos links cujo topo
esteja acima de 35% da altura da janela. O fallback não faz uma ativação inicial
até haver scroll ou chamada explícita de activate.

## API JS

No bundle global, use `FokusStyles.Scrollspy`. O trecho abaixo é uma
**demonstração sequencial de API**, incluindo descarte imediato para mostrar o
método: não o copie como montagem persistente. Para manter o rastreamento ativo,
use o módulo completo da seção Montagem persistente ao final desta página.
Via módulo, as chamadas individuais são:

```js
import { Scrollspy } from 'fokus-styles/js/scrollspy.js';
const nav = document.querySelector('[data-fs="scrollspy"]');
const spy = Scrollspy.getOrCreateInstance(nav);
spy.activate(document.getElementById('introducao'));
// Ao desmontar a página/componente:
spy.dispose();
```

- `new Scrollspy(navEl)`: instancia com uma navegação existente.
- `getInstance(navEl)`: instância registrada ou undefined.
- `getOrCreateInstance(navEl)`: reutiliza a instância ou cria uma.
- `activate(sectionEl)`: atualiza links e dispara evento para a seção recebida; a aplicação deve validar sua referência.
- `dispose()`: desconecta observer/listener e remove registro; não apaga
  `.is-active` já aplicado nem altera os links.

Não há objeto de opções, root configurável, refresh nem data attributes para
offset. A lista de links/seções é coletada na construção; após alterar esse
conteúdo, faça dispose e recrie. Não instancie novamente sem descartar a anterior.

## A11y

Mantenha navegação nomeada, links nativos, foco visível e títulos de seção.
O módulo não adiciona `aria-current`. Se quiser expor a localização ativa,
o aplicativo pode sincronizá-la com o evento. Este fragmento pedagógico é
isolado do bloco anterior; não concatene ambos no mesmo escopo (ambos declaram
`nav`). Para montagem real e remoção do listener, use a receita completa abaixo:

```js
const nav = document.querySelector('[data-fs="scrollspy"]');
nav.addEventListener('fs:scrollspy:activate', (event) => {
  for (const link of nav.querySelectorAll('a[href^="#"]')) {
    if (link.getAttribute('href') === `#${event.detail.section.id}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  }
});
```

Registre esse listener antes da ativação que deseja anunciar. Remova listeners
próprios ao desmontar. Não mude foco automaticamente durante a rolagem.

## Tokens e limites

A indicação ativa usa `--fs-color-primary` e peso 600. Não oferece smooth scroll,
histórico de URL automático nem suporte configurado para contêiner de scroll
interno. Links sem seção correspondente são ignorados na observação. Um href
`#` não produz seção. Várias seções visíveis podem provocar várias ativações;
a última entrada processada prevalece, não há ranking de visibilidade.

## Verificação

`documented-examples.test.js` testa auto-init. `component-docs-contract.test.js`
testa os atributos de estilo/inicialização, evento, aria-current, reutilização
e dispose nos exemplos. Verifique a rolagem com conteúdo real em navegador;
jsdom não simula geometria nem IntersectionObserver reais.


## Propósito e diferença entre observar e navegar

Scrollspy ajuda a pessoa a reconhecer em qual parte de um documento longo está lendo. Uma navegação lateral pode destacar Introdução, Instalação ou Referência conforme as seções entram na região observada. A interação de seguir um link continua nativa; o controlador apenas atualiza o destaque de localização. Essa distinção evita atribuir ao componente tarefas que ele não faz, como rolagem suave, alteração do histórico ou foco automático no título de cada seção.

Use-o quando o documento já tem uma estrutura clara de headings e âncoras. Se o conteúdo é curto e todas as seções aparecem ao mesmo tempo, o destaque pode mudar sem ajudar a orientação. Se a navegação representa páginas diferentes, o estado ativo deve vir da rota, não de um observador de seções locais. Tabs também resolve outro problema: alterna painéis, enquanto Scrollspy conserva todo o documento disponível para leitura e rolagem.

A navegação precisa funcionar mesmo antes do rastreamento. Links para IDs existentes permitem que o navegador alcance o conteúdo sem JavaScript. O CSS de sticky é opcional e não cria espaço de layout automaticamente para a coluna. Planeje a área de conteúdo, a largura da navegação e os ancestrais com overflow, pois eles influenciam se a fixação visual vai funcionar como esperado.

## Anatomia, atributos e correspondência

Há duas responsabilidades declarativas separadas: data-fs scrollspy participa da inicialização, e data-fs-scrollspy participa da regra de estilo do link ativo. Usar apenas uma delas pode produzir um controlador sem destaque ou uma aparência sem observação. A classe fs-scrollspy-nav acrescenta a posição sticky; ela não substitui nenhum dos dois atributos. Essa separação permite usar o rastreamento com um layout de navegação próprio sem obrigar a fixação lateral.

Os links são coletados por href começando com cerquilha e associados por ID. Um fragmento vazio não corresponde a uma seção útil; IDs inexistentes são ignorados na observação. Preserve a ordem dos links conforme a ordem do documento, especialmente para o fallback, que usa a última seção elegível nessa ordem. Links duplicados para a mesma seção podem receber destaque juntos, porque a comparação é pelo fragmento, não por uma identidade exclusiva de item.

O componente não busca uma seção usando um seletor CSS completo fornecido pela URL. A associação usa getElementById com o fragmento literal. Isso permite alguns caracteres especiais em IDs sem escapar um seletor, mas não representa uma camada de normalização de qualquer URL codificada. Use identificadores estáveis e simples para um documento público e teste os links reais copiados da barra de endereço.

## Algoritmo observado e fallback

Com IntersectionObserver disponível, a região de interesse é definida pela margem fixa documentada acima. Cada entrada intersectante processada chama activate. Se várias entradas forem entregues no mesmo lote, a última processada prevalece; não existe comparação de maior área visível, proximidade exata do título ou prioridade editorial. Não use a ordem de eventos como uma medição de tempo de leitura ou atenção sem uma lógica adicional apropriada.

Sem IntersectionObserver, o listener de scroll verifica o topo das seções em relação à altura da janela. Não há ativação imediata na montagem, então o HTML pode permanecer sem destaque até a primeira rolagem. Se a aplicação precisa de uma indicação inicial previsível, registre seus listeners e chame activate com uma seção conhecida. Essa escolha inicial é da aplicação e não demonstra que a seção realmente está visível na geometria atual.

Não existe opção root para um painel com rolagem interna nem configuração pública de rootMargin ou offset. Um cabeçalho fixo alto pode exigir revisão de como os fragmentos aparecem e de como a faixa observada corresponde à leitura. Ajustar scroll-margin no CSS do aplicativo pode ajudar a navegação nativa, mas não altera automaticamente a margem interna do observador. Mantenha essas duas decisões separadas na documentação da integração.

## API, eventos e responsabilidade do aplicativo

Activate(section) compara o ID recebido com os hrefs coletados e emite fs:scrollspy:activate. O método não valida se o elemento pertence à lista observada: passar um elemento externo pode remover o destaque de todos os links e ainda emitir o evento. Por isso, valide uma seção conhecida antes de chamar a API a partir de parâmetros externos. Não passe null esperando uma operação sem efeito; forneça uma referência de elemento existente.

O evento contém a seção, não um índice ou uma porcentagem de progresso. Ele pode se repetir para o mesmo elemento, não é cancelável e não descreve uma navegação confirmada pelo usuário. Um listener pode sincronizar aria-current location, conforme o exemplo, sem alterar o foco. Evite anunciar cada scroll em uma região live, pois isso pode interromper a leitura continuamente. O destaque deve orientar, não competir com o conteúdo.

Para integração modular, o exemplo de importação é uma entrada de bundler que resolve o pacote instalado. Execute-o depois de inserir a navegação e as seções. GetOrCreateInstance reutiliza uma instância registrada, mas não atualiza a lista de links quando o HTML muda. O helper não funciona como refresh. Ao reconstruir um sumário dinâmico, descarte a instância antiga, atualize IDs e links e crie uma nova.

## Variações, acessibilidade e descarte

Não há variantes de tamanho, cor ou direção próprias além da composição sticky opcional e do estado is-active. Use estilos de layout do aplicativo para posicionar a navegação ao lado ou acima do conteúdo. Uma navegação longa pode precisar de tratamento responsivo específico, mas o controlador não a transforma em dropdown nem escolhe quando escondê-la. Preserve uma maneira clara de acessar os títulos em telas pequenas.

Nomeie a navegação e mantenha headings em ordem lógica. O componente não aplica aria-current por padrão, e a atualização opcional deve remover o atributo dos links antigos. Na desmontagem, remova esse listener próprio, desconecte o controlador e depois remova o DOM. Dispose encerra observer e listener de scroll, mas conserva o destaque aplicado; prepare o estado inicial se reutilizar os mesmos elementos em outra montagem.

A validação em JSDOM pode comprovar que activate alterna classes e emite o payload esperado, mas não demonstra que a seção escolhida corresponde ao viewport de um navegador. A revisão final precisa de documento longo, rolagem manual, navegação por fragmentos, zoom e cabeçalho fixo quando houver. Nenhuma alteração no código do componente é necessária para reconhecer esses limites; eles definem o que o consumidor deve avaliar antes de usar o destaque como informação de localização.

## Variações

A composição sticky é opcional. O rastreamento, a navegação por links e a disposição visual são decisões independentes, conforme explicado acima.

## Exemplo

A marcação completa de Anatomia e exemplo funciona como navegação por fragmentos. O módulo de API demonstra montagem e descarte; registre e remova separadamente qualquer listener da aplicação que sincronize aria-current.


## Montagem persistente com cleanup nomeado

Depois de montar o HTML de Anatomia e exemplo, execute este módulo no bundler,
com o CSS do pacote carregado pela entrada. O listener é instalado antes da
ativação inicial, permanece durante a leitura e possui referência para remoção.
A função exportada só deve ser chamada pelo ciclo de desmontagem da aplicação.
Não execute também os dois fragmentos pedagógicos anteriores sobre essa região.

```js
import { Scrollspy } from 'fokus-styles/js/scrollspy.js';
const nav = document.querySelector('[data-fs="scrollspy"]');
if (!nav) throw new Error('Sumário ausente');
function atualizarLocalizacao(event) {
  for (const link of nav.querySelectorAll('a[href^="#"]')) {
    if (link.getAttribute('href') === `#${event.detail.section.id}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  }
}
nav.addEventListener('fs:scrollspy:activate', atualizarLocalizacao);
const spy = Scrollspy.getOrCreateInstance(nav);
const introducao = document.getElementById('introducao');
if (introducao) spy.activate(introducao);
export function desmontarSumario() {
  nav.removeEventListener('fs:scrollspy:activate', atualizarLocalizacao);
  spy.dispose();
}
```

A ativação explícita define apenas uma localização inicial conhecida, não mede a
seção visível. O observador ou fallback continuará atualizando-a durante o uso.
