export type QueryStatus = 'loading' | 'error' | 'success'

export interface BaseResult<
  T = unknown,
> {
  data: T | undefined;
  error: Error | undefined;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isFetched: boolean;
  status: QueryStatus;

  // errorMessage: string | undefined;
  // isRefetching: boolean
  // failureCount: number
  // failureReason: TError | null
}

export type QueryResult<T> = SuccessResult<T> | ErrorResult<T> | LoadingResult<T>;

export interface SuccessResult<T> extends BaseResult<T> {
  data: T;
  error: undefined;
  isError: false;
  isLoading: false;
  isSuccess: true;
  isFetched: true;
  status: 'success';
}

export interface ErrorResult<T> extends BaseResult<T> {
  data: undefined;
  error: Error;
  isError: true;
  isLoading: false;
  isSuccess: false;
  isFetched: true;
  status: 'error';
}

export interface LoadingResult<T> extends BaseResult<T> {
  data: undefined;
  error: undefined;
  isError: false;
  isLoading: true;
  isSuccess: false;
  isFetched: false;
  status: 'loading';
}

export function buildSuccessResult<T>(data: T): SuccessResult<T> {
  return {
    data,
    error: undefined,
    isError: false,
    isFetched: true,
    isLoading: false,
    isSuccess: true,
    status: 'success',
  };
}

export function buildErrorResult<T>(error: Error): ErrorResult<T> {
  return {
    data: undefined,
    error: error,
    isError: true,
    isFetched: true,
    isLoading: false,
    isSuccess: false,
    status: 'error',
  };
}

export function buildLoadingResult<T>(): LoadingResult<T> {
  return {
    data: undefined,
    error: undefined,
    isError: false,
    isFetched: false,
    isLoading: true,
    isSuccess: false,
    status: 'loading',
  };
}

