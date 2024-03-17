import { Component, contentChild, input } from '@angular/core';

@Component({
  selector: 'deferred-loader',
  template: `
    <ng-content></ng-content>

    <ng-container></ng-container>
  `,
})
export class DeferredLoaderComponent {
  public readonly isLoading = input.required<boolean>();

  public readonly loader = contentChild('loader');
  public readonly loadedContent = ContentChild('content');
  public readonly placeholder = ContentChild('placeholder');
}
