export class Tabs {
  readonly tablistEl: HTMLElement;

  constructor(tablistEl: HTMLElement);

  static getInstance(el: Element): Tabs | undefined;
  static getOrCreateInstance(el: Element): Tabs;
  static show(el: Element, tab: HTMLElement): void;
  static dispose(el: Element): void;

  show(tab: HTMLElement): void;
  dispose(): void;
}
