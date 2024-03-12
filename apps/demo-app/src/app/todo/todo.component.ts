import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { query } from 'ng-addition/query';
import { DeferredLoaderDirective } from 'ng-addition/deferred-loader';

import { AppService } from '../app.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DeferredLoaderDirective,
  ],
  template: `
  <h1>Users</h1>

  <span *deferredLoader="users().isLoading; else loaded; loadingThreshold: 1200; minLoadingTime: 700">Loading...</span>

  <ng-template #loaded>
    @for (item of users().data; track 'id') {
      <div>
        <a [routerLink]="[item.id]">{{item.first_name}} {{item.last_name}}</a>
      </div>
    }
  </ng-template>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  public readonly users = query(this.appService.getItems()).result();
  
  constructor(
    private appService: AppService,
  ) {}
}
