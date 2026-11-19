import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import type { Categoria } from '../../modelos/categoria.model';
import { CategoriasService } from '../../servicios/categorias.service';
import { GenericTable } from '../../componentes/table/generic-table';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, GenericTable],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  categorias = signal<Categoria[]>([]);

  private readonly categoriasService = inject(CategoriasService);

  ngOnInit(): void {
    this.categoriasService.obtenerTodas().subscribe({
      next: (data) => {
        this.categorias.set(data);
      },
      error: (err) => console.error('Error al obtener categorías:', err),
    });
  }
}
