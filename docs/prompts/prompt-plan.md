# Prompt para planejar refinamentos de um componente

Copie o texto abaixo e substitua os campos entre colchetes antes de usar.

```text
Atue como responsável pelo planejamento técnico e de design do Fokus Styles.

Quero criar um plano, sem implementar ainda, para o componente **[NOME DO COMPONENTE]**.

## Contexto do pedido

- Objetivo: [REFINAMENTO VISUAL DO COMPONENTE CAROUSEL;
Sugira correções, alterações e implementações de códigos, funcionalidades de mudanças de visual para algo com maior qualidade e usabilidade]

Antes de propor o plano, investigue o repositório e use a documentação como fonte de verdade. Não presuma que o componente está isolado: determine suas dependências, impactos visuais, comportamentais, públicos e de manutenção.

Leia, no mínimo, nesta ordem conforme forem aplicáveis:

1. `docs/README.md`, para entender o mapa e o contrato editorial da documentação;
2. a página de documentação do componente em `docs/components/` e as páginas dos componentes relacionados;
3. `docs/reference/definitions.md` e `docs/reference/stability.md`, para respeitar decisões e escopo já firmados;
4. `docs/reference/scss-architecture.md` e `docs/reference/design-tokens.md`, para preservar a arquitetura, as cascade layers, convenções e a hierarquia de tokens;
5. `docs/guides/accessibility.md`, a matriz de acessibilidade e o relatório de contraste quando o trabalho afetar interface, interação ou cores;
6. `CONTRIBUTING.md`, os mockups, exemplos, testes e o código-fonte efetivamente envolvidos.

Localize o SCSS, JavaScript, documentação, laboratórios em `mockup/`, testes unitários, testes visuais e testes de acessibilidade do componente. Consulte também tokens e componentes relacionados quando houver acoplamento, padrões compartilhados ou risco de regressão.

Priorize refinamento visual consistente com o sistema: use tokens semânticos e, quando cabível, tokens próprios do componente com fallback; não introduza valores soltos nem `!important`; preserve `@layer`, prefixos `.fs-*`, `.fs-u-*`, `.is-*`, `--fs-*` e as convenções de API. Avalie responsividade, estados padrão/hover/focus-visible/active/disabled/erro, temas claro e escuro, contraste, teclado, ARIA, foco e `prefers-reduced-motion`. Considere SemVer e compatibilidade pública ao sugerir mudanças de classes, atributos, tokens, eventos ou API JavaScript.

Se faltarem informações que alterem materialmente o plano, você pode me fazer de **5 a 10 perguntas** antes de finalizá-lo. Para cada pergunta, apresente exatamente **5 alternativas**, incluindo uma alternativa recomendada identificada como **"Recomendada"** e acompanhada de uma explicação mais detalhada do motivo. Não faça perguntas apenas por formalidade: use-as para resolver incertezas reais de objetivo, escopo, prioridade, direção visual, compatibilidade ou critérios de aceite.

Depois da investigação — e das minhas respostas, se houver perguntas — entregue um plano implementável, em português, sem modificar arquivos, com:

1. **Diagnóstico breve:** estado atual, causa/limitação e oportunidade identificada, citando arquivos e trechos relevantes.
2. **Decisões e escopo:** o que será feito, o que não será feito e as premissas adotadas.
3. **Plano passo a passo:** cada passo deve indicar arquivos prováveis, alteração concreta, justificativa, impacto em API/compatibilidade e dependências entre etapas.
4. **Direção visual e UX:** alterações propostas para hierarquia, espaçamento, tipografia, cor, elevação, responsividade e todos os estados aplicáveis; diferencie correções objetivas de sugestões opcionais.
5. **Acessibilidade e qualidade:** verificações de foco, teclado, ARIA, contraste, movimento reduzido e possíveis riscos.
6. **Testes e validação:** comandos e cenários específicos (unitário, build, lint, visual, a11y, contraste, documentação), proporcionais ao impacto.
7. **Documentação pós-implementação:** liste exatamente quais documentos devem ser corrigidos ou ampliados depois de implementar o plano — incluindo a página do componente, exemplos/mockups, tokens, guias, matriz de acessibilidade, changelog ou migração somente quando necessário — e descreva o conteúdo a atualizar. A implementação não estará concluída enquanto documentação, exemplos e testes afetados não refletirem o comportamento final.
8. **Riscos, alternativas e sugestões futuras:** riscos de regressão, trade-offs, alternativas descartadas e possíveis evoluções que devem ficar fora deste plano.
9. **Critérios de aceite:** resultados objetivos e verificáveis para considerar o trabalho concluído.

Se o pedido contiver uma implementação nova, primeiro avalie se ela pode ser composta com recursos existentes e se é coerente com a direção de consolidação do projeto. Sinalize explicitamente qualquer necessidade de discussão prévia por contradizer uma decisão documentada ou por representar uma mudança breaking.
```
