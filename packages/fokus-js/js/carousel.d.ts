export class Carousel {
  readonly carouselEl: HTMLElement;

  constructor(carouselEl: HTMLElement);

  static getInstance(el: Element): Carousel | undefined;

  next(): void;
  prev(): void;
  goTo(index: number): void;
  pause(): void;
  play(): void;
  dispose(): void;
}
