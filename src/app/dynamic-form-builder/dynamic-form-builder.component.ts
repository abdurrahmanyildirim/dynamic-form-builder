import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';
import {
  outputFromObservable,
  takeUntilDestroyed,
  toObservable,
} from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { DynamicFormField, FormErrors } from './model';
import { FieldBuilderComponent } from './field-builder/field-builder.component';
import { DynamicFormBuilderService } from './services/dynamic-form-builder.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-dynamic-form-builder',
  standalone: true,
  imports: [ReactiveFormsModule, FieldBuilderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynamicFormBuilderService],
  template: `
    <form [formGroup]="form()" style="width: min-content;">
      @for (config of formConfig(); track config.key || $index) {
        <app-field-builder [config]="config" [dir]="''" />
      }
    </form>
  `,
})
export class DynamicFormBuilderComponentReactive implements AfterViewInit {
  form = input.required<FormGroup>();
  formConfig = input.required<DynamicFormField[]>();

  defaultValue = input<any>({});
  DefaultValueEffect = effect(() => {
    const defaultValue = this.defaultValue();
    untracked(() => {
      this.form().patchValue(defaultValue);
    });
  });

  dynamicFormBuilderService = inject(DynamicFormBuilderService);
  destroyRef = inject(DestroyRef);

  /**
   * Extracted errors from form with our own error format.
   */
  errors = outputFromObservable(
    toObservable(this.dynamicFormBuilderService.errors),
  );

  ngAfterViewInit(): void {
    this.form()
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef), debounceTime(10))
      .subscribe((v) => {
        this.dynamicFormBuilderService.formValue.set(v);
      });
  }
}
