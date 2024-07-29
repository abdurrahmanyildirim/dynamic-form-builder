import { Component } from '@angular/core';
import { BaseFormFieldComponent } from '../../base-form-field/base-form-field.component';
import { MatFormField, MatLabel } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { parentFormGroupProvider } from '../../util';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-select-form-field',
  template: `
    @if (!hide() && inputConfig(); as inp) {
      @if (inp.type === 'SELECT') {
        <mat-form-field>
          <mat-label> {{ inp.label ?? inp.key }} </mat-label>
          <mat-select [formControlName]="inp.key" required>
            @for (item of inp.options; track item.value) {
              <mat-option [value]="item.value">{{ item.label }} </mat-option>
            }
          </mat-select>
        </mat-form-field>
      }
    }
  `,
  standalone: true,
  imports: [MatFormField, MatLabel, MatSelect, MatOption, ReactiveFormsModule],
  viewProviders: [parentFormGroupProvider],
})
export class SelectFormFieldComponent extends BaseFormFieldComponent {}
