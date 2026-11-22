import { Stepper } from "../../packages/fokus-js/js/stepper.js";

class VoidReturningStepperExtension extends Stepper {
  override next(): void { super.next(); }
  override prev(): void { super.prev(); }
  override goTo(index: number): void { super.goTo(index); }
  override complete(): void { super.complete(); }
}

export { VoidReturningStepperExtension };
