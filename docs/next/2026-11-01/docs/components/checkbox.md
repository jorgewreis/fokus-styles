> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Checkbox

Checkbox 100% CSS, desenhado sobre um `<input type="checkbox">` nativo —
teclado, foco e semântica são os do navegador; o framework só estiliza.

## Visão geral

Checkbox expressa uma escolha que pode ser ligada ou desligada independentemente de outras. É adequado para selecionar várias linhas, aceitar uma condição ou escolher interesses em um formulário. Se só uma alternativa puder ser escolhida, use Radio; se a intenção for comunicar uma preferência liga/desliga de efeito imediato, considere Switch. A escolha do componente deve refletir a regra de interação, não apenas o formato desejado.

O valor marcado pertence ao input, enquanto o desenho é produzido no label. Isso preserva comportamento de formulário e teclado nativos, mas torna a relação entre os dois elementos obrigatória para a aparência e a interação. Não substitua o input por uma div com um desenho de caixa: seria necessário reimplementar foco, semântica e ativação que o navegador já oferece.

```html
<div class="fs-check">
  <input type="checkbox" class="fs-check-input" id="aceite">
  <label for="aceite" class="fs-check-label">Aceito os termos</label>
</div>
```

## Anatomia

Mantenha o label imediatamente após o input: os seletores de estado usam o combinador adjacente `+`. Inserir uma mensagem entre os dois quebra o desenho do estado mesmo que `for` continue apontando ao ID certo. Coloque ajuda depois do label, com ID próprio, e associe-a ao input quando necessário.

Não aplique `display: none` ao input para escondê-lo. A técnica de clipping já o retira visualmente sem retirar sua participação no foco. Os pseudo-elementos da label não são controles adicionais, portanto não devem receber handlers próprios nem ser tratados como duas caixas independentes. Ao clicar no texto, a associação nativa deve continuar alternando o mesmo input.

`.fs-check` (wrapper) > `.fs-check-input` (`<input>`, visualmente oculto
via clip — continua focável/anunciado por leitor de tela) + `.fs-check-label`
(`<label for="...">`, desenha a caixa via `::before` e a marca via
`::after`). Input e label são **irmãos**, não aninhados — a associação é só
por `for`/`id` (mesma técnica de [Segmented Control](segmented-control.md)
e [Rating](rating.md)).

O `for`/`id` é obrigatório: sem ele, clicar no texto não alterna o
checkbox, e leitores de tela não anunciam o rótulo.

## Variações

Os modificadores de tamanho pertencem ao wrapper porque nele são definidos os tokens locais consumidos pela label. A dimensão da caixa não descreve toda a área clicável: o texto associado também participa da ativação. Em listas densas, preserve separação suficiente entre labels vizinhas para que tocar um texto não acione o item errado.

Uma personalização do raio muda somente o desenho, não o significado de escolha independente. Não use uma caixa circular para sugerir exclusividade quando o HTML continua permitindo múltiplas escolhas; consistência entre forma e comportamento reduz a necessidade de explicar o formulário.

Tamanho: `.fs-check-sm`, `.fs-check-lg` no wrapper (sem sufixo = padrão).
O raio usa `--fs-check-radius` (padrão `var(--fs-radius-sm)`). Desmarcado usa
`--fs-color-border` na borda; marcado usa `--fs-color-primary` e a marca
`--fs-check-mark-color` (padrão `--fs-color-on-primary`). Hover desmarcado usa
`--fs-control-hover-bg`; active usa `--fs-control-active-bg`.

```html
<div class="fs-check fs-check-sm">...</div>
<div class="fs-check fs-check-lg">...</div>
```

## Estados

`checked` no HTML estabelece a configuração inicial; durante a interação, leia e escreva a propriedade `input.checked`. O atributo inicial e a propriedade corrente podem divergir após a pessoa clicar. Um reset de formulário usa os valores padrão nativos, não um estado armazenado pelo Fokus Styles, pois não há controlador JavaScript do componente.

O indeterminado é útil para um controle “Selecionar todos” quando somente alguns itens estão marcados. A aplicação deve calcular esse estado a partir dos filhos e atribuir `indeterminate`; o framework não percorre a lista nem implementa seleção em lote. O estado visual misto não substitui a propriedade `checked` e não define sozinho o que será enviado no formulário. O trecho JavaScript abaixo precisa do elemento `c2` montado antes de executar.

A aparência de erro é especialmente forte nesta implementação: um X pode aparecer mesmo sem seleção. Não interprete esse desenho como um terceiro valor de negócio. Preserve o texto do erro e o estado real do input, para que “não aceito” não seja confundido com “aceito, porém inválido”.

