import type { AfterViewInit, Signal } from '@angular/core';
import { Directive, inject, input, ViewContainerRef } from '@angular/core';
import type { DynamicFormFieldCustom } from '../model';
import { FieldWrapperComponent } from '../field-builder/field-wrapper/field-wrapper.component';

/**
 * @description
 * The CustomFieldBuilderDirective dynamically creates and configures components based on the
 * provided DynamicCustomFormField configuration. This allows custom components to be added
 * and configured at runtime.
 */
@Directive({
  selector: '[appCustomFieldBuilder]',
  standalone: true,
})
export class CustomFieldBuilderDirective implements AfterViewInit {
  fieldWrapper = inject(FieldWrapperComponent);
  config = this.fieldWrapper.config as Signal<DynamicFormFieldCustom>;
  private viewContainerRef = inject(ViewContainerRef);

  ngAfterViewInit(): void {
    const config = this.config();
    if (!config) return;
    // Clear any existing components in the view container
    this.viewContainerRef.clear();

    // Dynamically create the component specified in the configuration
    this.viewContainerRef.createComponent(config.type);
  }
}
