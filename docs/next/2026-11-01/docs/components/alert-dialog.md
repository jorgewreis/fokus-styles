> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Alert Dialog (Confirm)

Diálogo de confirmação, 100% programático — ao contrário de todo outro
componente interativo (auto-init declarativo via `data-fs`), este é
montado na hora por `FokusStyles.confirm()`, sem marcação pré-declarada na
página. Reaproveita [Modal](modal.md) internamente (foco/teclado/overlay
já prontos).

## Visão geral

```js
const confirmado = await FokusStyles.confirm({
  title: "Excluir item?",
  message: "Essa ação não pode ser desfeita.",
  confirmText: "Excluir",
  cancelText: "Cancelar",
  variant: "danger",
});

if (confirmado) {
  // ação
}
```

`FokusStyles.confirm()` retorna uma `Promise<boolean>` — `true` se confirmado,
`false` se cancelado (botão Cancelar, `Escape`, ou clique fora).

## Anatomia

Gerada internamente: `.fs-modal.fs-alert-dialog` >
`.fs-modal-dialog.fs-modal-sm` > `.fs-modal-content` > `.fs-modal-body`
(título + `.fs-alert-dialog-message`, se `message` foi passado) +
`.fs-modal-footer` (botão Cancelar + botão de ação, na cor de `variant`).
Não há HTML pra escrever — só a chamada JS.

## Variações

`variant` aceita qualquer cor de tema (`primary`, `secondary`, `success`,
`warning`, `danger` — padrão, `info`) — vira `.fs-btn-{variant}` no botão
de confirmação.

```js
await FokusStyles.confirm({ title: "Sair sem salvar?", variant: "warning" });
```

## Estados

Nenhum estado próprio — é um fluxo de uma chamada só (abre já com foco
preso, resolve e desmonta ao confirmar/cancelar).

## A11y

Herda focus trap, `Escape` e clique-fora do [Modal](modal.md). Ao resolver
(confirmar ou cancelar), o foco volta automaticamente pro elemento que
tinha foco antes de `FokusStyles.confirm()` ser chamado (normalmente o botão
que disparou a ação).

## API JS

| Função | Retorno |
|---|---|
| `FokusStyles.confirm(options)` | `Promise<boolean>` |

| Opção | Padrão | Descrição |
|---|---|---|
| `title` | `"Tem certeza?"` | Título do diálogo. |
| `message` | `""` | Texto de apoio abaixo do título (omitido se vazio). |
| `confirmText` | `"Confirmar"` | Texto do botão de ação. |
| `cancelText` | `"Cancelar"` | Texto do botão de cancelar. |
| `variant` | `"danger"` | Cor do botão de ação (qualquer cor de tema). |

Sem `getInstance()`/`dispose()` — cada chamada cria e desmonta seu próprio
diálogo; não há instância persistente pra gerenciar.

## Tokens

Os mesmos do [Modal](modal.md) — não há token `--fs-alert-dialog-message`.
A classe `.fs-alert-dialog-message` usa `--fs-color-muted`/`$font-size-sm`.

## Exemplo

```html
<button type="button" class="fs-btn fs-btn-danger" id="btn-excluir">Excluir conta</button>
<script>
  document.getElementById("btn-excluir").addEventListener("click", async () => {
    const ok = await FokusStyles.confirm({
      title: "Excluir conta?",
      message: "Todos os seus dados serão apagados permanentemente.",
      confirmText: "Excluir conta",
      variant: "danger",
    });
    if (ok) {
      // prosseguir com a exclusão
    }
  });
</script>
```

Mockup: [laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-53851c3a37f3).

### Validação de variantes

`variant` aceita `primary`, `secondary`, `success`, `warning`, `danger` e
`info`. Valores desconhecidos usam `danger`; a entrada não é interpretada
como HTML nem como classe CSS arbitrária.

### Texto e limites das opções

`title`, `message`, `confirmText` e `cancelText` são texto, escapado antes de
compor o HTML interno. Tags aparecem literalmente; não há opção `html`.
`variant` é validada por lista permitida. Não há repasse de `backdrop` ou
`keyboard` para o Modal: só as cinco opções da tabela são lidas.

Para impedir chamadas simultâneas, o aplicativo deve controlar um estado
pendente e desabilitar o acionador enquanto aguarda a Promise. O confirm não
fornece instância pública nem função de cancelamento externa.

## Quando pedir uma confirmação

Alert Dialog é uma pergunta breve que precisa de uma decisão explícita antes de uma ação. O resultado booleano separa essa decisão da execução: receber `true` não exclui, salva ou envia nada. A aplicação continua responsável pela operação, por autorização e por apresentar seu resultado. Evite usar uma confirmação para toda interação reversível; uma pergunta repetitiva perde significado e interrompe o trabalho sem explicar o risco.

