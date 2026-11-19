import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Producto } from '../../modelos/catalogo.model';
import { CatalogoService } from '../../servicios/catalogo.service';
import { GenericTable } from '../../componentes/table/generic-table';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, GenericTable],
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio implements OnInit {
  productos = signal<Producto[]>([]);

  private readonly catalogoService = inject(CatalogoService);

  ngOnInit(): void {
    this.catalogoService.obtenerCatalogo().subscribe({
      next: (data) => {
        this.productos.set(data);
      },
      error: (err) => console.error('Error al obtener productos destacados:', err),
    });
  }
}
  