import { DestroyRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';

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
    onInit?: (f: AbstractControl, destroyRef: DestroyRef) => void;
    afterViewInit?: (f: AbstractControl, destroyRef: DestroyRef) => void;
    onDestroy?: (f: AbstractControl) => void;
  };
  children?: DynamicFormInput[];
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
