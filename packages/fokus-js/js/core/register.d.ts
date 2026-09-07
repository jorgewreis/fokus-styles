export interface InstanceRegistry<T> {
  get(el: Element): T | undefined;
  set(el: Element, instance: T): void;
  delete(el: Element): void;
}

export function createInstanceRegistry<T>(): InstanceRegistry<T>;

export interface AutoInitCtor<T> {
  new (el: HTMLElement, options?: unknown): T;
  getInstance(el: Element): T | undefined;
}

export function autoInit<T>(name: string, Ctor: AutoInitCtor<T>): void;
