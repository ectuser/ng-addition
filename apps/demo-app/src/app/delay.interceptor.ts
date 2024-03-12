import { HttpParams, type HttpInterceptorFn } from '@angular/common/http';

export const delayInterceptor: HttpInterceptorFn = (req, next) => {
  const params = (req.params ?? new HttpParams()).set('delay', 0.5);

  const newReq = req.clone({params});

  return next(newReq);
};
