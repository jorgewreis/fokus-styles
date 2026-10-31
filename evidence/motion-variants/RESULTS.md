# Motion variants — validação

Cinco exemplos aditivos sobre 55ac61f, sem alteração de runtime ou SCSS.
Build, docs:check e test:catalog (16 testes) aprovados. Gates de markup e
inicializadores reais: 212 testes aprovados. Comportamento final direcionado:
5 testes aprovados (collapse assíncrono, recuperação loading, foco de tag,
carousel manual e estático). Dois erros de expectativa iniciais foram corrigidos:
evento de transição deve ser aguardado; controls static são ocultos por CSS,
não pelo atributo hidden. Nada foi mascarado com skip.

Browser: 15 casos escritos (5 × três motores); execução fail-fast bloqueada por
Chromium ausente antes do corpo. Não há aprovação axe, visual ou teclado real.
Contagem global da documentação deve ser regenerada pelo integrador do lote.
