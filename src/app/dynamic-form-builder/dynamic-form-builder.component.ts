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
  FormErrorMessages,
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
import { createDynamicForm, getReactiveFormErrors } from '../util';

@Component({
  selector: 'app-dynamic-form-builder',
  standalone: true,
  imports: [FieldBuilderComponent, ReactiveFormsModule, JsonPipe],
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
  errorMessageList = computed<FormErrorMessages>(() => {
    const config = this.dynamicFormConfig();
    return this.extractErrorMessages(config, {});
  });

  formInitialized = output<FormGroup>();
  errors = output<ReactiveFormErrors>();

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
        const errorMessageList = this.errorMessageList();
        console.log(reactiveFormErrors);
        console.log();
        const errorsWithMessages = Object.entries(reactiveFormErrors).map(
          ([path, value]) => {
            const key = path.split('.').at(-1) ?? path;
            return {
              key,
              path,
              message: errorMessageList[path].message,
            } satisfies FormError;
          },
        );

        // this.errors.emit(getReactiveFormErrors(form));
      });
  }

  extractErrorMessages(
    config: DynamicFormInput[],
    errorList: FormErrorMessages,
    path?: string,
  ): FormErrorMessages {
    config.forEach((c) => {
      const newPath = path ? path + '.' + c.key : c.key;
      if (!c.fieldType && c.validators) {
        c.validators.forEach((v) => {
          errorList[newPath] = {
            key: v.key,
            message: v.message,
          };
        });
      }
      if (c.fieldType === 'GROUP' && c.children) {
        errorList = {
          ...errorList,
          ...this.extractErrorMessages(c.children, errorList, newPath),
        };
      }
    });
    return errorList;
  }

  ngOnDestroy(): void {
    this.valueChangeSub?.unsubscribe();
  }
}
