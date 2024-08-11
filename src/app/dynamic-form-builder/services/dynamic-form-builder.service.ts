import { effect, Injectable, signal, untracked } from '@angular/core';
import type { DynamicFormField, FormErrors } from '../model';
import type { FieldWrapperComponent } from '../field-builder/field-wrapper/field-wrapper.component';

@Injectable()
export class DynamicFormBuilderService {
  formValue = signal<unknown | undefined>(undefined);
  errors = signal<FormErrors>([]);
  fields = signal<FieldWrapperComponent[]>([]);

  FormValueEffect = effect(() => {
    const formValue = this.formValue();
    if (formValue) {
      untracked(() => {
        this.adjustFieldVariables(formValue);
      });
    }
  });

  addField(field: FieldWrapperComponent): void {
    this.fields.update((fields) => [...fields, field]);
  }

  removeField(field: FieldWrapperComponent): void {
    this.fields.update((fields) => fields.filter((f) => f !== field));
  }

  private adjustFieldVariables(formValue?: unknown): void {
    if (!formValue) return;
    let allFormErrors: FormErrors = [];
    this.fields().forEach((field) => {
      const config = field.config();
      this.adjustHide(field, config);
      this.adjustDisable(field, config);
      this.adjustProps(field, config);
      const errors = field.extractErrors();
      allFormErrors = [...allFormErrors, ...errors];
    });
    this.errors.set(allFormErrors);
  }

  private adjustHide(f: FieldWrapperComponent, c: DynamicFormField): void {
    const hideExpression = c?.hide;
    if (!hideExpression) return;
    const isHidden = hideExpression(f);
    f.hide.set(isHidden);
  }

  private adjustDisable(f: FieldWrapperComponent, c: DynamicFormField): void {
    const disableExpression = c?.disable;
    if (!disableExpression) return;
    f.disable.set(disableExpression(f));
  }

  /**
   * Adjust reactive props whenever data change.
   * This will improve reactivity of fields
   *
   * @param field
   * @param formValue
   */
  private adjustProps(f: FieldWrapperComponent, c: DynamicFormField): void {
    const props = c.props;
    if (props) {
      Object.entries(props ?? {}).forEach(([key, value]) => {
        if (typeof value === 'function') {
          f.props[key].set(value(f));
        }
      });
    }
  }
}
