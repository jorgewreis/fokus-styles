export interface OffcanvasOptions {
  backdrop?: boolean | "static";
}

export class Offcanvas {
  readonly triggerEl: HTMLElement;
  readonly offcanvasEl: HTMLElement;
  readonly hasBackdrop: boolean;
  readonly staticBackdrop: boolean;
  isOpen: boolean;

  constructor(triggerEl: HTMLElement, options?: OffcanvasOptions);

  static getInstance(el: Element): Offcanvas | undefined;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
