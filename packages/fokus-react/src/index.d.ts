import type { ForwardRefExoticComponent, ReactElement, ReactNode, RefAttributes } from "react";

export interface ModalHandle {
  show(): void;
  hide(): void;
  toggle(): void;
}

export interface ModalTriggerProps extends RefAttributes<ModalHandle> {
  target: string;
  backdrop?: boolean | "static";
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

export const ModalTrigger: ForwardRefExoticComponent<ModalTriggerProps>;

export interface ModalPanelProps {
  id: string;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export function ModalPanel(props: ModalPanelProps): ReactElement;

export interface DropdownHandle {
  show(): void;
  hide(): void;
  toggle(): void;
}

export interface DropdownTriggerProps extends RefAttributes<DropdownHandle> {
  target: string;
  placement?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

export const DropdownTrigger: ForwardRefExoticComponent<DropdownTriggerProps>;

export interface DropdownMenuProps {
  id: string;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export function DropdownMenu(props: DropdownMenuProps): ReactElement;

export interface TabListHandle {
  show(tabEl: HTMLElement): void;
}

export interface TabListProps extends RefAttributes<TabListHandle> {
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

export const TabList: ForwardRefExoticComponent<TabListProps>;
