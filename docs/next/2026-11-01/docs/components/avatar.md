> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Avatar

## Visão geral

`.fs-avatar` representa uma pessoa ou entidade com imagem ou iniciais.
Carregue o CSS completo conforme [instalação](../getting-started/installation.md).
Não há JavaScript nem carregamento/fallback automático de imagens.

## Anatomia e exemplo

A classe pode estar na própria imagem ou em um contêiner. Use imagens reais
fornecidas pelo aplicativo; o caminho abaixo é ilustrativo.

```html
<img class="fs-avatar" src="/imagens/jorge.jpg" alt="Jorge Reis" width="40" height="40">
<span class="fs-avatar fs-avatar-lg" role="img" aria-label="Érica Reis">ER</span>
<span class="fs-avatar fs-avatar-sm fs-avatar-square" role="img" aria-label="Equipe jurídica">EJ</span>
```

Uma imagem dentro de `.fs-avatar` ocupa 100% da largura/altura, com
`object-fit: cover`. O recorte pode esconder partes da imagem: confira rostos.

## Variações

| Classe adicionada à base | Dimensões | Forma |
| --- | --- | --- |
| Nenhuma | 2.5rem × 2.5rem | Circular |
| `.fs-avatar-sm` | 2rem × 2rem | Circular |
| `.fs-avatar-lg` | 3.5rem × 3.5rem | Circular |
| `.fs-avatar-square` | Mantém tamanho | Cantos com `--fs-radius-md` |

## Estados

Não existem estados de presença, carregamento ou erro próprios. Se a imagem
falhar, o aplicativo precisa substituí-la por iniciais ou outro conteúdo.
Não transforme o avatar em botão somente acrescentando `tabindex`.

## A11y

Forneça `alt` para imagens informativas. Quando o nome já estiver ao lado e
a imagem for redundante, use `alt=""`. Iniciais informativas usam `role="img"`
e nome acessível; uma ação deve envolver o avatar em um botão/link semântico.

## Tokens e limites

O fundo/texto usam `--fs-color-primary` / `--fs-color-on-primary`.
O tamanho usa valores fixos em rem, não um token `--fs-avatar-size`.
Valide contraste se substituir as cores. Não há API JS.

## Verificação

Teste nome acessível, recorte da imagem, iniciais longas, temas e imagem ausente.
Os exemplos HTML têm suas classes conferidas contra o CSS compilado em
`tests/unit/component-docs-contract.test.js`; isso não comprova qualidade de imagens.

## Escolha e integração

O Avatar fornece uma identificação visual compacta, mas não substitui o nome da pessoa. Ele é útil ao lado de responsáveis, autores de comentários e equipes, principalmente quando uma lista contém várias pessoas com funções diferentes. Antes de escolher a imagem, defina qual entidade está sendo representada: uma fotografia de perfil, uma marca de organização e iniciais são conteúdos diferentes, ainda que ocupem o mesmo espaço. Não reaproveite a mesma imagem genérica de modo que sugira uma identidade inexistente.

A aplicação é responsável por fornecer a URL, verificar autorização de acesso e escolher um fallback. O CSS não solicita uma segunda imagem quando a primeira falha e não gera iniciais a partir de um nome. Se usar iniciais, calcule-as segundo a convenção do produto, considerando nomes compostos, caracteres acentuados e alfabetos que não seguem a separação por espaços. Limite a quantidade visual de caracteres; uma palavra inteira dentro do círculo não vira automaticamente uma abreviação legível.

### Imagem direta ou contêiner

As duas anatomias documentadas atendem a necessidades diferentes. Aplicar `.fs-avatar` na imagem é suficiente quando só existe uma fotografia. Usar um contêiner permite substituir seu conteúdo por iniciais sem trocar o elemento externo. A regra para uma imagem descendente preenche a largura e a altura do contêiner, mas isso não representa um componente de slideshow nem uma sobreposição de estados. Colocar vários filhos visuais simultâneos exige uma composição própria, porque o layout base simplesmente os alinha com flex.

`object-fit: cover` preserva a proporção da fotografia ao preencher o espaço; quando a proporção original difere do quadro, parte da imagem fica fora da área visível. O `overflow: hidden` mantém esse recorte dentro do círculo ou quadrado. Teste fotografias de perfil próximas das bordas, rostos múltiplos e imagens verticais. A escolha do ponto de interesse ou de um recorte editorial não é feita pelo framework.

## API JS

Não existe construtor Avatar, evento de carregamento do framework ou método de atualização. Eventos nativos de imagem, como `load` e `error`, podem ser tratados pela aplicação. Se instalar listeners para trocar a fotografia por iniciais, remova-os quando desmontar a interface e evite ciclos que reatribuam indefinidamente a mesma URL inválida. O nome acessível deve continuar coerente após a substituição, não apenas a forma visual.

### Conteúdo redundante e ação

Uma imagem informativa sem nome visível próximo precisa de texto alternativo que identifique a pessoa. Quando fotografia e nome aparecem juntos no mesmo link, repetir o nome no `alt` pode tornar a leitura redundante; nesse caso, o texto visível pode nomear o link e a imagem pode ter `alt=""`. A decisão depende do conjunto, não de uma regra de que todo avatar precisa anunciar novamente o nome.

Para abrir um perfil, use um link com destino real; para abrir um menu, use um botão com o contrato desse menu. A classe do avatar não torna um `span` acionável, não cria foco e não implementa Enter ou Espaço. Também não existe indicador de presença automático: uma borda verde adicionada pelo aplicativo não deve ser interpretada como usuário online sem dados e texto que sustentem esse significado.

### Dimensões, temas e limites

Os tamanhos são definidos em rem, enquanto os atributos HTML de largura e altura podem reservar espaço antes do CSS carregar. Confira o resultado com a fonte raiz e o zoom reais do produto; não interprete os valores como pixels invariáveis. A variante quadrada modifica apenas o raio, não o tamanho. Personalizações devem preservar uma relação coerente entre a área do avatar, o texto ao lado e o alvo de uma eventual ação.

Teste ausência de imagem, nomes iguais, iniciais extensas e tema escuro. As cores de fundo e texto são tokens do tema, não uma análise automática da fotografia. Esta documentação comprova a estrutura disponível; qualidade do recorte, contraste de uma marca e privacidade da imagem precisam ser avaliados na aplicação.
