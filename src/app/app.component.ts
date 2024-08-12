import { Component, signal } from '@angular/core';
import { FormGroup, NgForm, Validators } from '@angular/forms';
import { DynamicFormField, FormErrors } from './dynamic-form-builder/model';
import { DynamicFormBuilderComponentReactive } from './dynamic-form-builder/dynamic-form-builder.component';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DynamicFormBuilderComponentReactive, JsonPipe],
  template: `
    <div style="padding:20px">
      <app-dynamic-form-builder
        [form]="form"
        [formConfig]="configs"
        [defaultValue]="defaultValue"
        (errors)="errors.set($event)"
      />
      <div style="display: flex;gap:10px">
        <div>
          <h3>Values</h3>
          <pre>{{ values() | json }}</pre>
        </div>

        <div>
          <h3>Errors</h3>
          <pre>{{ errors() | json }}</pre>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent {
  form = new FormGroup({});
  errors = signal<FormErrors>([]);

  values = toSignal(this.form.valueChanges);

  defaultValue = {
    name: 'Etalytics',
    car: 'mercedes',
    email: 'eta@etalytics.com',
    phones: {
      home: '1234',
    },
  };

  configs = [
    {
      type: 'text',
      key: 'name',
      label: 'Name',
      resetOnHide: true,
      validators: {
        required: {
          message: 'Name is required',
          validator: Validators.required,
        },
        minlength: {
          message: 'Name must be min 3 characters',
          validator: Validators.minLength(3),
        },
      },

      hide: (f) => f.getValueByKey('car') === 'bmw',
    },
    {
      type: 'email',
      key: 'email',
      label: 'Email',
      hide: (f) => f.getValueByKey('car') === undefined,
    },
    {
      type: 'text',
      key: 'carPlaceHolder',
      label: ' Car placeHolder',
      placeholder: (f) => f.getValueByKey<string>('car') ?? '',
    },
    {
      type: 'select',
      key: 'car',
      options: [
        {
          label: 'Mercedes',
          value: 'mercedes',
        },
        {
          label: 'Audi',
          value: 'audi',
        },
        {
          label: 'BMW',
          value: 'bmw',
        },
      ],
    },
    {
      key: 'phones',
      hide: (f) => f.getValueByKey('car') === 'audi',
      children: [
        {
          type: 'text',
          key: 'home',
          label: 'Home',
        },
        {
          type: 'text',
          key: 'mobile',
          label: 'Mobile',
          validators: {
            maxlength: {
              message: 'Mobile Phone max length is 5',
              validator: Validators.maxLength(4),
            },
          },
        },
      ],
    },
    {
      props: {
        myCustomProp: 'Custom Prop',
      },
      class: ['row'],
      children: [
        {
          type: 'text',
          key: 'homeAddress',
          label: 'Home Address',
          validators: {
            maxlength: {
              message: 'Home Address max length is 5',
              validator: Validators.maxLength(4),
            },
          },
        },
        {
          type: 'text',
          key: 'companyAddress',
          label: 'Company Address',
          disable: (f) => f.getValueByKey('car') === 'bmw',
        },
      ],
    },
  ] satisfies DynamicFormField[];
}
