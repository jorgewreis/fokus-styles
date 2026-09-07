export interface TransitionOptions {
  duration?: number;
}

export function collapse(el: HTMLElement, options?: TransitionOptions): Promise<void>;
export function expand(el: HTMLElement, options?: TransitionOptions): Promise<void>;
export function onTransitionEnd(el: HTMLElement, propertyName?: string): Promise<void>;
