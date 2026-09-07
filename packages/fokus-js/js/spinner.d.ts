export declare class Spinner {
  constructor(element: HTMLElement);
  static getInstance(element: HTMLElement): Spinner | undefined;
  static getOrCreateInstance(element: HTMLElement): Spinner;
  start(): void;
  stop(): void;
  toggle(): void;
  dispose(): void;
}
