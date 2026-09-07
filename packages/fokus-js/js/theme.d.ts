export declare class Theme {
  constructor(root?: Element);
  static getInstance(root?: Element): Theme | undefined;
  static getOrCreateInstance(root?: Element): Theme;
  static set(mode: "light" | "dark" | "auto", root?: Element): Theme;
  get(): string;
  set(mode: "light" | "dark" | "auto"): Theme;
  dispose(): void;
}
