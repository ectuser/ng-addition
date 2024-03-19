import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { query } from 'ng-addition/query';
import { DeferredLoaderComponent, DeferredLoaderDirective } from 'ng-addition/deferred-loader';

import { AppService } from '../app.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DeferredLoaderDirective,
    DeferredLoaderComponent,
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

  <h2>Component usage:</h2>

  <deferred-loader [isLoading]="users().isLoading">
    <ng-template #content>
      @for (item of users().data; track 'id') {
        <div>
          <a [routerLink]="[item.id]">{{item.first_name}} {{item.last_name}}</a>
        </div>
      }
    </ng-template>


    <ng-template #loader>
      <span>Loading...</span>
    </ng-template>
  </deferred-loader>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  public readonly users = query(this.appService.getItems()).result();
  
  constructor(
    private appService: AppService,
  ) {}
}
