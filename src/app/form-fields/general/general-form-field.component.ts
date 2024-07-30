import { Component } from '@angular/core';
import { BaseFormFieldComponent } from '../base/base-form-field.component';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { parentFormGroupProvider } from '../../util';

@Component({
  selector: 'app-general-form-field',
  template: `
    @if (!hide() && fieldConfig(); as inp) {
      <mat-form-field>
        <mat-label>{{ inp.label ?? inp.key }}</mat-label>
        <input
          matInput
          [type]="inp.type?.toLowerCase() ?? 'text'"
          [name]="inp.key"
          [formControlName]="inp.key"
        />
      </mat-form-field>
    }
  `,
  standalone: true,
  imports: [MatFormField, MatLabel, MatInput, ReactiveFormsModule],
  viewProviders: [parentFormGroupProvider],
})
export class GeneralFormFieldComponent extends BaseFormFieldComponent {}
