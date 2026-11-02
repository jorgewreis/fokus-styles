> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Upload avançado

Evolução do [File Upload](file-upload.md) simples: múltiplos arquivos,
preview por arquivo (thumbnail de imagem, nome, tamanho), progresso
individual e remoção por item. Reaproveita a mesma dropzone/botão
(`.fs-file-upload`/`.fs-file-input`/`.fs-file-label`) como gatilho — só
adiciona a lista de itens selecionados, gerada pelo JS.

**Agnóstico de backend**: o componente não faz upload de verdade (não
sabe nada sobre XHR/fetch/protocolo) — só mantém a lista de arquivos
selecionados e expõe uma API pra seu código atualizar o progresso/erro de
cada item conforme o upload de fato acontece.

## Visão geral

```html
<div class="fs-file-upload" data-fs="file-upload-advanced">
  <input type="file" class="fs-file-input" id="anexos" multiple>
  <label for="anexos" class="fs-file-label fs-file-label-dropzone">
    Escolher arquivos
    <span class="fs-file-dropzone-hint">Revise os arquivos antes de enviar</span>
  </label>
</div>
```

A validação de tipo, tamanho e quantidade é **não implementada** pelo controlador: deve ser fornecida pela aplicação e confirmada no servidor.

**Limites do exemplo acima:** a marcação oferece seleção nativa e lista; não implementa drag-and-drop, validação ou envio. Para arraste, use a composição abaixo.

A lista (`<ul class="fs-file-upload-list">`) é criada automaticamente
dentro do wrapper se não existir uma — cada arquivo selecionado vira um
`<li class="fs-file-upload-item">` com thumbnail, nome, tamanho, barra de
progresso e botão de remover.

## Arrastar e soltar

