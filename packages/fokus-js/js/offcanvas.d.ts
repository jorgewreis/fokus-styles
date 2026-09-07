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
  static getOrCreateInstance(el: HTMLElement, options?: OffcanvasOptions): Offcanvas;
  static show(el: HTMLElement, options?: OffcanvasOptions): void;
  static hide(el: HTMLElement): void;
  static toggle(el: HTMLElement, options?: OffcanvasOptions): void;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
