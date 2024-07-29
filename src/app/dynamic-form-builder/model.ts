export type DynamicFormConfig = {
  [key: string]: DynamicFormInput;
};

export type DynamicFormInput =
  | DynamicFormInputDefault
  | DynamicFormInputSelect
  | DynamicFormInputSlider;

export interface DynamicFormInputBase {
  key: string;
  type?: DynamicFormInputTypes;
  fieldType?: 'GROUP' | 'ARRAY';
  label?: string;
  defaultValue?: any;
  hide?: boolean | ((formValue: any) => boolean);
  disable?: boolean | ((formValue: any) => boolean);
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
