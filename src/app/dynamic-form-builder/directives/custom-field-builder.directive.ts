import type { AfterViewInit, Type } from '@angular/core';
import { Directive, inject, input, ViewContainerRef } from '@angular/core';

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
  type = input.required<Type<unknown>>();
  private viewContainerRef = inject(ViewContainerRef);

  ngAfterViewInit(): void {
    // Clear any existing components in the view container
    this.viewContainerRef.clear();

    // Dynamically create the component specified in the configuration
    this.viewContainerRef.createComponent(this.type());
  }
}
