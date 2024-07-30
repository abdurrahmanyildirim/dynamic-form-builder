import { Injector } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export type DynamicFormField<T = any> =
  | DynamicFormFieldDefault<T>
  | DynamicFormFieldSelect<T>
  | DynamicFormFieldSlider<T>;

export interface DynamicFormFieldBase<T = any> {
  key: string;
  type?: DynamicFormFieldTypes;
  fieldType?: 'GROUP' | 'ARRAY';
  label?: string;
  defaultValue?: any;
  /**
   * @example
   * ```ts
   *   hide:(value)=> value.gender === 'male'
   * ```
   */
  hide?: (formValue: T) => boolean;
  disable?: (formValue: T) => boolean;
  hooks?: {
    onInit?: (f: AbstractControl, injector: Injector) => void;
    afterViewInit?: (f: AbstractControl, injector: Injector) => void;
    onDestroy?: (f: AbstractControl) => void;
  };
  children?: DynamicFormField[];
  /**
   * You can pass any Angular validation.
   *
   * WARNING: The key must match the Angular validation keys. For example, when `maxLength` is used as a validator, the key should be 'maxlength'. Ensure this is accurate before using. Otherwise, the message will not match the validators created by Angular.
   */
  validators?: { message: string; key: string; validator: ValidatorFn }[];
  // asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
  /**
   * Style Classes for the field
   */
  class?: string[];
}

export type DynamicFormFieldDefault<T = any> = DynamicFormFieldBase<T> & {
  type?: 'TEXT' | 'NUMBER' | 'DATE';
};

export type DynamicFormFieldSelect<T = any> = DynamicFormFieldBase<T> & {
  type: 'SELECT';
  options: { label: string; value: string | number | unknown }[];
};

export type DynamicFormFieldSlider<T = any> = DynamicFormFieldBase<T> & {
  type: 'SLIDER';
  min?: number;
  max?: number;
  step?: number;
};

export type DynamicFormFieldTypes =
  | 'TEXT'
  | 'NUMBER'
  | 'SELECT'
  | 'SLIDER'
  | 'DATE';

/**
 * Represents errors in reactive forms.
 * The key is a path to the form control and the value is an object containing error details.
 */
export type ReactiveFormErrors = {
  [path: string]: Object;
};

/**
 * Configuration for error messages.
 * The key is a path to the form control and the value is an array of error messages associated with that path.
 */
export type FormConfigErrorMessages = {
  [path: string]: {
    key: string; // Error key, e.g., "required", "minLength"
    message: string; // Error message to be displayed
  }[];
};

/**
 * A collection of form errors combining reactive form errors and configuration error messages.
 *
 * When errors are caught from a reactive form, they are collected and matched with configuration error messages
 * using their path and key. The resulting form errors are based on these matches.
 */
export type FormErrors = FormError[];
export interface FormError {
  path: string; // like form.name.firstName or form.addresses[0].street
  key: string; // e.g. "required", "customValidatorKey"
  message: string; // "hey dude something is wrong at your form"
}
