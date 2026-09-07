export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning" | "success" | "info" | "secondary";
}

export function confirm(options?: ConfirmOptions): Promise<boolean>;
