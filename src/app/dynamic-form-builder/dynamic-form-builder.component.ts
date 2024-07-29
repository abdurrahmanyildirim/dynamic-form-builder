import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  output,
  untracked,
} from '@angular/core';
import { DynamicFormInput, FormErrors } from '../model';
import { JsonPipe } from '@angular/common';
import { InputBuilderComponent } from '../input-builder/input-builder.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormBuilderService } from './reactive-dynamic-form-builder.service';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  Subscription,
} from 'rxjs';
import { createDynamicForm, getErrors } from '../util';

@Component({
  selector: 'app-dynamic-form-builder',
  standalone: true,
  imports: [InputBuilderComponent, ReactiveFormsModule, JsonPipe],
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
    form.patchValue(this.defaultValue());
    untracked(() => {
      // Clean inputs from service.
      this.dynamicFormBuilderService.inputBuilders.set([]);
    });
    this.listenFormChanges(form);
    this.formInitialized.emit(form);
    return form;
  });

  formInitialized = output<FormGroup>();
  errors = output<Record<string, object>>();
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
        this.errors.emit(getErrors(form));
      });
  }

  ngOnDestroy(): void {
    this.valueChangeSub?.unsubscribe();
  }
}
