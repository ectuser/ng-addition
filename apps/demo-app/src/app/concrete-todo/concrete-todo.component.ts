import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { switchMap } from 'rxjs';
import { AppService, Todo } from '../app.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { query } from 'ng-addition/query';

@Component({
  selector: 'app-concrete-todo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  template: `
    <a [routerLink]="['..']">Back</a>
    <h2>Concrete todo - </h2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConcreteTodoComponent {
  // loading$: Observable<boolean>;
  // todo$: Observable<Todo | undefined>;
  // error$: Observable<Error | undefined>;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
  ) {
    const data = this.route.params.pipe(
      switchMap(params => {
        const id = params['id'];

        return this.appService.getItem(id);
      }),
    );
  }
}
