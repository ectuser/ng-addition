import { Observable, delay, of, tap } from 'rxjs';

import { DeferredLoaderOptions } from './deferred-loader-settings';

export class DeferredLoaderService {
  private lastEmitTime = 0;

  public calculateLoadingState(showLoader: boolean | undefined, loadingOptions: DeferredLoaderOptions): Observable<boolean> {
    const currentTime = Date.now();

    if (!showLoader) {
      // Calculate the elapsed time since the last false emission
      const elapsedTime = currentTime - this.lastEmitTime;
      
      if (elapsedTime < loadingOptions.minLoadingTime) {
        // Delay emitting false to ensure it stays visible for at least `minLoadingTime`
        return of(false).pipe(
          delay(loadingOptions.minLoadingTime - elapsedTime),
          tap(() => this.lastEmitTime = Date.now()),
        );
      } else {
        // If enough time has passed since the last false emission, emit immediately
        this.lastEmitTime = Date.now();
        return of(false);
      }
    }

    // If loading is true, emit loading within `loadingThreshold`
    return of(true).pipe(
      delay(loadingOptions.loadingThreshold),
      tap(() => this.lastEmitTime = Date.now()),
    );
  }
}
