import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { query } from 'ng-addition/query';
import { delay, of, switchMap } from 'rxjs';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(
    private http: HttpClient,
  ) {}

  getItems() {
    return query(
      this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').pipe(
        delay(2000)
      )
    );
  }

  getItem(id: string) {
    return this.http.get<Todo>('https://jsonplaceholder.typicode.com/todos/' + id).pipe(
      delay(2000)
    );
  }

  getItemsError() {
    return query(
      of('1').pipe(
        delay(2000),
        switchMap(() => this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/error'))
      )
    );
  }
}
