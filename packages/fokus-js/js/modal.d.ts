export interface ModalOptions {
  backdrop?: boolean | "static";
}

export class Modal {
  readonly triggerEl: HTMLElement;
  readonly modalEl: HTMLElement;
  readonly dialogEl: HTMLElement;
  isOpen: boolean;

  constructor(triggerEl: HTMLElement, options?: ModalOptions);

  static getInstance(el: Element): Modal | undefined;
  static getOrCreateInstance(el: HTMLElement, options?: ModalOptions): Modal;
  static show(el: HTMLElement, options?: ModalOptions): void;
  static hide(el: Element): void;
  static toggle(el: HTMLElement, options?: ModalOptions): void;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
