import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldBuilderComponent } from '../../field-builder/field-builder.component';
import { parentFormGroupProvider } from '../../util';
import { BaseFormFieldComponent } from '../base/base-form-field.component';

@Component({
  selector: 'app-group-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, forwardRef(() => FieldBuilderComponent)],
  viewProviders: [parentFormGroupProvider],
  styles: `
    .group-wrapper {
      width: fit-content;
      eta-field-builder:not(:first-child) {
        margin-left: 10px;
      }
    }

    .row {
      display: flex;
      flex-wrap: wrap;
    }
  `,
  template: `
    @if (!hide() && fieldConfig(); as field) {
      <div
        [formGroupName]="field.key"
        [class]="field.class"
        class="group-wrapper"
      >
        <!-- Don't use ng-content. Somehow can't connect groupname with controllers. -->
        @for (item of field.children; track item.key) {
          <app-field-builder [fieldConfig]="item" />
        }
      </div>
    }
  `,
})
export class GroupFormFieldComponent extends BaseFormFieldComponent {}
