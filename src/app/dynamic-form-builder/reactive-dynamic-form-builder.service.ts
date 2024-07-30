import { Injectable, signal } from '@angular/core';
import { BaseFormFieldComponent } from '../form-fields/base/base-form-field.component';

@Injectable()
export class DynamicFormBuilderService {
  formFields = signal<BaseFormFieldComponent[]>([]);

  addInput(inputBuilder: BaseFormFieldComponent): void {
    this.formFields.update((inputs) => [...inputs, inputBuilder]);
  }

  /**
   * Adjust hide and disable inputs of component whenever form data change
   *
   * @param formValue Form value
   */
  adjustInputs(formValue: any): void {
    this.formFields().forEach((builder) => {
      const hideExpression = builder.inputConfig().hide;
      if (hideExpression) {
        const hide = hideExpression(formValue);
        builder.hide.set(hide);
      }
      const disableExpression = builder.inputConfig().disable;
      if (disableExpression) {
        const disable = disableExpression(formValue);
        if (disable) {
          // Use onlySelf to prevent main form value change trigger
          builder.control()?.disable({ onlySelf: true });
        } else {
          builder.control()?.enable({ onlySelf: true });
        }
      }
    });
  }
}
