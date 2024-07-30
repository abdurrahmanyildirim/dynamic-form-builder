import { Component, signal } from '@angular/core';
import { DynamicFormBuilderComponent } from './dynamic-form-builder/dynamic-form-builder.component';
import { DynamicFormInput } from './model';
import { FormGroup, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';

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
  imports: [DynamicFormBuilderComponent, JsonPipe],
  template: `
    <app-dynamic-form-builder
      [dynamicFormConfig]="config"
      [defaultValue]="defaultValue"
      (errors)="formErrors.set($event)"
      (formInitialized)="form.set($event)"
    />

    <div style="display: flex;gap:100px">
      <div>
        <h2>Values</h2>
        <pre
          >{{ form()?.getRawValue() | json }}
      </pre
        >
      </div>
      <div>
        <h2>Errors</h2>
        <pre
          >{{ formErrors() | json }}
    </pre>
      </div>
    </div>
  `,
})
export class AppComponent {
  formErrors = signal({});
  form = signal<FormGroup | undefined>(undefined);

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
          // validators: [Validators.minLength(3), Validators.maxLength(10)],
        },
        {
          key: 'lastName',
          label: 'Last Name',
          type: 'TEXT',
          validators: [
            {
              message: 'Last Name cant be lesser than 3',
              key: 'minlength',
              validator: Validators.minLength(3),
            },
            {
              message: 'Last Name cant be lesser than 4',
              key: 'minlength',
              validator: Validators.minLength(4),
            },
            {
              message: 'Last Name cant be bigger than 10',
              key: 'maxlength',
              validator: Validators.maxLength(10),
            },
          ],
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
                  validators: [
                    {
                      message: 'Post code is required',
                      key: 'required',
                      validator: Validators.required,
                    },
                  ],
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
      disable: (value) => value.gender === 'female',
      validators: [
        {
          message: 'Min age is 10',
          key: 'min',
          validator: Validators.min(10),
        },
      ],
    },
    {
      key: 'birthDate',
      label: 'Birth Date',
      type: 'DATE',
      hide: (value) => value.gender === 'male',
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
}
