import { Injectable, signal } from '@angular/core';
import { BaseFormFieldComponent } from '../form-fields/base/base-form-field.component';

@Injectable()
export class DynamicFormBuilderService {
  formFields = signal<BaseFormFieldComponent[]>([]);

  addField(field: BaseFormFieldComponent): void {
    this.formFields.update((inputs) => [...inputs, field]);
  }

  /**
   * Adjust hide and disable inputs of fields whenever form data change
   *
   * @param formValue Form value
   */
  adjustFields(formValue: any): void {
    this.formFields().forEach((field) => {
      const hideExpression = field.fieldConfig().hide;
      if (hideExpression) {
        const hide = hideExpression(formValue);
        field.hide.set(hide);
      }
      const disableExpression = field.fieldConfig().disable;
      if (disableExpression) {
        const disable = disableExpression(formValue);
        if (disable) {
          // Use onlySelf to prevent main form value change trigger
          field.control()?.disable({ onlySelf: true });
        } else {
          field.control()?.enable({ onlySelf: true });
        }
      }
    });
  }
}
