import { vi } from "vitest";

// Sem isso, React 18 avisa "not configured to support act(...)" em todo
// teste de tests/unit/fokus-react.test.js — a flag informa ao React que
// o ambiente atual (vitest + jsdom) sabe lidar com act().
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom não implementa matchMedia; várias partes de js/core/ (prefers-reduced-motion) dependem dele.
window.matchMedia =
  window.matchMedia ||
  vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));

// jsdom não faz layout: offsetParent é sempre null, o que zeraria getFocusableElements()
// (js/core/focus.js) mesmo para elementos visíveis no teste. Aproxima "tem offsetParent"
// como "está anexado ao DOM", que é o suficiente para os testes de foco.
Object.defineProperty(HTMLElement.prototype, "offsetParent", {
  configurable: true,
  get() {
    return this.isConnected ? document.body : null;
  },
});

// Viewport determinístico para os cálculos de posicionamento (js/core/positioning.js).
Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, value: 1024 });
Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: 768 });

// jsdom só expõe requestAnimationFrame com pretendToBeVisual; garante um fallback
// para js/core/transition.js funcionar independente da configuração do ambiente.
window.requestAnimationFrame = window.requestAnimationFrame || ((callback) => setTimeout(() => callback(Date.now()), 16));
window.cancelAnimationFrame = window.cancelAnimationFrame || ((id) => clearTimeout(id));

// jsdom não implementa scrollIntoView (js/combobox.js usa pra manter a opção
// ativa visível durante a navegação por teclado).
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (() => {});

// jsdom não implementa URL.createObjectURL/revokeObjectURL (js/file-upload-advanced.js
// usa pra gerar thumbnail de imagem a partir do File selecionado).
if (!window.URL.createObjectURL) {
  let counter = 0;
  window.URL.createObjectURL = vi.fn(() => `blob:mock-${(counter += 1)}`);
  window.URL.revokeObjectURL = vi.fn();
}
