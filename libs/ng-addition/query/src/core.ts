import { Observable, catchError, map, of, shareReplay, startWith } from 'rxjs';
import { QueryResult, buildErrorResult, buildLoadingResult, buildSuccessResult } from './request';

export function baseQuery<T>(req$: Observable<T>): Observable<QueryResult<T>> {
  const obs$: Observable<QueryResult<T>> = req$.pipe(
    map((res) => {
      const result = buildSuccessResult(res);
      return result;
    }),
    catchError((error: Error) => {
      const result = buildErrorResult(error);
      return of(result);
    }),
    shareReplay({ refCount: true, bufferSize: 1 }),
    startWith(buildLoadingResult()),
  );

  return obs$;
}