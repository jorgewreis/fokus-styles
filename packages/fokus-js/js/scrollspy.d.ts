export declare class Scrollspy {
  constructor(element: Element);
  static getInstance(element: Element): Scrollspy | undefined;
  static getOrCreateInstance(element: Element): Scrollspy;
  activate(section: Element): void;
  dispose(): void;
}
