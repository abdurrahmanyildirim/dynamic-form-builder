import { Injectable, signal } from '@angular/core';
import { InputBuilderComponent } from '../input-builder/input-builder.component';

@Injectable()
export class DynamicFormBuilderService {
  inputs = signal<InputBuilderComponent[]>([]);
}
