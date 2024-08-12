import type {
  InjectOptions,
  OnInit,
  ProviderToken,
  WritableSignal,
} from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import type { DynamicFormField, Field, FormErrors } from '../../model';
import { DynamicFormBuilderService } from '../../services/dynamic-form-builder.service';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'eta-field-wrapper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatTooltip],
  styleUrl: 'field-wrapper.component.scss',
  template: `
    @let errMsg = errorMessage();
    <div [class.disable]="disable()" class="wrapper-container">
      <div
        class="error-indicator"
        [style.display]="!!errMsg ? '' : 'none'"
        [matTooltip]="errMsg ? errMsg : ''"
      >
        <mat-icon class="error-color">error</mat-icon>
      </div>
      <ng-content />
    </div>
  `,
})
export class FieldWrapperComponent<T extends DynamicFormField>
  implements OnInit, Field
{
  injector = inject(Injector);
  destroyRef = inject(DestroyRef);
  dynamicFormBuilderService = inject(DynamicFormBuilderService);
  controlContainer = inject(ControlContainer);

  config = input.required<T>();
  dir = input.required<string>();
  path = computed<string | undefined>(() => {
    const key = this.config().key;
    if (!key) return;
    if (this.dir()) {
      return `${this.dir()}.${key}`;
    }
    return key;
  });
  control = signal<AbstractControl | undefined>(undefined);

  errorMessage = signal<string | undefined>(undefined);

  /**
   * Those variables will be set in dynamic form builder service when data change
   */
  disable = signal(false);
  placeholder = signal<string>('');
  hide = signal(false);
  hideChange = outputFromObservable(toObservable(this.hide));

  /**
   * Props will be created as signal at onInit and will be set whenever data change.
   * We can send some conditional data to our fields.
   */
  props: {
    [key: string]: WritableSignal<undefined | any>;
  } = {};

  get parentFormGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  /**
   * This method checks the current form control's validation state and retrieves
   * any associated errors. It then combines these errors with the configuration
   * settings (e.g., validation messages) and formats them into a structured array
   * of errors. The first error message is also set as the current error message
   * in the form's state.
   *
   * @returns {FormErrors} An array of form error objects, where each object contains:
   *  - `key` (string): The key identifying the form control (or an empty string if not provided).
   *  - `path` (string): The path to the form control within the form.
   *  - `message` (string): The validation error message (or 'Unknown Error' if no specific message is found).
   *
   * If the form control is valid, or if no errors or path are found, an empty array is returned.
   */
  extractErrors(): FormErrors {
    const ct = this.control();
    const errors = ct?.errors;
    const path = this.path();

    if (!ct || ct.status !== 'INVALID' || !errors || !path) {
      this.errorMessage.set(undefined);
      return [];
    }

    const { key = '', validators = {} } = this.config();

    const formErrors = Object.keys(errors).map((errKey) => {
      const message = validators[errKey]?.message ?? 'Unknown Error';
      return {
        key,
        path,
        message,
      };
    });

    this.errorMessage.set(formErrors[0]?.message ?? '');
    return formErrors;
  }

  ngOnInit(): void {
    const { key, defaultValue, validators, children, props } = this.config();
    this.setProps(props);
    if (key) {
      let control = undefined;
      if (children && children.length > 0) {
        control = new FormGroup(defaultValue ?? {});
      } else {
        control = new FormControl(defaultValue);
      }
      if (validators) {
        Object.values(validators).forEach((v) => {
          control.addValidators(v.validator);
        });
      }
      this.parentFormGroup.addControl(key, control);
      this.control.set(control);
    }
    this.dynamicFormBuilderService.addField(this);
  }

  /**
   * Create signal variables for passed props.
   */
  private setProps(props: DynamicFormField['props']): void {
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        value = typeof value === 'function' ? value(this) : value;
        this.props[key] = signal(value);
      });
    }
  }

  /**
   *
   * @returns Returns current value of the field
   */
  getValue<T>(): T {
    return this.control()?.value;
  }

  /**
   *
   * @returns Returns value of given key. This function will check all controls till find value
   */
  getValueByKey<T>(key: string): T | undefined {
    const ct = this.config()?.key ? this.control()?.parent : this.control();
    return this.getValueByKeyRecursively<T>(key, ct);
  }

  private getValueByKeyRecursively<T>(
    key: string,
    control?: AbstractControl | null,
  ): T | undefined {
    if (!control) return undefined;

    // Check if the current control value contains the key
    const value = control.value;
    if (value && typeof value === 'object' && key in value) {
      return value[key];
    }

    // Recursively check the parent control
    return this.getValueByKeyRecursively(key, control.parent);
  }

  /**
   * Inject any service like angular way.
   */
  inject<T>(
    token: ProviderToken<T>,
    notFoundValue: null | undefined,
    options: InjectOptions,
  ): T | null {
    return this.injector.get(token, notFoundValue, options);
  }

  getFormValue<T>(): T {
    return this.dynamicFormBuilderService.formValue() as T;
  }
}
