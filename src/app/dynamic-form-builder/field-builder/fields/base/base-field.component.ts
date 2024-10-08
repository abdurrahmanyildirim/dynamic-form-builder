import type {
  AfterViewInit,
  InputSignal,
  OnDestroy,
  OnInit,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Directive, inject } from '@angular/core';
import type { DynamicFormField } from '../../../model';
import { FieldWrapperComponent } from '../../field-wrapper/field-wrapper.component';

/**
 *
 * @template T - The type of the form field configuration. Defaults to `DynamicFormField`.
 *               This allows customization of the form field configuration type.
 */
@Directive()
export abstract class BaseFieldComponent<T extends DynamicFormField>
  implements OnInit, AfterViewInit, OnDestroy
{
  fieldWrapper = inject(FieldWrapperComponent<T>);
  config = this.fieldWrapper.config;

  ngOnInit(): void {
    this.fieldWrapper.control()?.enable();
    this.config().hooks?.onInit?.(this.fieldWrapper);
  }

  /**
   * Props will be created as signal at fieldWrapper and will be set whenever data change.
   * We can send some conditional data to our fields.
   */
  props = this.fieldWrapper.props;
  placeholder = this.fieldWrapper.placeholder;
  errorMessage = this.fieldWrapper.errorMessage;

  ngAfterViewInit(): void {
    this.config().hooks?.afterViewInit?.(this.fieldWrapper);
  }

  ngOnDestroy(): void {
    this.config().hooks?.onDestroy?.(this.fieldWrapper);
    this.fieldWrapper.control()?.disable();
    if (this.config().resetOnHide || this.config().resetOnHide === undefined) {
      this.fieldWrapper.control()?.reset();
    }
  }
}
