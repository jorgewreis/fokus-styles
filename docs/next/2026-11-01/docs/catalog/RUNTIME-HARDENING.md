> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Runtime: Dropdown disabled e descarte de Breadcrumb

Base: `693fda081781f1820705fcd8317a1df283b7315b`. Catálogo preservado:
154 exemplos, 56 componentes; sem mudanças em fixtures, SCSS, tipos ou API pública.

## Efeitos verificados

- Dropdown impede click/auxclick e Enter/Espaço em itens `.is-disabled`,
  `disabled` e `aria-disabled="true"` antes dos handlers do item. Não navega,
  não fecha e não transfere foco; itens habilitados mantêm ordem dos eventos.
  Remove as guardas em dispose. Não substitui autorização de negócio nem
  intercepta listeners de captura externos que já executaram.
- Breadcrumb cancela RAF e ignora fonts.ready depois do descarte. Destrói apenas
  Tooltips de sua propriedade ainda registrados; preserva instâncias externas,
  inclusive substitutas. Dispose é idempotente e seguro sob reentrada. Classes
  de truncamento e data-title permanecem, como documentado.
- Proveniência corrente revalidada em runtime-revalidation.json; auditRows
  histórico preservado. Catálogo gerado novamente a partir da implementação.

## Tamanho

JS gzip: 26.549 bytes, +219 frente à base (26.330); excedia o teto anterior
26.496 em 53. Após autorização explícita, teto 26.560 (+64), margem 11 bytes.
CSS e seus tetos inalterados. Binding compartilhado, callback inline, coleção
alternativa e opções posicionais comuns não produziram economia suficiente;
mantida implementação clara, sem retirar guardas. Controle negativo confirma
falha quando o bundle excede o limite e sucesso após restauração exata.

## Validação e limitações

919 testes unitários em 72 arquivos; catálogo 16/16. Build, lint, tipos,
documentação, empacotamento, consumidores React 18/19 (tipos estritos e SSR),
contraste (57 pares) e tamanho verificados. Logs completos no checkpoint.

Os 15 casos novos de browser (5 casos em 3 engines), a suíte a11y e a suíte
visual foram invocados, mas Chromium não está instalado neste ambiente:
`chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell`.
Nenhum resultado visual/axe em navegador é alegado; os corpos não executaram.
Executar em ambiente preparado antes de publicação. Não houve publicação,
update de branch remoto, PR ou tentativa de repetir operações bloqueadas.

Falhas transitórias de empacotamento foram resolvidas usando cache npm gravável;
gates do catálogo foram repetidos após estabilizar build/fontes e regeneração.
