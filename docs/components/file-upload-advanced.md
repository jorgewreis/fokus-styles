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
| `setProgress(id, percent)` | Atualiza a barra de progresso do item (0–100). |
| `setError(id, message)` | Marca o item com erro e mostra `message` no lugar do tamanho. |
| `remove(id)` | Remove um item da lista programaticamente. |
| `dispose()` | Remove os listeners e libera as URLs de thumbnail (`URL.revokeObjectURL`). |

| Evento | Quando dispara |
|---|---|
| `fs:file-upload:added` | Após novos arquivos serem selecionados — `detail.items` é `{ id, file }[]`. |
| `fs:file-upload:removed` | Após um item ser removido — `detail` é `{ id, file }`. |

## Exemplo

Mockup completo em
[laboratório do componente](../../mockup/forms.html#file-upload).
