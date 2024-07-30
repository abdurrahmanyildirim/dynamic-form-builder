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
import { DynamicFormField } from '../../model';
import { ControlContainer, isFormGroup } from '@angular/forms';
import { DynamicFormBuilderService } from '../../dynamic-form-builder/dynamic-form-builder.service';

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

  fieldConfig = input.required<DynamicFormField>();

  // Form group/array/control of current input
  control = computed(() => {
    const key = this.fieldConfig().key;
    if (isFormGroup(this.controlContainer.control)) {
      return this.controlContainer.control.controls[key];
    }
    return this.controlContainer.control;
  });

  ngOnInit(): void {
    // Save all created fields to service.
    this.dynamicFormBuilderService.addField(this);
    const ct = this.control();
    if (ct) {
      this.fieldConfig().hooks?.onInit?.(ct, this.injector);
    }
  }

  ngAfterViewInit(): void {
    const ct = this.control();
    if (ct) {
      this.fieldConfig().hooks?.afterViewInit?.(ct, this.injector);
    }
  }

  ngOnDestroy(): void {
    const ct = this.control();
    if (ct) {
      this.fieldConfig().hooks?.onDestroy?.(ct);
    }
  }
}
