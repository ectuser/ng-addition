import { BehaviorSubject, ReplaySubject, distinctUntilChanged, switchMap } from 'rxjs';
import { DeferredLoaderService, LoadingState } from './deferred-loader.service';

import { fakeAsync, tick } from '@angular/core/testing';

const states: Record<LoadingState, LoadingState> = {
  started: 'started',
  loading: 'loading',
  finished: 'finished'
};

describe('DeferredLoaderService', () => {
  let service: DeferredLoaderService;

  beforeEach(() => {
    service = new DeferredLoaderService({loadingThreshold: 100, minLoadingTime: 500});
  });

  describe('loading is true', () => {

    it('emit "loading" within `loadingThreshold` with default value being "started"', fakeAsync(() => {
      const loading = new ReplaySubject<boolean>(1);
      const spy = jest.fn();

      loading.pipe(
        switchMap(isLoading => service.calculateLoadingState(isLoading))
      ).subscribe(spy);

      loading.next(true);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith(states.started);

      spy.mockClear();

      tick(101);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith(states.loading);
    }));
  });

  describe('loading is false', () => {
    it('emit "finished" if request took less than `loadingThreshold`', fakeAsync(() => {
      const loading = new ReplaySubject<boolean>(1);
      const spy = jest.fn();

      loading.pipe(
        switchMap(isLoading => service.calculateLoadingState(isLoading))
      ).subscribe(spy);

      loading.next(true);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith(states.started);

      spy.mockClear();

      tick(50);

      loading.next(false);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith(states.finished);
    }));

    it('emit "loading" and then "finished" if request took more than `loadingThreshold`. Loading should be shown for at least `minLoadingTime`', fakeAsync(() => {
      const loading = new ReplaySubject<boolean>(1);
      const spy = jest.fn();

      loading.pipe(
        switchMap(isLoading => service.calculateLoadingState(isLoading)),
      ).subscribe(spy);

      loading.next(true);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith(states.started);

      spy.mockClear();

      tick(150);

      loading.next(false);

      // request took longer than `loadingThreshold`, then we are showing loading for at least `minLoadingTime`
      
      expect(spy).toHaveBeenLastCalledWith(states.loading);

      tick(200);

      // still showing loading because `minLoadingTime` was not passed

      expect(spy).toHaveBeenLastCalledWith(states.loading);

      tick(600);

      // finally it is passed `minLoadingTime` ms, then stop show loading

      expect(spy).toHaveBeenLastCalledWith(states.finished);
    }));
  });
});