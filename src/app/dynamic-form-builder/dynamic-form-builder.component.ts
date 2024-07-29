import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChildren,
} from '@angular/core';
import { vestForms, DeepPartial, DeepRequired } from 'ngx-vest-forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { DynamicFormInput } from './model';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { InputBuilderComponent } from '../input-builder/input-builder.component';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DynamicFormBuilderService } from './reactive-dynamic-form-builder.service';

@Component({
  selector: 'app-reactive-dynamic-form-builder',
  standalone: true,
  imports: [InputBuilderComponent, ReactiveFormsModule, JsonPipe],
  providers: [DynamicFormBuilderService],
  templateUrl: './dynamic-form-builder.component.html',
})
export class DynamicFormBuilderComponent {
  fb = inject(FormBuilder);
  dynamicFormBuilderService = inject(DynamicFormBuilderService);
  myForm = this.fb.group({});
  dynamicFormConfig = input<DynamicFormInput[]>([]);
  formReady = signal(false);
  configEffect = effect(() => {
    const config = this.dynamicFormConfig();
    untracked(() => {
      this.formReady.set(false);
      this.dynamicFormBuilderService.inputs.set([]);
      this.buildForm(config);
      this.myForm.valueChanges.subscribe((ff) => console.log(ff));
      this.myForm.patchValue(this.defaultValue());
      this.formReady.set(true);
    });
  });
  defaultValue = input<any>();

  buildForm(config: DynamicFormInput[]): any {
    config.forEach((c) => {
      const control = this.createControl(c);
      this.myForm.addControl(c.key, control);
    });
  }

  createControl(c: DynamicFormInput): AbstractControl {
    if (!c.fieldType) {
      return new FormControl();
    }
    if (c.fieldType === 'ARRAY') {
      // TODO: Not sure how this will work. test this.
      return new FormArray([]);
    }
    const fg = this.fb.group({});
    c.children?.forEach((c) => {
      const ct = this.createControl(c);
      fg.addControl(c.key, ct);
    });
    return fg;
  }
}
