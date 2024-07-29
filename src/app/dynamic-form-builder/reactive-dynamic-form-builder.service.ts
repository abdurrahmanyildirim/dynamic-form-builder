import { Injectable, signal } from '@angular/core';
import { FieldBuilderComponent } from '../field-builder/field-builder.component';
import { BaseFormFieldComponent } from '../base-form-field/base-form-field.component';

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
      Object.entries(builder.inputConfig().expressions ?? {}).forEach(
        ([key, value]) => {
          if (key === 'hide') {
            const hide = value(formValue);
            builder.hide.set(hide);
          }
          if (key === 'disable') {
            const disable = value(formValue);
            if (disable) {
              // Use onlySelf to prevent main form value change trigger
              builder.control()?.disable({ onlySelf: true });
            } else {
              builder.control()?.enable({ onlySelf: true });
            }
          }
        },
      );
    });
  }
}
