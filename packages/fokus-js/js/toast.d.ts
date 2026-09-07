export class Toast {
  readonly toastEl: HTMLElement;
  isOpen: boolean;

  constructor(toastEl: HTMLElement);

  static getInstance(el: Element): Toast | undefined;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
