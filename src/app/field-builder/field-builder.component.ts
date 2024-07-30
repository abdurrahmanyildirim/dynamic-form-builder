import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SliderFormFieldComponent } from '../form-fields/slider/slider-form-field.component';
import { parentFormGroupProvider } from '../util';
import { SelectFormFieldComponent } from '../form-fields/select/select-form-field.component';
import { DateFormFieldComponent } from '../form-fields/date/date-form-field.component';
import { GeneralFormFieldComponent } from '../form-fields/general/general-form-field.component';
import { DynamicFormField } from '../model';

@Component({
  selector: 'app-field-builder',
  templateUrl: './field-builder.component.html',
  styleUrl: './field-builder.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    GeneralFormFieldComponent,
    SliderFormFieldComponent,
    SelectFormFieldComponent,
    DateFormFieldComponent,
  ],
  viewProviders: [parentFormGroupProvider],
})
export class FieldBuilderComponent {
  fieldConfig = input.required<DynamicFormField>();
}
