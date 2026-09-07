export function lockScroll(): void;
export function unlockScroll(): void;
export function onClickOutside(el: Element, callback: (event: MouseEvent) => void): () => void;
