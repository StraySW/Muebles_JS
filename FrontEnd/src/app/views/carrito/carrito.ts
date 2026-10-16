import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Table, type TableColumn } from '../../componentes/table/table';
import type { Carrito as CarritoModelType } from '../../modelos/carrito.model';
import { CarritoService } from '../../servicios/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito implements OnInit {
  private readonly carritoService = inject(CarritoService);

  carritos: CarritoModelType[] = [];
  carritoColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'clienteNombre', label: 'Cliente' },
    { key: 'totalItems', label: 'Items' },
    {
      key: 'total',
      label: 'Total',
      formatter: (value: unknown) => {
        const number = Number(value ?? 0);
        return Number.isFinite(number) ? `$${number.toLocaleString('es-CO')}` : 'N/A';
      },
    },
  ];
  cargando = true;
  error = '';

  ngOnInit(): void {
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
