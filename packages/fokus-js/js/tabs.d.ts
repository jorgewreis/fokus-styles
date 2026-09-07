export class Tabs {
  readonly tablistEl: HTMLElement;

  constructor(tablistEl: HTMLElement);

  static getInstance(el: Element): Tabs | undefined;

  show(tab: HTMLElement): void;
  dispose(): void;
}
