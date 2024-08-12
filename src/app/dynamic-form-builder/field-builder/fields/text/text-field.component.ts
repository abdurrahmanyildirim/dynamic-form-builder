import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import type { DynamicFormFieldText } from '../../../model';
import { parentFormGroupProvider } from '../../../util';
import { BaseFieldComponent } from '../base/base-field.component';

@Component({
  selector: 'eta-text-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormField, MatLabel, MatInput, MatError, ReactiveFormsModule],
  viewProviders: [parentFormGroupProvider],
  template: `
    @let c = config();
    <mat-form-field>
      <mat-label>{{ c.label ?? c.key }}</mat-label>
      <input
        matInput
        [type]="c.type"
        [formControlName]="c.key"
        [placeholder]="placeholder()"
      />
      <mat-error>
        @if (errorMessage()) {
          {{ errorMessage() }}
        }
      </mat-error>
    </mat-form-field>
  `,
})
export class TextFieldComponent extends BaseFieldComponent<DynamicFormFieldText> {}
