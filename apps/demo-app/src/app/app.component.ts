import { Component, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppService } from './app.service';
import { AsyncPipe, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [RouterModule, AsyncPipe],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'demo-app';
}
