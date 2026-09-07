export declare class Pagination {
  constructor(element: HTMLElement);
  static getInstance(element: HTMLElement): Pagination | undefined;
  static getOrCreateInstance(element: HTMLElement): Pagination;
  goTo(page: number): void;
  dispose(): void;
}
