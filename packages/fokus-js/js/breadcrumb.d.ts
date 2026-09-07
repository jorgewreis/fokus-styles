export interface BreadcrumbOptions {
  maxItems?: number;
}

export class Breadcrumb {
  readonly listEl: HTMLElement;
  readonly maxItems: number;
  isCollapsed: boolean;

  constructor(listEl: HTMLElement, options?: BreadcrumbOptions);

  static getInstance(el: Element): Breadcrumb | undefined;

  dispose(): void;
}
