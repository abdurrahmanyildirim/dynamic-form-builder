import type {
  InjectOptions,
  ProviderToken,
  Type,
  WritableSignal,
} from '@angular/core';
import type { AbstractControl, ValidatorFn } from '@angular/forms';

export type DynamicFormField =
  | DynamicFormFieldDefault
  | DynamicFormFieldText
  | DynamicFormFieldSelect
  | DynamicFormFieldCustom;

export type DynamicFormFieldTypes =
  | 'text'
  | 'email'
  | 'number'
  | 'select'
  | 'slider'
  | 'toggle'
  | Type<unknown>;

export type DynamicFormFieldDefault = {
  key?: string;
  type?: DynamicFormFieldTypes;
  defaultValue?: any;
  label?: string;
  placeholder?: string;
  hide?: (field: Field) => boolean;
  disable?: (field: Field) => boolean;
  resetOnHide?: boolean;
  /**
   * Pass any variables to the component from form config.
   * Method props will be updated at every data change.
   * Can be used if you need reactive variables.
   */
  props?: {
    [key: string]: string | boolean | number | object | ((field: Field) => any);
  };
  hooks?: {
    onInit?: (field: Field) => void;
    afterViewInit?: (field: Field) => void;
    onDestroy?: (field: Field) => void;
  };
  /**
   * You can pass any Angular validation.
   *
   * WARNING: The key must match the Angular validation keys. For example, when `maxLength` is used as a validator, the key should be 'maxlength'. Ensure this is accurate before using. Otherwise, the message will not match the validators created by Angular.
   */
  validators?: {
    [key: string]: {
      message: string;
      validator: ValidatorFn;
    };
  };
  /**
   * Style Classes for the field
   */
  class?: string[];
  children?: DynamicFormField[];
};

export type DynamicFormFieldText = DynamicFormFieldDefault & {
  key: string;
  type: 'text' | 'number' | 'email' | 'hidden';
};

export type DynamicFormFieldSelect = DynamicFormFieldDefault & {
  key: string;
  type: 'select';
  options: { label: string; value: string }[];
};

export type DynamicFormFieldCustom = DynamicFormFieldDefault & {
  key: string;
  type: Type<unknown>;
};

/**
 * Field interface to get useful data from field.
 */
export interface Field {
  /**
   * @returns current value of the field
   */
  getValue: <T>() => T | undefined | null;
  /**
   * @returns value of given key. This function will check all controls till find value
   */
  getValueByKey: <T>(key: string) => T | undefined | null;
  /**
   * @returns Model of form.
   */
  getFormValue: <T>() => T;
  /**
   * Inject any service like angular way.
   */
  inject: <T>(
    token: ProviderToken<T>,
    notFoundValue: null | undefined,
    options: InjectOptions,
  ) => T | null;

  control: WritableSignal<AbstractControl | undefined>;
}

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
