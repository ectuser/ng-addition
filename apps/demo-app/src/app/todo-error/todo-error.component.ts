import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  selector: 'app-todo-error',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
    <h2>Error page</h2>

    @if (loading$ | async) {
      Loading...
    }

    @if (error$ | async) {
      Error: {{error$ | async | json}}
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoErrorComponent {
  loading$: Observable<boolean>;
  error$: Observable<Error | undefined>;

  constructor(
    private appService: AppService,
  ) {
    const {isLoading$, error$} = this.appService.getItemsError();

    this.loading$ = isLoading$;
    this.error$ = error$;
  }
}