- **checked**: atributo `checked` no `<input>`.
- **indeterminate**: só via JavaScript (`input.indeterminate = true` — não
  existe atributo HTML equivalente; o framework estiliza `:indeterminate`,
  com borda `primary` e traço horizontal; não define borda tracejada).
- **disabled**: atributo `disabled` no `<input>`.
- **Validação**: use `.is-invalid` no `<input>` quando houver erro. O
  inválido usa preenchimento `danger` com um X na cor `--fs-color-on-danger`, inclusive quando não
  está marcado. `.is-valid` ou `aria-invalid="false"` aplica borda de sucesso;
  `.is-invalid` ou `aria-invalid="true"` aplica erro. São estados visuais:
  CSS não valida os dados nem sincroniza classes e ARIA automaticamente.
- **Disabled**: a label recebe opacidade reduzida. As regras compartilhadas de superfície
  usam tokens `--fs-switch-track-*`, definidos localmente em Switch; fora desse
  contexto não se deve prometer o mesmo preenchimento atenuado em Checkbox.
- **Foco**: `:focus-visible` no input desenha o anel sobre a caixa
  (`::before` da label), não sobre o texto.
- **Hover/active**: superfície e borda confirmam a interação sem depender
  apenas da cor do texto.
- **RTL e movimento**: propriedades lógicas acompanham `dir="rtl"` e as
  transições são desativadas em `prefers-reduced-motion: reduce`.

```html
<input type="checkbox" class="fs-check-input is-invalid" id="c1">
<label for="c1" class="fs-check-label">Campo obrigatório</label>
```

```js
document.getElementById("c2").indeterminate = true;
```

## A11y

Não acrescente `aria-checked` manualmente a um checkbox nativo para tentar acompanhar cada clique; o navegador já expõe sua propriedade. Já o erro e sua explicação exigem trabalho da aplicação: a classe visual não cria `aria-describedby` nem altera `aria-invalid` sozinha. Em um grupo, a legend fornece a pergunta e os labels fornecem as alternativas.

Ao serializar um formulário, checkboxes não marcados não produzem a mesma entrada que os marcados. Defina `name` e `value` conforme o contrato de dados e trate a ausência de seleção conscientemente. Os exemplos visuais omitem persistência; uma opção marcada na tela não significa que o servidor recebeu uma alteração.

- `<input type="checkbox">` nativo — `Space` alterna, `Tab` foca, leitor de
  tela anuncia estado (marcado/desmarcado/indeterminado) automaticamente.
  Nenhum ARIA extra é necessário.
- Sempre associe `label` via `for`/`id` — não use só `aria-label` no input
  se houver texto visível ao lado (duplica a leitura ou some com o clique
  no texto).
- Para grupos relacionados, use `fieldset`/`legend`. Associe ajuda ou erro
  com `aria-describedby` e indique erro com `aria-invalid="true"` quando
  aplicável.

## API JS

Nenhuma — 100% CSS. `indeterminate` é uma propriedade do DOM nativo do
`<input>`, não uma API do FokusStyles.

## Tokens

Os tokens são definidos na raiz `.fs-check`, permitindo personalização por instância. Mudar `--fs-check-size` sem revisar espaçamento e textos longos pode criar uma composição desconfortável, apesar de válida em CSS. Verifique desmarcado, marcado, misto, erro e disabled em vez de avaliar apenas o estado mais vistoso.

A folha contém regras para redução de movimento, contraste preferido e cores forçadas. Esses ramos são suporte de implementação, não um certificado de acessibilidade da sua combinação de tema e conteúdo. A revisão deve incluir foco visível na caixa e texto legível quando o sistema troca as cores.

Tokens de componente podem ser sobrescritos por instância sem `!important`:

| Token | Fallback | Uso |
|---|---|---|
| `--fs-check-size` | `18px` | Caixa visual |
| `--fs-check-border-width` | `2px` | Borda |
| `--fs-check-radius` | `--fs-radius-sm` | Raio |
| `--fs-check-gap` | `--fs-space-2` | Distância até o texto |
| `--fs-check-mark-color` | `--fs-color-on-primary` | Marca |

## Exemplo

```html
<div class="fs-check">
  <input type="checkbox" class="fs-check-input" id="c1" checked>
  <label for="c1" class="fs-check-label">Marcado</label>
</div>
<div class="fs-check">
  <input type="checkbox" class="fs-check-input" id="c2" disabled>
  <label for="c2" class="fs-check-label">Desabilitado</label>
</div>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-c6c9cce63a6b).
