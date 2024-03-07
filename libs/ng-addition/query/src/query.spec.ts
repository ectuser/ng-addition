import { effect } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { delay, of } from 'rxjs';

import { query } from './query';

describe('query', () => {

  it('should return data', fakeAsync(() => {
    TestBed.runInInjectionContext(() => {
      const spy = jest.fn();

      const request$ = of('success result').pipe(delay(10));
  
      const data$ = query(request$).result$;
  
      data$.subscribe(spy);
  
      tick(10);
  
      expect(spy).toHaveBeenCalledTimes(2);
    });
  }));

  it('should return data signal', fakeAsync(() => {
    TestBed.runInInjectionContext(() => {
      const spy = jest.fn();

      const request$ = of('success result').pipe(delay(10));
  
      const data = query(request$).result();

      effect(() => {
        spy(data());
      });
  
      tick(10);
  
      expect(spy).toHaveBeenCalledTimes(2);
    });
  }));
});
