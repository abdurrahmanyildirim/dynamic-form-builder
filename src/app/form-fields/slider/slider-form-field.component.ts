import { Component } from '@angular/core';
import { BaseFormFieldComponent } from '../base/base-form-field.component';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { parentFormGroupProvider } from '../../util';

@Component({
  selector: 'app-slider-form-field',
  template: `
    @if (!hide() && inputConfig(); as inp) {
      @if (inp.type === 'SLIDER') {
        <div style="width: fit-content">
          <div style="display: flex; justify-content: space-between">
            <span> {{ inp.label ?? inp.key }} </span>
            <span> {{ slider.value }} </span>
          </div>
          <mat-slider
            class="example-margin"
            [max]="inp.max ?? 100"
            [min]="inp.min ?? 0"
            [step]="inp.step ?? 1"
            [discrete]="true"
          >
            <input matSliderThumb [formControlName]="inp.key" #slider />
          </mat-slider>
        </div>
      }
    }
  `,
  standalone: true,
  imports: [MatSlider, MatInput, ReactiveFormsModule, MatSliderThumb],
  viewProviders: [parentFormGroupProvider],
})
export class SliderFormFieldComponent extends BaseFormFieldComponent {}
