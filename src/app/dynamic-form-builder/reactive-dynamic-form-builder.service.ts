import { Injectable, signal } from '@angular/core';
import { InputBuilderComponent } from '../input-builder/input-builder.component';

@Injectable()
export class DynamicFormBuilderService {
  inputBuilders = signal<InputBuilderComponent[]>([]);

  addInput(inputBuilder: InputBuilderComponent): void {
    this.inputBuilders.update((inputs) => [...inputs, inputBuilder]);
  }

  adjustInputs(formValue: any): void {
    this.inputBuilders().forEach((builder) => {
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
