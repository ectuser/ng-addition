import { Signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { BehaviorSubject, Observable, distinctUntilChanged, filter, switchMap, take } from 'rxjs';

import { DeferredLoaderService } from './deferred-loader.service';
import { useSettings } from './use-settings';

export class DeferredLoaderState {
  private readonly options = useSettings(this.loadingThreshold, this.minLoadingTime);

  private readonly deferredLoaderService$ = new BehaviorSubject<DeferredLoaderService | undefined>(undefined);
  private readonly serviceInitialized$ = this.deferredLoaderService$.pipe(
    filter(value => !!value)
  ) as Observable<DeferredLoaderService>;

  constructor(
    private loadingThreshold: Signal<number | undefined>,
    private minLoadingTime: Signal<number | undefined>,
  ) {
    toObservable(this.options).pipe(
      take(1),
      takeUntilDestroyed()
    ).subscribe((options) => {
      this.deferredLoaderService$.next(new DeferredLoaderService(options));
    });
  }

  public handleIsLoading(loading$: Observable<boolean>) {
    return this.serviceInitialized$.pipe(
      switchMap(service => {
        return loading$.pipe(
          switchMap(isLoading => service.calculateLoadingState(isLoading)),
          distinctUntilChanged(),
        )
      }),
      takeUntilDestroyed(),
    );
  }
}
