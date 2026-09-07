export class Tag {
  readonly tagEl: HTMLElement;

  constructor(tagEl: HTMLElement);

  static getInstance(el: Element): Tag | undefined;

  dismiss(): boolean;
  setLoading(loading: boolean): this;
  dispose(): void;
}
