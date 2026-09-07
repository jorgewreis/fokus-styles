import type { Placement, Align } from "./core/positioning.js";

export interface NestedMenuOptions {
  placement?: Placement;
  align?: Align;
}

export class NestedMenu {
  readonly toggleEl: HTMLElement;
  readonly rootMenu: HTMLElement;
  isOpen: boolean;

  constructor(toggleEl: HTMLElement, options?: NestedMenuOptions);

  static getInstance(el: Element): NestedMenu | undefined;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
