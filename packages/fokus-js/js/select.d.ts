export class Select {
  readonly selectEl: HTMLSelectElement;
  isOpen: boolean;

  constructor(selectEl: HTMLSelectElement);

  static getInstance(el: Element): Select | undefined;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
