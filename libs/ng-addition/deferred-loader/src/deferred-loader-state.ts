import { Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { BehaviorSubject, Observable, filter, take } from 'rxjs';

import { DeferredLoaderOptions } from './deferred-loader-settings';
import { DeferredLoaderService } from './deferred-loader.service';
import { useSettings } from './use-settings';

@Injectable()
export class DeferredLoaderState {
  // private readonly options = useSettings(this.loadingThreshold, this.minLoadingTime);


  constructor() {
    
  }

  public init(loadingThreshold: Signal<number>, minLoadingTime: Signal<number>) {
    
  }
}
