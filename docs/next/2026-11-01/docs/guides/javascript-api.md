> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# API JavaScript

O JavaScript é opcional para componentes somente CSS. Importe os módulos
necessários de `fokus-styles/js`; o bundle IIFE expõe a mesma entrada em
`window.FokusStyles`. Imports ESM podem ser feitos sem DOM, mas construir
instâncias e chamar métodos de interface exige o DOM e os elementos esperados.

## Inicialização e instâncias

O auto-init padrão procura **`data-fs="nome-do-componente"`** ao carregar o
módulo: no `DOMContentLoaded` se o documento ainda carrega, ou imediatamente
se já estiver pronto. Não é um `MutationObserver`; conteúdo inserido depois
precisa de inicialização manual. O elemento correto (gatilho, contêiner ou
input) é definido na página de cada componente.

`getInstance(element)` recupera uma instância já registrada. Não presuma que
`new Component(element)` seja idempotente: construir novamente pode duplicar
listeners. Para componentes sem helper, use a recuperação antes de construir:

```js
import { Tooltip } from "fokus-styles/js";

const element = document.querySelector('[data-fs="tooltip"]');
if (element) {
  const tooltip = Tooltip.getInstance(element) ?? new Tooltip(element);
  // Ao desmontar esta interface: tooltip.dispose().
}
```

**`getOrCreateInstance` não existe em todas as classes.** Nesta versão é
implementado por: Modal, Dropdown, Offcanvas, Tabs, Carousel, Navbar,
Scrollspy, Theme, FormValidation, Spinner e Pagination. O helper devolve a
instância existente; novas opções não reconfiguram automaticamente essa instância.

Helpers estáticos adicionais também variam: Modal/Dropdown/Offcanvas têm
`show`, `hide` e `toggle`; Tabs tem `show` e `dispose`; Carousel tem `next`,
`prev` e `goTo`; Theme tem `set`. Não aplique essas assinaturas a outras classes.
Consulte as declarações `.d.ts` incluídas no pacote e a API específica.

## Atributos declarativos

| Atributo | Uso nesta versão |
|---|---|
| `data-fs` | Inicializador padrão, como `modal`, `dropdown`, `tooltip`, `pagination` ou `spinner`. |
| `data-fs-target` | Seletor do alvo nos componentes que o documentam. Não é necessário para todos. |
| `data-fs-dismiss` | Fechamento nos componentes que documentam esse controle. |
| `data-placement`, `data-align` | Posicionamento de popups que suportam essas opções. **Não** use `data-fs-placement` como substituto. |
| `data-fs-theme` / `data-theme` | Contexto de tema, conforme o [guia de temas](theming.md). |

`data-fs-toggle="modal"` e `data-fs-toggle="offcanvas"` são aliases de
inicialização apenas desses dois componentes. Na Navbar, `data-fs-toggle="navbar"`
identifica o botão interno de um contêiner `data-fs="navbar"`; não é um
inicializador universal para os demais componentes.

Valores booleanos, precedência de opções/atributos e nomes de estado não são
universais. Consulte a página correspondente; não transforme toda ocorrência
de atributo no código em opção pública.

## Eventos

Os nomes e o alvo do evento variam por componente. Modal, Offcanvas, Accordion
e Toast emitem os eventos de ciclo `fs:show`, `fs:shown`, `fs:hide` e `fs:hidden`
além dos eventos específicos documentados. Outros componentes podem emitir
apenas parte desse ciclo ou eventos próprios. Não presuma que eventos antes da
mudança são canceláveis: nesses quatro componentes, os eventos comuns não são.

Exemplos de eventos específicos: `fs:pagination:change` informa `{ page, total }`;
`fs:loading:start` e `fs:loading:stop` pertencem a Spinner. Eventos como
`fs:stepper:beforechange` e `fs:tag:dismissed` têm cancelamento explicitamente
documentado nas respectivas páginas. Use `event.detail` conforme o contrato,
não uma estrutura presumida para todos os eventos.

