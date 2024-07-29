import {
  Component,
  input,
  SkipSelf,
  Optional,
  computed,
  inject,
  effect,
  signal,
  OnInit,
  AfterViewInit,
  OnDestroy,
  DestroyRef,
  Injector,
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
import { DynamicFormInput } from '../model';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DynamicFormBuilderService } from '../dynamic-form-builder/reactive-dynamic-form-builder.service';

/**
 * This provider connects child components' form controls to their parent form group.
 * It ensures that the parent form group is available in the child components for proper form handling.
 *
 * Inspired by: https://nevzatopcu.medium.com/angular-child-components-with-reactive-forms-fbf4563b304c
 *
 * Usage:
 * - Add this provider to the `providers` array of a child component's decorator to enable
 *   the child component to access and interact with the parent form group.
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
  styleUrl: './input-builder.component.scss',
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
export class InputBuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  controlContainer = inject(ControlContainer);
  injector = inject(Injector);
  dynamicFormBuilderService = inject(DynamicFormBuilderService);

  /**
   * Hide input based on some conditions
   * service handle that variable every value change in main form
   */
  hide = signal(false);

  inputConfig = input.required<DynamicFormInput>();

  // Form group/array/control of current input
  control = computed(() => {
    const key = this.inputConfig().key;
    if (isFormGroup(this.controlContainer.control)) {
      return this.controlContainer.control.controls[key];
    }
    return this.controlContainer.control;
  });

  isGeneralInput = computed(() =>
    ['TEXT', 'NUMBER'].includes(this.inputConfig().type ?? ''),
  );

  ngOnInit(): void {
    // Save all created inputs to service.
    this.dynamicFormBuilderService.addInput(this);
    const ct = this.control();
    if (ct) {
      this.inputConfig().hooks?.onInit?.(ct, this.injector);
    }
  }

  ngAfterViewInit(): void {
    const ct = this.control();
    if (ct) {
      this.inputConfig().hooks?.afterViewInit?.(ct, this.injector);
    }
  }

  ngOnDestroy(): void {
    const ct = this.control();
    if (ct) {
      this.inputConfig().hooks?.onDestroy?.(ct);
    }
  }
}
