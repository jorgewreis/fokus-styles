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
  static getOrCreateInstance(el: Element, options?: DropdownOptions): Dropdown;
  static show(el: Element, options?: DropdownOptions): void;
  static hide(el: Element): void;
  static toggle(el: Element, options?: DropdownOptions): void;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
