import type { Placement, Align } from "./core/positioning.js";

export interface PopoverOptions {
  placement?: Placement;
  align?: Align;
  trigger?: "click" | "hover" | "focus";
}

export class Popover {
  readonly triggerEl: HTMLElement;
  readonly popoverEl: HTMLElement;
  isOpen: boolean;

  constructor(triggerEl: HTMLElement, options?: PopoverOptions);

  static getInstance(el: Element): Popover | undefined;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
