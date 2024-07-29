import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { DynamicFormInput } from '../model';
import { JsonPipe } from '@angular/common';
import { InputBuilderComponent } from '../input-builder/input-builder.component';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { DynamicFormBuilderService } from './reactive-dynamic-form-builder.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';

@Component({
  selector: 'app-reactive-dynamic-form-builder',
  standalone: true,
  imports: [InputBuilderComponent, ReactiveFormsModule, JsonPipe],
  providers: [DynamicFormBuilderService],
  templateUrl: './dynamic-form-builder.component.html',
})
export class DynamicFormBuilderComponent implements AfterViewInit {
  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  dynamicFormBuilderService = inject(DynamicFormBuilderService);

  mainForm = this.fb.group({});
  dynamicFormConfig = input<DynamicFormInput[]>([]);
  /**
   * Flag to detect if form is ready.
   * Don't init UI till form ready.
   */
  formReady = signal(false);

  configEffect = effect(() => {
    const config = this.dynamicFormConfig();
    untracked(() => {
      this.formReady.set(false);
      this.dynamicFormBuilderService.inputBuilders.set([]);
      this.buildForm(config);
      this.mainForm.patchValue(this.defaultValue());
      this.formReady.set(true);
    });
  });
  defaultValue = input<any>();

  buildForm(config: DynamicFormInput[]): any {
    config.forEach((c) => {
      const control = this.createControl(c);
      this.mainForm.addControl(c.key, control);
    });
  }

  createControl(c: DynamicFormInput): AbstractControl {
    if (!c.fieldType) {
      return this.fb.control('');
    }
    if (c.fieldType === 'ARRAY') {
      // TODO: Not sure how this will work. test this.
      return this.fb.array([]);
    }
    const fg = this.fb.group({});
    c.children?.forEach((c) => {
      const ct = this.createControl(c);
      fg.addControl(c.key, ct);
    });
    return fg;
  }

  ngAfterViewInit(): void {
    this.mainForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(this.defaultValue()),
        // Make sure UI fully initialized and improve the performance
        debounceTime(50),
        distinctUntilChanged(),
      )
      .subscribe((v) => {
        this.dynamicFormBuilderService.adjustInputs(
          this.mainForm.getRawValue(),
        );
      });
  }
}
