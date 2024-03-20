import { ChangeDetectorRef, Directive, TemplateRef, ViewContainerRef, input, booleanAttribute } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { DeferredLoaderOptions } from './deferred-loader-settings';
import { DeferredLoaderState } from './deferred-loader-state';


/**
 * 
 * This directive is used for reducing number of times a loading spinner is shown.
 * 
 * There are two option settings: `loadingThreshold` and `minLoadingTime`. Find more info about them in `DeferredLoaderOptions` interface docs.
 * 
 * If it is necessary to configure `loadingThreshold` and `minLoadingTime` globally or to a sub component tree, then we can use `provideDeferredLoaderSettings()` function.
 * 
 * Usage:
 * 
 * ```html
 *   <app-loading-spinner *deferredLoader="isLoading(); else loaded; loadingThreshold: 1200; minLoadingTime: 700" />

    <ng-template #loaded>
      Loaded data
    </ng-template>
  ```
 * 
 */
@Directive({
  selector: '[deferredLoader]',
  standalone: true,
})
export class DeferredLoaderDirective {
  public readonly deferredLoader = input.required<boolean, boolean | string | undefined | null>({transform: booleanAttribute});
  /**
   * Template to display when loading is false
   */
  public readonly deferredLoaderElse = input<TemplateRef<unknown>>();

  /** 
   * Optional. 
   * This property defines after what time (in milliseconds) a loading spinner should be displayed.
   * For instance, if you set `{loadingThreshold: 500}`, it means that if request takes longer than 500ms, then loading spinner is shown.
   * If a request took less than 500ms, then loading spinner will not be shown at all
   */
  public readonly deferredLoaderLoadingThreshold = input<DeferredLoaderOptions['loadingThreshold']>();
  /** 
   * Optional. 
   * This property defines minimum time (in milliseconds) that loading spinner is shown.
   * For instance, if you set `{minLoadingTime: 500}`, it means that loading spinner will be shown for at least 500ms 
   * regardless how long it takes to complete a request
   */
  public readonly deferredLoaderMinLoadingTime = input<DeferredLoaderOptions['minLoadingTime']>();

  private readonly deferredLoaderState = new DeferredLoaderState(this.deferredLoaderLoadingThreshold, this.deferredLoaderMinLoadingTime);

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<unknown>,
    private cdr: ChangeDetectorRef,
  ) {

    const loading$ = toObservable(this.deferredLoader);

    this.deferredLoaderState.handleIsLoading(loading$)
      .pipe(takeUntilDestroyed())
      .subscribe(loadingState => {
        this.clearViewContainer();
        if (loadingState === 'loading') {
          this.showAppliedTemplate();
        } else if (loadingState === 'finished') {
          this.showElseTemplate();
        }

        this.cdr.markForCheck();
      });
  }

  private clearViewContainer() {
    this.viewContainer.clear();
  }

  private showAppliedTemplate() {
    this.viewContainer.createEmbeddedView(this.templateRef);
  }

  private showElseTemplate() {
    const elseTemplate = this.deferredLoaderElse();

    if (elseTemplate) {
      this.viewContainer.createEmbeddedView(elseTemplate);
    }
  }
}
