> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# File Upload

Botão de seleção de arquivo estilizado (preservando o `<input type="file">` nativo) — CSS-only na base, com arrastar-e-soltar opcional via JS.

## Visão geral

```html
<div class="fs-file-upload">
  <input type="file" class="fs-file-input" id="arquivo">
  <label for="arquivo" class="fs-file-label">Escolher arquivo</label>
</div>
```

Mesma técnica de input oculto + label irmã dos outros controles
CSS-only — `for`/`id` é o que faz o clique na label abrir o seletor de
arquivo nativo.

## Anatomia

`.fs-file-upload` (wrapper) > `.fs-file-input` (`<input type="file">`,
oculto via clip) + `.fs-file-label` (`<label for="...">`, o botão
visível).

## Variações

- **Tamanho**: `.fs-file-label-sm`, `.fs-file-label-lg`; sem sufixo =
  padrão.
- **Dropzone**: `.fs-file-label-dropzone` — versão maior, borda tracejada,
  layout em coluna, pra uma área de soltar mais generosa que o botão
  padrão. Combine com `.fs-file-dropzone-hint` pra um texto de apoio
  discreto dentro.

```html
<div class="fs-file-upload" style="width: 100%;">
  <input type="file" class="fs-file-input" id="arquivo2" accept="image/png,image/jpeg">
  <label for="arquivo2" class="fs-file-label fs-file-label-dropzone" data-fs="file-drop">
    Arraste um arquivo ou clique para escolher
    <span class="fs-file-dropzone-hint">PNG/JPEG sugeridos; valide conteúdo e tamanho na aplicação</span>
  </label>
</div>
```

## Estados

- `:disabled` no input — opacidade reduzida, sem interação.
- `:focus` no input — anel de foco na label.
- `.is-dragover` na label — aplicada pelo JS de drag-and-drop enquanto um
  arquivo é arrastado por cima (ver API JS).

## A11y

`<input type="file">` nativo — totalmente operável por teclado (`Tab`
foca, `Enter`/`Space` abre o seletor do sistema) sem nenhum JS. O
drag-and-drop é um **complemento**, não uma alternativa obrigatória — quem
usa teclado sempre tem o clique na label como caminho.

## API JS

Drag-and-drop é opcional, via `data-fs="file-drop"` **na `<label>`** (não
no input). `FileDrop.getInstance(labelEl)`.

| Método | Descrição |
|---|---|
| `dispose()` | Remove os listeners de drag/drop e desregistra a instância. |

Sem eventos customizados — ao soltar um arquivo, o JS atribui
`inputEl.files` e dispara o evento nativo `change` no input (mesmo evento
de uma seleção manual, então seu código de validação/upload não precisa
saber a diferença).

```js
document.getElementById("arquivo2").addEventListener("change", (event) => {
  console.log(event.target.files);
});
```

## Tokens

`--fs-color-border`, `--fs-color-subtle`, `--fs-color-text`,
`--fs-color-muted` (hint), `--fs-color-primary` (borda durante drag-over),
`--fs-radius-sm`.

## Exemplo

Ver acima (Visão geral e Variações) — mockup completo em
[`mockup/forms.html#file-upload`](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-b7b607fabb25).

## Variante avançada (múltiplos arquivos)

Pra upload de múltiplos arquivos com preview, progresso e remoção por
item, veja [Upload avançado](file-upload-advanced.md) — evolução deste
componente, reaproveitando a mesma dropzone/botão como gatilho.

## Limites da personalização e validação

FileDrop não filtra accept, MIME, tamanho ou quantidade e não faz upload.
accept é apenas uma sugestão do seletor nativo; o drop copia o FileList recebido.
Use multiple quando a interface permitir vários arquivos e valide no aplicativo
e no servidor. Um input disabled faz o drop ser ignorado; a aparência dragover
ainda pode ser aplicada por dragenter. Dispose remove listeners, mas não limpa
is-dragover: a aplicação pode limpar essa classe ao desmontar sua composição.

## Selecionar um arquivo não significa enviá-lo

File Upload oferece uma apresentação para o controle nativo de seleção. O navegador abre o seletor do sistema e disponibiliza arquivos escolhidos no input. Nenhuma chamada de rede ocorre por causa da classe visual ou do módulo FileDrop. Um formulário nativo pode enviá-los segundo seu action e encoding; uma aplicação JavaScript pode montar sua própria requisição. Escolha esse fluxo explicitamente antes de prometer ao usuário que o arquivo já foi recebido.

