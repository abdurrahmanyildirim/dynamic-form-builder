import { Component } from '@angular/core';
import { DynamicFormBuilderComponent } from './dynamic-form-builder/dynamic-form-builder.component';
import { DynamicFormInput, FormErrors } from './model';
import { Validators } from '@angular/forms';

type MyModel = {
  gender: 'male' | 'female' | 'other';
  generalInfo: {
    firstName: string;
    lastName: string;
    contact: {
      no: number;
      city: {
        cityName: string;
        postCode: string;
      };
    };
  };
  age?: number;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DynamicFormBuilderComponent],
  template: `
    <app-dynamic-form-builder
      [dynamicFormConfig]="config"
      [defaultValue]="defaultValue"
      (errors)="onErrors($event)"
    />
  `,
})
export class AppComponent {
  config = [
    {
      key: 'gender',
      type: 'SELECT',
      options: [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },
    {
      key: 'generalInfo',
      fieldType: 'GROUP',
      children: [
        {
          key: 'firstName',
          label: 'First Name',
          type: 'TEXT',
          validators: [Validators.minLength(3), Validators.maxLength(10)],
        },
        {
          key: 'lastName',
          label: 'Last Name',
          type: 'TEXT',
        },
        {
          key: 'contact',
          fieldType: 'GROUP',
          class: ['row'],
          children: [
            {
              key: 'no',
              label: 'No',
              type: 'NUMBER',
            },
            {
              key: 'city',
              fieldType: 'GROUP',
              children: [
                {
                  key: 'cityName',
                  label: 'City Name',
                  type: 'TEXT',
                },
                {
                  key: 'postCode',
                  label: 'Post Code',
                  type: 'NUMBER',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: 'age',
      label: 'Age',
      type: 'SLIDER',
      defaultValue: 10,
      expressions: {
        disable: (value) => value.gender === 'female',
      },
      validators: [Validators.min(10)],
    },
    {
      key: 'birthDate',
      label: 'Birth Date',
      type: 'DATE',
      expressions: {
        hide: (value) => value.gender === 'male',
      },
    },
  ] satisfies DynamicFormInput<MyModel>[];

  defaultValue = {
    gender: 'male',
    generalInfo: {
      firstName: 'Etalytics',
      lastName: 'Eta Eta',
      contact: {
        no: 475869,
        city: {
          cityName: 'Darmstadt',
          postCode: '64295',
        },
      },
    },
  } satisfies MyModel;

  onErrors(e: FormErrors): void {
    console.log(e);
  }
}
