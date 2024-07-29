import { Component } from '@angular/core';
import { DynamicFormBuilderComponent } from './dynamic-form-builder/dynamic-form-builder.component';
import { DynamicFormInput } from './model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DynamicFormBuilderComponent],
  template: `
    <app-reactive-dynamic-form-builder
      [dynamicFormConfig]="config"
      [defaultValue]="defaultValue"
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
        },
        {
          key: 'lastName',
          label: 'Last Name',
          type: 'TEXT',
        },
        {
          key: 'contact',
          fieldType: 'GROUP',
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
      expressions: {
        disable: (value) => value.gender === 'female',
      },
    },
    {
      key: 'birthDate',
      label: 'Birth Date',
      type: 'DATE',
      expressions: {
        hide: (value) => value.gender === 'male',
      },
    },
  ] satisfies DynamicFormInput[];

  defaultValue = {
    gender: 'male',
    generalInfo: {
      firstName: 'Apooo',
      lastName: 'Yildirim',
      contact: {
        no: '475869',
        city: {
          cityName: 'Darmstadt',
          postCode: '64295',
        },
      },
    },
    age: 29,
  };
}
