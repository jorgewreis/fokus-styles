import type { Placement, Align } from "./core/positioning.js";

export interface DropdownOptions {
  placement?: Placement;
  align?: Align;
}

export class Dropdown {
  readonly toggleEl: HTMLElement;
  readonly menuEl: HTMLElement;
  isOpen: boolean;

  constructor(toggleEl: HTMLElement, options?: DropdownOptions);

  static getInstance(el: Element): Dropdown | undefined;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