Combine com `data-fs="file-drop"` na mesma `<label>` (ver
[File Upload](file-upload.md#api-js)) pra ganhar drag-and-drop de graça — o `FileDrop` atribui `inputEl.files` e dispara
`change`, que é o mesmo evento que o `FileUploadAdvanced` escuta:

```html
<div class="fs-file-upload" data-fs="file-upload-advanced">
  <input type="file" class="fs-file-input" id="anexos" multiple>
  <label for="anexos" class="fs-file-label fs-file-label-dropzone" data-fs="file-drop">
    Arraste arquivos ou clique para escolher
  </label>
</div>
```

## Fazendo o upload de verdade

O componente dispara `fs:file-upload:added` com o `id` de cada item novo
— use esse `id` pra chamar `setProgress`/`setError` a partir do seu
próprio código de upload:

O trecho é um esqueleto parcial de transporte, não um upload de produção. `/upload` deve existir na aplicação; faltam validação da resposta HTTP, abort/timeout e limpeza, discutidos adiante. Execute após auto-init e carregamento do IIFE.

```js
const rootEl = document.querySelector('[data-fs="file-upload-advanced"]');
const upload = FokusStyles.FileUploadAdvanced.getInstance(rootEl);

rootEl.addEventListener("fs:file-upload:added", (event) => {
  for (const { id, file } of event.detail.items) {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) upload.setProgress(id, (e.loaded / e.total) * 100);
    });
    xhr.addEventListener("error", () => upload.setError(id, "Falha no upload"));
    xhr.open("POST", "/upload");
    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  }
});
```

## Estados

- Progresso: barra `.fs-progress`/`.fs-progress-bar` (mesmo componente de
  [Spinner & Progress](progress.md)), atualizada por `setProgress(id, %)`.
- Erro: `setError(id, mensagem)` marca o item com `.is-error` e troca o
  texto de tamanho pela mensagem.
- Remoção: botão `.fs-file-upload-remove` (`.fs-btn-close`) em cada item —
  clique remove da lista, de `getFiles()` e dispara
  `fs:file-upload:removed`.

## A11y

Cada barra de progresso tem `role="progressbar"` com
`aria-valuenow`/`aria-valuemin`/`aria-valuemax` e `aria-label` incluindo o
nome do arquivo. O botão de remover tem `aria-label` dinâmico ("Remover
nome-do-arquivo.png").

## Tokens

Reaproveita os tokens do File Upload simples (`--fs-color-border`,
`--fs-color-subtle`, `--fs-color-primary`, `--fs-radius-sm`) mais os do
[Spinner & Progress](progress.md) pra barra.

## API JS

- `data-fs="file-upload-advanced"` — auto-init no wrapper
  `.fs-file-upload`.

| Método | Descrição |
|---|---|
| `FileUploadAdvanced.getInstance(el)` | Retorna a instância associada ao wrapper (ou `undefined`). |
| `getFiles()` | Retorna um array com os `File` atualmente na lista. |
| `setProgress(id, percent)` | Recebe um número finito de 0–100 e atualiza a barra; também limpa o erro anterior. |
| `setError(id, message)` | Marca o item com erro e mostra `message` no lugar do tamanho. |
| `remove(id)` | Remove um item da lista programaticamente. |
| `dispose()` | Remove os listeners e libera as URLs de thumbnail (`URL.revokeObjectURL`). |

| Evento | Quando dispara |
|---|---|
| `fs:file-upload:added` | Após novos arquivos serem selecionados — `detail.items` é `{ id, file }[]`. |
| `fs:file-upload:removed` | Após um item ser removido — `detail` é `{ id, file }`. |

## Contrato de dados e limites

- Cada `change` acrescenta todos os arquivos recebidos à lista, inclusive arquivos
  repetidos. Seleções sucessivas acumulam itens; não há deduplicação automática.
- `getFiles()` é a lista autoritativa do componente. `remove(id)` não reescreve
  `input.files`, não limpa o input e não cancela XHR/fetch iniciado pela aplicação.
  Não use o FileList nativo como espelho da lista após remoções.
- `setProgress` limita números comuns ao intervalo 0–100, mas não rejeita `NaN`.
  Valide `Number.isFinite(percent)` antes de chamar. Não há promessa de
  normalização de valores não numéricos ou não finitos.
- Nome de arquivo e mensagem de erro são exibidos como texto escapado; não são
  pontos de extensão para HTML. Isso não valida o conteúdo ou a segurança do
  arquivo, que permanecem responsabilidade da aplicação e do servidor.
- `dispose()` libera URLs de preview, remove listeners e esvazia a lista interna,
  mas não remove o markup já renderizado nem limpa `input.files`. Se for remontar
  a mesma área, a aplicação deve limpar explicitamente seus resíduos visuais/input.

## Exemplo

Mockup completo em
[laboratório do componente](../../REFERENCIAS-NAO-INCLUIDAS.md#ref-b7b607fabb25).

## Escolher a lista avançada

Upload avançado permite revisar vários arquivos escolhidos em momentos diferentes e acompanhar cada item. É útil quando o produto precisa mostrar nomes, tamanho, preview e erro individual, em vez de substituir uma única seleção. Ele organiza a interface, não a transferência. A palavra upload no nome não significa que exista endpoint, fila de rede, autenticação, retry, concorrência limitada ou cancelamento automático.

A aplicação precisa definir quando enviar: imediatamente após selecionar ou somente depois de uma confirmação. O evento added atende os dois modelos. No primeiro, ele inicia trabalho externo; no segundo, apenas atualiza o estado de revisão. Não inicie um envio automático se a interface promete que a pessoa ainda poderá revisar antes de confirmar. A arquitetura do fluxo deve preceder a ligação do evento à requisição.

## Anatomia da lista e propriedade dos nós

O wrapper contém o input nativo, seu label e uma lista fs-file-upload-list, fornecida pelo aplicativo ou criada pelo controlador. Cada item tem thumbnail, informações e botão de remover. A thumbnail usa uma URL de objeto para imagens; outros tipos recebem uma indicação de extensão. O nome é exibido como texto e o tamanho é formatado para leitura. O componente não valida a imagem nem transforma o arquivo para reduzir peso.

## Variações e composição com o seletor

O mesmo label pode usar o tamanho básico ou a dropzone do File Upload. A classe tracejada é apresentação; para receber drop, adicione FileDrop ao label. Os controladores têm proprietários diferentes: FileDrop registra a label, FileUploadAdvanced registra o wrapper. Descartar um não descarta o outro. Use multiple quando o seletor deve aceitar mais de um arquivo e mantenha o hint alinhado com a validação realmente implementada.

O construtor captura input e lista e instala listeners. Não possui objeto de opções e exige um descendente fs-file-input. A lista anterior não é interpretada como arquivos já existentes: o mapa interno nasce vazio. Se o servidor renderizou anexos previamente enviados, modele-os separadamente ou defina uma composição de aplicativo; não presuma que o controlador reconstrói objetos File a partir de nomes exibidos no HTML.

## IDs, seleções sucessivas e remoção

Cada arquivo adicionado recebe um ID próprio, comunicado em detail.items. Guarde esse ID junto à operação de rede correspondente. Dois arquivos de mesmo nome ou até o mesmo arquivo selecionado novamente podem produzir itens diferentes; não use nome como chave única. GetFiles retorna os arquivos atualmente no mapa, mas não os IDs. Preserve os handles recebidos no evento quando precisar atualizar progresso ou remover um item específico.

Remover altera a lista e emite removed com id e file. Não modifica input.files nem cancela uma requisição já iniciada. Um submit nativo posterior pode, portanto, não representar exatamente a coleção visível. Escolha uma fonte autoritativa de envio: se a interface avançada define o conjunto, use getFiles e o estado de IDs da aplicação em vez de confiar que o input nativo espelha todas as remoções.

## Transferência, resposta e erro são fases distintas

O snippet de XMLHttpRequest anterior é um esqueleto de transporte para uma rota que a aplicação precisa implementar. Ele acompanha bytes e erro de rede, mas não trata status HTTP de resposta, cancelamento, timeout, retry ou desmontagem. Uma resposta 400 ou 500 pode ocorrer no evento load, não no evento error. Não use o exemplo incompleto como evidência de sucesso: valide a resposta do servidor antes de confirmar que um anexo foi aceito.

O evento progress de xhr.upload mede transferência. Quando chegar a 100%, o servidor ainda pode estar processando. Defina como comunicar essa fase, pois a API visual não contém um estado separado de processamento remoto. Também não há evento de concluído gerado por setProgress. O consumidor decide quando mostrar o resultado final e se mantém ou remove a linha.

SetProgress limita números comuns e limpa erro anterior; não rejeita NaN. Valide o percentual antes de chamar e não deixe uma atualização atrasada de progresso apagar uma mensagem de falha definitiva. SetError substitui o texto de tamanho e aplica a aparência de erro, mas não cancela trabalho externo. Use um estado por ID para ignorar callbacks de uma tentativa cancelada ou de um item já removido, especialmente quando o usuário consegue selecionar novamente o mesmo arquivo.

## Renderização e acessibilidade durante atualizações

Cada atualização renderiza novamente o conteúdo do item. O botão de remoção pode ser substituído, o que importa se estiver focado enquanto eventos de progresso chegam. A biblioteca fornece nomes acessíveis e valores de progressbar, mas não administra a preservação de foco nessa atualização nem anuncia automaticamente todo erro como live region. Teste a experiência de teclado sob progresso frequente e acrescente feedback contextual apropriado na aplicação.

As imagens de preview são decorativas porque o nome identifica o arquivo. Um preview não prova que o arquivo é válido ou seguro. As mensagens de erro devem explicar a recuperação possível, não apenas trocar a barra para vermelho. Não exponha detalhes internos do servidor ou caminhos do sistema ao usuário. Nome de arquivo e texto de erro são escapados, mas segurança do conteúdo enviado continua sendo validada fora da interface.

## Integração e limpeza de recursos

Com bundler, carregue `fokus-styles` e importe FileUploadAdvanced de `fokus-styles/js`; no IIFE use FokusStyles.FileUploadAdvanced. Consulte getInstance no wrapper antes de uma construção manual. Registre handlers próprios de added e removed com referências removíveis. Uma estratégia de aplicativo é manter um mapa id para XMLHttpRequest ou AbortController; ao receber removed, aborte a operação correspondente e apague esse vínculo. Isso é uma responsabilidade externa, não um método oculto do componente.

Na desmontagem, interrompa requisições, remova seus listeners e descarte os dois controladores quando houver composição com FileDrop. FileUploadAdvanced revoga URLs de preview e esvazia o mapa, mas não remove os itens já renderizados nem limpa o input. Se a área for remontada sem reconstrução, limpe lista e seleção de forma explícita para não apresentar linhas sem correspondência no estado novo. Não reutilize referências a URLs revogadas como se os previews continuassem válidos.

Os tokens de formulário e Progress controlam aparência, não limites de tamanho, tipos aceitos ou quantidade. Valide a lista com nomes longos, vários erros e atualizações simultâneas antes de adotar o componente avançado em produção. Testes DOM comprovam eventos, escaping, valores e descarte de URLs simuladas; não comprovam upload real, leitura assistiva, decodificação de imagens ou comportamento do seletor nativo. Esses cenários dependem da integração do aplicativo e de testes em navegador.
