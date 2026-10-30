# Close button

## Visão geral

`.fs-close` é um botão compacto, com um “×” gerado por `::before`.
É distinto de `.fs-btn-close`, documentado em [Button](button.md).
Não misture as duas classes, nem insira outro “×” como texto.

## Anatomia e exemplo

```html
<section id="aviso-local" aria-label="Aviso">
  <p>As alterações foram salvas.</p>
  <button type="button" class="fs-close" aria-label="Fechar aviso" aria-controls="aviso-local"></button>
</section>
```

A aparência não fecha nada automaticamente. Para este exemplo isolado, o
aplicativo pode associar a ação abaixo. Execute depois de criar o HTML:

```js
const aviso = document.querySelector('#aviso-local');
const fechar = aviso.querySelector('.fs-close');
fechar.addEventListener('click', () => { aviso.hidden = true; });
```

Em diálogos/toasts, use o contrato de dismiss do componente proprietário, não
este handler genérico. Ao ocultar conteúdo que contém foco, retorne o foco a
um controle lógico do aplicativo (por exemplo, o botão que abriu o painel).

## Estados

Base: 2rem × 2rem, cor herdada, opacidade .72. Hover: opacidade 1 e fundo
subtle. `:focus-visible` desenha contorno. Use `disabled` em `<button>` para
bloquear sua ativação nativa; `.fs-close` não define aparência disabled própria.

## A11y

Nome acessível é obrigatório: `aria-label` descreve o que será fechado.
`aria-controls` identifica o alvo, mas não implementa a ação. Use `type="button"`
para não enviar formulários. Verifique alvo de toque e foco em contexto real.

## Tokens e limites

`--fs-color-subtle`, `--fs-focus-width`, `--fs-focus-color` e
`--fs-focus-offset`. Não há opções, instância ou eventos JS próprios.

## Verificação

O teste `component-docs-contract.test.js` executa o handler acima sobre o
HTML da página e confere o alvo ocultado; também confere nome e type do botão.
Teste manualmente retorno de foco na composição final.
