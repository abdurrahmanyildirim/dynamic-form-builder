import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatLabel } from '@angular/material/input';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import type { DynamicFormFieldSelect } from '../../../model';
import { parentFormGroupProvider } from '../../../util';
import { BaseFieldComponent } from '../base/base-field.component';

@Component({
  selector: 'eta-select-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  viewProviders: [parentFormGroupProvider],
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatSelectTrigger,
    MatIcon,
    MatIconButton,
    MatError,
    ReactiveFormsModule,
  ],

  template: `
    @if (config(); as c) {
      <mat-form-field>
        <mat-label> {{ c.label ?? c.key }} </mat-label>
        <mat-select [id]="c.key" [formControlName]="c.key">
          @for (item of c.options; track item.value) {
            <mat-option [value]="item.value">{{ item.label }} </mat-option>
          }
        </mat-select>
        <mat-error>
          @if (errorMessage()) {
            {{ errorMessage() }}
          }
        </mat-error>
      </mat-form-field>
    }
  `,
})
export class SelectFieldComponent extends BaseFieldComponent<DynamicFormFieldSelect> {}
