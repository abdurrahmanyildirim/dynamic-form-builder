import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  isFormArray,
  isFormControl,
  isFormGroup,
} from '@angular/forms';
import { DynamicFormInput, FormErrors } from './model';

/**
 * Extract all errors from given form by protecting their structure.
 *
 * @param form
 * @returns
 * ```ts
 * {
 *   "firstName": {
 *     "minlength": {
 *       "requiredLength": 3,
 *       "actualLength": 1
 *     }
 *   }
 * }
 *
 * ```
 */
export function getErrors(form: FormGroup): FormErrors {
  let errors = {} as FormErrors;
  Object.entries(form.controls).forEach(([key, ct]) => {
    if (ct.invalid) {
      errors = getError(ct, errors, key);
    }
  });
  return errors;
}

function getError(
  ct: AbstractControl,
  errorList: FormErrors,
  key: string,
): any {
  if (isFormControl(ct) && ct.errors) {
    errorList[key] = ct.errors;
  }
  if (isFormGroup(ct) && ct.invalid) {
    errorList[key] = getErrors(ct);
  }
  if (isFormArray(ct)) {
    errorList[key] = ct.controls.map((c, i) => getError(c, {}, i + ''));
  }
  return errorList;
}

/**
 * Create Form Group based on given config JSON.
 *
 * @param config
 * @returns
 */
export function createDynamicForm(config: DynamicFormInput[]): FormGroup {
  const fg = new FormGroup({});
  config?.forEach((c) => {
    const control = createControl(c);
    control.addValidators(c.validators ?? []);
    control.addAsyncValidators(c.asyncValidators ?? []);
    fg.addControl(c.key, control);
  });
  return fg;
}

function createControl(c: DynamicFormInput): AbstractControl {
  if (!c.fieldType) {
    return new FormControl();
  }
  if (c.fieldType === 'ARRAY') {
    // TODO: Not sure how this will work. test this.
    return new FormArray([]);
  }
  return createDynamicForm(c.children ?? []);
}
