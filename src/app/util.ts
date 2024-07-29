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
 * Recursively extracts all validation errors from the given FormGroup while preserving their structure.
 *
 * This function traverses through all controls within the FormGroup and collects errors for each control.
 * The errors are organized in a nested structure that reflects the hierarchy of the form controls,
 * allowing for easy access to specific validation issues.
 *
 * @param form The FormGroup from which to extract errors.
 * @returns An object containing validation errors for the form controls. The structure of the returned object
 *          reflects the structure of the form, with keys representing control names and values containing
 *          error details.
 *
 * Example:
 * ```ts
 * {
 *   "firstName": {
 *     "minlength": {
 *       "requiredLength": 3,
 *       "actualLength": 1
 *     }
 *   },
 *   "address": {
 *     "city": {
 *       "required": true
 *     }
 *   }
 * }
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

/**
 * Recursively retrieves validation errors for a given control and its children, if applicable.
 *
 * This function handles FormControl, FormGroup, and FormArray types:
 * - For FormControl, it directly adds the control's errors to the errorList.
 * - For FormGroup, it recursively collects errors from the group's controls.
 * - For FormArray, it collects errors from each control within the array.
 *
 * @param ct The AbstractControl (could be FormControl, FormGroup, or FormArray) to check for errors.
 * @param errorList The current error list object to which errors are added.
 * @param key The key representing the name or index of the control in the errorList.
 * @returns The updated error list containing errors for the provided control.
 */
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
 * Creates a FormGroup based on the provided configuration JSON.
 *
 * This function constructs a `FormGroup` by iterating over a configuration array, where each configuration
 * item defines a form control. It handles different types of form controls, including nested form groups
 * and form arrays, by recursively creating controls based on the provided configuration.
 *
 * @param config An array of `DynamicFormInput` objects that define the configuration of the form controls.
 * @returns A `FormGroup` object with controls and validators as specified in the configuration.
 *
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

/**
 * Creates an AbstractControl based on the provided configuration.
 *
 * This function generates different types of controls depending on the `fieldType` specified in the configuration.
 * It supports creating nested FormGroups and FormArrays, though handling FormArrays is currently not fully implemented.
 *
 * @param c A `DynamicFormInput` object that defines the configuration of a control.
 * @returns An `AbstractControl` object (either `FormControl`, `FormGroup`, or `FormArray`) based on the configuration.
 *
 * Notes:
 * - If `fieldType` is 'GROUP', it recursively creates a nested `FormGroup`.
 * - If `fieldType` is 'ARRAY', it creates a `FormArray`, but the handling of this type is yet to be implemented.
 * - If `fieldType` is not specified, a default `FormControl` is created.
 */
function createControl(c: DynamicFormInput): AbstractControl {
  if (!c.fieldType) {
    return new FormControl(c.defaultValue);
  }

  if (c.fieldType === 'ARRAY') {
    // TODO: Implement handling for FormArray
    return new FormArray(c.defaultValue ?? []);
  }

  // Create a nested FormGroup if fieldType is 'GROUP'
  return createDynamicForm(c.children ?? []);
}
