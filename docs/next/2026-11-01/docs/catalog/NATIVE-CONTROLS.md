> **Documentação aprovada do candidato `next` (01/11/2026).** Este texto descreve a árvore `f5a5d62`, não o runtime da branch `main` nem uma nova versão npm. [Escopo e índice](../../README.md).

# Controles nativos: 12 exemplos adicionais

Base `c3f174d` (125 exemplos). O catálogo passa a 137 exemplos, ainda parcial e
não publicado. Nenhuma API, fonte SCSS ou runtime foi alterada.

| Componente | Exemplos novos | Fonte de verdade |
|---|---|---|
| Checkbox, Radio, Switch | native-states, native-tokens | forms/_check-radio-switch.scss |
| Input | native-states, native-sizes | forms/_forms.scss |
| Input Group | native-states, native-sizes | forms/_forms.scss |
| File Upload | native-states, native-sizes | forms/_forms.scss |

Todos são composições autorais, não extrações literais de Markdown. Proveniência
por exemplo registra hash do HTML, commit-base e hash do SCSS. Os tokens de gap
são aplicados na própria instância, onde os defaults são definidos; não prometemos
herança a partir de um ancestral que seria sobrescrita pelo componente.

## Contrato e limites

- Checkbox e Switch mantêm semântica checkbox nativa; não inventamos role nem
  controlador JS. Radio usa name compartilhado e exclusividade nativa. Estados
  indeterminate, forced-colors e RTL não são demonstrados neste lote.
- disabled impede a interação nativa; readonly mantém o valor disponível para
  submissão e não equivale a disabled. CSS is-invalid não valida um formulário:
  erro e aria-invalid são responsabilidade da aplicação. A fixture não limpa
  automaticamente o erro após digitação.
- Select é HTML nativo e não recebe data-fs=select nem inicializador customizado.
- Prefixos e sufixos essenciais usam aria-describedby; o rótulo visível é próprio.
  Mensagem de erro fora do input-group usa texto de ajuda sempre visível, sem
  depender de combinador de irmãos que não atravessa o wrapper.
- File Upload apenas seleciona arquivos localmente. accept é sugestão do seletor,
  não verificação de MIME/tamanho ou segurança. Não há upload, drag-and-drop,
  progresso, validação de servidor ou limite de tamanho implementado.
- Exemplos não representam certificação WCAG nem equivalência visual entre motores.
  Testes browser/axe separados precisam efetivamente executar para serem aprovados.
