import type * as FokusStylesNamespace from "./fokus.js";

declare global {
  const FokusStyles: typeof FokusStylesNamespace;

  interface Window {
    FokusStyles: typeof FokusStylesNamespace;
  }
}

export {};
