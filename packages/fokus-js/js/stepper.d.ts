export class Stepper {
  readonly stepperEl: HTMLElement;

  constructor(stepperEl: HTMLElement);

  static getInstance(el: Element): Stepper | undefined;

  next(): void;
  prev(): void;
  goTo(index: number): void;
  setError(index: number, hasError?: boolean): void;
  complete(): void;
  dispose(): void;
}
