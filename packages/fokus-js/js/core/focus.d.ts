export interface FocusTrap {
  activate(): void;
  deactivate(): void;
}

export function getFocusableElements(container: Element): HTMLElement[];
export function createFocusTrap(container: HTMLElement): FocusTrap;
export function onEscapeKey(callback: (event: KeyboardEvent) => void): () => void;
