export interface FileUploadItemHandle {
  id: string;
  file: File;
}

export class FileUploadAdvanced {
  readonly rootEl: HTMLElement;
  readonly inputEl: HTMLInputElement;
  readonly listEl: HTMLElement;

  constructor(rootEl: HTMLElement);

  static getInstance(el: Element): FileUploadAdvanced | undefined;

  getFiles(): File[];
  setProgress(id: string, percent: number): void;
  setError(id: string, message: string): void;
  remove(id: string): void;
  dispose(): void;
}
