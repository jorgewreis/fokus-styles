# Prompt: Revisão de Código — Fokus Styles

> Uso: cole/execute este arquivo sempre que quiser uma varredura completa do
> código em busca de erros, bugs, falhas e inconsistências. Este prompt
> instrui a análise **e a correção automática** de tudo que for encontrado,
> organizado por 5 níveis de severidade.

---

## Contexto do projeto

O **Fokus Styles** é um framework CSS modular (SCSS + JS vanilla mínimo):

- `scss/` — fonte SCSS, organizada em `base/`, `settings/`, `tokens/`,
  `themes/`, `layout/`, `forms/`, `components/`, `utilities/`, `tools/`,
  `entries/`. Ponto de entrada: `scss/fokus.scss`.
- `js/` — JS vanilla mínimo (`fokus.js`).
- `scripts/` — build (`build.mjs`) e watch (`watch.mjs`) em Node/esbuild/Sass/PostCSS.
- `dist/` — saída gerada pelo build (não editar manualmente).
- Lint: Stylelint com `stylelint-config-standard-scss` (`.stylelintrc.json`).
- Sem suíte de testes automatizada configurada (`npm test` é placeholder).

Regras gerais para esta revisão:

1. **Não edite nada em `dist/`** — é saída de build, qualquer correção deve
   ser feita na fonte (`scss/`, `js/`, `scripts/`) e depois re-buildada.
2. Respeite as convenções já existentes no projeto (nomenclatura de classes,
   organização de partials, uso de `@use`/`@forward`, tokens/variáveis SCSS).
3. Rode `npm run lint:scss` antes e depois das correções para validar.
4. Se o build existir (`npm run build`), rode-o ao final para confirmar que
   nada quebrou.
5. Não introduza dependências novas, abstrações ou refatorações que não
   sejam estritamente necessárias para corrigir o problema encontrado.

---

## Como conduzir a revisão

Percorra o código (SCSS, JS, scripts de build, configs) e classifique **cada
problema encontrado** em um dos 5 níveis de severidade abaixo. Corrija todos
os níveis, começando sempre do mais crítico para o menos crítico. Ao final,
apresente um resumo do que foi encontrado e corrigido, agrupado por nível.

### Nível 1 — 🔴 Crítico
Problemas que quebram o build, geram CSS/JS inválido, causam erros em tempo
de execução, ou impedem o framework de ser consumido corretamente.

- Erros de sintaxe SCSS/CSS/JS que impedem compilação.
- Falhas no script de build (`build.mjs`) ou watch (`watch.mjs`).
- Referências quebradas: `@use`/`@forward`/`@import` para arquivos
  inexistentes, variáveis/mixins/funções não definidas.
- Exports do `package.json` apontando para caminhos que não existem em `dist/`.
- Seletores ou propriedades CSS malformados que fazem o navegador descartar
  a regra inteira.
- Loops infinitos ou recursão sem parada em mixins/funções SCSS.

### Nível 2 — 🟠 Alto
Problemas que não quebram o build, mas causam comportamento incorreto,
visível e reproduzível para quem usa o framework.

- Especificidade de seletor incorreta que quebra a cascata pretendida
  (ex.: utilitário sendo sobrescrito por componente, quando deveria vencer).
- Media queries, breakpoints ou lógica de grid (`layout/`) com valores
  errados ou invertidos.
- Tokens de design (`tokens/`, `settings/`, `themes/`) com valores
  inconsistentes entre light/dark ou entre variantes de tema.
- JS (`fokus.js`) com bugs de lógica que quebram interatividade
  (event listeners não removidos, seletores errados, `this` incorreto).
- Duplicação de regras CSS que gera conflito silencioso (a última declaração
  vence, mas não é a intenção do autor).

### Nível 3 — 🟡 Médio
Inconsistências que degradam manutenibilidade, acessibilidade ou robustez,
sem quebrar a funcionalidade principal.

- Falta de fallback para propriedades CSS modernas sem suporte amplo
  (verificar contra `.browserslistrc`).
- Problemas de acessibilidade: contraste insuficiente em temas, falta de
  estados `:focus-visible`, uso incorreto de `prefers-reduced-motion`.
- Unidades inconsistentes (mistura de `px`, `rem`, `em` sem critério).
- Nomenclatura de classes/variáveis que foge do padrão já estabelecido no
  restante do projeto.
- Regras Stylelint desabilitadas localmente (`stylelint-disable`) sem
  justificativa aparente.

### Nível 4 — 🟢 Baixo
Problemas cosméticos ou de estilo de código que não afetam o resultado
final, mas valem correção por consistência.

- Formatação/indentação divergente do restante do arquivo.
- Comentários desatualizados ou que descrevem código que já mudou.
- Ordem de propriedades CSS fora do padrão do `stylelint-config-standard-scss`.
- Imports/`@use` fora de ordem ou agrupamento inconsistente.
- Variáveis SCSS declaradas e nunca usadas.

### Nível 5 — ⚪ Informativo
Não são "erros", mas oportunidades identificadas durante a revisão que
merecem nota — **não corrigir automaticamente**, apenas reportar.

- Sugestões de simplificação que mudariam a API pública do framework
  (fora do escopo de uma correção de bug).
- Duplicação de código que só faria sentido resolver com uma refatoração
  maior.
- Dependências desatualizadas em `package.json` (reportar, não atualizar
  sem confirmação, pois pode introduzir breaking changes).

---

## Formato do resumo final

Ao terminar, apresente algo como:

```
## Revisão concluída

🔴 Crítico   — N encontrados, N corrigidos
🟠 Alto      — N encontrados, N corrigidos
🟡 Médio     — N encontrados, N corrigidos
🟢 Baixo     — N encontrados, N corrigidos
⚪ Informativo — N observados (não corrigidos, ver lista)

### Detalhes
- [nível] arquivo:linha — descrição do problema e da correção aplicada
...

### Validação
- npm run lint:scss: OK/FALHOU
- npm run build: OK/FALHOU
```

Se algum problema de Nível 1 ou 2 não puder ser corrigido com segurança
(ex.: exige decisão de design/API), **pare e pergunte** antes de prosseguir
em vez de aplicar uma correção arriscada.
