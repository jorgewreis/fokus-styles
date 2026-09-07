export interface DataTableOptions {
  pageSize?: number;
}

export class DataTable {
  readonly rootEl: HTMLElement;
  readonly tableEl: HTMLTableElement;
  pageSize: number;
  sortKey: string | null;
  sortDirection: "asc" | "desc" | "none";
  filterQuery: string;
  currentPage: number;

  constructor(rootEl: HTMLElement, options?: DataTableOptions);

  static getInstance(el: Element): DataTable | undefined;

  refresh(): void;
  sort(key: string, direction?: "asc" | "desc"): void;
  filter(query: string): void;
  goToPage(page: number): void;
  setLoading(isLoading: boolean): void;
  setError(message: string | null): void;
  dispose(): void;
}
