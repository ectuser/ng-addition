import { Pipe, PipeTransform, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { DEFERRED_LOADER_OPTIONS, DeferredLoaderOptions } from './deferred-loader-settings';
import { DeferredLoaderService, LoadingState } from './deferred-loader.service';

// WIP

@Pipe({
  name: 'deferredLoader',
  standalone: true,
})
export class DeferredLoaderPipe implements PipeTransform {
  private readonly deferredLoaderService: DeferredLoaderService;

  private readonly loaderOptions = inject(DEFERRED_LOADER_OPTIONS);

  constructor() {
    this.deferredLoaderService = new DeferredLoaderService(this.loaderOptions);
  }

  transform(showLoader: boolean | undefined, loadingThreshold?: number, minLoadingTime?: number): Observable<LoadingState> {
    const paramsOptions = {
      loadingThreshold: loadingThreshold ?? this.loaderOptions.loadingThreshold,
      minLoadingTime: minLoadingTime ?? this.loaderOptions.minLoadingTime,
    };

    const options: DeferredLoaderOptions = {
      ...this.loaderOptions,
      ...paramsOptions,
    };

    return this.deferredLoaderService.calculateLoadingState(showLoader, options);
  }

}
