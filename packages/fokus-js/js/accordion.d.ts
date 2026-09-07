export class Accordion {
  readonly accordionEl: HTMLElement;

  constructor(accordionEl: HTMLElement);

  static getInstance(el: Element): Accordion | undefined;

  dispose(): void;
}
