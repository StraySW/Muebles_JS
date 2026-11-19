import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import type { Carrito as CarritoModelType } from '../../modelos/carrito.model';
import { CarritoService } from '../../servicios/carrito.service';
import { GenericTable } from '../../componentes/table/generic-table';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, GenericTable],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito implements OnInit {
  carritos = signal<CarritoModelType[]>([]);

  private readonly carritoService = inject(CarritoService);

  ngOnInit(): void {
    this.carritoService.obtenerTodos().subscribe({
      next: (data) => {
        this.carritos.set(data);
      },
      error: (err) => console.error('Error al obtener carritos:', err),
    });
  }
}
