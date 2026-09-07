export class Carousel {
  readonly carouselEl: HTMLElement;

  constructor(carouselEl: HTMLElement);

  static getInstance(el: Element): Carousel | undefined;
  static getOrCreateInstance(el: Element): Carousel;
  static next(el: Element): void;
  static prev(el: Element): void;
  static goTo(el: Element, index: number): void;

  next(): void;
  prev(): void;
  goTo(index: number): void;
  pause(): void;
  play(): void;
  dispose(): void;
}
