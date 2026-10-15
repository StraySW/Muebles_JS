import { Component, signal } from '@angular/core';
import { MenuComponent } from './views/menu/menu.component';

@Component({
  imports: [MenuComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Muebles_JS');
}
