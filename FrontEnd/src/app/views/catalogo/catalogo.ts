import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import type { Producto } from '../../modelos/catalogo.model';
import { CatalogoService } from '../../servicios/catalogo.service';
import { GenericTable } from '../../componentes/table/generic-table';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, GenericTable],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  catalogo = signal<Producto[]>([]);

  private readonly catalogoService = inject(CatalogoService);

  ngOnInit(): void {
    this.catalogoService.obtenerCatalogo().subscribe({
      next: (data) => {
        this.catalogo.set(data);
      },
      error: (err) => console.error ('Error al obtener catálogo:', err),
    });
  }
}
