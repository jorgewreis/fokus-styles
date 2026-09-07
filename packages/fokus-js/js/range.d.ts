export class RangeSlider {
  readonly inputEl: HTMLInputElement;
  readonly outputEl: HTMLElement | null;

  constructor(inputEl: HTMLInputElement);

  static getInstance(el: Element): RangeSlider | undefined;

  dispose(): void;
}
