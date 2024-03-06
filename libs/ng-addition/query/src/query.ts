import { Observable, map } from 'rxjs';
import { QueryStatus } from './request';
import { baseQuery } from './core';

// private defaultOptions = inject(DEFAULT_HANDLE_OPTIONS);

interface HandleOptions {
}

interface QueryOptions {
  
}

interface BaseQueryResult<T> {
  data$: Observable<T | undefined>;
  error$: Observable<Error | undefined>;
  isError$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  isSuccess$: Observable<boolean>;
  isFetched$: Observable<boolean>;
  status$: Observable<QueryStatus>;
  // data: Signal<T | undefined>;
  // error: Signal<Error | undefined>;
  // isError: Signal<boolean>;
  // isLoading: Signal<boolean>;
  // isSuccess: Signal<boolean>;
  // isFetched: Signal<boolean>;
  // status: Signal<QueryStatus>;
}

export function query<T>(
    req$: Observable<T>,
    opt: Partial<HandleOptions> = {}
): BaseQueryResult<T> {
    const res$ = baseQuery(req$);

    const data$ = res$.pipe(map(res => res.data));
    const error$ = res$.pipe(map(res => res.error));
    const isError$ = res$.pipe(map(res => res.isError));
    const isLoading$ = res$.pipe(map(res => res.isLoading));
    const isSuccess$ = res$.pipe(map(res => res.isSuccess));
    const isFetched$ = res$.pipe(map(res => res.isFetched));
    const status$ = res$.pipe(map(res => res.status));

    return {
      data$,
      // data: toSignal(data$),
      error$,
      // error: toSignal(error$),
      isError$,
      // isError: toSignal(isError$, {initialValue: false}),
      isLoading$,
      // isLoading: toSignal(isLoading$, {initialValue: false}),
      isSuccess$,
      // isSuccess: toSignal(isSuccess$, {initialValue: false}),
      isFetched$,
      // isFetched: toSignal(isFetched$, {initialValue: false}),
      status$,
      // status: toSignal(status$, {initialValue: 'loading'}),
    };
}
