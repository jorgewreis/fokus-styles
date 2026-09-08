import type { Placement } from "./core/positioning.js";

export type TooltipAlign = "start" | "center" | "end";
export type TooltipPlacement = Placement | `${Placement}-${Exclude<TooltipAlign, "center">}`;

export interface TooltipOptions {
  placement?: TooltipPlacement;
  align?: TooltipAlign;
  offset?: number;
  title?: string;
  showDelay?: number;
  hideDelay?: number;
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
