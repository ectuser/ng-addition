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
    service = new DeferredLoaderService();
  });

  describe('loading is true', () => {

    it('emit "loading" within `loadingThreshold` with default value being "started"', fakeAsync(() => {
      const spy = jest.fn();
      
      service.calculateLoadingState(true, {loadingThreshold: 100, minLoadingTime: 500}).subscribe(spy);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith(states.started);
      spy.mockClear();

      tick(101);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith(states.loading);
    }));
  });

  describe('loading is false', () => {
    it('emit "finished" if request took less than `loadingThreshold`', () => {
      const spy = jest.fn();
      
      service.calculateLoadingState(true, {loadingThreshold: 100, minLoadingTime: 500}).subscribe(spy);
      
      service.calculateLoadingState(false, {loadingThreshold: 100, minLoadingTime: 500}).subscribe(spy);
    });
  });
});
