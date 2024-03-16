import { Inject, Pipe, PipeTransform } from '@angular/core';

import { Observable } from 'rxjs';

import { DEFERRED_LOADER_OPTIONS, DeferredLoaderOptions } from './deferred-loader-settings';
import { DeferredLoaderService, LoadingState } from './deferred-loader.service';

@Pipe({
  name: 'deferredLoader',
  standalone: true,
})
export class DeferredLoaderPipe implements PipeTransform {
  private deferredLoaderService: DeferredLoaderService;

  constructor(@Inject(DEFERRED_LOADER_OPTIONS) private loaderOptions: DeferredLoaderOptions) {
    this.deferredLoaderService = new DeferredLoaderService();
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
