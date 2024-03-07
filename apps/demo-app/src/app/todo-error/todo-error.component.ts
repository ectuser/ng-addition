import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { query } from 'ng-addition/query';

import { AppService } from '../app.service';

@Component({
  selector: 'app-todo-error',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
    <h2>Error page</h2>

    @if (user().isLoading) {
      Loading...
    }

    @if (user().isError) {
      Error: {{user().error | json}}
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoErrorComponent {
  public readonly user = query(this.appService.getItemError()).result();

  constructor(
    private appService: AppService,
  ) {}
}
