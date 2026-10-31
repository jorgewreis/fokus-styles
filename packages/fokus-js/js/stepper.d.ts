export class Stepper {
  readonly stepperEl: HTMLElement;

  constructor(stepperEl: HTMLElement);

  static getInstance(el: Element): Stepper | undefined;

  next(): boolean;
  prev(): boolean;
  goTo(index: number): boolean;
  setError(index: number, hasError?: boolean): void;
  complete(): boolean;
  dispose(): void;
}
