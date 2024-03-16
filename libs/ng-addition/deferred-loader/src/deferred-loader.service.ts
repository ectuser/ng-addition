import { Observable, delay, of, startWith, tap } from 'rxjs';

import { DeferredLoaderOptions } from './deferred-loader-settings';

export enum LoadingState {
  Started = 'started',
  Loading = 'loading',
  Finished = 'finished',
}

export class DeferredLoaderService {
  private lastEmitTime = 0;

  public calculateLoadingState(showLoader: boolean | undefined, loadingOptions: DeferredLoaderOptions): Observable<LoadingState> {
    const currentTime = Date.now();

    if (!showLoader) {
      // Calculate the elapsed time since the last false emission
      const elapsedTime = currentTime - this.lastEmitTime;
      
      if (elapsedTime < loadingOptions.minLoadingTime) {
        // Delay emitting false to ensure it stays visible for at least `minLoadingTime`
        return of(LoadingState.Finished).pipe(
          delay(loadingOptions.minLoadingTime - elapsedTime),
          tap(() => this.lastEmitTime = Date.now()),
          startWith(LoadingState.Loading),
        );
      } else {
        // If enough time has passed since the last false emission, emit immediately
        this.lastEmitTime = Date.now();
        return of(LoadingState.Finished);
      }
    }

    // If loading is true, emit loading within `loadingThreshold`
    return of(LoadingState.Loading).pipe(
      delay(loadingOptions.loadingThreshold),
      tap(() => this.lastEmitTime = Date.now()),
      startWith(LoadingState.Started),
    );
  }
}
