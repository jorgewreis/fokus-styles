# Code

## Visão geral

`.fs-code` apresenta código inline e `.fs-pre` apresenta blocos pré-formatados.
Não inclui realce de sintaxe, numeração de linhas, execução nem botão de copiar.

## Anatomia e exemplo

```html
<p>Execute <code class="fs-code">npm run build</code> para gerar os arquivos.</p>
<pre class="fs-pre" tabindex="0" role="region" aria-label="Exemplo de saudação"><code>const nome = "Jorge";
console.log(`Olá, ${nome}`);
// HTML deve ser escapado: &lt;button&gt;Salvar&lt;/button&gt;</code></pre>
```

O `pre` preserva espaços e quebras de linha; mantenha `code` dentro dele.
Não aplique `.fs-code` ao código interno se quiser evitar o estilo de chip
inline dentro do bloco. Escape `<` e `&` ao inserir texto em HTML; para conteúdo
dinâmico, use `textContent`, não `innerHTML` com entrada não confiável.

## Estados

`.fs-pre` usa `max-width:100%` e `overflow:auto`. Linhas maiores que o espaço
disponível podem rolar horizontalmente; não há quebra automática de linhas nem
altura máxima. O aplicativo decide quando limitar a altura.

## A11y

No exemplo, `tabindex="0"` permite foco para rolagem por teclado, e a região
possui nome. Não remova o indicador de foco. Avalie se é necessário adicionar
uma parada de Tab para blocos pequenos que não rolam. Não use apenas cor para
indicar linhas com erro e mantenha a ordem de leitura do código.

## Tokens e limites

Inline: `--fs-color-danger`, `--fs-color-subtle`, `--fs-radius-sm`.
Bloco: `--fs-space-4`, `--fs-color-text`, `--fs-color-subtle`,
`--fs-color-border`, `--fs-radius-md`. Não há API JS; fonte monospace também
depende dos estilos tipográficos/reset carregados.

## Verificação

`component-docs-contract.test.js` verifica classes, semântica pre/code e
preservação do HTML escapado como texto. Confira rolagem/foco no navegador.
