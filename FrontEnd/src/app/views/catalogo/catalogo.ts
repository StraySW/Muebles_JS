import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import type { Producto } from '../../modelos/catalogo.model';
import { CatalogoService } from '../../servicios/catalogo.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  private readonly catalogoService = inject(CatalogoService);

  productos: Producto[] = [];
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.error = '';

    this.catalogoService.obtenerCatalogo().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargando = false;
      },
      error: (err: unknown) => {
        console.error('Error al cargar catálogo desde el backend:', err);
        this.error = 'No fue posible cargar el catálogo de productos desde el servidor backend.';
        this.cargando = false;
      },
    });
  }
}
