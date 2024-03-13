import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, computed, input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { EMPTY, shareReplay, switchMap } from 'rxjs';

import { query } from 'ng-addition/query';

import { AppService } from '../app.service';

@Component({
  selector: 'app-concrete-todo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  template: `
    <div>
      <a [routerLink]="['..']">Back</a>
    </div>
    <div>
      @if (user$ | async; as user) {
        @if (user.isLoading) {
          Loading...
        } @else {
          <h2>Concrete user - {{user.data?.first_name}}</h2>
          <div>
            {{user.data | json}}
          </div>
        }
      
        @if (user.isError) {
          Error: {{user.error | json}}
        }
      }
    </div>
    <br>
    @if (idNumber() !== undefined) {
      <div>
        <a [routerLink]="['..', previousId()]">Previous</a> | 
        <a [routerLink]="['..', nextId()]">Next</a>
      </div>
      <br>
    }

    <div>Is fetched - {{(user$ | async)?.isFetched}}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConcreteTodoComponent {
  // route param id 
  private readonly id = input.required<number | undefined>();

  public readonly idNumber = computed(() => {
    const id = this.id();

    if (id === undefined) {
      return undefined;
    }

    const numb = Number(id);

    return isNaN(numb) ? undefined : numb;
  })

  public readonly user$ = this.route.params.pipe(
    switchMap(params => {
      const id = params['id'];

      if (!id) {
        return EMPTY;
      }

      return query(this.appService.getItem(id)).result$;
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  public readonly previousId: Signal<number | undefined>;
  public readonly nextId: Signal<number | undefined>;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
  ) {
    this.previousId = computed(() => {
      const id = this.idNumber();

      if (id === undefined) {
        return undefined;
      }

      return id - 1;
    });

    this.nextId = computed(() => {
      const id = this.idNumber();

      if (id === undefined) {
        return undefined;
      }

      return id + 1;
    });
  }
}
