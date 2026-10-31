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
    Arraste arquivos ou clique para escolher
    <span class="fs-file-dropzone-hint">Vários arquivos, até 5MB cada</span>
  </label>
</div>
```

**Limites do exemplo acima:** o texto “até 5MB cada” é somente uma regra
ilustrativa da aplicação, **não implementada** pelo componente. Não há validação
de tamanho, MIME, extensão ou quantidade. A frase “Arraste arquivos” também
exige a composição com FileDrop mostrada abaixo; esta primeira marcação sozinha
só oferece seleção pelo controle nativo. Para um exemplo executável sem essas
promessas, consulte a fixture básica do catálogo.

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
[laboratório do componente](../../mockup/forms.html#file-upload).
