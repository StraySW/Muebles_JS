import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
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
  private readonly platformId = inject(PLATFORM_ID);

  productos: Producto[] = [];
  cargando = true;
  error = '';
  categoriaSeleccionada = '';

  categoriasDisponibles = ['Todas', 'Salas', 'Comedores', 'Dormitorios', 'Oficina y Estudio'];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.cargarProductos();
  }

  cargarProductos(categoria?: string): void {
    this.cargando = true;
    this.error = '';
    this.categoriaSeleccionada = categoria && categoria !== 'Todas' ? categoria : '';

    this.catalogoService.obtenerCatalogo(this.categoriaSeleccionada || undefined).subscribe({
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

  filtrarPorCategoria(categoria: string): void {
    this.cargarProductos(categoria);
  }
}
