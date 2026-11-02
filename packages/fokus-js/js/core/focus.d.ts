export interface FocusTrap {
  activate(options?: { focus?: boolean }): void;
  focusFirst(): void;
  deactivate(): void;
}

export function getFocusableElements(container: Element): HTMLElement[];
export function createFocusTrap(container: HTMLElement): FocusTrap;
export function onEscapeKey(callback: (event: KeyboardEvent) => void): () => void;
/** Internal transaction: preserve live background attributes while traps isolate it. */
export function updateFocusIsolation(change?: () => void): void;
