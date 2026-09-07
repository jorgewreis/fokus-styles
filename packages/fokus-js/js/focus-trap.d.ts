export declare function getFocusableElements(container: Element): Element[];
export declare function createFocusTrap(container: Element): { activate(): void; deactivate(): void };
export declare function onEscapeKey(callback: (event: KeyboardEvent) => void): () => void;
