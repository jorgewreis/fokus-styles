import type { Placement } from "./core/positioning.js";

export interface DatepickerOptions {
  placement?: Placement;
}

export class Datepicker {
  readonly inputEl: HTMLInputElement;
  readonly panelEl: HTMLElement;
  isOpen: boolean;
  selectedDate: Date | null;
  viewDate: Date;
  value: string | null;

  constructor(inputEl: HTMLInputElement, options?: DatepickerOptions);

  static getInstance(el: Element): Datepicker | undefined;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
