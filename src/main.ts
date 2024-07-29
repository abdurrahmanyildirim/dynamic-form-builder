import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { Routes } from '@angular/router';

bootstrapApplication(
  AppComponent,

  {
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter([]),
      provideAnimationsAsync(),
    ],
  },
).catch((err) => console.error(err));
