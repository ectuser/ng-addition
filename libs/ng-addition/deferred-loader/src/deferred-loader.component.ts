import { Component, TemplateRef, ViewContainerRef, computed, contentChild, effect, input, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { distinctUntilChanged, switchMap } from 'rxjs';

import { useSettings } from './use-settings';
import { DeferredLoaderOptions } from './deferred-loader-settings';
import { DeferredLoaderService } from './deferred-loader.service';

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
  public readonly loadingThreshold = input<DeferredLoaderOptions['loadingThreshold']>();
  /** 
   * Optional. 
   * This property defines minimum time (in milliseconds) that loading spinner is shown.
   * For instance, if you set `{minLoadingTime: 500}`, it means that loading spinner will be shown for at least 500ms 
   * regardless how long it takes to complete a request
   */
  public readonly minLoadingTime = input<DeferredLoaderOptions['minLoadingTime']>();

  private readonly loader = contentChild.required<TemplateRef<unknown>>('loader');
  private readonly loadedContent = contentChild.required<TemplateRef<unknown>>('content');
  private readonly placeholder = contentChild<TemplateRef<unknown>>('placeholder');

  private readonly ref = viewChild.required('ref', {read: ViewContainerRef});


  private options = useSettings(this.loadingThreshold, this.minLoadingTime);
  private readonly computedInputs = computed(() => ({
    isLoading: this.isLoading(),
    loader: this.loader(),
    loadedContent: this.loadedContent(),
    placeholder: this.placeholder(),
    loadingThreshold: this.loadingThreshold(),
    minLoadingTime: this.minLoadingTime(),
    options: this.options(),
  }));

  private deferredLoaderService: DeferredLoaderService;

  constructor() {
    effect(() => {
      console.log(this.ref());
      
    });

    this.deferredLoaderService = new DeferredLoaderService();

    toObservable(this.computedInputs).pipe(
      switchMap(({isLoading, options}) => this.deferredLoaderService.calculateLoadingState(isLoading, options)),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe((result) => {
      this.ref().clear();

      if (result === 'started') {
        this.renderPlaceholder();
      } else if (result === 'loading') {
        this.renderLoader();
      } else {
        this.renderContent();
      }
    });
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
    const content = this.loadedContent();

    if (content) {
      this.ref().createEmbeddedView(content);
    }
  }
}
