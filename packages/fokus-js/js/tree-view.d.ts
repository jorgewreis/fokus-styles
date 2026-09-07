export class TreeView {
  readonly rootEl: HTMLElement;

  constructor(rootEl: HTMLElement);

  static getInstance(el: Element): TreeView | undefined;

  expand(item: HTMLElement): void;
  collapse(item: HTMLElement): void;
  toggle(item: HTMLElement): void;
  select(item: HTMLElement): void;
  dispose(): void;
}
