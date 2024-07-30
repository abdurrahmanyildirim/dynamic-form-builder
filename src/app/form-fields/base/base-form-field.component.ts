import {
  AfterViewInit,
  computed,
  Directive,
  inject,
  Injector,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { DynamicFormInput } from '../../model';
import { ControlContainer, isFormGroup } from '@angular/forms';
import { DynamicFormBuilderService } from '../../dynamic-form-builder/reactive-dynamic-form-builder.service';

@Directive()
export abstract class BaseFormFieldComponent
  implements OnInit, AfterViewInit, OnDestroy
{
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
