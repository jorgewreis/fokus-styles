> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Auditoria de atributos e personalização — 31/10/2026

Base 3b6b880, 152 exemplos. Este lote corrige cinco divergências prioritárias em quatro componentes
entre documentação e implementação e acrescenta duas fixtures de regressão:
catálogo154, cobertura ainda parcial. Não altera runtime, API ou SCSS.

| Documentação anterior | Evidência no código | Correção |
|---|---|---|
| FileDrop no input no exemplo de dropzone | file-drop.js resolve label.getAttribute(for) e registra na label | data-fs movido para label; teste executa blocos HTML reais da doc |
| Hint prometia PNG/JPG até5MB | drop apenas atribui FileList e dispara change, sem filtro | hint e limites explícitos: accept é sugestão, validar no aplicativo/servidor |
| Checkbox negava visual válido e dizia raio0 fixo | _check-radio-switch.scss tem is-valid/aria-invalid=false e --fs-check-radius | docs corrigidas (incluindo borda2px, cores/tokens e indeterminate sem tracejado); fixture validation-contract |
| Rating dizia preencher maiores valores | DOM decrescente e :checked ~ label selecionam3,2,1 para nota3 | texto corrigido e seletor executado sobre fixture real |
| Input listava só sm/lg | _forms.scss também tem control/select xs/xl | quatro tamanhos documentados, conferidos no CSS compilado |

Fixture FileDrop usa auto-init na label ou instância existente; cleanup remove
listeners do aplicativo e do runtime e limpa is-dragover explicitamente. O drop
em disabled é ignorado; dragenter ainda pode estilizar a label (limite existente,
não corrigido silenciosamente na fixture). Não ocorre upload. Os testes JSDOM
isolam apenas o setter de FileList; teste browser usa DataTransfer real e só pode
ser declarado aprovado se o navegador efetivamente executar.

Validação CSS não valida dados, sincroniza ARIA ou remove erros automaticamente.
Sem novas promessas de segurança, tamanho máximo ou filtragem de arquivos.
