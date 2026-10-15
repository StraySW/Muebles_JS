import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ApiMuebles } from '../../servicios/api-muebles';

@Component({
  imports: [],
  selector: 'app-catalogo',
  styleUrl: './catalogo.css',
  templateUrl: './catalogo.html',
})
export class Catalogo implements OnInit {
  private readonly apiMuebles = inject(ApiMuebles);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.apiMuebles.getCarts().subscribe({
      next: (response) => console.log(response),
      error: (error: unknown) => console.error('Error al consultar los carritos:', error),
    });
  }
}
