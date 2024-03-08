import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Observable, shareReplay } from 'rxjs';

import { QueryResult } from './request';
import { baseQuery } from './core';

export function query<T>(
  req$: Observable<T>,
) {
  const result$ = baseQuery(req$).pipe(
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  return {
    result$, 
    result() {
      return toSignal(result$) as unknown as Signal<QueryResult<T>>
    }
  };
}

export { QueryResult } from './request';
