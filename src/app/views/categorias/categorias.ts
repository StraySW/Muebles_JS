import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Table, type TableColumn } from '../../componentes/table/table';
import type { Categoria } from '../../modelos/categoria.model';
import { CategoriasService } from '../../servicios/categorias.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  private readonly categoriasService = inject(CategoriasService);

  categorias: Categoria[] = [];
  categoriaColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
  ];
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.categoriasService.obtenerTodas().subscribe({
      next: (categorias) => {
        console.log('📦 [Categorias Component] Datos recibidos desde el Backend:', categorias);
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
