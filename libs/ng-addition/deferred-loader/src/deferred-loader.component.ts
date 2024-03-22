import { Component, PLATFORM_ID, TemplateRef, ViewContainerRef, contentChild, inject, input, numberAttribute, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { DeferredLoaderOptions } from './deferred-loader-settings';
import { DeferredLoaderState } from './deferred-loader-state';
import { isPlatformBrowser } from '@angular/common';

/**
 * 
 * This component is used for reducing number of times a loading spinner is shown.
 * 
 * There are two option settings: `loadingThreshold` and `minLoadingTime`. Find more info about them in `DeferredLoaderOptions` interface docs.
 * 
 * If it is necessary to configure `loadingThreshold` and `minLoadingTime` globally or to a sub component tree, then we can use `provideDeferredLoaderSettings()` function.
 * 
 * Usage:
 * 
 * ```html
 *    <deferred-loader [isLoading]="isLoading()" loadingThreshold="1500" minLoadingTime="300" >
 * 
 *      <ng-content #loader>
 *        <app-loading-spinner />
 *      <ng-content>
 *
 *       <ng-template #loadedContent>
 *         Loaded data
 *       </ng-template>
 * 
 *    </deferred-loader>
 * 
 * ```
 * 
 */

@Component({
  selector: 'deferred-loader',
  template: `
    <ng-container #ref />
    <ng-content />
  `,
  standalone: true,
})
export class DeferredLoaderComponent {
  public readonly isLoading = input.required<boolean>();

  /** 
   * Optional. 
   * This property defines after what time (in milliseconds) a loading spinner should be displayed.
   * For instance, if you set `{loadingThreshold: 500}`, it means that if request takes longer than 500ms, then loading spinner is shown.
   * If a request took less than 500ms, then loading spinner will not be shown at all
   */
  public readonly loadingThreshold = input<DeferredLoaderOptions['loadingThreshold'] | undefined, number>(undefined, {transform: numberAttribute});
  /** 
   * Optional. 
   * This property defines minimum time (in milliseconds) that loading spinner is shown.
   * For instance, if you set `{minLoadingTime: 500}`, it means that loading spinner will be shown for at least 500ms 
   * regardless how long it takes to complete a request
   */
  public readonly minLoadingTime = input<DeferredLoaderOptions['minLoadingTime'] | undefined, number>(undefined, {transform: numberAttribute});

  private readonly loader = contentChild.required<TemplateRef<unknown>>('loader');
  private readonly content = contentChild.required<TemplateRef<unknown>>('content');
  private readonly placeholder = contentChild<TemplateRef<unknown>>('placeholder');

  private readonly ref = viewChild.required('ref', {read: ViewContainerRef});

  private readonly deferredLoaderState = new DeferredLoaderState(this.loadingThreshold, this.minLoadingTime);

  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    const loading$ = toObservable(this.isLoading);

    if (isPlatformBrowser(this.platformId)) {
      // This intricate logic operates exclusively within the browser to prevent prolonged rendering of the loading spinner on the server.

      this.deferredLoaderState.handleIsLoading(loading$)
        .pipe(takeUntilDestroyed())
        .subscribe(result => {
          this.ref().clear();

          if (result === 'started') {
            this.renderPlaceholder();
          } else if (result === 'loading') {
            this.renderLoader();
          } else {
            this.renderContent();
          }
        });
    } else {
      // on server we render loading spinner as it is

      loading$.pipe(takeUntilDestroyed()).subscribe((loading) => {
        this.ref().clear();

        if (loading) {
          this.renderLoader();
        } else {
          this.renderContent();
        }
      });
    }
  }

  private renderPlaceholder() {
    const placeholder = this.placeholder();

    if (placeholder) {
      this.ref().createEmbeddedView(placeholder);
    }
  }

  private renderLoader() {
    const loader = this.loader();

    if (loader) {
      this.ref().createEmbeddedView(loader);
    }
  }

  private renderContent() {
    const content = this.content();

    if (content) {
      this.ref().createEmbeddedView(content);
    }
  }
}
