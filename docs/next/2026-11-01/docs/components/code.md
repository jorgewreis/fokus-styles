> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

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

## Quando usar cada apresentação

Use código inline para mencionar um comando, nome de propriedade ou pequeno valor dentro de uma frase. O objetivo é distingui-lo do texto editorial sem interromper a leitura. Um arquivo completo, uma resposta de API ou uma sequência que depende de indentação deve ficar em bloco. O componente não identifica linguagem nem interpreta o conteúdo: a aparência do texto não comprova que um comando é seguro, atual ou apropriado ao ambiente do leitor.

O elemento HTML importa. `code` indica um fragmento de código; `pre` preserva a apresentação pré-formatada, incluindo espaços e quebras de linha. A classe `.fs-pre` fornece o contêiner visual, enquanto o `code` interno mantém a semântica do conteúdo. Aplicar `.fs-code` nesse filho acrescentaria a aparência compacta do código inline dentro de um bloco que já possui fundo e espaçamento; normalmente isso não é desejado.

## Variações

A implementação oferece duas apresentações, inline e bloco, sem variantes próprias de linguagem, tamanho, linhas destacadas ou numeração. Caso o produto precise de realce de sintaxe, essa integração deve ser escolhida e documentada separadamente. Não use um nome de classe inventado com prefixo do framework para sugerir que o recurso existe. Mantenha uma alternativa legível se o realçador falhar ou se as cores personalizadas forem indisponíveis.

## Integração segura de conteúdo

Ao escrever código HTML em uma página, os sinais que delimitam tags precisam ser representados como texto. No exemplo, a sequência escapada aparece ao leitor como um botão de exemplo, mas não cria um botão real dentro do bloco. Em conteúdo dinâmico, atribuir a string a `textContent` evita que marcação fornecida por outra pessoa seja interpretada. A classe CSS não sanitiza HTML e não oferece proteção contra execução quando o aplicativo escolhe uma API de inserção insegura.

Preserve também a diferença entre mostrar um comando e executá-lo. Code não abre terminal, não avalia JavaScript e não dispara requisições. Uma função de copiar pode ser adicionada pela aplicação, mas precisa de botão nomeado, tratamento de falha da área de transferência e mensagem de resultado. Copiar não deve modificar o exemplo nem executar a instrução. Dados confidenciais, chaves e credenciais reais não pertencem a um exemplo público só porque estão dentro de `pre`.

## API JS

Não há construtor Code, auto-init, eventos personalizados ou lifecycle do framework. A rolagem do bloco é nativa do navegador. Listeners de copiar, expandir ou alternar linguagem pertencem à aplicação e devem ser removidos por ela ao desmontar a interface. Um realçador externo também pode acrescentar nós ou estilos; teste essa saída e não atribua seu comportamento ao Fokus Styles.

### Rolagem e leitura prolongada

O limite de largura impede que o bloco deliberadamente tenha largura superior a seu contêiner, mas uma linha longa pode continuar exigindo rolagem interna. A implementação não define altura máxima nem quebra forçada de linha. Em uma resposta extensa, decida se é melhor oferecer todo o texto, uma região limitada ou um link para download. Ocultar o fim sem indicar que há mais conteúdo torna o exemplo incompleto para todos os leitores.

Uma região rolável com `tabindex="0"` pode ser percorrida por teclado, desde que seu foco seja perceptível e a plataforma permita esse gesto. Dê um nome que identifique o exemplo, sobretudo quando houver vários blocos na página. Não transforme automaticamente cada palavra inline em parada de Tab. Preserve a ordem das linhas e explique erros também por texto; cor, destaque ou sublinhado isolados podem desaparecer em modos de alto contraste.

### Critérios de revisão

Confira se o texto copiado preserva aspas, acentos, espaços e quebras esperados, especialmente quando a documentação é gerada de outra fonte. Teste linhas extensas, zoom e leitura no tema escuro. Os tokens ajustam superfície, borda e cores, mas a família monoespaçada depende da tipografia carregada. A validação estrutural não certifica a execução do código apresentado: exemplos de comandos ainda precisam de testes próprios no ambiente que descrevem.
