import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Categoria } from '../../modelos/categoria.model';
import { CategoriasService } from '../../servicios/categorias.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  private readonly categoriasService = inject(CategoriasService);
  private readonly platformId = inject(PLATFORM_ID);

  categorias: Categoria[] = [];
  cargando = true;
  error = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.categoriasService.obtenerTodas().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cargando = false;
      },
      error: (err: unknown) => {
        console.error('Error al obtener categorías:', err);
        this.error = 'No fue posible cargar las categorías desde el servidor backend.';
        this.cargando = false;
      },
    });
  }
}
