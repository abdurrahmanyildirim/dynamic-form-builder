import { Component } from '@angular/core';
import { BaseFormFieldComponent } from '../../base-form-field/base-form-field.component';
import {
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { parentFormGroupProvider } from '../../util';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-date-form-field',
  template: `
    @if (!hide() && inputConfig(); as inp) {
      @if (inp.type === 'DATE') {
        <mat-form-field>
          <mat-label> {{ inp.label ?? inp.key }} </mat-label>
          <input
            matInput
            [formControlName]="inp.key"
            [matDatepicker]="picker"
          />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      }
    }
  `,
  standalone: true,
  imports: [
    MatSuffix,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  viewProviders: [parentFormGroupProvider],
})
export class DateFormFieldComponent extends BaseFormFieldComponent {}
