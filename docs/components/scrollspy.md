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

No bundle global, use `FokusStyles.Scrollspy`; via módulo:

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
- `activate(sectionEl)`: atualiza links e dispara evento para uma seção válida.
- `dispose()`: desconecta observer/listener e remove registro; não apaga
  `.is-active` já aplicado nem altera os links.

Não há objeto de opções, root configurável, refresh nem data attributes para
offset. A lista de links/seções é coletada na construção; após alterar esse
conteúdo, faça dispose e recrie. Não instancie novamente sem descartar a anterior.

## A11y

Mantenha navegação nomeada, links nativos, foco visível e títulos de seção.
O módulo não adiciona `aria-current`. Se quiser expor a localização ativa,
o aplicativo pode sincronizá-la com o evento:

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
