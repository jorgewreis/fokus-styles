export interface CommandPaletteOptions {
  shortcut?: string;
}

export class CommandPalette {
  readonly triggerEl: HTMLElement;
  readonly paletteEl: HTMLElement;
  readonly dialogEl: HTMLElement;
  readonly inputEl: HTMLInputElement;
  readonly listEl: HTMLElement;
  isOpen: boolean;
  activeIndex: number;

  constructor(triggerEl: HTMLElement, options?: CommandPaletteOptions);

  static getInstance(el: Element): CommandPalette | undefined;

  show(): void;
  hide(): void;
  toggle(): void;
  dispose(): void;
}
