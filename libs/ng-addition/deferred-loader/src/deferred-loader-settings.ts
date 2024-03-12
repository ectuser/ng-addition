import { InjectionToken, makeEnvironmentProviders } from '@angular/core';

export interface DeferredLoaderOptions {
  /** 
   * This property defines after what time (in milliseconds) a loading spinner should be displayed.
   * For instance, if you set `{loadingThreshold: 500}`, it means that if request takes longer than 500ms, then loading spinner is shown.
   * If a request took less than 500ms, then loading spinner will not be shown at all
   */
  loadingThreshold: number;
  /** 
   * This property defines minimum time (in milliseconds) that loading spinner is shown.
   * For instance, if you set `{minLoadingTime: 500}`, it means that loading spinner will be shown for at least 500ms 
   * regardless how long it takes to complete a request
   */
  minLoadingTime: number;
}

export const defaultLoaderOptions: DeferredLoaderOptions = {
  loadingThreshold: 1000,
  minLoadingTime: 500,
};

export const DEFERRED_LOADER_OPTIONS = new InjectionToken<DeferredLoaderOptions>('deferred-loader-settings', {
  providedIn: 'root',
  factory() {
    return defaultLoaderOptions;
  }
});

/**
 * 
 * This function provides custom options to the app globally or to a sub component tree.
 * 
 * Usage:
 * 
 * ```ts
 * // Standalone
  bootstrapApplication(App, { providers: [provideDeferredLoaderSettings(globalOptions)] });

  // AppModule
  @NgModule({
    providers: [provideDeferredLoaderSettings(globalOptions)],
  })
  export class AppModule {}

  // Route#provider
  const route = {
    path: 'some-path',
    providers: [provideDeferredLoaderSettings(subTreeGlobalOptions)],
  };
 * ```
 *  
 */
export function provideDeferredLoaderSettings(options: Partial<DeferredLoaderOptions> = {}) {
  const valuesToPaste = {...defaultLoaderOptions, ...options};
  
  return makeEnvironmentProviders([
    { provide: DEFERRED_LOADER_OPTIONS, useValue: valuesToPaste },
  ]);
}
