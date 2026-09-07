export class Collapse {
  readonly triggerEl: HTMLElement;
  isOpen: boolean;

  constructor(triggerEl: HTMLElement);

  static getInstance(el: Element): Collapse | undefined;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