O padrão básico é suficiente quando basta escolher um documento e mostrar seu nome em outro local da página. Upload avançado acrescenta uma lista gerenciada de itens e progresso, mas continua sem backend. Não acrescente essa complexidade apenas para obter uma área tracejada: a dropzone visual já está disponível no componente básico. A escolha deve refletir o que a pessoa precisa revisar antes do envio.

## Associação nativa e ordem dos elementos

O input é visualmente recortado, não removido do documento. Por isso continua disponível para interação nativa e tecnologias assistivas. O label usa for para apontar ao ID do input; esse vínculo abre o seletor quando o label é ativado. IDs devem ser exclusivos na página. Não use o mesmo ID em dois exemplos montados simultaneamente, pois o navegador e o FileDrop podem encontrar outro campo.

Além do vínculo semântico, a ordem importa para os estilos. O anel de foco e a aparência disabled usam o seletor de irmão adjacente input mais label. Inserir um elemento entre os dois preserva o vínculo for/id, mas pode quebrar esses estados visuais. Coloque o hint dentro do label ou em uma região associada por aria-describedby, sem deslocar inadvertidamente o label para fora dessa relação.

Não troque o input por uma div focável para obter aparência customizada. O controle nativo fornece acesso ao seletor, propriedades de formulário e a semântica de arquivo. Também não o esconda com display none se a intenção é manter a operação por teclado. A aparência proposta depende de um input preservado, não de um clique programático como única alternativa de acesso.

## Variações com finalidade clara

As classes de tamanho pertencem ao label. Elas alteram altura, padding e fonte, não os arquivos aceitos nem a capacidade de seleção múltipla. A dropzone amplia a área visual, usa borda tracejada e dispõe o conteúdo em coluna. Uma largura de 100% precisa de espaço no contêiner externo para se expandir; o wrapper básico é inline-flex. Verifique a composição no layout final em vez de presumir que a dropzone ocupa a página inteira.

O hint pode informar formatos sugeridos, limite de tamanho e política do produto, mas cada regra apresentada precisa existir na validação. Accept orienta o seletor, não valida conteúdo de forma confiável. Arquivos arrastados não são filtrados pelo FileDrop. Faça validação no aplicativo para feedback imediato e no servidor para a regra efetiva. Extensão e MIME declarados pelo arquivo não provam que seu conteúdo é seguro.

## Drag-and-drop como melhoria opcional

FileDrop é construído sobre o label, resolve o input pelo for e lança erro se não o encontra. O auto-init usa data-fs file-drop nesse label. Em montagem manual, carregue os estilos e importe FileDrop de fokus-styles/js em um bundler, ou use FokusStyles.FileDrop no IIFE. Consulte getInstance antes de criar para evitar listeners duplicados. O construtor não recebe opções de filtro ou limites.

O controlador conta entradas e saídas de arraste para que passar sobre o hint interno não faça a borda piscar. Dragover cancela o comportamento padrão que impediria receber o drop. Ao soltar, ele limpa o estado visual, ignora input disabled e FileList vazio, atribui os arquivos e dispara change com propagação. Não há evento customizado que diferencie a seleção por drop da seleção nativa, o que permite compartilhar o mesmo handler de validação.

Mesmo sem multiple, não presuma que esse módulo filtra a lista recebida para um único arquivo. O código copia o FileList fornecido. Se o produto permite somente um documento, valide a quantidade além de configurar o seletor. O módulo também não descobre diretórios nem percorre pastas: seu contrato é a lista de arquivos recebida no evento.

## Estado, leitura e descarte

Leia input.files no change e apresente uma síntese útil: nome selecionado, ausência de arquivo ou mensagem de rejeição. O botão estilizado não atualiza seu texto automaticamente. Use texto seguro para nomes de arquivo e não interprete esses nomes como HTML. Se houver cancelamento do seletor, não transforme a ausência de nova seleção em confirmação de upload. Mantenha os estados de selecionado, validado e enviado distintos.

O handler de log mostrado nesta página apenas inspeciona o FileList; não envia, valida ou persiste arquivos. Para uma operação real, defina um endpoint próprio e tratamento de sucesso, erro e cancelamento. Se criar URLs de preview fora deste componente, revogue-as quando deixarem de ser usadas. O FileDrop não criou essas URLs e não pode administrá-las por você.

Dispose remove os listeners de arraste e o registro, mas preserva input, label, arquivos selecionados e eventual classe is-dragover. Limpe essa apresentação ao desmontar uma composição que será reaproveitada e remova handlers de change instalados pela aplicação. A validação DOM cobre associação e eventos; abertura do seletor, arraste real entre aplicações e comportamento de arquivos precisam de teste em navegador e sistema operacional representativos.
