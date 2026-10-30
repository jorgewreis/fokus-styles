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
