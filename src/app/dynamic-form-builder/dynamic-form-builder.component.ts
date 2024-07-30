import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  output,
  untracked,
} from '@angular/core';
import {
  DynamicFormInput,
  FormError,
  FormConfigErrorMessages,
  FormErrors,
  ReactiveFormErrors,
} from '../model';
import { JsonPipe } from '@angular/common';
import { FieldBuilderComponent } from '../field-builder/field-builder.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormBuilderService } from './reactive-dynamic-form-builder.service';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  Subscription,
} from 'rxjs';
import {
  createDynamicForm,
  extractErrorMessagesFromConfig,
  getReactiveFormErrors,
} from '../util';

@Component({
  selector: 'app-dynamic-form-builder',
  standalone: true,
  imports: [FieldBuilderComponent, ReactiveFormsModule],
  providers: [DynamicFormBuilderService],
  templateUrl: './dynamic-form-builder.component.html',
})
export class DynamicFormBuilderComponent implements OnDestroy {
  dynamicFormBuilderService = inject(DynamicFormBuilderService);

  // Inputs
  dynamicFormConfig = input.required<DynamicFormInput[]>();
  defaultValue = input<any>();

  mainForm = computed<FormGroup>(() => {
    const config = this.dynamicFormConfig();
    const form = createDynamicForm(config);
    untracked(() => {
      // Clean inputs from service.
      this.dynamicFormBuilderService.formFields.set([]);
    });
    this.listenFormChanges(form);
    form.patchValue(this.defaultValue());
    this.formInitialized.emit(form);
    return form;
  });
  configErrorMessageList = computed<FormConfigErrorMessages>(() =>
    extractErrorMessagesFromConfig(this.dynamicFormConfig(), {}),
  );

  formInitialized = output<FormGroup>();
  errors = output<FormErrors>();

  valueChangeSub?: Subscription;

  listenFormChanges(form: FormGroup): void {
    // Unsubscribe previous value change.
    this.valueChangeSub?.unsubscribe();
    this.valueChangeSub = form.valueChanges
      .pipe(
        startWith(this.defaultValue()),
        // Make sure UI fully initialized and improve the performance
        debounceTime(50),
        distinctUntilChanged(),
      )
      .subscribe((v) => {
        this.dynamicFormBuilderService.adjustInputs(form.getRawValue());
        const reactiveFormErrors = getReactiveFormErrors(form);
        const errorMessageList = this.configErrorMessageList();
        const errorsWithMessages = Object.entries(reactiveFormErrors).map(
          ([path, value]) => {
            const errorKey = Object.keys(value)[0];
            const fieldKey = path.split('.').at(-1) ?? path;

            return {
              key: fieldKey,
              path,
              message:
                errorMessageList[path].find((m) => m.key === errorKey)
                  ?.message ?? 'Error',
            } satisfies FormError;
          },
        );
        this.errors.emit(errorsWithMessages);
      });
  }

  ngOnDestroy(): void {
    this.valueChangeSub?.unsubscribe();
  }
}
