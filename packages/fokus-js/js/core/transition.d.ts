export interface TransitionOptions {
  duration?: number;
}

/** Cancels the pending height transition without emitting completion. */
export function cancelHeightTransition(el: HTMLElement): void;

export function collapse(el: HTMLElement, options?: TransitionOptions): Promise<boolean>;
export function expand(el: HTMLElement, options?: TransitionOptions): Promise<boolean>;
export function onTransitionEnd(el: HTMLElement, propertyName?: string): Promise<void>;
