import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  Type,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import type { DynamicFormField } from '../model';
import { CustomFieldBuilderDirective } from '../directives/custom-field-builder.directive';
import { FieldWrapperComponent } from './field-wrapper/field-wrapper.component';
import { SelectFieldComponent } from './fields/select/select-form-field.component';
import { TextFieldComponent } from './fields/text/text-field.component';
import { parentFormGroupProvider } from '../util';

@Component({
  selector: 'eta-field-builder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TextFieldComponent,
    SelectFieldComponent,
    FieldWrapperComponent,
    CustomFieldBuilderDirective,
  ],
  viewProviders: [parentFormGroupProvider],
  styles: `
    .container {
      display: flex;
      flex-direction: column;
      &.row {
        flex-direction: row;
        gap: 10px;
      }
      &.column {
        flex-direction: column;
      }
    }
  `,
  template: `
    @let c = config();
    <eta-field-wrapper
      [config]="c"
      (hideChange)="hide.set($event)"
      [dir]="dir()"
    >
      <span [style.display]="hide() ? 'none' : ''">
        @if (!hide()) {
          @if (customFieldType(); as cType) {
            <ng-container etaCustomFieldBuilder [type]="cType" />
          } @else if (hasChildren()) {
            <div class="container" [class]="c.class">
              @if (c.key) {
                <ng-container [formGroupName]="c.key">
                  @for (item of c.children; track item.key || $index) {
                    <eta-field-builder
                      [config]="item"
                      [dir]="dir() ? dir() + '.' + c.key : c.key"
                    />
                  }
                </ng-container>
              } @else {
                @for (item of c.children; track item.key || $index) {
                  <eta-field-builder [config]="item" [dir]="dir()" />
                }
              }
            </div>
          } @else if (isTextField()) {
            <eta-text-field />
          } @else if (c.type === 'select') {
            <eta-select-form-field />
          }
        }
      </span>
    </eta-field-wrapper>
  `,
})
export class FieldBuilderComponent {
  config = input.required<DynamicFormField>();
  /**
   * Directory of field
   */
  dir = input.required<string>();

  hasChildren = computed(() => {
    const children = this.config().children;
    return children && children.length > 0;
  });

  /**
   * Controls the visibility of content based on certain conditions.
   */
  hide = signal(false);

  customFieldType = computed<Type<unknown> | undefined>(() => {
    const type = this.config()?.type;
    if (!type || typeof type === 'string') return;
    return type;
  });

  isTextField = computed<boolean>(() => {
    const textFields = ['text', 'email', 'number', 'hidden'];
    const type = this.config().type;
    return typeof type === 'string' && textFields.includes(type);
  });
}
