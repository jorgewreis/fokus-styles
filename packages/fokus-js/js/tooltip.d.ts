import type { Placement } from "./core/positioning.js";

export interface TooltipOptions {
  placement?: Placement;
  title?: string;
}

export class Tooltip {
  readonly referenceEl: HTMLElement;
  readonly title: string;
  readonly id: string;
  isOpen: boolean;

  constructor(referenceEl: HTMLElement, options?: TooltipOptions);

  static getInstance(el: Element): Tooltip | undefined;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
