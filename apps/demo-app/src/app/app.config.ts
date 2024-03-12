import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { delayInterceptor } from './delay.interceptor';

import { provideDeferredLoaderSettings } from 'ng-addition/deferred-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(
      appRoutes,
      withComponentInputBinding()
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([delayInterceptor]),
    ),
    provideDeferredLoaderSettings({minLoadingTime: 600, loadingThreshold: 1100}),
  ],
};
