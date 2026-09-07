export function lockScroll(): void;
export function unlockScroll(): void;
export function onClickOutside(el: Element, callback: (event: MouseEvent) => void): () => void;
export function registerOverlay(instance: { hide?: () => void }): void;
export function unregisterOverlay(instance: { hide?: () => void }): void;
