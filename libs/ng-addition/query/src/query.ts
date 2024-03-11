import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Observable, shareReplay } from 'rxjs';

import { QueryResult } from './request';
import { baseQuery } from './core';


/**
 * 
 * This utility function `query` is used for transforming fetch response to a `QueryResult` 
 * which contains useful properties as `isLoading`, `isError`, `error`.
 * 
 * 
 * @param req$ - Source Observable. Usually it's a request.
 * 
 * 
 * It returns an object with a field: `result$` which represents an Observable result.
 * It also returns a function `result()` that transforms `result$` Observable field into a `Signal`. 
 * 
 * Important note: it's mandatory to call `result()` function inside Angular reactive context:
 * Properties declarations and `constructor`.
 * 
 * Usage example:
 * 
 * ```typescript
 * Component({
 *  template: `
 *    if (postsResult().isLoading) {
 *      Loading...
 *    } else if (postsResult().isError) {
*       Error - {{postsResult().error | json}}
*     } else {
*       Posts: 
*       for (let post of postsResult().data) {
*         {{post.title}}
*       }
*     }
 *  `
 * })
 * export class ExampleComponent {
 *  postsResult = query(this.postsApiService.fetchPosts()).result() // `this.postsResult` is a signal
 * 
 *  constructor(private postsApiService: PostsApiService) {}
 * }
 * ```
 */
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
