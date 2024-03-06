import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-route',
  standalone: true,
  imports: [
    RouterModule
  ],
  template: `
    <h2>Client:</h2>
    @if (isBrowser) {
      <router-outlet></router-outlet>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientRouteComponent {
  private readonly platform = inject(PLATFORM_ID);

  public readonly isBrowser = isPlatformBrowser(this.platform);
}
