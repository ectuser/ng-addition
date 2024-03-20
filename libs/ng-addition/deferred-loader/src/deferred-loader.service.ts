import { Observable, delay, of, startWith, tap } from 'rxjs';

import { DeferredLoaderOptions } from './deferred-loader-settings';

export type LoadingState = 'started' | 'loading' | 'finished';

const states: Record<LoadingState, LoadingState> = {
  started: 'started',
  loading: 'loading',
  finished: 'finished'
};

export class DeferredLoaderService {
  private lastEmitTime = 0;

  constructor(private loadingOptions: DeferredLoaderOptions) {}

  public calculateLoadingState(showLoader: boolean | undefined): Observable<LoadingState> {
    const currentTime = Date.now();

    if (!showLoader) {
      // Calculate the elapsed time since the last false emission
      const elapsedTime = currentTime - this.lastEmitTime;
      
      if (elapsedTime < this.loadingOptions.minLoadingTime) {
        // Delay emitting false to ensure it stays visible for at least `minLoadingTime`
        return of(states.finished).pipe(
          delay(this.loadingOptions.minLoadingTime - elapsedTime),
          tap(() => this.lastEmitTime = Date.now()),
          startWith(states.loading),
        );
      } else {
        // If enough time has passed since the last false emission, emit immediately
        this.lastEmitTime = Date.now();
        return of(states.finished);
      }
    }

    // If loading is true, emit loading within `loadingThreshold`
    return of(states.loading).pipe(
      delay(this.loadingOptions.loadingThreshold),
      tap(() => this.lastEmitTime = Date.now()),
      startWith(states.started),
    );
  }
}
