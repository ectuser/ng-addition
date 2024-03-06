import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService, Todo } from '../app.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  template: `
  @if (loading$ | async) {
    Loading...
  }

  @for (item of (data$ | async); track 'id') {
    <div>
      <a [routerLink]="[item.id]">{{item.title}}</a>
    </div>
  }
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  loading$: Observable<boolean>;
  data$: Observable<Todo[] | undefined>;
  
  constructor(
    private appService: AppService,
  ) {
    const {data$, isLoading$} = this.appService.getItems();

    this.loading$ = isLoading$;
    this.data$ = data$;

    this.loading$.subscribe(console.log);
    this.data$.subscribe(console.log);
  }
}
