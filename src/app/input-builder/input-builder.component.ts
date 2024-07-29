import {
  Component,
  input,
  SkipSelf,
  Optional,
  computed,
  inject,
  effect,
  signal,
} from '@angular/core';
import {
  ControlContainer,
  isFormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatSuffix } from '@angular/material/input';
import { DynamicFormInput } from '../dynamic-form-builder/model';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

/**
 * This allow us to connect controls with parent form groups.
 */
export const parentFormGroupProvider = [
  {
    provide: ControlContainer,
    useFactory: (container: ControlContainer) => {
      if (!container) {
        throw new Error('I need a FormGroup instance');
      }
      return container;
    },
    deps: [[new SkipSelf(), new Optional(), ControlContainer]],
  },
];

@Component({
  selector: 'app-input-builder',
  templateUrl: './input-builder.component.html',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatSlider,
    MatSliderThumb,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatIcon,
    MatSuffix,
    MatIconButton,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  viewProviders: [parentFormGroupProvider],
})
export class InputBuilderComponent {
  controlContainer = inject(ControlContainer);

  key = input.required<string>();
  input = input.required<DynamicFormInput>();

  // Form group/array/control of current input
  control = computed(() => {
    const key = this.key();
    let control = undefined;
    if (isFormGroup(this.controlContainer.control)) {
      control = this.controlContainer.control.controls[key];
    }
    return control;
  });

  disabled = signal(false);
  hide = signal(false);

  isGeneralInput = computed(() =>
    ['TEXT', 'NUMBER'].includes(this.input().type ?? ''),
  );
}
