import { Injector } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';

export type DynamicFormInput =
  | DynamicFormInputDefault
  | DynamicFormInputSelect
  | DynamicFormInputSlider;

export interface DynamicFormInputBase<T = any> {
  key: string;
  type?: DynamicFormInputTypes;
  fieldType?: 'GROUP' | 'ARRAY';
  label?: string;
  defaultValue?: T;
  /**
   * Pass any reactive condition here.
   * All expressions will be triggered whenever data change on main form.
   *
   * @example
   * ```ts
   * expressions:{
   *   hide:(value)=> value.gender === 'male'
   * }
   * ```
   */
  expressions?: {
    hide?: (formValue: T) => boolean;
    disable?: (formValue: T) => boolean;
  };
  hooks?: {
    onInit?: (f: AbstractControl, injector: Injector) => void;
    afterViewInit?: (f: AbstractControl, injector: Injector) => void;
    onDestroy?: (f: AbstractControl) => void;
  };
  children?: DynamicFormInput[];
  /**
   * Can be passed any angular validation.
   */
  validators?: ValidatorFn | ValidatorFn[];
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
  class?: string[];
}

export type DynamicFormInputDefault = DynamicFormInputBase & {
  type?: 'TEXT' | 'NUMBER' | 'DATE';
};

export type DynamicFormInputSelect = DynamicFormInputBase & {
  type: 'SELECT';
  options: { label: string; value: string | number | unknown }[];
};

export type DynamicFormInputSlider = DynamicFormInputBase & {
  type: 'SLIDER';
  min?: number;
  max?: number;
  step?: number;
};

export type DynamicFormInputTypes =
  | 'TEXT'
  | 'NUMBER'
  | 'SELECT'
  | 'SLIDER'
  | 'DATE';

export type FormErrors = {
  [key: string]: Object;
};