## Theme: contrato do controlador

`new Theme(root)` e os métodos estáticos usam `document.documentElement` quando
`root` é omitido. `Theme.getInstance(root)` recupera, e
`Theme.getOrCreateInstance(root)` reutiliza/cria a instância. Não há auto-init
por `data-fs="theme"` nesta implementação.

- `theme.get()` lê `data-fs-theme`, depois `data-theme`, ou retorna `"light"`.
- `theme.set(mode)` e `Theme.set(mode, root)` aceitam `"light"`, `"dark"` e
  `"auto"`; outro valor lança `TypeError`. Retornam a instância.
- `set` escreve `data-fs-theme` com o modo e `data-theme` com `"dark"` somente
  para dark, `"light"` nos demais casos. Emite no root `fs:theme:change`, com
  `detail: { mode }`, inclusive quando o modo repetido é informado.
- `dispose()` remove o registro, sem restaurar atributos. O controlador não
  persiste preferências em storage nem instala listeners de preferência do
  sistema; a resposta visual de auto pertence ao CSS de temas.

```js
import { Theme } from "fokus-styles/js";
const theme = Theme.getOrCreateInstance(document.documentElement);
theme.set("dark");
console.log(theme.get()); // "dark"
// Ao descartar o controlador: theme.dispose().
```

Veja também [dark mode](dark-mode.md) e [theming](theming.md); exemplos de
persistência nesses guias são código da aplicação, não recursos automáticos de Theme.

## FormValidation: validação nativa, não validação de negócio

Auto-init em `<form data-fs="form-validation">`, ou
`FormValidation.getOrCreateInstance(form)` / `new FormValidation(form)`.
`FormValidation.getInstance(form)` recupera o registro existente.

`validate(event)` recebe um evento de submit, retorna o boolean de
`form.checkValidity()`, aplica `.fs-was-validated` e atualiza `aria-invalid`
nos campos cujo `willValidate` seja verdadeiro. Se inválido, chama
`event.preventDefault()` e `event.stopPropagation()`; portanto não omita o evento
em chamadas manuais. Emite no formulário `fs:form:validated`, com
`detail: { valid }`, propagação habilitada e sem cancelamento.

O listener é de `submit`, não de input/blur. Para deixar esse listener tratar
um formulário inválido, use `novalidate`; sem ele, a validação interativa nativa
pode impedir o evento submit antes de o controlador recebê-lo.

```html
<form data-fs="form-validation" novalidate>
  <label class="fs-form-label" for="api-email">E-mail</label>
  <input class="fs-form-control" id="api-email" name="email" type="email" required>
  <button class="fs-btn" type="submit">Enviar</button>
</form>
```

`dispose()` remove o listener e o registro, mas não limpa classes/ARIA já
aplicados. O controlador não envia dados, não bloqueia submissão válida, não
cria mensagens de erro ou move foco automaticamente, e não substitui validação
no servidor. Consulte [controles de formulário](forms-controls.md) para o CSS.

## Desmontagem e limites

Use `dispose()` na instância ao desmontar uma interface que a criou. Ele remove
os recursos geridos por cada componente, mas **não promete restaurar todo o
markup, atributos, input, foco ou requisições da aplicação**. Leia as ressalvas
de lifecycle e reinicialização na página específica. `confirm()` é uma função
que retorna uma Promise, não uma classe com o contrato de instância acima.

Acessibilidade e regras de negócio continuam exigindo trabalho do consumidor:
estados `disabled`, validação, foco e conteúdo dinâmico possuem limites próprios.
O [índice de componentes](../README.md), [Pagination](../components/pagination.md),
[Spinner & Progress](../components/progress.md) e as páginas específicas detalham
anatomia, estados, API, eventos, exemplos e limites. Presença no catálogo não
significa cobertura exaustiva ou certificação de acessibilidade.
