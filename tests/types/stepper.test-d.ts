import { Stepper } from "../../packages/fokus-js/js/fokus.js";

const stepper = new Stepper(document.createElement("div"));
export const results: boolean[] = [stepper.next(), stepper.prev(), stepper.goTo(1), stepper.complete()];
