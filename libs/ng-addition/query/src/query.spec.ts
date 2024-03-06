// import { delay, of } from 'rxjs';

import { fakeAsync, tick } from '@angular/core/testing';

import { delay, of } from 'rxjs';
import { query } from './query';

// import { query } from './query';

describe('query', () => {

  it('should return data', fakeAsync(() => {
    // expect(false).toBeTruthy();

    const request$ = of('success result').pipe(delay(1));

    const {data$} = query(request$);

    const spy = jest.spyOn(data$, 'subscribe');

    data$.subscribe((data) => {
      console.log('3', data);
      
    });

    tick(1);

    expect(spy).toHaveBeenCalledTimes(1);
  }));
});
