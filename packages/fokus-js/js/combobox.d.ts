import type { Placement } from "./core/positioning.js";

export interface ComboboxOptions {
  placement?: Placement;
}

export class Combobox {
  readonly inputEl: HTMLInputElement;
  readonly listboxEl: HTMLElement;
  isOpen: boolean;
  activeIndex: number;
  value: string | null;

  constructor(inputEl: HTMLInputElement, options?: ComboboxOptions);

  static getInstance(el: Element): Combobox | undefined;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
