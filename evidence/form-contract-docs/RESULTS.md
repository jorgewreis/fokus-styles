# Auditoria documental de contratos de formulário

Base 79dff2f. Apenas documentação, catálogo regenerado e cinco regressões; nenhuma
mudança de runtime, SCSS, API, fixtures ou contagem (154 exemplos).

Correções: limite5MB meramente ilustrativo; sem validação automática de arquivos;
acúmulo/duplicados e FileList independente; dispose mantém markup; progresso exige
valor finito; mensagens tratadas como texto. Select snapshot e limitações de
optgroup/multiple/dynamic disabled; Combobox conserva última seleção após editar;
Datepicker inicializa ISO e entrada inválida não chama setCustomValidity.

O primeiro bloco histórico de Upload avançado foi preservado para manter
proveniência de extração; imediatamente após ele há aviso explícito de que 5MB e
arraste não são implementados por aquela marcação. A fixture básica já removia
essas promessas. Nenhum implementation[] referencia os quatro Markdown editados.

Verificação: build e docs:check aprovados; 166 testes direcionados aprovados
(inclui cinco regressões novas e todas as fixtures). Primeira rodada sem build
falhou por dist/css/fokus.css inexistente; rerun após build passou integralmente.
Sem tentativa browser adicional neste lote exclusivamente documental. Sem push,
release, deploy ou publicação. Integração e gates completos ficam com coordenador.
