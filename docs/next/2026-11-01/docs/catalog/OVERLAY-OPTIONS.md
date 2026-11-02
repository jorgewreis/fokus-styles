> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Overlays: quatro exemplos complementares

Base `55ac61f`; fontes JS e tipos públicos conferidos. Não altera runtime.
Os hashes por exemplo constam em fixture-provenance.json.

- Offcanvas static-end: classe end e data-backdrop=static. Escape e clique fora
  não fecham; botão dismiss continua disponível.
- Offcanvas no-backdrop-bottom: atributo textual data-backdrop=false e classe
  bottom. Continua modal, com focus trap e scroll lock. Não usar a opção JS
  boolean false como equivalente: a implementação compara com string "false".
- Popover focus-bottom-start: foco abre; dismiss retorna foco sem reabrir;
  sem focus trap modal. Placement pode ser invertido para caber na viewport.
  Trigger manual encontrado no JS não é promovido: não está nos tipos públicos.
- Alert Dialog warning-copy: confirm com rótulos próprios e mensagem literal
  com caracteres HTML, sem executar HTML. Impede abertura duplicada e cancela
  diálogo pertencente à fixture no pagehide. Não modifica dados reais.

Testes JSDOM executam os inicializadores reais, estado, fechamento, reabertura,
seleção de variante, texto escapado e cleanup. Browser/axe devem executar em
ambiente autorizado com navegadores; não há certificação visual ou WCAG.
