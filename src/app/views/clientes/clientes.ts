import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Table } from '../../componentes/table/table';
import type { Cliente } from '../../modelos/cliente.model';
import { ClientesService } from '../../servicios/clientes.service';

@Component({
  selector: 'app-clientes',
  imports: [Table],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  private readonly clientesService = inject(ClientesService);
  private readonly platformId = inject(PLATFORM_ID);

  clientes: Cliente[] = [];
  cargando = true;
  error = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.clientesService.obtenerTodos().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.cargando = false;
      },
      error: (error: unknown) => {
        console.error('Error al consultar los clientes:', error);
        this.error = 'No fue posible cargar los clientes.';
        this.cargando = false;
      },
    });
  }
}
