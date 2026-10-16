import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import type { Carrito as CarritoModelType } from '../../modelos/carrito.model';
import { CarritoService } from '../../servicios/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito implements OnInit {
  private readonly carritoService = inject(CarritoService);
  private readonly platformId = inject(PLATFORM_ID);

  carritos: CarritoModelType[] = [];
  cargando = true;
  error = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.carritoService.obtenerTodos().subscribe({
      next: (carritos) => {
        this.carritos = carritos;
        this.cargando = false;
      },
      error: (err: unknown) => {
        console.error('Error al obtener los carritos:', err);
        this.error = 'No fue posible cargar la información de carritos desde el servidor backend.';
        this.cargando = false;
      },
    });
  }
}
