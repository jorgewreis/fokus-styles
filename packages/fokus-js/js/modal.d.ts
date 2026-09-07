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

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
