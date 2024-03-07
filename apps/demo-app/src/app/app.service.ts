import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs';

export interface ApiResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(
    private http: HttpClient,
  ) {}

  getItems() {
    return this.http.get<ApiListResponse<User>>('https://reqres.in/api/users').pipe(map(data => data.data));
  }

  getItem(id: string) {
    return this.http.get<ApiResponse<User>>('https://reqres.in/api/users/' + id).pipe(map(data => data.data));
  }

  getItemError() {
    return this.http.get<ApiResponse<User>>('https://reqres.in/api/users/1231212312').pipe(map(data => data.data));
  }
}
