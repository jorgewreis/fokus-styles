export declare class Navbar {
  constructor(element: Element);
  static getInstance(element: Element): Navbar | undefined;
  static getOrCreateInstance(element: Element): Navbar;
  isOpen(): boolean;
  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
