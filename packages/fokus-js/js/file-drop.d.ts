export class FileDrop {
  readonly labelEl: HTMLLabelElement;
  readonly inputEl: HTMLInputElement;

  constructor(labelEl: HTMLLabelElement);

  static getInstance(el: Element): FileDrop | undefined;

  dispose(): void;
}
