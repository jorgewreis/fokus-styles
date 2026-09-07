export interface NotificationCenterOptions {
  target?: string;
  storage?: "memory" | "local";
  storageKey?: string;
  toastContainer?: string;
}

export interface PushOptions {
  title?: string;
  body?: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  autohide?: boolean;
  delay?: number;
}

export interface NotificationRecord {
  id: string;
  title: string;
  body: string;
  variant: string;
  time: number;
  read: boolean;
}

export class NotificationCenter {
  readonly triggerEl: HTMLElement;
  readonly panelEl: HTMLElement;
  history: NotificationRecord[];
  isOpen: boolean;
  readonly unreadCount: number;

  constructor(triggerEl: HTMLElement, options?: NotificationCenterOptions);

  static getInstance(el: Element): NotificationCenter | undefined;

  push(options?: PushOptions): string;
  remove(id: string): void;
  clear(): void;
  getAll(): NotificationRecord[];
  open(): void;
  close(): void;
  toggle(): void;
  dispose(): void;
}
