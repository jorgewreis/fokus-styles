export type Placement = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";

export interface ComputePositionOptions {
  placement?: Placement;
  align?: Align;
  offset?: number;
  padding?: number;
}

export interface Position {
  top: number;
  left: number;
  placement: Placement;
}

export function computePosition(
  referenceEl: Element,
  floatingEl: HTMLElement,
  options?: ComputePositionOptions
): Position;

export function applyPosition(floatingEl: HTMLElement, position: Position): void;

export function watchPosition(
  referenceEl: Element,
  floatingEl: HTMLElement,
  options?: ComputePositionOptions
): () => void;
