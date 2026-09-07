export declare class FormValidation {
  constructor(form: HTMLFormElement);
  static getInstance(form: HTMLFormElement): FormValidation | undefined;
  static getOrCreateInstance(form: HTMLFormElement): FormValidation;
  validate(event: SubmitEvent): boolean;
  dispose(): void;
}