Escreva um título que nomeie a ação e uma mensagem que explique a consequência concreta. “Excluir relatório?” e a identificação do relatório oferecem mais contexto que “Tem certeza?”. O texto do botão deve descrever a decisão, enquanto Cancelar deve permitir voltar ao estado anterior sem efeitos. A variante danger destaca uma ação destrutiva visualmente, mas não substitui essa informação textual. Não apresente uma cor de sucesso como evidência de que a operação já terminou: o botão apenas autoriza a próxima etapa.

## O que a função monta e o que ela não aceita

A chamada cria um Modal pequeno no body e um gatilho sintético oculto necessário ao controlador de Modal. O usuário interage com Cancelar e Confirmar no footer; a primeira ação focável normalmente é Cancelar. O título recebe a classe que permite ao Modal gerar seu vínculo acessível. A mensagem, quando presente, é um parágrafo auxiliar: a implementação não cria automaticamente uma associação `aria-describedby` entre todo esse texto e o diálogo.

O nome comercial Alert Dialog não significa que o runtime atribua `role="alertdialog"`: ele herda `role="dialog"` do Modal. Não dependa de um anúncio urgente apenas por escolher essa função. Teste como o título, a mensagem e os controles são anunciados no fluxo real. Se sua tarefa precisa de inputs, conteúdo interativo complexo, validação inline ou rodapé customizado, monte um Modal em vez de tentar inserir tags nas opções textuais.

As cinco opções documentadas são a interface completa da função. Os tipos declaram strings para os quatro textos e uma união fechada para variant. O runtime escapa os textos e normaliza a variante, mas isso não transforma entradas de qualquer tipo em um contrato de consumo suportado. Não há callback onConfirm, opção de HTML, botão extra nem duração automática. A Promise é o mecanismo de resultado; não tente recuperar uma instância usando o elemento que abriu a confirmação, porque esse elemento não é o gatilho sintético registrado internamente.

## Um ciclo de decisão seguro

Para usar `FokusStyles.confirm` como nos exemplos, o bundle IIFE `dist/js/fokus.js` e o CSS devem estar carregados pelo aplicativo. Com bundler, o projeto pode importar o CSS de `fokus-styles` e a função exportada de `fokus-styles/js`. A função é para execução no navegador e exige document; não a execute durante renderização de servidor.

No handler do botão original, registre um estado pendente antes de chamar confirm. Enquanto aguarda, impeça reentradas para que dois cliques não criem duas perguntas sobre o mesmo registro. Depois do await, se o resultado for false, encerre o fluxo sem alterar os dados. Se for true, execute a operação real sob tratamento de erro. Use finally para liberar o estado pendente mesmo se a operação posterior falhar. Esse controle pertence à aplicação e não é uma propriedade do diálogo.

O trecho anterior que contém apenas o comentário “prosseguir com a exclusão” é deliberadamente um esqueleto de integração, não uma implementação de exclusão de conta. Ele não possui endpoint nem autorização. Em um produto real, só apresente feedback de conclusão depois que o servidor confirmar a ação. Se o servidor negar a operação, ofereça uma mensagem recuperável; abrir outra confirmação não resolve uma falha de rede ou de permissão.

## Fechamento, tema e limites

Cancelar, Escape e clique externo resolvem false. Confirmar resolve true. O fechamento usa uma proteção interna para resolver apenas uma vez, mesmo que o descarte do Modal também dispare o evento hidden. Em seguida remove o diálogo e o gatilho sintético e tenta devolver foco ao elemento que estava ativo antes da chamada. Preserve esse elemento até concluir a interação ou planeje um novo destino caso a ação o remova da tela.

A função não expõe cancelamento externo nem AbortSignal. Em navegação de uma SPA, não presuma que remover a tela original resolve automaticamente uma confirmação já montada no body. Defina uma política de navegação que conclua a pergunta antes de desmontar seu contexto. Tampouco existe fila global de confirmações na API: impedir concorrência e decidir a ordem das perguntas são responsabilidades do consumidor.

O diálogo usa os estilos e tokens do Modal, e o texto auxiliar usa `--fs-color-muted`. Como o nó é criado no body, uma customização aplicada exclusivamente em um contêiner local da tela pode não ser herdada; valide o escopo do tema adotado pela aplicação. Não há token homônimo à classe da mensagem. Ajustes em superfície, borda, sombra ou tipografia devem ser verificados com o título mais longo e com as traduções dos botões, sem supor que o tamanho pequeno comportará qualquer texto.
