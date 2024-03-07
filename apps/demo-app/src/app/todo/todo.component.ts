import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { query } from 'ng-addition/query';

import { AppService } from '../app.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  template: `
  <h1>Users</h1>
  @if (users().isLoading) {
    Loading...
  } @else {
    @for (item of users().data; track 'id') {
      <div>
        <a [routerLink]="[item.id]">{{item.first_name}} {{item.last_name}}</a>
      </div>
    }
  }
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  public readonly users = query(this.appService.getItems()).result();
  
  constructor(
    private appService: AppService,
  ) {}
}
